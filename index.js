require("dotenv").config()

const express = require("express")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")

const adminUserRoutes = require("./routes/admin/userRouteAdmin")
const adminSystemActivityRoutes = require("./routes/admin/systemActivityRouteAdmin")
const adminFeedbackRoutes = require("./routes/admin/feedbackAdmin")
const adminDashboardRoutes = require("./routes/admin/dashboardAdmin")

const expenseRoutes = require("./routes/expenseRoutes")
const incomeRoutes = require("./routes/incomeRoutes")
const totalBalanceRoutes = require("./routes/totalBalanceRoutes")

const transactionRoutes = require("./routes/transactionRoutes")

const statsRoutes = require("./routes/statsRoutes")

const path = require("path")
const app = express()

const cors = require("cors")
let corsOptions = {
    origin: "*" 
}
app.use(cors(corsOptions))

connectDB()

app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/auth", userRoutes)

app.use("/api/admin", adminDashboardRoutes)
app.use("/api/admin/user", adminUserRoutes)
app.use("/api/admin/system-activity", adminSystemActivityRoutes)
app.use("/api/admin/feedback", adminFeedbackRoutes)

// app.use("/api/expenses", expenseRoutes)
// app.use("/api/incomes", incomeRoutes)
// app.use("/api/balance", totalBalanceRoutes)

app.use("/api/transactions", transactionRoutes)

app.use("/api/stats", statsRoutes)

module.exports = app