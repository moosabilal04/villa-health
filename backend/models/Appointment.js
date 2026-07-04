const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    specialist: { type: mongoose.Schema.Types.ObjectId, ref: "Specialist", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    reasonForVisit: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    payment: {
      amount: { type: Number, default: 0 },
      status: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
      stripePaymentIntentId: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
