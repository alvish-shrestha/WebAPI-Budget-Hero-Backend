const requestStats = require("supertest");
const appStats = require("../index");
const mongooseStats = require("mongoose");

beforeAll(async () => {
    await mongooseStats.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
    await mongooseStats.disconnect();
});

describe("Dashboard Stats Endpoint", () => {
    test("should fetch dashboard stats", async () => {
        const res = await requestStats(appStats).get("/api/admin/dashboard-stats");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("users");
        expect(res.body).toHaveProperty("feedbacks");
        expect(res.body).toHaveProperty("activities");
    });
});