const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");

const User = require("../models/User");
const Goal = require("../models/Goal");
const SystemActivity = require("../models/SystemActivity");

let token;
let goalId;

beforeAll(async () => {
    // Clean up existing user
    await User.deleteOne({ email: "goaluser@gmail.com" });

    // Register new user
    await request(app).post("/api/auth/register").send({
        username: "goaluser",
        email: "goaluser@gmail.com",
        password: "test1234",
        confirmPassword: "test1234",
    });

    // Login
    const res = await request(app).post("/api/auth/login").send({
        email: "goaluser@gmail.com",
        password: "test1234",
    });

    token = res.body.token;
});

beforeAll(async () => {
    await SystemActivity.deleteMany({});
});

afterAll(async () => {
    await Goal.deleteMany({});
    await SystemActivity.deleteMany({});
    await User.deleteOne({ email: "goaluser@gmail.com" });
    await mongoose.disconnect();
});

describe("Goal API", () => {
    test("should create a goal", async () => {
        const res = await request(app)
            .post("/api/goals/createGoal")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Buy a Laptop",
                targetAmount: 1500,
                deadline: "2025-12-31",
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe("Buy a Laptop");

        goalId = res.body.data._id;
    });

    test("should fetch all user goals", async () => {
        const res = await request(app)
            .get("/api/goals")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    test("should update a goal", async () => {
        const res = await request(app)
            .put(`/api/goals/updateGoal/${goalId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Buy a MacBook Pro",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.title).toBe("Buy a MacBook Pro");
    });

    test("should contribute to a goal", async () => {
        const res = await request(app)
            .post(`/api/goals/${goalId}/contribute`)
            .set("Authorization", `Bearer ${token}`)
            .send({ amount: 500 });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.currentAmount).toBe(500);
    });

    // This must come before the "delete goal" test!
    test("should fetch user activity", async () => {
        const res = await request(app)
            .get("/api/system-activity/activity")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);

        // Safely assert optional structure
        if (res.body.data.length > 0) {
            expect(res.body.data[0]).toHaveProperty("goalsCreated");
            expect(res.body.data[0]).toHaveProperty("contributionsMade");
        }
    });

    test("should delete a goal", async () => {
        const res = await request(app)
            .delete(`/api/goals/deleteGoal/${goalId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Goal deleted successfully");
    });

    test("should not create a goal without token", async () => {
        const res = await request(app).post("/api/goals/createGoal").send({
            title: "New Goal",
            targetAmount: 1000,
        });

        expect(res.statusCode).toBe(401);
    });

    test("should return 404 for updating a non-existent goal", async () => {
        const res = await request(app)
            .put("/api/goals/updateGoal/64f1f1f1f1f1f1f1f1f1f1f1")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Does not exist" });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Goal not found");
    });
});
