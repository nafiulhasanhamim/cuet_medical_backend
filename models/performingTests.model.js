const mongoose = require("mongoose");
const users = require("./shop.model");
const performingTestsSchema = new mongoose.Schema({
  tests: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tests",
    required: true,
  },
  test_status: {
    type: String,
    required: true
  },
  test_report:{
    //continued later
  }
});

module.exports = mongoose.model("performingTests", performingTestsSchema);
