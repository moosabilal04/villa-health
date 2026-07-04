const Patient = require("../models/Patient");
const User = require("../models/User");

// @route GET /api/patients  (admin only)
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate("user", "name email phone isActive");
    res.json({ patients });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patients", error: error.message });
  }
};

// @route GET /api/patients/:id
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate("user", "name email phone isActive");
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json({ patient });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patient", error: error.message });
  }
};

// @route PUT /api/patients/:id
const updatePatient = async (req, res) => {
  try {
    const { dateOfBirth, gender, address, medicalNotes, emergencyContact } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { dateOfBirth, gender, address, medicalNotes, emergencyContact },
      { new: true, runValidators: true }
    ).populate("user", "name email phone");

    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json({ patient });
  } catch (error) {
    res.status(500).json({ message: "Failed to update patient", error: error.message });
  }
};

// @route PATCH /api/patients/:id/deactivate  (admin only)
const deactivatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    await User.findByIdAndUpdate(patient.user, { isActive: false });
    res.json({ message: "Patient account deactivated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to deactivate patient", error: error.message });
  }
};

module.exports = { getAllPatients, getPatientById, updatePatient, deactivatePatient };
