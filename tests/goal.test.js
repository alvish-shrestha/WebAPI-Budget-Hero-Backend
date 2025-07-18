const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const User = require("../models/User");
const Goal = require("../models/Goal");

let token;
let goalId;

beforeAll(async () => {
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

afterAll(async () => {
    await Goal.deleteMany({});
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

    test("should delete a goal", async () => {
        const res = await request(app)
            .delete(`/api/goals/deleteGoal/${goalId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Goal deleted successfully");
    });

    test("should not create a goal without token", async () => {
        const res = await request(app)
            .post("/api/goals/createGoal")
            .send({
                title: "New Goal",
                targetAmount: 1000,
            });

        expect(res.statusCode).toBe(401);
    });
});
