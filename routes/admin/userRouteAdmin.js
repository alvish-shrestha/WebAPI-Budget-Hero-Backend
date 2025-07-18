const express = require("express")
const router = express.Router()
const { createUser, getUsers, getOneUser, updateOneUser, deleteOneUser } = require("../../controllers/admin/userManagement")
const { authenticateUser, isAdmin } = require("../../middlewares/authorizedUser")

router.post(
    "/",
    createUser
)

router.get(
    "/",
    // authenticateUser,
    // isAdmin,
    getUsers
)

router.get(
    "/:id", // req.params.id
    getOneUser
)

router.put(
    "/:id", // req.params.id
    updateOneUser
)

router.delete(
    "/:id",
    deleteOneUser
)

module.exports = router