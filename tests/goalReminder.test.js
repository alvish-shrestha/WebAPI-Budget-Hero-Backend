const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

let adminToken;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    const admin = await User.create({
        username: "goaladmin",
        email: "goaladmin@example.com",
        password: "adminpass",
        role: "admin",
    });

    adminToken = jwt.sign({ id: admin._id, role: "admin" }, process.env.SECRET, {
        expiresIn: "1h",
    });
});

afterAll(async () => {
    await User.deleteMany({ email: "goaladmin@example.com" });
    await mongoose.disconnect();
});

describe("Goal Reminder Endpoint", () => {
    test("should trigger goal reminder without error", async () => {
        const res = await request(app)
            .get("/api/admin/goal/send-reminders")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
