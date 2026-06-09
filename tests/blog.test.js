const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const Blog = require("../models/blogs");
const User = require("../models/users");
const helper = require("./test_helper");

const api = supertest(app);

describe("blog api", () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({});
    await api.post("/api/users").send(helper.initialUSers[0]);
    const loginResponse = await api.post("/api/login").send({
      username: "santiago",
      password: "mickey18",
    });

    token = loginResponse.body.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    await Blog.deleteMany({});
    helper.initialBlogs = helper.initialBlogs.map((blog) => ({
      ...blog,
      user: decodedToken.id,
    }));
    await Blog.insertMany(helper.initialBlogs);
  });

  describe("validating format", () => {
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
  });

  describe("addition of a new blog", () => {
    test("a valid blog can be added", async () => {
      const newBlog = {
        title: "Jijiji",
        author: "Patricio Rey y sus Redonditos de Ricota",
        url: "https://open.spotify.com/track/1tW6LiJGXGlReuNP38wrKb?si=6f9bbcd2ca4c439a",
        likes: 20,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogs = await helper.blogsInDb();

      assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);
    });

    test("validate key likes", async () => {
      const newBlog = {
        title: "La Ultima Lagrima",
        author: "Memphis la Blusera",
        url: "https://open.spotify.com/track/0cHVi2rirbT62DlX3uabke?si=6a084c99fceb40b4",
      };

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.likes, 0);
    });

    test("validate title and url", async () => {
      const newBlogUrl = {
        title: "La Ultima Lagrima",
        author: "Memphis la Blusera",
      };

      const newBlogTitle = {
        author: "Memphis la Blusera",
        url: "https://open.spotify.com/track/0cHVi2rirbT62DlX3uabke?si=6a084c99fceb40b4",
      };

      const responseUrl = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlogUrl)
        .expect(400);
      const responseTitle = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlogTitle)
        .expect(400);

      assert(responseUrl.body.error.includes("url is required"));
      assert(responseTitle.body.error.includes("title is required"));
    });
  });

  describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      const ids = blogsAtEnd.map((n) => n.id);
      assert(!ids.includes(blogToDelete.id));

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
    });
  });

  describe("update of a blog", () => {
    test("succeeds with status code 200 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const updateBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 999,
      };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updateBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.likes, 999);

      const blogsAtEnd = await helper.blogsInDb();

      const updatedBlog = blogsAtEnd.find(
        (blog) => blog.id === blogToUpdate.id,
      );

      assert.strictEqual(updatedBlog.likes, 999);

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
