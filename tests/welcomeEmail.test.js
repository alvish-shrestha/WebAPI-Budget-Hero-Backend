jest.mock("nodemailer", () => {
    return {
        createTransport: () => ({
            sendMail: (options, callback) => {
                callback(null, { response: "Mocked email sent" });
            },
        }),
    };
});

const requestEmail = require("supertest");
const appEmail = require("../index");
const mongooseEmail = require("mongoose");
const UserEmail = require("../models/User");

afterAll(async () => {
    await UserEmail.deleteMany({ email: /test.*@mail.com/ });
    await mongooseEmail.disconnect();
});

describe("Welcome Email Trigger", () => {
    test("should trigger welcome email on registration", async () => {
        const email = `test${Date.now()}@mail.com`;
        const res = await requestEmail(appEmail).post("/api/auth/register").send({
            username: "emailUser",
            email,
            password: "pass1234",
            confirmPassword: "pass1234",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User registered");
    });
});