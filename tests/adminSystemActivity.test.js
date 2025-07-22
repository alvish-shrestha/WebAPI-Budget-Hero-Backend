require("dotenv").config({ path: "./.env" });

const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SystemActivity = require("../models/admin/SystemActivityAdmin");

let adminToken;
let activityId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    // Create admin user
    const adminUser = new User({
        username: "admin_activity",
        email: "admin_activity@example.com",
        password: "test1234",
        role: "admin"
    });
    await adminUser.save();

    // Create JWT token
    adminToken = jwt.sign(
        { id: adminUser._id, role: "admin" },
        process.env.SECRET,
        { expiresIn: "1h" }
    );

    // Create sample system activity
    const activity = new SystemActivity({
        entriesAdded: 10,
        goalsCreated: 5,
        notificationsSent: 3,
        offlineDataSynced: 2,
        date: new Date("2024-01-01")
    });
    await activity.save();
    activityId = activity._id;
});

afterAll(async () => {
    await User.deleteMany({ email: /admin_activity/ });
    await SystemActivity.deleteMany({});
    await mongoose.connection.close();
});

describe("Admin System Activity API", () => {
    test("should fetch all system activities", async () => {
        const res = await request(app)
            .get("/api/admin/system-activity/overview")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("should fetch the latest system activity", async () => {
        const res = await request(app)
            .get("/api/admin/system-activity/overview/latest")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("entriesAdded");
    });

    test("should not fetch activities without token", async () => {
        const res = await request(app)
            .get("/api/admin/system-activity/overview");

        expect(res.statusCode).toBe(401); // unauthorized
    });

    test("should deny access if user is not admin", async () => {
        // Create a non-admin user
        await User.deleteOne({ username: "normaluser" }); // prevent duplicate
        const normalUser = new User({
            username: "normaluser",
            email: "normaluser@example.com",
            password: "userpass",
            role: "user"
        });
        await normalUser.save();

        const userToken = jwt.sign(
            { id: normalUser._id, role: "user" },
            process.env.SECRET,
            { expiresIn: "1h" }
        );

        const res = await request(app)
            .get("/api/admin/system-activity/overview")
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Admin privilege required");
    });

});
