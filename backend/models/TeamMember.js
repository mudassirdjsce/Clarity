const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    companyEmail: { type: String, required: true, index: true },
    name:         { type: String, required: true },
    role:         { type: String, required: true },
    imageSeed:    { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeamMember", teamMemberSchema);
