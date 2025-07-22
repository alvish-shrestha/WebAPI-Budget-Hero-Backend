const User = require("../models/User")

const Transaction = require("../models/Transaction")
const { updateAdminActivity } = require("../controllers/admin/systemActivityManagement")
const { updateUserActivity } = require("../controllers/systemActivityController")

exports.addTransaction = async (req, res) => {
    try {
        const { type, date, amount, category, account, note, description } = req.body;

        if (!type || !date || !amount || !category || !account || !note) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const transaction = new Transaction({
            type,
            date,
            amount,
            category,
            account,
            note,
            description,
            userId: req.user._id,
        });

        const savedTransaction = await transaction.save();

        try {
            await updateAdminActivity("entriesAdded");
            await updateUserActivity(req.user._id, "entriesAdded");
        } catch (e) {
            console.warn("System activity update failed:", e.message);
        }

        // STREAK LOGIC
        const user = await User.findById(req.user._id);

        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        const lastSaved = user.streak?.lastSavedDate
            ? new Date(user.streak.lastSavedDate).toDateString()
            : null;

        if (lastSaved === today) {
            // Already logged today – no change
        } else if (lastSaved === yesterday) {
            user.streak.current += 1;
        } else {
            user.streak.current = 1; // New streak
        }

        user.streak.lastSavedDate = new Date();

        if (user.streak.current > user.streak.best) {
            user.streak.best = user.streak.current;
        }

        // Award badges based on streak
        const { current, badges } = user.streak;

        if (current >= 3 && !user.badges.includes("3-Day Streak")) {
            user.badges.push("3-Day Streak");
        }

        if (current >= 7 && !user.badges.includes("1-Week Warrior")) {
            user.badges.push("1-Week Warrior");
        }

        if (current >= 14 && !user.badges.includes("Savings Hero")) {
            user.badges.push("Savings Hero");
        }

        await user.save();

        res.status(201).json({
            success: true,
            message: "Transaction saved",
            data: savedTransaction,
            badges: user.badges,
            streak: user.streak
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add transaction",
            error: error.message,
        });
    }
}

exports.getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.find({
            userId: req.user._id
        }).sort({
            date: -1
        })

        return res.status(200).json(
            {
                success: true,
                message: "Data fetched successfully",
                data: transaction
            }
        )

    } catch (err) {
        console.error("Error fetching transactions: ", err)
        return res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        )
    }
}

exports.updateTransaction = async (req, res) => {
    const { id } = req.params

    try {
        const updatedTransaction = await Transaction.findOneAndUpdate(
            {
                _id: id,
                userId: req.user._id
            },
            {
                $set: req.body
            },
            {
                new: true,
                runValidators: true
            }
        )

        if (!updatedTransaction) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Transaction not found"
                }
            )
        }

        return res.status(200).json(
            {
                success: true,
                message: "Transaction updated",
                data: updatedTransaction
            }
        )
    } catch (err) {
        console.error("Error updating transaction: ", err)
        return res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        )
    }
}

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params

    try {
        const deletedTransaction = await Transaction.findOneAndDelete(
            {
                _id: id,
                userId: req.user._id
            }
        )

        if (!deletedTransaction) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Transaction not found"
                }
            )
        }

        return res.status(200).json(
            {
                success: true,
                message: "Transaction deleted"
            }
        )
    } catch (err) {
        console.error("Error deleting transaction: ", err)
        return res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        )
    }
}