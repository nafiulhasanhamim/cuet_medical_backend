const { v4: uuidv4 } = require("uuid");
const Medicines = require("../../models/medicines.model");
const MedicinesStock = require("../../models/medicinestock.model");
const User = require("../../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { createToken } = require("../../helpers/jsonwebtoken");
const { ObjectId } = require("mongodb");
const saltRounds = 10;

//add medicine info
const addMedicineInfo = async (req, res) => {
  const { user_id, role, _id } = req.role;
  const {
    medicine_name,
    medicine_image,
    medicine_mg
  } = req.body;

  if (role === "staff") {
    if(!medicine_name) {
      return res.status(200).json({
        "message": "Medicine Name is a required field"
      })
    } else if(!medicine_image) {
      return res.status.json({
        "message": "Image is a required field"
      })
    } else if(!medicine_mg) {
      return res.status.json({
        message: "Medicine mg is a required field",
      });
    }
    const medicine_id = uuidv4();
    const newMedicine = new Medicines({
        medicine_id,
        medicine_name,
        medicine_image,
        medicine_mg
    })
    const medicineData = await newMedicine.save();
    if(medicineData) {
      return res.status(201).send({
        success: true,
        message: "Medicine is added in the list",
      });   
    } else {
        return res.status(200).json({
          success: false,
          message: "Something went wrong.Please try again",
        });
    }
  } else {
    return res.status(200).json({
      success: false,
      message: "Please login as an staff",
    });
  }
};

//get all medicine info like name, mg and image
const getAllMedicinesInfo = async (req, res) => {
  const { role } = req.role;
  try {
    if(role === "admin" || role === "staff" || role === "doctor") {
      const medicinesInfo = await Medicines.find();
      if (medicinesInfo) {
        res.status(200).json({
          "success": true,
          "message":
            "returns all the medicines information like medicine_name, image and mg",
          medicinesInfo,
        });
      } else {
        res.status(200).json({
          "success": false,
          "message": "Something wrong",
        });
      }
    } else {
      return res.status(200).json({
        "success": false,
        "message":"You don't have access to get this info" 
      })
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
  }
}

//edit medicine info like name, mg and image
const editMedicineInfo = async (req, res) => {
  const {medicine_name, medicine_image, medicine_mg} = req.body;
  console.log(req.body)
  const {medicine_id} = req.params;
  const { role, user_id } = req.role;
  try {
    if (role === "staff" || role === "admin") {
      if (!medicine_name) {
        return res.status(200).json({
          message: "Medicine Name is a required field",
        });
      }
      if (!medicine_image) {
        return res.status(200).json({
          message: "Medicine Image is a required field",
        });
      }
      if (!medicine_mg) {
        return res.status(200).json({
          message: "Medicine mg is a required field",
        });
      }

      const medicineInfo = await Medicines.findOne({ medicine_id });
      medicineInfo.medicine_name = medicine_name;
      medicineInfo.medicine_image = medicine_image;
      medicineInfo.medicine_mg = medicine_mg;

      const medicineData = await medicineInfo.save();

      if (medicineData) {
        return res.status(201).send({
          success: true,
          message: "Medicine info is edited successfully",
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Something went wrong.Please try again",
        });
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "Please login as an staff or admin",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

//add medicine stock info like price, stock etc
const addMedicineStockInfo = async (req, res) => {
  const { role } = req.role;
  const {medicine_id, _id, price, piece} = req.body;
  
  try {
    if (role === "staff" || role === "admin") {
      const id = new ObjectId(_id)
      const findMedicine = await Medicines.findOne({_id:id});
      const medicineInfo = await Medicines.findOne({ medicine_id });
      if (findMedicine && medicineInfo) {
        if(!price) {
          return res.status.json({
            message: "Medicine Price a required field",
          });
        } else if(!piece) {
          return res.status.json({
            message: "Medicine Piece is a required field",
          });
        }
         const newMedicineStockInfo = new MedicinesStock({
           medicine: _id,
           price,
           piece
         });
         const medicineData = await newMedicineStockInfo.save();
         medicineInfo.availableStock = medicineInfo.availableStock + piece;
         const updateAvaiableStockData = await medicineInfo.save();
         if (medicineData && updateAvaiableStockData) {
           return res.status(201).json({
             "success": true,
             "message": "Medicine stock information is successfully added",
           });
         } else {
           return res.status(200).json({
             "success": false,
             "message": "Something went wrong.Please try again",
           });
         }   
      } else {
        return res.status(200).json({
          "success": true,
          "message": "This medicine is not found in the list"
        })
      }
     
    } else {
      return res.status(200).json({
        success: false,
        message: "You don't have access to add this info",
      });
    }
  } catch(error) {
     res.status(500).json({
       "success": false,
       "message": "Something went wrong.Please try again",
     });
  }
  
}

//get all details information about all the medicines
const medicineFullDetails = async (req, res) => {
  const { role } = req.role;
  try {
     if(role === "staff" || role === "admin" || role === "doctor") {
      const medicineDetails = await Medicines.aggregate([
        {
        $lookup: {
          from: "medicinestocks",
          localField: "_id",
          foreignField: "medicine",
          as: "stockList",
        },
      },
      ])
      if(medicineDetails) {
        return res.status(200).json({
          "success": true,
          "message": "Successfully fetched",
          "medicineDetails": medicineDetails
        })
      } else {
        return res.status(200).json({
          success: false,
          message: "Something went wrong",
        });
      }
     } else {
      return res.status(200).json({
        "success": false,
        "message": "You don't have access"
      })
     }
  } catch(error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again",
    });
  }
}

//return a particular medicine details
const particularMedicineDetails = async (req, res) => {
  const { role } = req.role;
  const { _id } = req.params;
  const id = new ObjectId(_id)
  try {
     if(role === "staff" || role === "admin" || role === "doctor") {
      const medicineDetails = await Medicines.aggregate([
        {
          $match: {
            _id: id,
          },
        },
        {
          $lookup: {
            from: "medicinestocks",
            localField: "_id",
            foreignField: "medicine",
            as: "stockList",
          },
        },
        {
          $project: {
            stockList: {
              _id: 0,
              medicine: 0,
            },
          },
        },
      ]);
      if(medicineDetails) {
        return res.status(200).json({
          "success": true,
          "message": "Successfully fetched",
          "medicineDetails": medicineDetails
        })
      } else {
        return res.status(200).json({
          success: false,
          message: "Something went wrong",
        });
      }
     } else {
      return res.status(200).json({
        "success": false,
        "message": "You don't have access"
      })
     }
  } catch(error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again",
    });
  }
} 

//edit medicine stock info
const editMedicineStockInfo = async (req, res) => {
  const { role } = req.role;
  const { _id } = req.params;
  const {medicine_id, price, piece} = req.body;
  const id = new ObjectId(_id);
    try {
      if (role === "staff" || role === "admin") {
        if (!price) {
          return res.status(200).json({
            message: "Medicine price is a required field",
          });
        }
        if (!piece) {
          return res.status(200).json({
            message: "Medicine piece is a required field",
          });
        }

        const stockInfo = await MedicinesStock.findOne({ _id });
        const medicineInfo = await Medicines.findOne({medicine_id})
        const prevStock = stockInfo.piece;
        stockInfo.price = price;
        stockInfo.piece = piece;
        medicineInfo.availableStock = medicineInfo.availableStock - prevStock + piece; 
        const stockData = await stockInfo.save();
        const medicineData = await medicineInfo.save();

        if (stockData && medicineData) {
          return res.status(201).send({
            success: true,
            message: "Medicine stock info is edited successfully",
          });
        } else {
          return res.status(200).json({
            success: false,
            message: "Something went wrong.Please try again",
          });
        }
      } else {
        return res.status(200).json({
          success: false,
          message: "Please login as an staff or admin",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error });
    }


}
module.exports = {
  addMedicineInfo,
  getAllMedicinesInfo,
  addMedicineStockInfo,
  medicineFullDetails,
  particularMedicineDetails,
  editMedicineInfo,
  editMedicineStockInfo
};
