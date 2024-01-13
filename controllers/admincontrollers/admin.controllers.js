const { v4: uuidv4 } = require("uuid");
const Activedoctor = require("../../models/activedoctors.model");
const User = require("../../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { createToken } = require("../../helpers/jsonwebtoken");
const Token = require("../../models/tokens.model");
const emailWithNodeMailer = require("../../helpers/email");
const saltRounds = 10;

//add a doctor into
const addDoctor = async (req, res) => {
  // const { user_id, role, _id } = req.role;
  const {
    name,
    email,
    password,
    user_image,
    phone_number,
    specialization,
    experience,
  } = req.body;

  // if (role === "admin") {
  const findDoctor = await User.findOne({ email });
  if (typeof findDoctor?.email === "string") {
    return res.status(200).json({
      success: false,
      message: "This doctor is already added to the list",
    });
  } else {
    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      try {
        const user_id = uuidv4();
        const payload = {
          user_id,
          name,
          email,
          hash,
          role: "doctor",
          user_image,
          phone_number,
          specialization,
          experience,
        };
        const token = createToken(payload, "20m");
        const newToken = new Token({
          token,
          token_type: "account_activation",
        });
        const tokenData = await newToken.save();
        //prepare email
        const emailData = {
          email,
          subject: "Acount Activation Email",
          html: `
            <h2>Hello, ${name}! </h2>
            <p> Please click here to activate your account <a href="http://localhost:5000/registration/activate-account/${token}" target="_blank">Activate Your Account </a></p>
            `,
        };

        try {
          await emailWithNodeMailer(emailData);
          return res.send({
            success: true,
            message: `Please go to your ${email} for completing your registration process`,
          });
        } catch (emailError) {
          //  next(createError(500,'Failed to send verification email'));
          return;
        }
      } catch (error) {
        res.status(500).send({ message: error });
      }
    });
  }
  // } else {
  //   return res.status(200).json({
  //     success: false,
  //     message: "Please login as an admin",
  //   });
  // }
};

//add a staff into
const addStaff = async (req, res) => {
  // const { user_id, role, _id } = req.role;
  const { name, email, password, user_image, phone_number } = req.body;

  // if (role === "admin") {
  const findDoctor = await User.findOne({ email });
  if (typeof findDoctor?.email === "string") {
    return res.status(200).json({
      success: false,
      message: "This doctor is already added to the list",
    });
  } else {
    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      try {
        const user_id = uuidv4();
        const payload = {
          user_id,
          name,
          email,
          hash,
          role: "staff",
          user_image,
          phone_number,
        };
        const token = createToken(payload, "20m");
        const newToken = new Token({
          token,
          token_type: "account_activation",
        });
        const tokenData = await newToken.save();
        //prepare email
        const emailData = {
          email,
          subject: "Acount Activation Email",
          html: `
            <h2>Hello, ${name}! </h2>
            <p> Please click here to activate your account <a href="http://localhost:5000/registration/activate-account/${token}" target="_blank">Activate Your Account </a></p>
            `,
        };

        try {
          await emailWithNodeMailer(emailData);
          return res.send({
            success: true,
            message: `Please go to your ${email} for completing your registration process`,
          });
        } catch (emailError) {
          //  next(createError(500,'Failed to send verification email'));
          return;
        }
      } catch (error) {
        res.status(500).send({ message: error });
      }
    });
  }
  // } else {
  //   return res.status(200).json({
  //     success: false,
  //     message: "Please login as an admin",
  //   });
  // }
};

//get all staffs
const getAllStaffs = async (req, res) => {
  // const { user_id, role, _id } = req.role;

  // if (role === "admin") {
   try {
     const staffs = await User.aggregate([
       {
         $match: {
           role: { $eq: "staff" },
         },
       },
       {
         $project: {
           _id: 0,
           password: 0,
         },
       },
     ]);
     if (staffs) {
       res.status(200).send({
         success: true,
         message: "returns all staffs",
         staffs,
       });
     } else {
       res.status(200).send({
         message: "Something wrong",
       });
     }
   } catch (error) {
     res.status(500).send({
       success: false,
       message: error,
     });
   }
  // } else {
  //   return res.status(200).json({
  //     success: false,
  //     message: "Please login as an admin",
  //   });
  // }
};
module.exports = {
  addDoctor,
  addStaff,
  getAllStaffs
};
