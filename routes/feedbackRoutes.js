const express = require("express")
const router = express.Router()
const { createFeedback, getUserFeedback } = require("../controllers/feedbackController")
const { authenticateUser } = require("../middlewares/authorizedUser")

// Create a new feedback
router.post(
    "/create",
    authenticateUser,
    createFeedback
);

router.get(
    "/",
    authenticateUser,
    getUserFeedback
)

module.exports = router