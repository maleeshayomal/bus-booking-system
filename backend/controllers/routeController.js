const { pool } = require("../config/db");

// GET /api/routes
const getRoutes = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM routes ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/routes/:id  (includes stops + schedules)
const getRouteDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[route]] = await pool.query("SELECT * FROM routes WHERE id = ?", [id]);
    if (!route) return res.status(404).json({ message: "Route not found." });

    const [stops] = await pool.query("SELECT * FROM stops WHERE route_id = ? ORDER BY stop_order ASC", [id]);
    const [schedules] = await pool.query(
      `SELECT s.*, b.bus_name FROM schedules s JOIN buses b ON s.bus_id = b.id WHERE s.route_id = ?`,
      [id]
    );

    res.json({ route, stops, schedules });
  } catch (err) {
    next(err);
  }
};

// POST /api/routes  (admin)
const createRoute = async (req, res, next) => {
  try {
    const { origin, destination, routeType, distanceKm, durationMinutes, frequency, stops } = req.body;
    if (!origin || !destination) {
      return res.status(400).json({ message: "origin and destination are required." });
    }

    const [result] = await pool.query(
      `INSERT INTO routes (origin, destination, route_type, distance_km, duration_minutes, frequency)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [origin, destination, routeType || "Normal", distanceKm || null, durationMinutes || null, frequency || "Daily"]
    );

    if (Array.isArray(stops) && stops.length > 0) {
      const stopValues = stops.map((s, idx) => [
        result.insertId,
        s.stopName,
        idx + 1,
        s.arrivalTime || null,
        s.departureTime || null,
        s.isTerminal ? 1 : 0,
      ]);
      await pool.query(
        "INSERT INTO stops (route_id, stop_name, stop_order, arrival_time, departure_time, is_terminal) VALUES ?",
        [stopValues]
      );
    }

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
};

// PUT /api/routes/:id  (admin)
const updateRoute = async (req, res, next) => {
  try {
    const { origin, destination, routeType, distanceKm, durationMinutes, frequency } = req.body;
    await pool.query(
      `UPDATE routes SET origin=?, destination=?, route_type=?, distance_km=?, duration_minutes=?, frequency=? WHERE id=?`,
      [origin, destination, routeType, distanceKm, durationMinutes, frequency, req.params.id]
    );
    res.json({ message: "Route updated." });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/routes/:id  (admin)
const deleteRoute = async (req, res, next) => {
  try {
    await pool.query("DELETE FROM routes WHERE id = ?", [req.params.id]);
    res.json({ message: "Route deleted." });
  } catch (err) {
    next(err);
  }
};

// POST /api/routes/:id/schedules  (admin) - assign a bus/time to this route
const addSchedule = async (req, res, next) => {
  try {
    const { busId, departureTime, arrivalTime, travelDate, price } = req.body;
    const [result] = await pool.query(
      `INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, travel_date, price)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [busId, req.params.id, departureTime, arrivalTime, travelDate || null, price]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRoutes, getRouteDetails, createRoute, updateRoute, deleteRoute, addSchedule };
