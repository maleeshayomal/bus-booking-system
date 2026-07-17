const { pool } = require("../config/db");
const BookingModel = require("../models/bookingModel");
const { generateBookingQR } = require("../utils/qrGenerator");

// POST /api/payments  { bookingId, paymentMethod }
// Simulates a payment gateway call. Swap the "processing" block for a real
// gateway (Stripe, PayHere, Genie, eZ Cash) integration in production.
const processPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentMethod } = req.body;
    if (!bookingId) return res.status(400).json({ message: "bookingId is required." });

    const booking = await BookingModel.getById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found." });

    const [seatRows] = await pool.query(
      `SELECT sts.seat_number FROM booking_seats bs
       JOIN seats sts ON bs.seat_id = sts.id
       WHERE bs.booking_id = ?`,
      [bookingId]
    );
    const seatNumbers = seatRows.map((r) => r.seat_number);

    // --- simulated gateway success ---
    const transactionRef = `TXN-${Date.now()}`;

    await pool.query(
      `INSERT INTO payments (booking_id, amount, payment_method, payment_status, transaction_ref, paid_at)
       VALUES (?, ?, ?, 'Paid', ?, NOW())`,
      [bookingId, booking.total_amount, paymentMethod || "Card", transactionRef]
    );

    const qrCodeData = await generateBookingQR({
      reference: booking.booking_reference,
      passengerName: booking.passenger_name,
      travelDate: booking.travel_date,
      seats: seatNumbers,
    });

    await BookingModel.confirmBooking(bookingId, qrCodeData);

    res.json({
      message: "Payment successful.",
      transactionRef,
      bookingReference: booking.booking_reference,
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
    );
    const [[{ pendingAmount }]] = await pool.query(
      `SELECT COALESCE(SUM(total_amount),0) AS pendingAmount FROM bookings WHERE status='Pending'`
    );
    const [[{ pendingCount }]] = await pool.query(
      `SELECT COUNT(*) AS pendingCount FROM bookings WHERE status='Pending'`
    );
    const [[{ refundedAmount }]] = await pool.query(
      "SELECT COALESCE(SUM(amount),0) AS refundedAmount FROM payments WHERE payment_status='Refunded'"
    );

    res.json({ todayRevenue, pendingAmount, pendingCount, refundedAmount });
  } catch (err) {
    next(err);
  }
};

module.exports = { processPayment, getPaymentStats };
