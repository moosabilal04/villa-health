const Appointment = require("../models/Appointment");
const Specialist = require("../models/Specialist");
const Patient = require("../models/Patient");

// @route POST /api/appointments
const createAppointment = async (req, res) => {
  try {
    const { specialistId, date, startTime, endTime, reasonForVisit } = req.body;

    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return res.status(404).json({ message: "Patient profile not found" });

    const specialist = await Specialist.findById(specialistId);
    if (!specialist) return res.status(404).json({ message: "Specialist not found" });

    const appointment = await Appointment.create({
      patient: patient._id,
      specialist: specialistId,
      date,
      startTime,
      endTime,
      reasonForVisit,
      payment: { amount: specialist.consultationFee },
    });

    res.status(201).json({ appointment });
  } catch (error) {
    res.status(500).json({ message: "Failed to create appointment", error: error.message });
  }
};

// @route GET /api/appointments  (admin: all, specialist: own, patient: own)
const getAppointments = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "patient") {
      const patient = await Patient.findOne({ user: req.user._id });
      filter.patient = patient?._id;
    } else if (req.user.role === "specialist") {
      const specialist = await Specialist.findOne({ user: req.user._id });
      filter.specialist = specialist?._id;
    }

    const appointments = await Appointment.find(filter)
      .populate({ path: "patient", populate: { path: "user", select: "name email phone" } })
      .populate({ path: "specialist", populate: { path: "user", select: "name email phone" } })
      .sort({ date: -1 });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
  }
};

// @route PATCH /api/appointments/:id/status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ message: "Failed to update appointment", error: error.message });
  }
};

module.exports = { createAppointment, getAppointments, updateAppointmentStatus };
