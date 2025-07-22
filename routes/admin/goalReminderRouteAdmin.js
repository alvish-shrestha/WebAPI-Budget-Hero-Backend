const express = require("express");
const router = express.Router();
const { sendUpcomingGoalReminders } = require("../../controllers/admin/goalReminderManagement");
const { authenticateUser, isAdmin } = require("../../middlewares/authorizedUser");

router.get("/send-reminders", authenticateUser, isAdmin, sendUpcomingGoalReminders);

module.exports = router;
