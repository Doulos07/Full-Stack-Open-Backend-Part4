const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  password: String,
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
