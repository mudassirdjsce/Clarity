require("dotenv").config();

const connectDB = require("../config/db");
const { runNewsPipeline } = require("../cron/newsCron");

const seed = async () => {
  try {
    console.log("Connecting DB...");
    await connectDB();

    console.log("Running Pipeline...");
    await runNewsPipeline();

    console.log("✅ SEED COMPLETE");

    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seed();