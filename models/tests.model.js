const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  test_id: {
    type: String,
    require: true,
  },
  test_name: {
    type: String,
    require: true,
  },
  test_image: {
    type: String,
    // require: true,
  },
  test_description: {
    type: String,
    // require: true,
  },
  test_price: {
    type: Number,
    required: true
  },
  available_status: {
    type: String,
    default: "available"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("tests", testSchema);
