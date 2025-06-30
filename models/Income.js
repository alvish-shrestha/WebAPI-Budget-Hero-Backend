const mongoose = require("mongoose")

const IncomeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            required: true,
            enum: ["Received", "Allowance", "Petty Cash", "Bonus", "Salary", "Other"]
        },
        account: {
            type: String,
            required: true,
            trim: true
        },
        notes: {
            type: String,
            trim: true,
        },
        isRecurring: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            default: "",
            trim: true
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model(
    "Income", IncomeSchema
)