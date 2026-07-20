const { pool } = require("../config/db");

const BusModel = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM buses ORDER BY created_at DESC");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM buses WHERE id = ?", [id]);
    return rows[0] || null;
  },

  async create({ busName, busNumber, busType, totalSeats, imageUrl, operatorName }) {
    const [result] = await pool.query(
      `INSERT INTO buses (bus_name, bus_number, bus_type, total_seats, image_url, operator_name)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [busName, busNumber, busType, totalSeats || 52, imageUrl || null, operatorName || null]
    );

    // Auto-generate the 52-seat layout (2+2 configuration, 13 rows)
    const seatInserts = [];
    let seatCounter = 1;
    for (let row = 1; row <= 13; row++) {
      for (let col = 1; col <= 4; col++) {
        const seatType = col === 1 || col === 4 ? "Window" : "Aisle";
        seatInserts.push([result.insertId, `${seatCounter}`, row, col, seatType]);
        seatCounter++;
      }
    }
    await pool.query(
      "INSERT INTO seats (bus_id, seat_number, seat_row, seat_column, seat_type) VALUES ?",
      [seatInserts]
    );

    return this.getById(result.insertId);
  },

  async update(id, fields) {
    const allowed = ["bus_name", "bus_number", "bus_type", "total_seats", "image_url", "operator_name", "status"];
    const keys = Object.keys(fields).filter((k) => allowed.includes(k));
    if (keys.length === 0) return this.getById(id);

    const setClause = keys.map((k) => `${k} = ?`).join(", ");
    const values = keys.map((k) => fields[k]);
    await pool.query(`UPDATE buses SET ${setClause} WHERE id = ?`, [...values, id]);
    return this.getById(id);
  },

  async remove(id) {
    await pool.query("DELETE FROM buses WHERE id = ?", [id]);
    return true;
  },
};

module.exports = BusModel;
