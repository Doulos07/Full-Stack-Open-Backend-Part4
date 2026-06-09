const usersRouter = require("express").Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", { user: 0, likes: 0 });
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: "password must be at least 3 characters long",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({ username, name, password: passwordHash });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
