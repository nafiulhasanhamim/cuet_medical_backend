const { detectUserRole } = require("../../controllers/authcontrollers/auth.controllers");
const { addActiveDoctor, getAllActiveDoctors, getAllDoctors } = require("../../controllers/doctorcontrollers/doctor.controllers");

const doctorrouter = require("express").Router();
require("dotenv").config();

doctorrouter.get("/get-all-active-doctors", getAllActiveDoctors)
doctorrouter.post("/add-active-doctor", detectUserRole, addActiveDoctor)
doctorrouter.get("/get-all-doctors", getAllDoctors)

module.exports = doctorrouter;
