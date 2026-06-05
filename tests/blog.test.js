const assert = require("node:assert");
const { test, describe, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blogs");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Promise.all(helper.initialBlogs.map((blog) => new Blog(blog).save()));
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("Validate the Blogs lathe without _id", async () => {
  const response = await api.get("/api/blogs");

  // const has_id = response.body.some((blog) => blog.hasOwnProperty("_id")); -> ESLint -> Error | robustness problem
  const has_id = response.body.some((blog) =>
    Object.prototype.hasOwnProperty.call(blog, "_id"),
  );
  assert.strictEqual(has_id, false);
});

after(async () => {
  await mongoose.connection.close();
});
