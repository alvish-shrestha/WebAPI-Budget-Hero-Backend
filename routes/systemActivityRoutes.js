const express = require("express");
const router = express.Router();
const { getUserActivity } = require("../controllers/systemActivityController");
const { authenticateUser } = require("../middlewares/authorizedUser");

router.get(
    "/activity",
    authenticateUser,
    getUserActivity
);

module.exports = router;
