const express = require("express");
const {
  signup, login,
  addGoal, getGoals, addGoalFunds, deleteGoal,
  getFestivals, addFestival, addFestivalExpense, deleteFestival,
  getBankAccounts, connectBank, addTransaction,
  getHoldings, addHolding, deleteHolding,
  getInstitutionalHoldings, addInstitutionalHolding, deleteInstitutionalHolding,
  getTreasuryAccounts, addTreasuryAccount, deleteTreasuryAccount,
  getTeamMembers, addTeamMember, deleteTeamMember,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/goals", addGoal);
router.get("/goals", getGoals);
router.patch("/goals/:id/funds", addGoalFunds);
router.delete("/goals/:id", deleteGoal);

router.post("/festivals", addFestival);
router.get("/festivals", getFestivals);
router.post("/festivals/:id/expenses", addFestivalExpense);
router.delete("/festivals/:id", deleteFestival);

router.get("/bank-accounts", getBankAccounts);
router.post("/bank-accounts/connect", connectBank);
router.post("/bank-accounts/:id/transactions", addTransaction);

router.get("/holdings", getHoldings);
router.post("/holdings", addHolding);
router.delete("/holdings/:id", deleteHolding);

router.get("/institutional-holdings", getInstitutionalHoldings);
router.post("/institutional-holdings", addInstitutionalHolding);
router.delete("/institutional-holdings/:id", deleteInstitutionalHolding);

router.get("/treasury-accounts", getTreasuryAccounts);
router.post("/treasury-accounts", addTreasuryAccount);
router.delete("/treasury-accounts/:id", deleteTreasuryAccount);

router.get("/team-members", getTeamMembers);
router.post("/team-members", addTeamMember);
router.delete("/team-members/:id", deleteTeamMember);

module.exports = router;
