const express = require("express");
const { createPaymentIntent, confirmPayment } = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/create-intent", protect, authorize("patient"), createPaymentIntent);
router.post("/confirm", protect, authorize("patient"), confirmPayment);

module.exports = router;
