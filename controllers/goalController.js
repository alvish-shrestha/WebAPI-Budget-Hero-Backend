const Goal = require("../models/Goal");
const {updateAdminActivity} = require("./admin/systemActivityManagement");
const {updateUserActivity} = require("./systemActivityController");

exports.createGoal = async (req, res) => {
    try {
        const { title, targetAmount, deadline } = req.body;

        if (!title || !targetAmount) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const goal = new Goal({
            title,
            targetAmount,
            deadline,
            userId: req.user._id,
        });

        const savedGoal = await goal.save();
        try {
            await updateAdminActivity("goalsCreated");
            await updateUserActivity(req.user._id, "goalsCreated");
        } catch (activityError) {
            console.warn("Failed to update system activity:", activityError.message);
        }

        return res.status(201).json({
            success: true,
            message: "Goal created successfully",
            data: savedGoal,
        });
    } catch (error) {
        console.error("Error creating goal:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create goal",
            error: error.message,
        });
    }
};

exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({
            userId: req.user._id,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            message: "Goals fetched successfully",
            data: goals,
        });
    } catch (error) {
        console.error("Error fetching goals:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.updateGoal = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedGoal = await Goal.findOneAndUpdate(
            {
                _id: id,
                userId: req.user._id,
            },
            {
                $set: req.body,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedGoal) {
            return res.status(404).json({
                success: false,
                message: "Goal not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Goal updated successfully",
            data: updatedGoal,
        });
    } catch (error) {
        console.error("Error updating goal:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.deleteGoal = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedGoal = await Goal.findOneAndDelete({
            _id: id,
            userId: req.user._id,
        });

        if (!deletedGoal) {
            return res.status(404).json({
                success: false,
                message: "Goal not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Goal deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting goal:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.contributeToGoal = async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid contribution amount",
        });
    }

    try {
        const updatedGoal = await Goal.findOneAndUpdate(
            {
                _id: id,
                userId: req.user._id,
            },
            {
                $inc: { currentAmount: amount },
            },
            {
                new: true,
            }
        );

        if (!updatedGoal) {
            return res.status(404).json({
                success: false,
                message: "Goal not found",
            });
        }

        try {
            await updateUserActivity(req.user._id, "contributionsMade");
        } catch (activityError) {
            console.warn("Failed to update user contribution activity:", activityError.message);
        }

        return res.status(200).json({
            success: true,
            message: "Contribution added successfully",
            data: updatedGoal,
        });
    } catch (error) {
        console.error("Error contributing to goal:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};