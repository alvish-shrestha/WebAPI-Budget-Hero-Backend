const express = require("express")
const { authenticateUser } = require("../middlewares/authorizedUser")
const { getExpenseStats } = require("../controllers/statsController")
const router = express.Router()

router.get(
    "/",
    authenticateUser,
    getExpenseStats
)

module.exports = router