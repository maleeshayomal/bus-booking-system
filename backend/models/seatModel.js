const { pool } = require("../config/db");

const SeatModel = {
  async getByBus(busId) {
    const [rows] = await pool.query(
      "SELECT * FROM seats WHERE bus_id = ? ORDER BY seat_row ASC, seat_column ASC",
      [busId]
    );
    return rows;
  },

  async setGenderReservation(scheduleId, seatId, travelDate) {
    await pool.query(
      `INSERT INTO schedule_seats (schedule_id, seat_id, travel_date, status)
       VALUES (?, ?, ?, 'Female Reserved')
       ON DUPLICATE KEY UPDATE status = 'Female Reserved'`,
      [scheduleId, seatId, travelDate]
    );
  },

  async releaseSeat(scheduleId, seatId, travelDate) {
    await pool.query(
      `UPDATE schedule_seats SET status = 'Available'
       WHERE schedule_id = ? AND seat_id = ? AND travel_date = ?`,
      [scheduleId, seatId, travelDate]
    );
  },
};

module.exports = SeatModel;
