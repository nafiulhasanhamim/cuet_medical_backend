const {
  detectUserRole,
} = require("../../controllers/authcontrollers/auth.controllers");
const {
  addMedicineInfo,
  getAllMedicinesInfo,
  addMedicineStockInfo,
  medicineFullDetails,
  particularMedicineDetails,
  editMedicineInfo,
  editMedicineStockInfo,
  getParticularMedicineInfo,
} = require("../../controllers/staffcontrollers.js/medicine.controllers");
const {
  addTest,
  getAllTestInfo,
  particularTestDetails,
  editTest,
} = require("../../controllers/staffcontrollers.js/test.controllers");

const staffrouter = require("express").Router();
require("dotenv").config();

staffrouter.post("/add-medicine-info", 
// detectUserRole,
 addMedicineInfo);
staffrouter.get("/get-all-medicines-info", getAllMedicinesInfo);
staffrouter.get("/get-particular-medicine-info/:medicine_id", getParticularMedicineInfo);
staffrouter.put("/edit-medicine-info/:medicine_id", 
// detectUserRole,
 editMedicineInfo);
staffrouter.post(
  "/add-medicine-stock-info",
  // detectUserRole,
  addMedicineStockInfo
);
staffrouter.put(
  "/edit-medicine-stock-info/:_id",
  // detectUserRole,
  editMedicineStockInfo
);
staffrouter.get(
  "/get-full-medicine-details",
  // detectUserRole,
  medicineFullDetails
);
staffrouter.get(
  "/particular-medicine-details/:_id",
  // detectUserRole,
  particularMedicineDetails
);
staffrouter.post("/add-test", 
// detectUserRole, 
addTest);
staffrouter.get("/get-all-test-info", getAllTestInfo);
staffrouter.get("/particular-test-details/:test_id", particularTestDetails);
staffrouter.put("/edit-test/:test_id", 
// detectUserRole, 
editTest);
module.exports = staffrouter;
