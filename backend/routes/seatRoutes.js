const express = require("express");
const router = express.Router();
const {
  getSeatsByBus,
  getSeatMapForSchedule,
  reserveFemaleSeat,
  releaseSeat,
} = require("../controllers/seatController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/bus/:busId", getSeatsByBus);
router.get("/schedule/:scheduleId", getSeatMapForSchedule);
router.put("/reserve-female", protect, adminOnly, reserveFemaleSeat);
router.put("/release", protect, adminOnly, releaseSeat);

module.exports = router;
