const express = require("express");
const {
  getAllSpecialists,
  getSpecialistById,
  updateSpecialist,
  approveSpecialist,
} = require("../controllers/specialistController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getAllSpecialists);
router.get("/:id", protect, getSpecialistById);
router.put("/:id", protect, updateSpecialist);
router.patch("/:id/approve", protect, authorize("admin"), approveSpecialist);

module.exports = router;
