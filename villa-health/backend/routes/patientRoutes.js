const express = require("express");
const {
  getAllPatients,
  getPatientById,
  updatePatient,
  deactivatePatient,
} = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, authorize("admin"), getAllPatients);
router.get("/:id", protect, getPatientById);
router.put("/:id", protect, updatePatient);
router.patch("/:id/deactivate", protect, authorize("admin"), deactivatePatient);

module.exports = router;
