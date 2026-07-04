const express = require("express");
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, authorize("patient"), createAppointment);
router.get("/", protect, getAppointments);
router.patch("/:id/status", protect, authorize("admin", "specialist"), updateAppointmentStatus);

module.exports = router;
