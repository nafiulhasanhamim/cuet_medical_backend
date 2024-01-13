const { v4: uuidv4 } = require("uuid");
const Activedoctor = require("../../models/activedoctors.model");
const Appointments = require("../../models/appointments.model");
const Medicine = require("../../models/medicines.model");
const { ObjectId } = require("mongodb");
const saltRounds = 10;

//add a staff into
const takeAppointment = async (req, res) => {
  // const { user_id, role, _id } = req.role;
  let { doctor, patient, problem_description } = req.body;
  const id = new ObjectId(doctor);
  //   patient = new ObjectId(patient);
  // if (role === "patient") {
  const checkActiveDoctor = await Activedoctor.findOne({ doctor: id });
  console.log(checkActiveDoctor);
  if (!checkActiveDoctor) {
    return res.status(200).send({
      success: false,
      message: "This doctor is not currently active",
    });
  } else {
    if (!patient) {
      return res.status(200).json({
        message: "Patient is a required field",
      });
    } else if (!doctor) {
      return res.status(200).json({
        message: "Doctor is a required field",
      });
    } else if (!problem_description) {
      return res.status(200).json({
        message: "Problem Description is a required field",
      });
    }
    const newAppointment = new Appointments({
      doctor,
      patient,
      problem_description,
      appointment_status: "pending",
      medicine_supply_status: "pending",
      prescription: [],
    });
    const appointmentData = await newAppointment.save();
    if (appointmentData) {
      return res.status(200).send({
        success: true,
        message: "Appointment is taking successfully",
      });
    }
    return res.status(200).send({
      success: false,
      message: "Something went wrong",
    });
  }

  // } else {
  //   return res.status(200).json({
  //     success: false,
  //     message: "Please login as an admin",
  //   });
  // }
};

//get all apointments
const getAllAppointments = async (req, res) => {
  //   let { doctor } = req.params;
  //   doctor = new ObjectId(doctor);
  try {
    // if (role === "staff" || role === "admin" || role === "doctor") {
    const appointments = await Appointments.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "patient",
          foreignField: "_id",
          as: "patientDetails",
        },
      },
      {
        $project: {
          patientDetails: {
            _id: 0,
            user_id: 0,
            password: 0,
            role: 0,
          },
        },
      },
    ]);
    if (appointments) {
      return res.status(200).json({
        success: true,
        message: "Successfully fetched",
        appointments,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Something went wrong",
      });
    }
    // } else {
    //   return res.status(200).json({
    //     success: false,
    //     message: "You don't have access",
    //   });
    // }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again",
    });
  }
};

//get all apointments for a particular doctor
const getAllAppointmentsForParticularDoctor = async (req, res) => {
  let { doctor } = req.params;
  doctor = new ObjectId(doctor);
  try {
    // if (role === "staff" || role === "admin" || role === "doctor") {
    const appointments = await Appointments.aggregate([
      {
        $match: {
          doctor,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "patient",
          foreignField: "_id",
          as: "patientDetails",
        },
      },
      {
        $project: {
          patientDetails: {
            _id: 0,
            user_id: 0,
            password: 0,
            role: 0,
          },
        },
      },
    ]);
    if (appointments) {
      return res.status(200).json({
        success: true,
        message: "Successfully fetched",
        appointments,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Something went wrong",
      });
    }
    // } else {
    //   return res.status(200).json({
    //     success: false,
    //     message: "You don't have access",
    //   });
    // }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again",
    });
  }
};


//get all apointments for a particular user
const getAllAppointmentsForParticularUser = async (req, res) => {
  let { patient } = req.params;
  patient = new ObjectId(patient);
  try {
    // if (role === "staff" || role === "admin" || role === "doctor") {
    const appointments = await Appointments.aggregate([
      {
        $match: {
          patient
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "patient",
          foreignField: "_id",
          as: "patientDetails",
        },
      },
      {
        $project: {
          patientDetails: {
            _id: 0,
            user_id: 0,
            password: 0,
            role: 0,
          },
        },
      },
    ]);
    if (appointments) {
      return res.status(200).json({
        success: true,
        message: "Successfully fetched",
        appointments,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Something went wrong",
      });
    }
    // } else {
    //   return res.status(200).json({
    //     success: false,
    //     message: "You don't have access",
    //   });
    // }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again",
    });
  }
};


//get all apointments for a particular doctor
const getAllPendingAppointmentsForParticularDoctor = async (req, res) => {
  let { doctor } = req.params;
  doctor = new ObjectId(doctor);
  try {
    // if (role === "staff" || role === "admin" || role === "doctor") {
    const appointments = await Appointments.aggregate([
      {
        $match: { $and: [{ appointment_status: "pending" }, { doctor }] },
      },
      {
        $lookup: {
          from: "users",
          localField: "patient",
          foreignField: "_id",
          as: "patientDetails",
        },
      },
      {
        $project: {
          patientDetails: {
            _id: 0,
            user_id: 0,
            password: 0,
            role: 0,
          },
        },
      },
    ]);
    if (appointments) {
      return res.status(200).json({
        success: true,
        message: "Successfully fetched",
        appointments,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Something went wrong",
      });
    }
    // } else {
    //   return res.status(200).json({
    //     success: false,
    //     message: "You don't have access",
    //   });
    // }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.Please try again",
    });
  }
};

//change appointment status
const changeAppointmentStatus = async (req, res) => {
  let { _id } = req.params;
  _id = new ObjectId(_id);

  // const { role, user_id } = req.role;
  try {
    //  if (role === "admin") {

    const appointmentInfo = await Appointments.findOne({ _id });
    appointmentInfo.appointment_status = "done";

    const appointmentData = await appointmentInfo.save();

    if (appointmentData) {
      return res.status(200).send({
        success: true,
        message: "Appointment Status is changed successfully",
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

//change appointment status
const changeMedicineSupplyStatus = async (req, res) => {
  let { _id } = req.params;
  _id = new ObjectId(_id);

  // const { role, user_id } = req.role;
  try {
    //  if (role === "admin") {

    const appointmentInfo = await Appointments.findOne({ _id });
    appointmentInfo.medicine_supply_status = "done";

    const appointmentData = await appointmentInfo.save();

    if (appointmentData) {
      return res.status(200).send({
        success: true,
        message: "Medicine supply Status is changed successfully",
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

//add medicine to appointment
const addMedicineToAppointment = async (req, res) => {
  let { _id } = req.params;
  _id = new ObjectId(_id);
  let { medicine, piece, note } = req.body;
  medicine= new ObjectId(medicine)
  // const { role, user_id } = req.role;
  try {
    //  if (role === "doctor") {

    const appointment = await Appointments.findOne({ _id });
    const findMedicine = await Medicine.findOne({ _id: medicine });
    findMedicine.availableStock = findMedicine.availableStock - piece;
    appointment.prescription.push({ medicine, piece, note });

    const appointmentData = await appointment.save();
    const medicineData = await findMedicine.save();

    if (appointmentData && medicineData) {
      return res.status(200).send({
        success: true,
        message: "Medicine is saved successfully",
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

//prescribed medicine full details
const prescribedMedicineDetails = async (req, res) => {
  let { _id } = req.params;
  _id = new ObjectId(_id);
  // const { role, user_id } = req.role;
  try {
    //  if (role === "doctor") {

    // const appointment = await Appointments.findOne({ _id });
    const data = await Appointments.aggregate([
      { $match: { _id } },
      {
        $lookup: {
          from: "users", // Replace "users" with the actual collection name for users
          localField: "doctor",
          foreignField: "_id",
          as: "doctorDetails",
        },
      },
      {
        $unwind: "$doctorDetails",
      },
      {
        $lookup: {
          from: "users", // Replace "users" with the actual collection name for users
          localField: "patient",
          foreignField: "_id",
          as: "patientDetails",
        },
      },
      {
        $unwind: "$patientDetails",
      },
      {
        $unwind: "$prescription",
      },
      {
        $lookup: {
          from: "medicines", // Replace "medicines" with the actual collection name for medicines
          localField: "prescription.medicine",
          foreignField: "_id",
          as: "medicineDetails",
        },
      },
      {
        $unwind: "$medicineDetails",
      },
      {
        $group: {
          _id: "$_id",
          doctor: { $first: "$doctorDetails" },
          patient: { $first: "$patientDetails" },
          problem_description: { $first: "$problem_description" },
          appointment_status: { $first: "$appointment_status" },
          medicine_supply_status: { $first: "$medicine_supply_status" },
          createdAt: { $first: "$createdAt" },
          prescription: {
            $push: {
              medicine: "$prescription.medicine",
              note: "$prescription.note",
              piece: "$prescription.piece",
              medicineDetails: "$medicineDetails",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          doctor: 1,
          patient: 1,
          problem_description: 1,
          appointment_status: 1,
          medicine_supply_status: 1,
          createdAt: 1,
          prescription: 1,
        },
      },
    ]);


    if (data) {
      return res.status(200).send({
        success: true,
        message: "Data is fetched successfully",
        prescriptionData: data
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
  takeAppointment,
  getAllAppointments,
  getAllAppointmentsForParticularDoctor,
  getAllAppointmentsForParticularUser,
  getAllPendingAppointmentsForParticularDoctor,
  changeAppointmentStatus,
  changeMedicineSupplyStatus,
  addMedicineToAppointment,
  prescribedMedicineDetails
};
