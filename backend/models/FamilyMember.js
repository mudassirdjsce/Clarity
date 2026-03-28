const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  income: { type: Number, default: 0 },
  savings: { type: Number, default: 0 },
  isPrimary: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("FamilyMember", familyMemberSchema);
