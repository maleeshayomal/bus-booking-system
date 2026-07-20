const { pool } = require("../config/db");

const UserModel = {
  async findByPhone(phone) {
    const [rows] = await pool.query("SELECT * FROM users WHERE phone = ?", [phone]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  },

  async createIfNotExists({ fullName, phone, email }) {
    const existing = await this.findByPhone(phone);
    if (existing) return existing;

    const [result] = await pool.query(
      "INSERT INTO users (full_name, phone, email, is_verified) VALUES (?, ?, ?, 1)",
      [fullName, phone, email || null]
    );
    return this.findById(result.insertId);
  },

  async markVerified(phone) {
    await pool.query("UPDATE users SET is_verified = 1 WHERE phone = ?", [phone]);
  },
};

module.exports = UserModel;
