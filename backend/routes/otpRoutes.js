const express = require("express");
const router = express.Router();
const {
  requestOTP,
  confirmOTP,
  requestEmailOTP,
  confirmEmailOTP,
} = require("../controllers/otpController");

router.post("/send", requestOTP);
router.post("/verify", confirmOTP);
router.post("/send-email", requestEmailOTP);
router.post("/verify-email", confirmEmailOTP);

module.exports = router;
