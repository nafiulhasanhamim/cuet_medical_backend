const mongoose = require("mongoose");
const activeDoctorsSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    validate: {
      validator: async function (value) {
        const user = await mongoose.model('users').findById(value);
        return user && user.role === 'doctor';
      },
      message: 'Provided user must have the role of doctor.'
    }
  },
});

module.exports = mongoose.model("activeDoctors", activeDoctorsSchema);
