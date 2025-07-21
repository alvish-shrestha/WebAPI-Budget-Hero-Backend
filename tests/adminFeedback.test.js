const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const User = require("../models/User");
const Feedback = require("../models/Feedback");
const jwt = require("jsonwebtoken");

let token;
let feedbackId;

beforeAll(async () => {
    // Cleanup test user and feedbacks
    await User.deleteOne({ email: "adminfeedback@example.com" });
    await Feedback.deleteMany({ subject: "Test Subject" });

    // Create admin user
    const user = new User({
        username: "adminFeedback",
        email: "adminfeedback@example.com",
        password: "hashedPassword",
        role: "admin"
    });
    await user.save();

    // Generate token
    const payload = { id: user._id, email: user.email, username: user.username };
    token = jwt.sign(payload, process.env.SECRET, { expiresIn: "7d" });
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe("Admin Feedback Management API", () => {
    test("should create new feedback", async () => {
        const res = await request(app)
            .post("/api/admin/feedback")
            .set("Authorization", `Bearer ${token}`)
            .send({
                subject: "Test Subject",
                message: "This is a test message",
                priority: "high"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.subject).toBe("Test Subject");

        feedbackId = res.body.data._id;
    });

    test("should get all feedback", async () => {
        const res = await request(app)
            .get("/api/admin/feedback")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("should get feedback by ID", async () => {
        const res = await request(app)
            .get(`/api/admin/feedback/${feedbackId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data._id).toBe(feedbackId);
    });

    test("should update feedback", async () => {
        const res = await request(app)
            .put(`/api/admin/feedback/${feedbackId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ status: "resolved" });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.status).toBe("resolved");
    });

    test("should delete feedback", async () => {
        const res = await request(app)
            .delete(`/api/admin/feedback/${feedbackId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Deleted successfully");
    });

    test("should not create feedback without token", async () => {
        const res = await request(app)
            .post("/api/admin/feedback")
            .send({
                subject: "Unauthorized",
                message: "Should fail",
                priority: "low"
            });

        expect(res.statusCode).toBe(401);
    });
});
