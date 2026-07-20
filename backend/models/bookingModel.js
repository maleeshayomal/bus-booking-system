const { pool } = require("../config/db");

const generateReference = () => {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SK-${rand}`;
};

const BookingModel = {
  async searchSchedules({ origin, destination, travelDate }) {
    const [rows] = await pool.query(
      `SELECT s.id AS schedule_id, s.departure_time, s.arrival_time, s.price, s.travel_date,
              b.id AS bus_id, b.bus_name, b.bus_type, b.total_seats, b.image_url, b.operator_name,
              r.id AS route_id, r.origin, r.destination, r.distance_km, r.duration_minutes
       FROM schedules s
       JOIN buses b ON s.bus_id = b.id
       JOIN routes r ON s.route_id = r.id
       WHERE r.origin = ? AND r.destination = ?
         AND (s.travel_date = ? OR s.travel_date IS NULL)
         AND s.status = 'Scheduled'
       ORDER BY s.departure_time ASC`,
      [origin, destination, travelDate]
    );
    return rows;
  },

  async getScheduleDetails(scheduleId) {
    const [rows] = await pool.query(
      `SELECT s.id AS schedule_id, s.departure_time, s.arrival_time, s.price, s.travel_date,
              b.id AS bus_id, b.bus_name, b.bus_type, b.total_seats, b.image_url, b.operator_name,
              r.id AS route_id, r.origin, r.destination, r.distance_km, r.duration_minutes
       FROM schedules s
       JOIN buses b ON s.bus_id = b.id
       JOIN routes r ON s.route_id = r.id
       WHERE s.id = ?`,
      [scheduleId]
    );
    return rows[0] || null;
  },

  async getStops(routeId) {
    const [rows] = await pool.query(
      "SELECT * FROM stops WHERE route_id = ? ORDER BY stop_order ASC",
      [routeId]
    );
    return rows;
  },

  async getSeatMap(busId, scheduleId, travelDate) {
    const [rows] = await pool.query(
      `SELECT seats.id, seats.seat_number, seats.seat_row, seats.seat_column, seats.seat_type,
              COALESCE(ss.status, 'Available') AS status
       FROM seats
       LEFT JOIN schedule_seats ss
         ON ss.seat_id = seats.id AND ss.schedule_id = ? AND ss.travel_date = ?
       WHERE seats.bus_id = ?
       ORDER BY seats.seat_row ASC, seats.seat_column ASC`,
      [scheduleId, travelDate, busId]
    );
    return rows;
  },

  async createBooking({ userId, scheduleId, passengerName, passengerPhone, passengerEmail, travelDate, seatIds, price }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const totalAmount = seatIds.length * price;
      const reference = generateReference();

      const [bookingResult] = await conn.query(
        `INSERT INTO bookings (booking_reference, user_id, schedule_id, passenger_name, passenger_phone, passenger_email, travel_date, total_amount, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
        [reference, userId || null, scheduleId, passengerName, passengerPhone, passengerEmail || null, travelDate, totalAmount]
      );
      const bookingId = bookingResult.insertId;

      for (const seatId of seatIds) {
        await conn.query(
          "INSERT INTO booking_seats (booking_id, seat_id, price) VALUES (?, ?, ?)",
          [bookingId, seatId, price]
        );

        await conn.query(
          `INSERT INTO schedule_seats (schedule_id, seat_id, travel_date, status)
           VALUES (?, ?, ?, 'Booked')
           ON DUPLICATE KEY UPDATE status = 'Booked'`,
          [scheduleId, seatId, travelDate]
        );
      }

      await conn.commit();
      return { bookingId, reference, totalAmount };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async confirmBooking(bookingId, qrCodeData) {
    await pool.query("UPDATE bookings SET status = 'Confirmed', qr_code_data = ? WHERE id = ?", [qrCodeData, bookingId]);
  },

  async getById(bookingId) {
    const [rows] = await pool.query("SELECT * FROM bookings WHERE id = ?", [bookingId]);
    return rows[0] || null;
  },

  async getByReference(reference) {
    const [rows] = await pool.query("SELECT * FROM bookings WHERE booking_reference = ?", [reference]);
    return rows[0] || null;
  },

  async getByPhone(phone) {
    const [rows] = await pool.query(
      `SELECT bk.*, s.departure_time, s.arrival_time, r.origin, r.destination, b.bus_name
       FROM bookings bk
       JOIN schedules s ON bk.schedule_id = s.id
       JOIN routes r ON s.route_id = r.id
       JOIN buses b ON s.bus_id = b.id
       WHERE bk.passenger_phone = ?
       ORDER BY bk.created_at DESC`,
      [phone]
    );
    return rows;
  },

  async getAllForAdmin({ search }) {
    let query = `SELECT bk.*, r.origin, r.destination, b.bus_name
       FROM bookings bk
       JOIN schedules s ON bk.schedule_id = s.id
       JOIN routes r ON s.route_id = r.id
       JOIN buses b ON s.bus_id = b.id`;
    const params = [];
    if (search) {
      query += " WHERE bk.booking_reference LIKE ? OR bk.passenger_name LIKE ? OR bk.passenger_phone LIKE ?";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    query += " ORDER BY bk.created_at DESC LIMIT 100";
    const [rows] = await pool.query(query, params);
    return rows;
  },

  async cancelBooking(bookingId) {
    await pool.query("UPDATE bookings SET status = 'Cancelled' WHERE id = ?", [bookingId]);
    await pool.query(
      `UPDATE schedule_seats ss
       JOIN booking_seats bs ON ss.seat_id = bs.seat_id
       SET ss.status = 'Available'
       WHERE bs.booking_id = ?`,
      [bookingId]
    );
  },
};

module.exports = BookingModel;
