const blogsRouter = require("express").Router();
const Blog = require("../models/blogs");

blogsRouter.get("/", async (request, response) => {
  const returnBlog = await Blog.find({});
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
  const blog = new Blog(request.body);

  const saveBlog = await blog.save();
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
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

module.exports = blogsRouter;
