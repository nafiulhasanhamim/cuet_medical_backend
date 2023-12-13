const mongoose = require("mongoose");
const users = require("./shop.model");
const appointmentsSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    validate: {
      validator: async function (value) {
        const user = await mongoose.model("users").findById(value);
        return user && user.role === "doctor";
      },
      message: "Provided user must have the role of doctor.",
    },
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    validate: {
      validator: async function (value) {
        const user = await mongoose.model("users").findById(value);
        return user && user.role === "patient";
      },
      message: "Provided user must have the role of patient.",
    },
  },
  appointment_status: {
    type: String,
    required: true,
  },
  prescription: [
    {
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
      },
      note: {
        type: String,
        required: true
      }
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("appointments", appointmentsSchema);
