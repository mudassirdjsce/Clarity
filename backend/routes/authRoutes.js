const express = require("express");
const { signup, login, addGoal, getGoals, addGoalFunds, deleteGoal, getFestivals, addFestival, addFestivalExpense, deleteFestival } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/goals", addGoal);
router.get("/goals", getGoals);
router.post("/goals/add-funds", addGoalFunds);
router.delete("/goals/:id", deleteGoal);

router.post("/festivals", addFestival);
router.get("/festivals", getFestivals);
router.post("/festivals/:id/expenses", addFestivalExpense);
router.delete("/festivals/:id", deleteFestival);

module.exports = router;
