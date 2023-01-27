/* eslint-disable no-undef */
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
mongoose.set("strictQuery", false);

const supertest = require('supertest')

const app = require('../src/app')
const { MONGO_TEST_URL } = process.env
const { User } = require('../src/db/userModel')

describe("login", () => {
    beforeAll(async() => {
        await mongoose.connect(MONGO_TEST_URL)
        await User.deleteMany()
        console.log('connected to test db')
    })
    afterAll(async () => {
        await mongoose.disconnect(MONGO_TEST_URL)
        console.log("disconnected from test db")
    })
    it("should login user", async() => {
        await supertest(app).post("/api/users/register").send({
            email: "user1@gmail.com",
            password: "user1123",
        })
        const res = await supertest(app).get("/api/users/login").send({
            email: "user1@gmail.com",
            password: "user1123",
        });

        expect(res.statusCode).toBe(200)
        expect(res.body.token).toBeDefined()
        expect(res.body.user).toEqual(
            expect.objectContaining({
            email: "user1@gmail.com",
            subscription: expect.any(String),
        }))
    })
})
