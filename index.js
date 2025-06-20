require("dotenv").config()

const express = require("express")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const adminUserRoutes = require("./routes/admin/userRouteAdmin")
const adminSystemActivityRoute = require("./routes/admin/systemActivityRouteAdmin")
const adminFeedbackRoute = require("./routes/admin/feedbackAdmin")
const path = require("path")
const app = express()

const cors = require("cors")
let corsOptions = {
    origin: "*" // can provide ist of domain
}
app.use(cors(corsOptions))

// connection implementation
connectDB()

app.use(express.json()) // accept json in request
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// implement routes here
app.use("/api/auth", userRoutes)
app.use("/api/admin/user", adminUserRoutes)
app.use("/api/admin/system-activity", adminSystemActivityRoute)
app.use("/api/admin/feedback", adminFeedbackRoute)

module.exports = app