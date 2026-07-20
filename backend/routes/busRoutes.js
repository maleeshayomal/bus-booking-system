const express = require("express");
const router = express.Router();
const { getBuses, getBus, createBus, updateBus, deleteBus } = require("../controllers/busController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getBuses);
router.get("/:id", getBus);
router.post("/", protect, adminOnly, createBus);
router.put("/:id", protect, adminOnly, updateBus);
router.delete("/:id", protect, adminOnly, deleteBus);

module.exports = router;
