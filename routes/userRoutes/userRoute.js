const userrouter = require("express").Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

userrouter.use(passport.initialize());

userrouter.post(
  "/order/order-by-a-particular-use"
);

module.exports = userrouter;
