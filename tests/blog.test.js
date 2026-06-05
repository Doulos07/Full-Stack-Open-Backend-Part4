const assert = require("node:assert");
const { test, after, beforeEach } = require("node:test");
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

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Jijiji",
    author: "Patricio Rey y sus Redonditos de Ricota",
    url: "https://open.spotify.com/track/1tW6LiJGXGlReuNP38wrKb?si=6f9bbcd2ca4c439a",
    likes: 20,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogs = await helper.blogsInDb();

  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);
});

after(async () => {
  await mongoose.connection.close();
});
