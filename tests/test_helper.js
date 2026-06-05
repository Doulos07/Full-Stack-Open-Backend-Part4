const Blog = require("../models/blogs");

const initialBlogs = [
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    url: "http://test.com",
    likes: 7,
  },
  {
    title: "Refactoring UI",
    author: "Martin Fowler",
    url: "http://test.com",
    likes: 10,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://test.com",
    likes: 12,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
