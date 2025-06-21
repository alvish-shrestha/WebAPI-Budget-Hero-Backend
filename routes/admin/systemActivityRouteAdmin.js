const express = require("express");
const router = express.Router();
const { getAllActivities, getLatestActivity } = require("../../controllers/admin/systemActivityManagement");
const { authenticateUser, isAdmin } = require("../../middlewares/authorizedUser");

router.get(
    "/overview",
    authenticateUser,
    isAdmin,
    getAllActivities
);

router.get(
    "/overview/latest",
    authenticateUser,
    isAdmin,
    getLatestActivity
);

module.exports = router;
