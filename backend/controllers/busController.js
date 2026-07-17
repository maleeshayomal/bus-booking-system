const BusModel = require("../models/busModel");

// GET /api/buses
const getBuses = async (req, res, next) => {
  try {
    const buses = await BusModel.getAll();
    res.json(buses);
  } catch (err) {
    next(err);
  }
};

// GET /api/buses/:id
const getBus = async (req, res, next) => {
  try {
    const bus = await BusModel.getById(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found." });
    res.json(bus);
  } catch (err) {
    next(err);
  }
};

// POST /api/buses  (admin)
const createBus = async (req, res, next) => {
  try {
    const { busName, busNumber, busType, totalSeats, imageUrl, operatorName } = req.body;
    if (!busName || !busNumber) {
      return res.status(400).json({ message: "busName and busNumber are required." });
    }
    const bus = await BusModel.create({ busName, busNumber, busType, totalSeats, imageUrl, operatorName });
    res.status(201).json(bus);
  } catch (err) {
    next(err);
  }
};

// PUT /api/buses/:id  (admin)
const updateBus = async (req, res, next) => {
  try {
    const bus = await BusModel.update(req.params.id, req.body);
    res.json(bus);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/buses/:id  (admin)
const deleteBus = async (req, res, next) => {
  try {
    await BusModel.remove(req.params.id);
    res.json({ message: "Bus deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBuses, getBus, createBus, updateBus, deleteBus };
