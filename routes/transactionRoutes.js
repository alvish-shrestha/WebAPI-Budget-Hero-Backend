const express = require("express")
const { addTransaction, getTransaction, updateTransaction, deleteTransaction } = require("../controllers/transactionController");
const { authenticateUser } = require("../middlewares/authorizedUser");
const router = express.Router()

router.post(
    "/addTransaction",
    authenticateUser,
    addTransaction,
)

router.get(
    "/",
    authenticateUser,
    getTransaction,
)

router.put(
    "/updateTransaction/:id",
    authenticateUser,
    updateTransaction,
)

router.delete(
    "/deleteTransaction/:id",
    authenticateUser,
    deleteTransaction,
)

module.exports = router