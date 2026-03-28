const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    name:      { type: String, required: true },       // e.g. "Bitcoin"
    symbol:    { type: String, required: true },       // e.g. "BTC"
    icon:      { type: String, default: "?" },         // single-char icon
    amount:    { type: Number, required: true },       // numeric quantity
    buyPrice:  { type: Number, required: true },       // price per unit at purchase (INR/USD)
    currentPrice: { type: Number, required: true },    // current price per unit
    color:     { type: String, default: "#8eff71" },   // chart color
  },
  { timestamps: true }
);

module.exports = mongoose.model("Holding", holdingSchema);
