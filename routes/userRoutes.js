const express = require("express")
const router = express.Router()
const { registerUser, loginUser, sendResetLink, resetPassword, getStreak} = require("../controllers/userController")
const {authenticateUser} = require("../middlewares/authorizedUser");

router.post(
    "/register",
    registerUser
)

router.post(
    "/login",
    loginUser
)

router.get(
    "/streak",
    authenticateUser,
    getStreak
)

router.post(
    "/request-reset",
    sendResetLink
)

router.post(
    "/reset-password/:token",
    resetPassword
)

module.exports = router