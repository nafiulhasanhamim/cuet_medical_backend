const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    require: true,
  },
  token_type: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("tokens", tokenSchema);
