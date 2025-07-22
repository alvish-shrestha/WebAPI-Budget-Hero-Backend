jest.mock("nodemailer", () => ({
    createTransport: () => ({
        sendMail: (options, callback) => {
            callback(null, { response: "Mocked email sent" });
        },
    }),
}));

const request = require("supertest");
const app = require("../index"); // or "../app"
const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

let token;
let userId;

afterAll(async () => {
    await User.deleteOne({ email: "test@gmail.com" });
    await mongoose.disconnect();
});

describe("User Authentication API", () => {
    test("should fail to register if required fields are missing", async () => {
        const res = await request(app).post("/api/auth/register").send({
            username: "test",
            email: "test@gmail.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Missing field");
        expect(res.body.success).toBe(false);
    });

    test("should fail if passwords do not match", async () => {
        const res = await request(app).post("/api/auth/register").send({
            username: "test",
            email: "test@gmail.com",
            password: "password123",
            confirmPassword: "wrongpass",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Passwords do not match");
    });

    test("should register a new user", async () => {
        const res = await request(app).post("/api/auth/register").send({
            username: "test",
            email: "test@gmail.com",
            password: "password123",
            confirmPassword: "password123",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User registered");
    });

    test("should not allow duplicate user", async () => {
        const res = await request(app).post("/api/auth/register").send({
            username: "test",
            email: "test@gmail.com",
            password: "password123",
            confirmPassword: "password123",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("User exists");
    });

    test("should login with valid credentials", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "test@gmail.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        token = res.body.token;

        // Decode token to extract user ID for later
        const decoded = jwt.decode(token);
        userId = decoded.id;
    });

    test("should fail login with wrong password", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "test@gmail.com",
            password: "wrongpassword",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid Credentials");
    });

    test("should fail login if user not found", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "notfound@gmail.com",
            password: "password",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Missing User");
    });
});
