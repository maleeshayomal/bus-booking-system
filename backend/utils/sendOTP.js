const { pool } = require("../config/db");
const config = require("../config/config");

const generateOTPCode = () => String(Math.floor(100000 + Math.random() * 900000));

/**
 * Sends an OTP to the given phone number.
 * In development this only stores the OTP and logs it to the console.
 * In production, plug in a real SMS gateway (e.g. Twilio, Notify.lk, Dialog) here.
 */
const sendOTP = async (phone) => {
  const code = generateOTPCode();
  const expiresAt = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000);

  await pool.query(
    "INSERT INTO otp_verifications (phone, otp_code, expires_at) VALUES (?, ?, ?)",
    [phone, code, expiresAt]
  );

  if (process.env.NODE_ENV !== "production") {
    console.log(`[OTP] Code for ${phone}: ${code} (expires ${expiresAt.toISOString()})`);
  } else if (process.env.SMS_PROVIDER_API_KEY) {
    // TODO: integrate real SMS gateway here, e.g.:
    // await smsClient.send({ to: phone, message: `Your LankaTransit OTP is ${code}` });
  }

  return { sent: true };
};

const verifyOTP = async (phone, code) => {
  const [rows] = await pool.query(
    `SELECT * FROM otp_verifications
     WHERE phone = ? AND otp_code = ? AND is_used = 0 AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [phone, code]
  );
  if (rows.length === 0) return false;

  await pool.query("UPDATE otp_verifications SET is_used = 1 WHERE id = ?", [rows[0].id]);
  return true;
};

module.exports = { sendOTP, verifyOTP };
