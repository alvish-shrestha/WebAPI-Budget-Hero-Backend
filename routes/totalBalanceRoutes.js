const express = require("express")
const { authenticateUser } = require("../middlewares/authorizedUser")
const { getBalance } = require("../controllers/totalBalanceController")
const router = express.Router()

router.get(
    "/",
    authenticateUser,
    getBalance
)

module.exports = router