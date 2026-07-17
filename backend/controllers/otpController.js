const { sendOTP, verifyOTP } = require("../utils/sendOTP");
const UserModel = require("../models/userModel");

// POST /api/otp/send  { phone }
const requestOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required." });

    await sendOTP(phone);
    res.json({ message: "OTP sent successfully." });
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
    if (!valid) return res.status(400).json({ message: "Invalid or expired OTP." });

    await UserModel.markVerified(phone).catch(() => {});
    res.json({ verified: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { requestOTP, confirmOTP };
