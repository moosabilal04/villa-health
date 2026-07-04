const Specialist = require("../models/Specialist");

// @route GET /api/specialists
const getAllSpecialists = async (req, res) => {
  try {
    const filter = req.query.approvedOnly === "true" ? { isApproved: true } : {};
    const specialists = await Specialist.find(filter).populate("user", "name email phone isActive");
    res.json({ specialists });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch specialists", error: error.message });
  }
};

// @route GET /api/specialists/:id
const getSpecialistById = async (req, res) => {
  try {
    const specialist = await Specialist.findById(req.params.id).populate("user", "name email phone");
    if (!specialist) return res.status(404).json({ message: "Specialist not found" });
    res.json({ specialist });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch specialist", error: error.message });
  }
};

// @route PUT /api/specialists/:id
const updateSpecialist = async (req, res) => {
  try {
    const { specialty, licenseNumber, yearsOfExperience, bio, consultationFee, availability } = req.body;

    const specialist = await Specialist.findByIdAndUpdate(
      req.params.id,
      { specialty, licenseNumber, yearsOfExperience, bio, consultationFee, availability },
      { new: true, runValidators: true }
    ).populate("user", "name email phone");

    if (!specialist) return res.status(404).json({ message: "Specialist not found" });
    res.json({ specialist });
  } catch (error) {
    res.status(500).json({ message: "Failed to update specialist", error: error.message });
  }
};

// @route PATCH /api/specialists/:id/approve  (admin only)
const approveSpecialist = async (req, res) => {
  try {
    const specialist = await Specialist.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!specialist) return res.status(404).json({ message: "Specialist not found" });
    res.json({ message: "Specialist approved", specialist });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve specialist", error: error.message });
  }
};

module.exports = { getAllSpecialists, getSpecialistById, updateSpecialist, approveSpecialist };
