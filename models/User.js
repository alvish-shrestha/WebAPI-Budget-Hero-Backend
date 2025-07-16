const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "User"
        },
        streak: {
            current: {
                type: Number,
                default: 0
            },
            best: {
                type: Number,
                default: 0
            },
            lastSavedDate: {
                type: Date,
                default: null
            }
        },
        badges: {
            type: [String],
            default: []
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model(
    "User", UserSchema
)