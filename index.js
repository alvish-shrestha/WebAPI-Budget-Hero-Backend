require("dotenv").config()

const express = require("express")
const connectDB = require("./config/db")
const cron = require("node-cron");
const { sendUpcomingGoalReminders } = require("./controllers/admin/goalReminderManagement");

// ================== User ===============================
const userRoutes = require("./routes/userRoutes")
const feedbackRoutes = require("./routes/feedbackRoutes")
const accountInfoRoutes = require("./routes/accountInfoRoutes")

// ======================= Admin =========================
const adminUserRoutes = require("./routes/admin/userRouteAdmin")
const adminSystemActivityRoutes = require("./routes/admin/systemActivityRouteAdmin")
const adminFeedbackRoutes = require("./routes/admin/feedbackAdmin")
const adminDashboardRoutes = require("./routes/admin/dashboardAdmin")
const goalReminderRoutes = require("./routes/admin/goalReminderRouteAdmin")

// ===================== Transaction =========================
const transactionRoutes = require("./routes/transactionRoutes")

// ================== Goal ==================
const goalRoutes = require("./routes/goalRoutes")

// ==================== System-Activity ======================
const systemActivityRoutes = require("./routes/systemActivityRoutes")

const app = express()

const cors = require("cors")
const {sendResetLink, resetPassword} = require("./controllers/userController");
let corsOptions = {
    origin: "*"
}
app.use(cors(corsOptions))

connectDB()

app.use(express.json())

// ============ User ============
app.use("/api/auth", userRoutes)
app.use("/api/userFeedback", feedbackRoutes)
app.use("/api/accountInfo", accountInfoRoutes)

// ========== Admin ===========
app.use("/api/admin", adminDashboardRoutes)
app.use("/api/admin/user", adminUserRoutes)
app.use("/api/admin/system-activity", adminSystemActivityRoutes)
app.use("/api/admin/feedback", adminFeedbackRoutes)
app.use("/api/admin/goal", goalReminderRoutes)

// ========== Transactions ========
app.use("/api/transactions", transactionRoutes)

// =========== Goal =========
app.use("/api/goals", goalRoutes)

// =========== System-Activity ================
app.use("/api/system-activity", systemActivityRoutes)

// ================== Cron Job =====================
// Run daily at 9 AM server time
cron.schedule("0 9 * * *", async () => {
    try {
        await sendUpcomingGoalReminders({}, { status: () => ({ json: () => {} }) });
        console.log("Goal reminder emails sent at 9 AM");
    } catch (err) {
        console.error("Error sending goal reminders:", err);
    }
});

module.exports = app