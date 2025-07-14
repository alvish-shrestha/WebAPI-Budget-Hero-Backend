// const express = require("express")
// const { createExpense, updateExpense, deleteExpense, getExpenses } = require("../controllers/expenseController")
// const { authenticateUser } = require("../middlewares/authorizedUser")
// const router = express.Router()
//
// router.post(
//     "/create",
//     authenticateUser,
//     createExpense
// )
//
// router.get(
//     "/",
//     authenticateUser,
//     getExpenses
// )
//
// router.put(
//     "/update/:id",
//     authenticateUser,
//     updateExpense
// )
//
// router.delete(
//     "/delete/:id",
//     authenticateUser,
//     deleteExpense
// )
//
// module.exports = router