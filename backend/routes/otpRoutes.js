const express = require("express");
const router = express.Router();
const { requestOTP, confirmOTP } = require("../controllers/otpController");

router.post("/send", requestOTP);
router.post("/verify", confirmOTP);

module.exports = router;
