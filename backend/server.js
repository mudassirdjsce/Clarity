require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;
const { startNewsCron } = require("./cron/newsCron");

const startServer = async () => {
  await connectDB();
  startNewsCron();

  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
};

startServer();