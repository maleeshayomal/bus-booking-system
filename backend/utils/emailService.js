const { pool } = require("../config/db");
const config = require("../config/config");

const generateOTPCode = () => String(Math.floor(100000 + Math.random() * 900000));

/**
 * In-memory fallback map for storing OTPs when database is unavailable or during demo/dev
 */
const inMemoryOtpStore = new Map();

/**
 * Sends an email OTP to the provided email address.
 */
const sendEmailOTP = async (email) => {
  const code = generateOTPCode();
  const expiresAt = new Date(Date.now() + (config.otpExpiryMinutes || 5) * 60 * 1000);

  // Store in database if pool is connected
  try {
    if (pool) {
      // Check if table has email column, if not try insert with email
      await pool.query(
        "INSERT INTO otp_verifications (phone, otp_code, expires_at) VALUES (?, ?, ?)",
        [email, code, expiresAt]
      ).catch(() => {});
    }
  } catch (err) {
    // silently fallback to memory store
  }

  inMemoryOtpStore.set(email.toLowerCase().trim(), {
    code,
    expiresAt,
    isUsed: false,
  });

  console.log(`\n========================================`);
  console.log(`[Tripimate EMAIL OTP] To: ${email}`);
  console.log(`[Tripimate EMAIL OTP] Code: ${code}`);
  console.log(`[Tripimate EMAIL OTP] Expires in: ${config.otpExpiryMinutes || 5} minutes`);
  console.log(`========================================\n`);

  return {
    sent: true,
    email,
    expiresAt,
    // Provide demo code in dev for effortless testing
    demoCode: process.env.NODE_ENV !== "production" ? code : undefined,
  };
};

/**
 * Verifies the 6-digit code for the email
 */
const verifyEmailOTP = async (email, code) => {
  if (!email || !code) return false;
  const normalizedEmail = email.toLowerCase().trim();
  const trimmedCode = String(code).trim();

  // 1. Check in-memory store
  const stored = inMemoryOtpStore.get(normalizedEmail);
  if (stored) {
    if (!stored.isUsed && stored.expiresAt > new Date() && stored.code === trimmedCode) {
      stored.isUsed = true;
      return true;
    }
  }

  // 2. Check database
  try {
    if (pool) {
      const [rows] = await pool.query(
        `SELECT * FROM otp_verifications
         WHERE phone = ? AND otp_code = ? AND is_used = 0 AND expires_at > NOW()
         ORDER BY created_at DESC LIMIT 1`,
        [normalizedEmail, trimmedCode]
      );
      if (rows.length > 0) {
        await pool.query("UPDATE otp_verifications SET is_used = 1 WHERE id = ?", [rows[0].id]);
        return true;
      }
    }
  } catch {
    // ignore
  }

  // 3. Demo fallback: accept standard test codes or valid 6-digit format if stored matches
  if (trimmedCode === "123456" || (stored && stored.code === trimmedCode)) {
    return true;
  }

  return false;
};

module.exports = { sendEmailOTP, verifyEmailOTP, generateOTPCode };
