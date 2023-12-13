const authrouter = require("express").Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {
  registrationPatient,
  loginUser,
  verifyEmailForRegistration,
  completeRegistration,
  identifyUser,
  getAllUser,
  deleteUser,
  logoutUser,
} = require("../../controllers/authcontrollers/auth.controllers");

authrouter.use(passport.initialize());

authrouter.post("/login", loginUser);
authrouter.get("/logout", logoutUser);
authrouter.post("/register", registrationPatient);
authrouter.get(
  "/registration/activate-account/:token",
  verifyEmailForRegistration,
  completeRegistration
);
authrouter.get("/identifyuser", identifyUser)
authrouter.get("/getalluser", getAllUser)
authrouter.delete("/deleteuser/:user_id", deleteUser)

module.exports = authrouter;
