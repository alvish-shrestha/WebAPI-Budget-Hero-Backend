const express = require("express");
const router = express.Router();
const { getAllActivities, getLatestActivity, getSystemActivityById} = require("../../controllers/admin/systemActivityManagement");
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

router.get(
    "/:id",
    authenticateUser,
    isAdmin,
    getSystemActivityById
);

module.exports = router;
