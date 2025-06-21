require("dotenv").config()

const express = require("express")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const adminUserRoutes = require("./routes/admin/userRouteAdmin")
const adminSystemActivityRoute = require("./routes/admin/systemActivityRouteAdmin")
const adminFeedbackRoute = require("./routes/admin/feedbackAdmin")
const adminDashboardRoute = require("./routes/admin/dashboardAdmin")
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
app.use("/api/admin", adminDashboardRoute)
app.use("/api/admin/user", adminUserRoutes)
app.use("/api/admin/system-activity", adminSystemActivityRoute)
app.use("/api/admin/feedback", adminFeedbackRoute)

module.exports = app
