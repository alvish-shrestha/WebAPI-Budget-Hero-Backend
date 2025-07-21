const express = require("express")
const { authenticateUser } = require("../middlewares/authorizedUser");
const { createGoal, getGoals, updateGoal, deleteGoal, contributeToGoal } = require("../controllers/goalController");
const router = express.Router()

router.post(
    "/createGoal",
    authenticateUser,
    createGoal,
)

router.post(
    "/:id/contribute",
    authenticateUser,
    contributeToGoal,
)

router.get(
    "/",
    authenticateUser,
    getGoals,
)

router.put(
    "/updateGoal/:id",
    authenticateUser,
    updateGoal,
)

router.delete(
    "/deleteGoal/:id",
    authenticateUser,
    deleteGoal,
)

module.exports = router