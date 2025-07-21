const Feedback = require("../models/Feedback");

// Create feedback
exports.createFeedback = async (req, res) => {
    try {
        const feedback = new Feedback({
            userId: req.user._id,
            subject: req.body.subject,
            message: req.body.message,
            priority: req.body.priority,
        });
        const saved = await feedback.save();
        res.status(201).json({ success: true, data: saved });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get feedback
exports.getUserFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find(
            { userId: req.user._id }
        ).sort(
            { createdAt: -1 }
        );
        res.status(200).json(
            {
                success: true,
                data: feedbacks
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: error.message
            }
        );
    }
};
