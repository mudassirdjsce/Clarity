const cron = require("node-cron");
const {
  fetchFinnhub,
  fetchNewsAPI
} = require("../services/ingestion/newsFetcher");

const {
  normalizeFinnhub,
  normalizeNewsAPI
} = require("../services/ingestion/normalizer");

const { deduplicate } = require("../services/ingestion/deduplicator");
const { isRelevant } = require("../services/processing/filterService");
const { analyzeNews } = require("../services/processing/aiService");
const { calculateCredibility } = require("../services/processing/credibilityService");

const News = require("../models/News");

const runNewsPipeline = async () => {
  try {
    let data = [
      ...normalizeFinnhub(await fetchFinnhub()),
      ...normalizeNewsAPI(await fetchNewsAPI())
    ];

    data = deduplicate(data);
    data = data.filter(isRelevant);

    for (let article of data) {
      const exists = await News.findOne({ title: article.title });
      if (exists) continue;

      const ai = await analyzeNews(article);

      const similar = await News.countDocuments({
        title: { $regex: article.title.split(" ")[0], $options: "i" }
      });

      const credibility = calculateCredibility(article, similar);

      await News.create({
        ...article,
        ...ai,
        credibilityScore: credibility,
        tags: article.title.split(" ")
      });
    }

    console.log("News updated");

  } catch (err) {
    console.error(err.message);
  }
};

const startNewsCron = () => {
  cron.schedule("*/10 * * * *", runNewsPipeline);
};

module.exports = startNewsCron;