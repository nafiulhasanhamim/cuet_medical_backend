const { v4: uuidv4 } = require("uuid");
const Activedoctor = require("../../models/activedoctors.model");
const User = require("../../models/users.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const saltRounds = 10;

//get all the active doctors
const getAllActiveDoctors = async (req, res) => {
   try {
    const doctorList = await Activedoctor.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "doctor",
          foreignField: "_id",
          as: "doctorList",
        },
      },
      {
        $project: {
          _id: 0,
          doctor: 0,
          doctorList: {
            password: 0,
            role: 0
          }
        },
      },
    ]);
     if (doctorList) {
       res.status(200).send({
         success: true,
         message: "returns all active doctors",
         activeDoctors: doctorList,
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
}

//add a doctor into active list
const addActiveDoctor = async (req, res) => {
  const { user_id, role, _id } = req.role;
  if (role === "doctor") {
    const activeDoctor = await Activedoctor.findOne({ doctor:_id });
    if(activeDoctor) {
      return res.status(200).json({
        "success": false,
        "message": "This doctor is already added to the list"
      })
    }
    const newActiveDoctor = new Activedoctor({
      doctor: _id,
    });
    const doctorData = await newActiveDoctor.save();
    if (doctorData) {
      return res.status(201).send({
        success: true,
        message: "Doctor is added in the list",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Something went wrong.Please try again",
      });
    }
  } else {
    return res.status(200).json({
      "success": false,
      "message": "Please login as a doctor"
    })
  }
};

//get all doctor list
const getAllDoctors = async (req, res) => {
   try {
    const doctors = await User.aggregate([
      {
        $match: {
          role: { $eq: "doctor" },
        },
      },
      {
        $project: {
          _id: 0,
          password: 0
        },
      },
    ]);
     if (doctors) {
       res.status(200).send({
         success: true,
         message: "returns all doctors",
         doctors
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
}

module.exports = {
  addActiveDoctor,
  getAllActiveDoctors,
  getAllDoctors
};
