const mongoose = require("mongoose");

const treasuryAccountSchema = new mongoose.Schema(
  {
    companyEmail: { type: String, required: true, index: true },
    bankName:     { type: String, required: true },
    bankIconText: { type: String, required: true },
    accountType:  { type: String, required: true },
    balance:      { type: Number, required: true },
    isPrimary:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TreasuryAccount", treasuryAccountSchema);
