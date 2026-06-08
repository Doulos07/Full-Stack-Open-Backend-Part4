const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minLength: [3, "minimum 3 characters"],
    required: true,
    unique: true,
  },
  name: String,
  password: {
    type: String,
    required: true,
  },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
});

userSchema.set("toJSON", {
  transform: (document, objectReturn) => {
    objectReturn.id = objectReturn._id.toString();
    delete objectReturn._id;
    delete objectReturn.__v;
    delete objectReturn.password;
  },
});

module.exports = mongoose.model("User", userSchema);
