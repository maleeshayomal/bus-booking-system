const express = require("express");
const router = express.Router();
const {
  getRoutes,
  getRouteDetails,
  createRoute,
  updateRoute,
  deleteRoute,
  addSchedule,
} = require("../controllers/routeController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getRoutes);
router.get("/:id", getRouteDetails);
router.post("/", protect, adminOnly, createRoute);
router.put("/:id", protect, adminOnly, updateRoute);
router.delete("/:id", protect, adminOnly, deleteRoute);
router.post("/:id/schedules", protect, adminOnly, addSchedule);

module.exports = router;
