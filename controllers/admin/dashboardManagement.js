// controllers/admin/dashboardManagement.js
const User = require('../../models/User');
const Feedback = require('../../models/Feedback');
const SystemActivity = require('../../models/SystemActivity');

const getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const feedbacks = await Feedback.countDocuments();
    const activities = await SystemActivity.countDocuments();

    res.json({ users, feedbacks, activities });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
