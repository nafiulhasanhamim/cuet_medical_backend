const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userrouter = require("./routes/userRoutes/userRoute");
const authrouter = require("./routes/authRoutes/authRoute");
const doctorrouter = require("./routes/userRoutes/doctorRoute");
const adminrouter = require("./routes/adminRoutes/adminroute");
const staffrouter = require("./routes/staffRoutes/staffRoute");
const app = express();
require("./config/db");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hi Server is running successfully");
});

//define all routes
app.use("/", userrouter);
app.use("/", authrouter);
app.use("/", doctorrouter);
app.use("/", adminrouter);
app.use("/", staffrouter);


//router error
app.use((req, res, next) => {
  res.status(404).json({
    message: "router not found",
  });
});

//server error
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "server error",
  });
});
module.exports = app;
