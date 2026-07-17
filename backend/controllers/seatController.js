const SeatModel = require("../models/seatModel");
const BookingModel = require("../models/bookingModel");

// GET /api/seats/bus/:busId
const getSeatsByBus = async (req, res, next) => {
  try {
    const seats = await SeatModel.getByBus(req.params.busId);
    res.json(seats);
  } catch (err) {
    next(err);
  }
};

// GET /api/seats/schedule/:scheduleId?date=&busId=
const getSeatMapForSchedule = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const { date, busId } = req.query;
    if (!date || !busId) return res.status(400).json({ message: "date and busId are required." });

    const seatMap = await BookingModel.getSeatMap(busId, scheduleId, date);
    res.json(seatMap);
  } catch (err) {
    next(err);
  }
};

// PUT /api/seats/reserve-female  { scheduleId, seatId, travelDate } (admin)
const reserveFemaleSeat = async (req, res, next) => {
  try {
    const { scheduleId, seatId, travelDate } = req.body;
    await SeatModel.setGenderReservation(scheduleId, seatId, travelDate);
    res.json({ message: "Seat reserved for female passengers." });
  } catch (err) {
    next(err);
  }
};

// PUT /api/seats/release  { scheduleId, seatId, travelDate } (admin)
const releaseSeat = async (req, res, next) => {
  try {
    const { scheduleId, seatId, travelDate } = req.body;
    await SeatModel.releaseSeat(scheduleId, seatId, travelDate);
    res.json({ message: "Seat released." });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSeatsByBus, getSeatMapForSchedule, reserveFemaleSeat, releaseSeat };
