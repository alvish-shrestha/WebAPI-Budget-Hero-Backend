const requestAuth = require("supertest");
const appAuth = require("../index");
const mongooseAuth = require("mongoose");

beforeAll(async () => {
    await mongooseAuth.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
    await mongooseAuth.disconnect();
});

describe("Auth Middleware", () => {
    test("should block protected route without token", async () => {
        const res = await requestAuth(appAuth).get("/api/goals");
        expect(res.statusCode).toBe(401);
    });
});