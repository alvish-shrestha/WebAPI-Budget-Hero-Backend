const requestStreak = require("supertest");
const appStreak = require("../index");
const mongooseStreak = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

let token;

beforeAll(async () => {
    await mongooseStreak.connect(process.env.MONGODB_URI);
    await User.deleteOne({ email: "streak@gmail.com" });

    await requestStreak(appStreak).post("/api/auth/register").send({
        username: "streakuser",
        email: "streak@gmail.com",
        password: "streak123",
        confirmPassword: "streak123",
    });

    const res = await requestStreak(appStreak).post("/api/auth/login").send({
        email: "streak@gmail.com",
        password: "streak123",
    });
    token = res.body.token;
});

afterAll(async () => {
    await User.deleteOne({ email: "streak@gmail.com" });
    await mongooseStreak.disconnect();
});

describe("Streak Endpoint", () => {
    test("should fetch streak and badges", async () => {
        const res = await requestStreak(appStreak)
            .get("/api/auth/streak")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("streak");
        expect(res.body).toHaveProperty("badges");
    });
});