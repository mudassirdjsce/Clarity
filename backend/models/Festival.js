const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
});

const festivalSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    expenses: [expenseSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Festival", festivalSchema);
