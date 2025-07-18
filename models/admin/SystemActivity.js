const mongoose = require("mongoose");

const SystemActivitySchema = new mongoose.Schema({
    entriesAdded: {
        type: Number,
        default: 0,
    },
    goalsCreated: {
        type: Number,
        default: 0,
    },
    notificationsSent: {
        type: Number,
        default: 0,
    },
    offlineDataSynced: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        required: true,
        unique: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("SystemActivity", SystemActivitySchema);