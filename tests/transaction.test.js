const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

let token;
let transactionId;

beforeAll(async () => {
    // 1. Ensure clean DB user
    await User.deleteOne({ email: "txnuser@gmail.com" });

    // 2. Register user
    await request(app).post("/api/auth/register").send({
        username: "txnuser",
        email: "txnuser@gmail.com",
        password: "test1234",
        confirmPassword: "test1234",
    });

    // 3. Login and get token
    const res = await request(app).post("/api/auth/login").send({
        email: "txnuser@gmail.com",
        password: "test1234",
    });

    token = res.body.token;
});

afterAll(async () => {
    await Transaction.deleteMany({});
    await User.deleteOne({ email: "txnuser@gmail.com" });
    await mongoose.disconnect();
});

describe("Transaction API", () => {
    test("should create a new transaction", async () => {
        const res = await request(app)
            .post("/api/transactions/addTransaction")
            .set("Authorization", `Bearer ${token}`)
            .send({
                type: "income",
                amount: 5000,
                category: "Salary",
                account: "Bank",
                note: "Test salary",
                date: new Date(),
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        transactionId = res.body.data._id;
    });

    test("should fetch all transactions for the user", async () => {
        const res = await request(app)
            .get("/api/transactions")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    test("should update a transaction", async () => {
        const res = await request(app)
            .put(`/api/transactions/updateTransaction/${transactionId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                amount: 6000,
                note: "Updated salary",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.amount).toBe(6000);
        expect(res.body.data.note).toBe("Updated salary");
    });

    test("should delete a transaction", async () => {
        const res = await request(app)
            .delete(`/api/transactions/deleteTransaction/${transactionId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Transaction deleted");
    });

    test("should not create a transaction without token", async () => {
        const res = await request(app).post("/api/transactions").send({
            type: "income",
            amount: 3000,
            category: "Freelance",
        });

        expect(res.statusCode).toBe(404);
    });
});
