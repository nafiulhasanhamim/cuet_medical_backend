const {
  addDoctor,
  addStaff,
  getAllStaffs,
} = require("../../controllers/admincontrollers/admin.controllers");
const {
  detectUserRole,
} = require("../../controllers/authcontrollers/auth.controllers");
const {
  addActiveDoctor,
  getAllActiveDoctors,
  getAllDoctors,
} = require("../../controllers/doctorcontrollers/doctor.controllers");

const adminrouter = require("express").Router();
require("dotenv").config();

adminrouter.post(
  "/add-doctor",
  //  detectUserRole,
  addDoctor
);
adminrouter.post(
  "/add-staff",
  //  detectUserRole,
  addStaff
);

adminrouter.get(
  "/get-all-staffs",
  //  detectUserRole,
  getAllStaffs
);

module.exports = adminrouter;
