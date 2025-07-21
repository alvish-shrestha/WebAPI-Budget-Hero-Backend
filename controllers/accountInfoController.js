const User = require("../models/User");

// View account info
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("username email role");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Error in getUserProfile:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Update account info
exports.updateUserProfile = async (req, res) => {
    const { username, email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { username, email },
            {
                new: true,
                runValidators: true,
            }
        ).select("username email");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated",
            data: updatedUser,
        });
    } catch (err) {
        console.error("Error in updateUserProfile:", err.message, err.stack);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
};
