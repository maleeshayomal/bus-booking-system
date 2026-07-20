const express = require("express");
const router = express.Router();
const { processPayment, getPaymentStats } = require("../controllers/paymentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", processPayment);
router.get("/stats", protect, adminOnly, getPaymentStats);

module.exports = router;
