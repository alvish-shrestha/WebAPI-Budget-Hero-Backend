const Goal = require("../../models/Goal");
const User = require("../../models/User");
const sendEmail = require("../../utils/mailer");

exports.sendUpcomingGoalReminders = async (req, res) => {
    console.log("✅ Reminder function triggered");

    try {
        const today = new Date();
        const inTwoDays = new Date();
        inTwoDays.setDate(today.getDate() + 2);

        const goals = await Goal.find({ deadline: { $lte: inTwoDays } }).populate("userId");

        console.log(`📌 Found ${goals.length} goal(s) ending in 2 days or less`);

        for (let goal of goals) {
            const user = goal.userId;

            if (!user || !user.email) {
                console.warn(`⚠️ Skipped: goal "${goal.title}" has no valid user or email`);
                continue;
            }

            console.log(`📧 Sending email to ${user.email} for goal: "${goal.title}"`);

            try {
                await sendEmail({
                    to: user.email,
                    subject: `🎯 Goal Reminder: ${goal.title}`,
                    html: `
                        <p>Hi ${user.username},</p>
                        <p>This is a reminder that your goal "<strong>${goal.title}</strong>" ends on <strong>${(await goal).deadline.toDateString()}</strong>.</p>
                        <p>Keep going! 💪</p>
                        <p>– Budget Hero</p>
                    `,
                });
            } catch (emailErr) {
                console.error(`❌ Failed to send email to ${user.email}:`, emailErr);
            }
        }

        res.status(200).json({ success: true, message: "Emails sent" });
    } catch (err) {
        console.error("❌ Reminder job failed:", err);
        res.status(500).json({ success: false, message: "Error sending emails" });
    }
};
