const express = require("express")
const { getUserProfile, updateUserProfile } = require("../controllers/accountInfoController");
const { authenticateUser } = require("../middlewares/authorizedUser");
const router = express.Router()

router.get(
    "/profile",
    authenticateUser,
    getUserProfile,
)

router.put(
    "/profile",
    authenticateUser,
    updateUserProfile
)

module.exports = router