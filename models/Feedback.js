const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["open", "in-progress", "resolved", "closed"],
        default: "open",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
