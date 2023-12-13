const mongoose = require("mongoose");
const medicineStockSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "medicines",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  piece: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("medicineStocks", medicineStockSchema);
