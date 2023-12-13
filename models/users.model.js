const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
  user_image: {
    type: String,
    require: true,
  },
  phone_number: {
    type: String,
    require: true,
  },
  specialization: {
    type: String,
    // required: true,
  },
  experience: {
    type: String,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("users", userSchema);
