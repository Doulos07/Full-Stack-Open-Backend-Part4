const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blogs");
const User = require("../models/users");

blogsRouter.get("/", async (request, response) => {
  const returnBlog = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  if (returnBlog) {
    response.json(returnBlog);
  }
});

blogsRouter.get("/:id", async (request, response) => {
  const returnBlog = await Blog.findById(request.params.id);

  if (returnBlog) {
    response.json(returnBlog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    response.status(401).send({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(400).json({ error: "UserId missing or not valid" });
  }

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  };

  const blog = new Blog(newBlog);
  const saveBlog = await blog.save();

  user.blogs = user.blogs.concat(saveBlog._id);

  await user.save();

  response.status(201).json(saveBlog);
});

blogsRouter.put("/:id", async (request, response) => {
  const updateBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      returnDocument: "after",
    },
  );

  if (updateBlog) {
    response.json(updateBlog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }

  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(401).json({ error: "unauthorized user" });
  }

  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

module.exports = blogsRouter;
