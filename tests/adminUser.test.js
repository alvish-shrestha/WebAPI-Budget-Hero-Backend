const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const User = require("../models/User");

let userId;

beforeAll(async () => {
    await User.deleteOne({ email: "admin_test@example.com" });
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe("Admin User Management API", () => {
    test("should create a new user", async () => {
        const res = await request(app).post("/api/admin/user").send({
            username: "admin_test",
            email: "admin_test@example.com",
            password: "securepass123",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);

        const user = await User.findOne({ email: "admin_test@example.com" });
        expect(user).toBeTruthy();
        userId = user._id;
    });

    test("should fetch all users", async () => {
        const res = await request(app).get("/api/admin/user");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("should fetch one user by ID", async () => {
        const res = await request(app).get(`/api/admin/user/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.email).toBe("admin_test@example.com");
    });

    test("should update a user", async () => {
        const res = await request(app).put(`/api/admin/user/${userId}`).send({
            username: "updated_admin",
            email: "admin_test@example.com",
            role: "admin",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("User data updated");

        const updatedUser = await User.findById(userId);
        expect(updatedUser.username).toBe("updated_admin");
    });

    test("should delete a user", async () => {
        const res = await request(app).delete(`/api/admin/user/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("User deleted");

        const deleted = await User.findById(userId);
        expect(deleted).toBeNull();
    });

    test("should not create a user with missing fields", async () => {
        const res = await request(app).post("/api/admin/user").send({
            username: "",
            email: "",
            password: "",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });
});
