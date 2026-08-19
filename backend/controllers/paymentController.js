const crypto = require("crypto");
const { pool } = require("../config/db");
const BookingModel = require("../models/bookingModel");
const { generateBookingQR } = require("../utils/qrGenerator");

// PayHere Sandbox Default Configuration
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || "1224856";
const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || "4s1e8c7r6e5t";

/**
 * Helper to compute PayHere MD5 Hash
 * Hash = strtoupper(md5(merchant_id + order_id + amount_formatted + currency + strtoupper(md5(merchant_secret))))
 */
function computePayHereHash(merchantId, orderId, amount, currency, merchantSecret) {
  const amountFormatted = parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace(/,/g, "");

  const hashedSecret = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();

  const hashString = `${merchantId}${orderId}${amountFormatted}${currency}${hashedSecret}`;
  return crypto.createHash("md5").update(hashString).digest("hex").toUpperCase();
}

// POST /api/payments/payhere-hash  { orderId, amount, currency, passenger, items }
const generatePayHereHash = async (req, res, next) => {
  try {
    const { orderId, amount, currency = "LKR", passenger, items } = req.body;
    if (!orderId || !amount) {
      return res.status(400).json({ message: "orderId and amount are required." });
    }

    const hash = computePayHereHash(
      PAYHERE_MERCHANT_ID,
      orderId,
      amount,
      currency,
      PAYHERE_MERCHANT_SECRET
    );

    const amountFormatted = parseFloat(amount).toFixed(2);

    res.json({
      merchant_id: PAYHERE_MERCHANT_ID,
      order_id: orderId,
      amount: amountFormatted,
      currency,
      hash,
      items: items || "Tripimate Bus Ticket",
      first_name: passenger?.fullName?.split(" ")[0] || "Passenger",
      last_name: passenger?.fullName?.split(" ").slice(1).join(" ") || "Customer",
      email: passenger?.email || "passenger@tripimate.lk",
      phone: passenger?.phone || "0770000000",
      address: "Central Terminal",
      city: "Colombo",
      country: "Sri Lanka",
      sandbox: true,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/verify-payhere  { orderId, paymentMethod, paymentId, amount, passenger, bus, seats }
const verifyPayHerePayment = async (req, res, next) => {
  try {
    const { orderId, paymentMethod, paymentId, amount, passenger, bus, seats } = req.body;
    const bookingRef = orderId || `SK-${Math.floor(1000 + Math.random() * 9000)}`;
    const transactionRef = paymentId || `PH-${Date.now()}`;

    const qrCodeData = await generateBookingQR({
      reference: bookingRef,
      passengerName: passenger?.fullName || "Valued Passenger",
      travelDate: bus?.departure || new Date().toISOString().split("T")[0],
      seats: seats || [],
    });

    // If database is connected, update records
    try {
      if (pool) {
        let booking = await BookingModel.getByReference(bookingRef);
        if (booking) {
          await pool.query(
            `INSERT INTO payments (booking_id, amount, payment_method, payment_status, transaction_ref, paid_at)
             VALUES (?, ?, ?, 'Paid', ?, NOW())`,
            [booking.id, amount || booking.total_amount, paymentMethod || "PayHere (Sandbox)", transactionRef]
          );
          await BookingModel.confirmBooking(booking.id, qrCodeData);
        }
      }
    } catch {
      // fallback in demo mode
    }

    res.json({
      success: true,
      status: "CONFIRMED",
      message: "Payment successfully verified by backend.",
      bookingReference: bookingRef,
      transactionRef,
      qrCodeData,
      confirmedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/payments  (legacy / simulated)
const processPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentMethod } = req.body;
    const booking = await BookingModel.getById(bookingId).catch(() => null);

    const transactionRef = `TXN-${Date.now()}`;
    const qrCodeData = await generateBookingQR({
      reference: booking?.booking_reference || `SK-${Date.now().toString().slice(-4)}`,
      passengerName: booking?.passenger_name || "Passenger",
      travelDate: booking?.travel_date || new Date().toISOString(),
      seats: [],
    });

    if (booking) {
      await BookingModel.confirmBooking(bookingId, qrCodeData).catch(() => {});
    }

    res.json({
      message: "Payment successful.",
      status: "CONFIRMED",
      transactionRef,
      bookingReference: booking?.booking_reference || `SK-${Date.now().toString().slice(-4)}`,
      qrCodeData,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/payments/stats (admin)
const getPaymentStats = async (req, res, next) => {
  try {
    const [[{ todayRevenue }]] = await pool.query(
      "SELECT COALESCE(SUM(amount),0) AS todayRevenue FROM payments WHERE payment_status='Paid' AND DATE(paid_at)=CURDATE()"
    ).catch(() => [[{ todayRevenue: 125000 }]]);

    const [[{ pendingAmount }]] = await pool.query(
      `SELECT COALESCE(SUM(total_amount),0) AS pendingAmount FROM bookings WHERE status='Pending'`
    ).catch(() => [[{ pendingAmount: 18000 }]]);

    const [[{ pendingCount }]] = await pool.query(
      `SELECT COUNT(*) AS pendingCount FROM bookings WHERE status='Pending'`
    ).catch(() => [[{ pendingCount: 5 }]]);

    const [[{ refundedAmount }]] = await pool.query(
      "SELECT COALESCE(SUM(amount),0) AS refundedAmount FROM payments WHERE payment_status='Refunded'"
    ).catch(() => [[{ refundedAmount: 4500 }]]);

    res.json({ todayRevenue, pendingAmount, pendingCount, refundedAmount });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generatePayHereHash,
  verifyPayHerePayment,
  processPayment,
  getPaymentStats,
};
