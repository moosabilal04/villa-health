const Stripe = require("stripe");
const Appointment = require("../models/Appointment");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @route POST /api/payments/create-intent
// Creates a Stripe PaymentIntent for a given appointment
const createPaymentIntent = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (appointment.payment.status === "paid") {
      return res.status(400).json({ message: "This appointment has already been paid for" });
    }

    const amountInCents = Math.round(appointment.payment.amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "eur",
      metadata: { appointmentId: appointment._id.toString() },
    });

    appointment.payment.stripePaymentIntentId = paymentIntent.id;
    await appointment.save();

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: "Failed to create payment intent", error: error.message });
  }
};

// @route POST /api/payments/confirm
// Marks an appointment as paid once the client confirms the Stripe payment succeeded
const confirmPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const intent = await stripe.paymentIntents.retrieve(appointment.payment.stripePaymentIntentId);

    if (intent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment has not succeeded yet" });
    }

    appointment.payment.status = "paid";
    appointment.status = "confirmed";
    await appointment.save();

    res.json({ message: "Payment confirmed", appointment });
  } catch (error) {
    res.status(500).json({ message: "Failed to confirm payment", error: error.message });
  }
};

module.exports = { createPaymentIntent, confirmPayment };
