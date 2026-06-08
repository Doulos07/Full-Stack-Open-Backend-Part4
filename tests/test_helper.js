const Blog = require("../models/blogs");
const User = require("../models/users");

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

//============================
// USER
//============================
const initialUSers = [
  {
    username: "santiago",
    name: "santiago alvarez",
    password: "mickey18",
  },
  {
    username: "mickey",
    name: "mickey barnes",
    password: "mickey17",
  },
];

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  initialUSers,
  blogsInDb,
  usersInDb,
};
