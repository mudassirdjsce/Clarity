const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true }, // positive = credit, negative = debit
  category: { type: String, enum: ["food", "salary", "shopping", "bills", "transfer", "other"], default: "other" },
});

const bankAccountSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true }, // masked, e.g. "**** 4829"
    balance: { type: Number, required: true },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BankAccount", bankAccountSchema);
