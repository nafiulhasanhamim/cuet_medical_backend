const { v4: uuidv4 } = require("uuid");
const User = require("../../models/users.model");
const Token = require("../../models/tokens.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { createToken } = require("../../helpers/jsonwebtoken");
const emailWithNodeMailer = require("../../helpers/email");
const saltRounds = 10;

const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).send({
        success: true,
        message: "returns all users",
        users: users,
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
};

const getSingleUser = async (req, res) => {
  try {
    const users = await User.findOne({ id: req.params.id });

    if (users) {
      res.status(200).send({
        success: true,
        message: "returns all users",
        data: users,
      });
    } else {
      res.status(200).send({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const users = await User.deleteOne({ user_id: req.params.user_id });
    if (users) {
      res.status(200).send({
        success: true,
        message: "Deleted Successfully",
        data: users,
      });
    } else {
      res.status(200).send({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

const registrationPatient = async (req, res) => {
  const { name, email, password, user_image, phone_number, role } = req.body;
  const users = await User.findOne({ email });

  //This also provide the same result..but returns an array
  if (typeof users?.email === "string") {
    return res.status(201).send({
      message: "User already exist in this email",
    });
  }
  else if(!name) {
    return res.status(200).json({
      "message":"Name is a required field"
    })
  } else if(!user_image) {
    return res.status(200).json({
      "message": "Image is a required field"
    })
  } else if(!phone_number) {
    return res.status(200).json({
      "message": "Phone Number is a required field"
    })
  }
  bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
    try {
      const user_id = uuidv4();
      const payload = {
        user_id,
        name,
        email,
        hash,
        role: role ? role : "patient",
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
};

const verifyEmailForRegistration = async (req, res, next) => {
  let token = req.params.token;
  token = await Token.findOne({ token });
  if (token?.token && token?.token_type === "account_activation") {
    token = token.token.split(" ")[1];
    // console.log(token);
    jwt.verify(token, process.env.SECRET_KEY, async (err, valid) => {
      if (err) {
        res.send({ result: "This activation link is already used" });
      } else {
        try {
          let decode;
          decode = jwt.decode(token);
          const { user_id, name, email, hash, role, user_image, phone_number } =
            decode;
          req.token = decode;
          // console.log(token);
          deletedToken = await Token.deleteOne({ token: `Bearer ${token}` });
          // console.log(deletedToken);
          next();
        } catch (error) {
          console.log(error);
        }
      }
    });
  } else {
    res.send({ result: "This activation token is already used" });
  }
};

const completeRegistration = async (req, res) => {
  const { user_id, name, email, hash, role, phone_number, user_image, specialization, experience } =
    req.token;
  if (req?.token) {
    const users = await User.findOne({ email: req.body.email });
    if (typeof users?.email === "string") {
      return res.status(201).send({
        message: "This Email was Already Used",
      });
    } else {
      if (role === "patient") {
        const newUser = new User({
          user_id,
          name,
          email,
          password: hash,
          role: "patient",
          phone_number,
          user_image,
        });
        const userData = await newUser.save();
        if (userData) {
          res.send(`<h1>Your Email has been verified Successfully...
                 Please , <a href="http://localhost:3000/login" target="_blank">Login here </a>
              </h1>`);
        } else {
          res.status(200).send({ message: "Data was not successfully posted" });
        }
      } else if (role === "doctor") {
        if(!specialization) {
          return res.status(200).json({
            "message": "Specialization is a required field"

          })
        } else if(!experience) {
          return res.status(200).json({
            "message": "Experience is a required field"
          })
        }
        const newUser = new User({
          user_id,
          name,
          email,
          password: hash,
          role,
          phone_number,
          user_image,
          specialization,
          experience,
        });
        const userData = await newUser.save();
        if (userData) {
          res.send(`<h1>Your Email has been verified Successfully...
                 Please , <a href="http://localhost:3000/login" target="_blank">Login here </a>
              </h1>`);
        } else {
          res.status(200).send({ message: "Data was not successfully posted" });
        }
      } else if (role === "staff") {
        const newUser = new User({
          user_id,
          name,
          email,
          password: hash,
          role: "staff",
          phone_number,
          user_image,
        });
        const userData = await newUser.save();
        if (userData) {
          res.send(`<h1>Your Email has been verified Successfully...
                 Please , <a href="http://localhost:3000/login" target="_blank">Login here </a>
              </h1>`);
        } else {
          res.status(200).send({ message: "Data was not successfully posted" });
        }
      }
    }
  } else {
    // console.log("called");
    return res.send({
      success: false,
      message: `This Activation link is already used`,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const cookies = req.cookies;
  if (cookies?.token) {
    return res.status(200).json({
      message: "Please logout first",
    });
  }
  const user = await User.aggregate([
    {
      $match: {
        email: { $eq: email },
      },
    },
  ]);

  if (user?.length === 0) {
    return res.status(201).send({
      success: false,
      message: "User is not found",
    });
  }
  if (!bcrypt.compareSync(password, user[0]?.password)) {
    return res.status(201).send({
      success: false,
      message: "Incorrect password",
    });
  }

  const payload = {
    _id: user[0]._id,
    user_id: user[0].user_id,
    name: user[0].name,
    role: user[0].role,
  };
  const token = createToken(payload, "1d");
  // console.log(token)
  res.cookie("token", token, {
    httpOnly: false,
    sameSite: "None",
    // secure: true,
  });
  return res.status(200).send({
    success: true,
    message: "User is logged in successfully",
    userinfo: {
      name: user[0].name,
      _id: user[0]._id,
      user_id: user[0].user_id,
      role: user[0].role,
    },
  });
};

//logout user
const logoutUser = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(200).json({
      message: "You are not logged in..",
    });
  }
  res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

//identify the user
const identifyUser = async (req, res) => {
  const { token } = req.cookies;

  // console.log(token);
};

//detect the role of the user
const detectUserRole = (req, res, next) => {
  // console.log("hiiii");
  let { token } = req.cookies;
  // console.log(token)
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, valid) => {
      if (err) {
        res.send({ result: "Token is not valid" });
      } else {
        // console.log(token)
        let decode;
        decode = jwt.decode(token);
        // req.user_role = decode.role;
        req.role = {
          role: decode.role,
          user_id: decode.user_id,
          _id: decode._id,
        };
        next();
      }
    });
  } else {
    res.send({ result: "please login first" });
  }
};

//check customer middleware
const isCustomer = (req, resp, next) => {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, valid) => {
      if (err) {
        resp.send({ result: "please provide valid token" });
      } else {
        let decode;
        decode = jwt.decode(token);
        req.info = decode;
        if (decode.role === "customer") {
          next();
        } else {
          resp.send({
            message: "customer is not verified",
          });
        }
      }
    });
  } else {
    resp.send({ result: "please add token with header" });
  }
};

module.exports = {
  getAllUser,
  registrationPatient,
  verifyEmailForRegistration,
  completeRegistration,
  getSingleUser,
  deleteUser,
  loginUser,
  logoutUser,
  identifyUser,
  detectUserRole,
  isCustomer,
};
