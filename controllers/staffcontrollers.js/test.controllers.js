const { v4: uuidv4 } = require("uuid");
const Test = require("../../models/tests.model");
const User = require("../../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { createToken } = require("../../helpers/jsonwebtoken");
const { ObjectId } = require("mongodb");
const saltRounds = 10;

//add test info
const addTest = async (req, res) => {
  // const { user_id, role, _id } = req.role;
  const { test_name, test_image, test_description, test_price } = req.body;
  // if (role === "staff" || role === "admin") {
    const test_id = uuidv4();
    if (!test_name) {
      return res.status(200).json({
        message: "Test Name is a required field",
      });
    }
    if (!test_image) {
      return res.status(200).json({
        message: "Test Image is a required field",
      });
    }
    if (!test_description) {
      return res.status(200).json({
        message: "Test Description is a required field",
      });
    }
    if (!test_price) {
      return res.status(200).json({
        message: "Test Price is a required field",
      });
    }
    const newTest = new Test({
      test_id,
      test_name,
      test_image,
      test_description,
      test_price,
    });
    const TestData = await newTest.save();
    if (TestData) {
      return res.status(201).send({
        success: true,
        message: "Test is added in the list",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Something went wrong.Please try again",
      });
    }
  // } else {
  //   return res.status(200).json({
  //     success: false,
  //     message: "Please login as an staff or admin",
  //   });
  // }
};

//get all tests info
const getAllTestInfo = async (req, res) => {
  try {
      const testInfo = await Test.find();
      if (testInfo) {
        res.status(200).json({
          success: true,
          message:
            "returns all the tests information",
          testInfo,
        });
      } else {
        res.status(200).json({
          success: false,
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

//return a particular test details
const particularTestDetails = async (req, res) => {
  const { test_id } = req.params;
  try {
      const testDetails = await Test.aggregate([
        {
          $match: {
            test_id,
          },
        },
      ]);
      if (testDetails) {
        return res.status(200).json({
          success: true,
          message: "Successfully fetched",
          testDetails,
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Something went wrong",
        });
      }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again",
    });
  }
};

//edit test info
const editTest = async (req, res) => {
  const {test_name, test_image, test_price, test_description, available_status} = req.body;
  const {test_id} = req.params;
  // const { role, user_id } = req.role;
  try {
    //  if (role === "staff" || role === "admin") {
       if (!test_name) {
         return res.status(200).json({
           message: "Test Name is a required field",
         });
       }
       if (!test_image) {
         return res.status(200).json({
           message: "Test Image is a required field",
         });
       }
       if (!test_description) {
         return res.status(200).json({
           message: "Test Description is a required field",
         });
       }
       if (!test_price) {
         return res.status(200).json({
           message: "Test Price is a required field",
         });
       }
       
       const testInfo = await Test.findOne({ test_id });
       testInfo.test_name = test_name;
       testInfo.test_image = test_image;
       testInfo.test_description = test_description;
       testInfo.test_price = test_price;
       testInfo.available_status = available_status;
       
       const testData = await testInfo.save();

       if (testData) {
         return res.status(201).send({
           success: true,
           message: "Test is edited successfully",
         });
       } else {
         return res.status(200).json({
           success: false,
           message: "Something went wrong.Please try again",
         });
       }
    //  } else {
    //    return res.status(200).json({
    //      success: false,
    //      message: "Please login as an staff or admin",
    //    });
    //  }

  } catch (error) {
    res.status(500).send({ message: error });
  }
};


module.exports = {
  addTest,
  getAllTestInfo,
  particularTestDetails,
  editTest
};
