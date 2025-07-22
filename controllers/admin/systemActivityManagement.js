const SystemActivity = require("../../models/admin/SystemActivityAdmin");

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

exports.getSystemActivityById = async (req, res) => {
    try {
        const activity = await SystemActivity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Activity fetched successfully",
            data: activity
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error
        });
    }
};

exports.updateAdminActivity = async (field, amount = 1) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time for unique day

    await SystemActivity.findOneAndUpdate(
        { date: today },
        { $inc: { [field]: amount } },
        { upsert: true, new: true }
    );
};