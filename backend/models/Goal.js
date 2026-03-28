const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);
