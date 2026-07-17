const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const generateToken = require("../utils/generateToken");

// POST /api/auth/admin/login
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const [rows] = await pool.query("SELECT * FROM admins WHERE email = ?", [email]);
    const admin = rows[0];
    if (!admin) return res.status(401).json({ message: "Invalid credentials." });

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid credentials." });

    const token = generateToken({ id: admin.id, email: admin.email, role: "admin" });
    res.json({
      token,
      admin: { id: admin.id, fullName: admin.full_name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { adminLogin, getProfile };
