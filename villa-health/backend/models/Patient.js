const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    address: { type: String, trim: true },
    medicalNotes: { type: String, trim: true },
    emergencyContact: {
      name: String,
      phone: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
