const express = require("express");
const router = express.Router();
const { createFeedback, getAllFeedback, getFeedbackById, updateFeedback, deleteFeedback } = require("../../controllers/admin/feedbackManagement");
const { authenticateUser, isAdmin } = require("../../middlewares/authorizedUser");

// Create a new feedback
router.post(
    "/",
    authenticateUser,
    isAdmin,
    createFeedback
);

// Get all feedback entries
router.get(
    "/",
    authenticateUser,
    isAdmin,
    getAllFeedback
);

// Get a specific feedback by ID
router.get(
    "/:id",
    authenticateUser,
    isAdmin,
    getFeedbackById
);

// Update a feedback by ID
router.put(
    "/:id",
    authenticateUser,
    isAdmin,
    updateFeedback
);

// Delete a feedback by ID
router.delete(
    "/:id",
    authenticateUser,
    isAdmin,
    deleteFeedback
);

module.exports = router;
