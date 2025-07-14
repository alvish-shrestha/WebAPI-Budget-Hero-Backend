// const express = require("express")
// const { authenticateUser } = require("../middlewares/authorizedUser")
// const { createIncome, getIncomes, updateIncome, deleteIncome } = require("../controllers/incomeController")
// const router = express.Router()
//
// router.post(
//     "/create",
//     authenticateUser,
//     createIncome
// )
//
// router.get(
//     "/",
//     authenticateUser,
//     getIncomes
// )
//
// router.put(
//     "/update/:id",
//     authenticateUser,
//     updateIncome
// )
//
// router.delete(
//     "/delete/:id",
//     authenticateUser,
//     deleteIncome
// )
//
// module.exports = router