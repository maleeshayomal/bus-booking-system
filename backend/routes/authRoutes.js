const express = require("express");
const router = express.Router();
const { adminLogin, getProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/admin/login", adminLogin);
// router.get("/me", protect, getProfile);
router.get("/me",  getProfile);

module.exports = router;
