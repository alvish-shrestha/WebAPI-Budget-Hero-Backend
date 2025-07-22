const SystemActivityUser = require("../models/SystemActivity");

const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

// Update user activity
exports.updateUserActivity = async (userId, field, amount = 1) => {
    const today = getToday();

    await SystemActivityUser.findOneAndUpdate(
        { userId, date: today },
        { $inc: { [field]: amount } },
        { upsert: true, new: true }
    );
};

// GET all for logged-in user
exports.getUserActivity = async (req, res) => {
    try {
        const activities = await SystemActivityUser.find({ userId: req.user._id }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            message: "User activity fetched successfully",
            data: activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while fetching user activity",
            error
        });
    }
};
