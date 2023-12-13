const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  medicine_id: {
    type: String,
    require: true,
  },
  medicine_name: {
    type: String,
    require: true,
  },  
  availableStock: {
    type: Number,
    default: 0
  },
  medicine_image: {
    type: String,
    // require: true,
  },
  medicine_mg: {
    type: Number,
    // require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("medicines", medicineSchema);
