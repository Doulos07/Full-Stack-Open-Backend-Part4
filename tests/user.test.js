const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/users");
const helper = require("./test_helper");

const api = supertest(app);

describe("User api", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(helper.initialUSers);
  });

  describe("validating format", () => {
    test("users are returned as json", async () => {
      await api
        .get("/api/users")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("Validate the turnstile for users without _id or password", async () => {
      const response = await api.get("/api/users");

      const has_id = response.body.some((user) =>
        Object.prototype.hasOwnProperty.call(user, "_id"),
      );

      const has_password = response.body.some((user) =>
        Object.prototype.hasOwnProperty.call(user, "password"),
      );

      assert.strictEqual(has_id, false);
      assert.strictEqual(has_password, false);
    });
  });

  describe("addition of a new user", () => {
    test("a valid user can be added", async () => {
      const newuser = {
        username: "nasha",
        name: "Nasha Barridge",
        password: "mickey17&mickey18",
      };

      await api
        .post("/api/users")
        .send(newuser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const users = await helper.usersInDb();

      assert.strictEqual(users.length, helper.initialUSers.length + 1);
    });

    test("validate username", async () => {
      const newuser = {
        username: "NB",
        name: "Nasha Barridge",
        password: "mickey17&mickey18",
      };

      await api
        .post("/api/users")
        .send(newuser)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    });

    test("validate password", async () => {
      const newuser = {
        username: "nasha",
        name: "Nasha Barridge",
        password: "my",
      };

      await api
        .post("/api/users")
        .send(newuser)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
