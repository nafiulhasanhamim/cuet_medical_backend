const mongoose = require("mongoose");

const userTestSchema = new mongoose.Schema({
  test_id: {
    type: String,
    ref: "tests",
    field: "test_id",
  },
  test_status: {
    type: String,
    require: true,
  },
  test_report_image: {
    type: String,
    // require: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("userTests", userTestSchema);
