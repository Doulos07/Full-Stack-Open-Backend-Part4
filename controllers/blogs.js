const blogsRouter = require("express").Router();
const Blog = require("../models/blogs");

blogsRouter.get("/", (request, response, next) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs);
    })
    .catch((error) => next(error));
});

blogsRouter.get("/:id", (request, response, next) => {
  Blog.findById(request.params.id)
    .then((returnBlog) => {
      if (returnBlog) {
        response.json(returnBlog);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

blogsRouter.post("/", (request, response, next) => {
  console.log(request.body);
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => next(error));
});

blogsRouter.put("/:id", (request, response, next) => {
  Blog.findByIdAndUpdate(request.params.id, request.body, {
    returnDocument: "after",
  })
    .then((updateBlog) => {
      if (updateBlog) {
        response.json(updateBlog);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

blogsRouter.delete("/:id", (request, response, next) =>
  Blog.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error)),
);

module.exports = blogsRouter;
