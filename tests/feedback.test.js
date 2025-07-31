const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../models/User");
const Feedback = require("../models/Feedback");
const jwt = require("jsonwebtoken");

let userToken, adminToken, feedbackId;

beforeAll(async () => {
    // Connect to test DB
    await mongoose.connect(process.env.MONGODB_URI);

    // Create regular user
    const user = await User.create({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
        role: "user"
    });

    // Create admin user
    const admin = await User.create({
        username: "adminuser",
        email: "adminuser@example.com",
        password: "admin123",
        role: "admin"
    });

    // Generate JWT tokens
    userToken = jwt.sign({ id: user._id, role: "user" }, process.env.SECRET, { expiresIn: "1h" });
    adminToken = jwt.sign({ id: admin._id, role: "admin" }, process.env.SECRET, { expiresIn: "1h" });
});

afterAll(async () => {
    await User.deleteMany({ email: { $in: ["testuser@example.com", "adminuser@example.com"] } });
    await Feedback.deleteMany({ subject: "Test feedback" });
    await mongoose.disconnect();
});

describe("Feedback API Tests", () => {

    // User-side Feedback tests
    test("User can submit feedback", async () => {
        const res = await request(app)
            .post("/api/userFeedback/create")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                subject: "Test feedback",
                message: "This is a test feedback message",
                priority: "high"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toMatchObject({
            subject: "Test feedback",
            message: "This is a test feedback message",
            priority: "high",
        });

        feedbackId = res.body.data._id;
    });

    test("User can view their feedback", async () => {
        const res = await request(app)
            .get("/api/userFeedback/")
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    // Admin-side Feedback tests
    test("Admin can view all feedback", async () => {
        const res = await request(app)
            .get("/api/admin/feedback/")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("Admin can view feedback by ID", async () => {
        const res = await request(app)
            .get(`/api/admin/feedback/${feedbackId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBe(feedbackId);
    });

    test("Admin gets 404 when feedback not found", async () => {
        const res = await request(app)
            .get("/api/admin/feedback/65af5b8f1b2b3c2d3e4f1234")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Not found");
    });

    test("Admin can update feedback status and priority", async () => {
        const res = await request(app)
            .put(`/api/admin/feedback/${feedbackId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                status: "resolved",
                priority: "medium"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toMatchObject({
            status: "resolved",
            priority: "medium"
        });
    });

    test("Admin can delete feedback", async () => {
        const res = await request(app)
            .delete(`/api/admin/feedback/${feedbackId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Deleted successfully");
    });

    test("Admin gets 404 on deleting non-existing feedback", async () => {
        const res = await request(app)
            .delete(`/api/admin/feedback/${feedbackId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Not found");
    });

    test("should not allow feedback submission without token", async () => {
        const res = await request(app)
            .post("/api/userFeedback/create")
            .send({ subject: "No Token", message: "Missing auth", priority: "low" });

        expect(res.statusCode).toBe(401);
    });

    test("should return empty feedback if none exist", async () => {
        const res = await request(app)
            .get("/api/userFeedback/")
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
