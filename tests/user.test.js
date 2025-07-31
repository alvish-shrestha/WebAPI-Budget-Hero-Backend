jest.mock("nodemailer", () => {
    return {
        createTransport: () => ({
            sendMail: (options, callback) => {
                callback(null, { response: "Mocked email sent" });
            },
        }),
    };
});

const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../models/User");

let token;
let resetToken;

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

describe("Account Info Controller", () => {
    test("should get user profile", async () => {
        const res = await request(app)
            .get("/api/accountInfo/profile")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toMatchObject({
            username: "test",
            email: "test@gmail.com",
            role: expect.any(String),
        });
    });

    test("should update user profile", async () => {
        const uniqueEmail = `updated${Date.now()}@example.com`;
        const uniqueUsername = `updatedUser${Date.now()}`;

        const res = await request(app)
            .put("/api/accountInfo/profile")
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: uniqueUsername,
                email: uniqueEmail,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Profile updated");
        expect(res.body.data).toMatchObject({
            username: uniqueUsername,
            email: uniqueEmail,
        });
    });

    test("should fail password reset with invalid token", async () => {
        const res = await request(app)
            .post("/api/auth/reset-password/invalidtoken")
            .send({ password: "any" });

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Server error / Token invalid");
    });
});