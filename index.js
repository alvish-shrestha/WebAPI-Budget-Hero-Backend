require("dotenv").config()

const express = require("express")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")

const adminUserRoutes = require("./routes/admin/userRouteAdmin")
const adminSystemActivityRoutes = require("./routes/admin/systemActivityRouteAdmin")
const adminFeedbackRoutes = require("./routes/admin/feedbackAdmin")
const adminDashboardRoutes = require("./routes/admin/dashboardAdmin")

const transactionRoutes = require("./routes/transactionRoutes")

const path = require("path")
const app = express()

const cors = require("cors")
let corsOptions = {
    origin: "*" 
}
app.use(cors(corsOptions))

connectDB()

app.use(express.json())

// ============ User ============
app.use("/api/auth", userRoutes)

// ========== Admin ===========
app.use("/api/admin", adminDashboardRoutes)
app.use("/api/admin/user", adminUserRoutes)
app.use("/api/admin/system-activity", adminSystemActivityRoutes)
app.use("/api/admin/feedback", adminFeedbackRoutes)


app.use("/api/transactions", transactionRoutes)

module.exports = app