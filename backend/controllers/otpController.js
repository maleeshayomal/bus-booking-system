const { sendOTP, verifyOTP } = require("../utils/sendOTP");
const { sendEmailOTP, verifyEmailOTP } = require("../utils/emailService");
const UserModel = require("../models/userModel");

// POST /api/otp/send  { phone }
const requestOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required." });

    const result = await sendOTP(phone);
    res.json({ message: "OTP sent successfully.", ...result });
  } catch (err) {
    next(err);
  }
};

// POST /api/otp/verify  { phone, code }
const confirmOTP = async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ message: "Phone and code are required." });

    const valid = await verifyOTP(phone, code);
    if (!valid) return res.status(400).json({ message: "Invalid or expired OTP code." });

    await UserModel.markVerified(phone).catch(() => {});
    res.json({ verified: true, message: "OTP verified successfully." });
  } catch (err) {
    next(err);
  }
};

// POST /api/otp/send-email { email, passengerName }
const requestEmailOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email address is required." });

    const result = await sendEmailOTP(email);
    res.json({
      success: true,
      message: `Verification code sent to ${email}`,
      demoCode: result.demoCode,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/otp/verify-email { email, code }
const confirmEmailOTP = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: "Email and verification code are required." });

    const valid = await verifyEmailOTP(email, code);
    if (!valid) return res.status(400).json({ success: false, message: "Invalid or expired verification code." });

    res.json({ success: true, verified: true, message: "Email verified successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = { requestOTP, confirmOTP, requestEmailOTP, confirmEmailOTP };
