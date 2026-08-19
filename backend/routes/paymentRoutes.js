const express = require("express");
const router = express.Router();
const {
  generatePayHereHash,
  verifyPayHerePayment,
  processPayment,
  getPaymentStats,
} = require("../controllers/paymentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/payhere-hash", generatePayHereHash);
router.post("/verify-payhere", verifyPayHerePayment);
router.post("/payhere-notify", verifyPayHerePayment);
router.post("/", processPayment);
router.get("/stats", protect, adminOnly, getPaymentStats);

module.exports = router;
