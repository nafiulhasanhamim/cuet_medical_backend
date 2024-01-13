const userrouter = require("express").Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { detectUserRole } = require("../../controllers/authcontrollers/auth.controllers");
const { takeAppointment, getAllAppointmentsForParticularUser } = require("../../controllers/usercontrollers/appointment.controllers");

userrouter.use(passport.initialize());

userrouter.post(
  "/take-appointment",
  // detectUserRole,
  takeAppointment
);

userrouter.get(
  "/get-all-appointments-for-a-particular-user/:patient",
  // detectUserRole,
  getAllAppointmentsForParticularUser
);

module.exports = userrouter;
