const express = require("express");
const router = express.Router();
const {
  searchBuses,
  getScheduleDetails,
  createBooking,
  getBookingHistory,
  getBookingByReference,
  getAllBookingsAdmin,
  cancelBooking,
  getDashboardStats,
} = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/search", searchBuses);
router.get("/schedule/:scheduleId", getScheduleDetails);
router.post("/", createBooking);
router.get("/history/:phone", getBookingHistory);
router.get("/stats/dashboard", protect, adminOnly, getDashboardStats);
router.get("/admin/all", protect, adminOnly, getAllBookingsAdmin);
router.put("/:id/cancel", protect, adminOnly, cancelBooking);
router.get("/:reference", getBookingByReference);

module.exports = router;
