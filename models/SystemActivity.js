const mongoose = require("mongoose");

const SystemActivityUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    entriesAdded: {
        type: Number,
        default: 0,
    },
    goalsCreated: {
        type: Number,
        default: 0,
    },
    contributionsMade: {
        type: Number,
        default: 0,
    },
    notificationsSent: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true
});

SystemActivityUserSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("SystemActivityUser", SystemActivityUserSchema);
