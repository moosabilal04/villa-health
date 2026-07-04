const mongoose = require("mongoose");

const specialistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    specialty: { type: String, required: true, trim: true },
    licenseNumber: { type: String, required: true, trim: true },
    yearsOfExperience: { type: Number, default: 0 },
    bio: { type: String, trim: true },
    consultationFee: { type: Number, required: true, default: 0 },
    availability: [
      {
        day: {
          type: String,
          enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        startTime: String,
        endTime: String,
      },
    ],
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Specialist", specialistSchema);
