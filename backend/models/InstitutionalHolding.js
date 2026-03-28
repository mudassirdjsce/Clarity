const mongoose = require("mongoose");

const institutionalHoldingSchema = new mongoose.Schema(
  {
    companyEmail: { type: String, required: true, index: true },
    name:         { type: String, required: true },
    symbol:       { type: String, required: true },
    icon:         { type: String, default: "?" },
    amount:       { type: Number, required: true },
    buyPrice:     { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    color:        { type: String, default: "#8eff71" },
    risk:         { type: String, default: "Medium", enum: ["Low", "Medium", "High"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InstitutionalHolding", institutionalHoldingSchema);
