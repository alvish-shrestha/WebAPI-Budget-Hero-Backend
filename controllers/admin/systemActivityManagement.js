const SystemActivity = require("../../models/SystemActivity");

// Fetch all activity records (e.g., for 7/30-day trends)
exports.getAllActivities = async (req, res) => {
    try {
        const activities = await SystemActivity.find().sort({ date: -1 });
        return res.status(200).json({
            success: true,
            message: "All system activity data fetched",
            data: activities
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error
        });
    }
};

// Fetch the most recent system activity (today or last available)
exports.getLatestActivity = async (req, res) => {
    try {
        const latest = await SystemActivity.findOne().sort({ date: -1 });

        if (!latest) {
            return res.status(404).json({
                success: false,
                message: "No activity record found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Latest system activity fetched",
            data: latest
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error
        });
    }
};