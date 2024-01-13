const {
  detectUserRole,
} = require("../../controllers/authcontrollers/auth.controllers");
const {
  addActiveDoctor,
  getAllActiveDoctors,
  getAllDoctors,
  removeActiveDoctor,
} = require("../../controllers/doctorcontrollers/doctor.controllers");
const {
  getAllAppointmentsForParticularDoctor, changeAppointmentStatus, changeMedicineSupplyStatus, getAllPendingAppointmentsForParticularDoctor, getAllAppointments, addMedicineToAppointment, prescribedMedicineDetails,
} = require("../../controllers/usercontrollers/appointment.controllers");

const doctorrouter = require("express").Router();
require("dotenv").config();

doctorrouter.get("/get-all-active-doctors", getAllActiveDoctors);

doctorrouter.get(
  "/get-all-appointments",
  // detectUserRole,
  getAllAppointments
);

doctorrouter.get(
  "/get-all-appointments-for-a-particular-doctor/:doctor",
  // detectUserRole,
  getAllAppointmentsForParticularDoctor
);

doctorrouter.get(
  "/get-all-pending-appointments-for-a-particular-doctor/:doctor",
  // detectUserRole,
  getAllPendingAppointmentsForParticularDoctor
);

doctorrouter.put(
  "/change-appointment-status/:_id",
  // detectUserRole,
  changeAppointmentStatus
);

doctorrouter.put(
  "/add-medicine-to-appointment/:_id",
  // detectUserRole,
  addMedicineToAppointment
);

//prescribed medicine details
doctorrouter.get(
  "/prescribed-medicine-details/:_id",
  // detectUserRole,
  prescribedMedicineDetails
);

doctorrouter.put(
  "/change-medicine-supply-status/:_id",
  // detectUserRole,
  changeMedicineSupplyStatus
);

doctorrouter.post(
  "/add-active-doctor",
  // detectUserRole,
  addActiveDoctor
);

doctorrouter.delete(
  "/remove-active-doctor/:_id",
  // detectUserRole,
  removeActiveDoctor
);
doctorrouter.get("/get-all-doctors", getAllDoctors);

module.exports = doctorrouter;
