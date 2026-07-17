const BookingModel = require("../models/bookingModel");
const UserModel = require("../models/userModel");
const { pool } = require("../config/db");

// GET /api/bookings/search?origin=&destination=&date=
const searchBuses = async (req, res, next) => {
  try {
    const { origin, destination, date } = req.query;
    if (!origin || !destination || !date) {
      return res.status(400).json({ message: "origin, destination and date are required." });
    }
    const results = await BookingModel.searchSchedules({ origin, destination, travelDate: date });
    res.json(results);
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/schedule/:scheduleId?date=
const getScheduleDetails = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const { date } = req.query;
    const schedule = await BookingModel.getScheduleDetails(scheduleId);
    if (!schedule) return res.status(404).json({ message: "Schedule not found." });

    const stops = await BookingModel.getStops(schedule.route_id);
    const seatMap = await BookingModel.getSeatMap(schedule.bus_id, scheduleId, date || schedule.travel_date);

    res.json({ schedule, stops, seatMap });
  } catch (err) {
    next(err);
  }
};

// POST /api/bookings  { scheduleId, passengerName, passengerPhone, passengerEmail, travelDate, seatIds }
const createBooking = async (req, res, next) => {
  try {
    const { scheduleId, passengerName, passengerPhone, passengerEmail, travelDate, seatIds } = req.body;

    if (!scheduleId || !passengerName || !passengerPhone || !travelDate || !seatIds?.length) {
      return res.status(400).json({ message: "Missing required booking fields." });
    }

    const schedule = await BookingModel.getScheduleDetails(scheduleId);
    if (!schedule) return res.status(404).json({ message: "Schedule not found." });

    // Auto-create (or find) the customer account after verification
    const user = await UserModel.createIfNotExists({ fullName: passengerName, phone: passengerPhone, email: passengerEmail });

    const result = await BookingModel.createBooking({
      userId: user.id,
      scheduleId,
      passengerName,
      passengerPhone,
      passengerEmail,
      travelDate,
      seatIds,
      price: schedule.price,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/history/:phone
const getBookingHistory = async (req, res, next) => {
  try {
    const bookings = await BookingModel.getByPhone(req.params.phone);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/:reference
const getBookingByReference = async (req, res, next) => {
  try {
    const booking = await BookingModel.getByReference(req.params.reference);
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings (admin) ?search=
const getAllBookingsAdmin = async (req, res, next) => {
  try {
    const bookings = await BookingModel.getAllForAdmin({ search: req.query.search });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// PUT /api/bookings/:id/cancel (admin)
const cancelBooking = async (req, res, next) => {
  try {
    await BookingModel.cancelBooking(req.params.id);
    res.json({ message: "Booking cancelled." });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/stats/dashboard (admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [[{ totalBuses }]] = await pool.query("SELECT COUNT(*) AS totalBuses FROM buses");
    const [[{ totalBookings }]] = await pool.query("SELECT COUNT(*) AS totalBookings FROM bookings");
    const [[{ totalRoutes }]] = await pool.query("SELECT COUNT(*) AS totalRoutes FROM routes");
    const [[{ revenue }]] = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) AS revenue FROM payments WHERE payment_status = 'Paid'"
    );
    const [dailyBookings] = await pool.query(
      `SELECT DATE(created_at) AS day, COUNT(*) AS count
       FROM bookings
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at) ORDER BY day ASC`
    );
    const [recentBookings] = await pool.query(
      `SELECT bk.booking_reference, bk.passenger_name, bk.status, r.origin, r.destination
       FROM bookings bk
       JOIN schedules s ON bk.schedule_id = s.id
       JOIN routes r ON s.route_id = r.id
       ORDER BY bk.created_at DESC LIMIT 5`
    );

    res.json({ totalBuses, totalBookings, totalRoutes, revenue, dailyBookings, recentBookings });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  searchBuses,
  getScheduleDetails,
  createBooking,
  getBookingHistory,
  getBookingByReference,
  getAllBookingsAdmin,
  cancelBooking,
  getDashboardStats,
};
