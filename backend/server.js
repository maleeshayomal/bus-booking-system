const express = require("express");
const cors = require("cors");
require("dotenv").config();

const config = require("./config/config");
const { testConnection } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/busRoutes");
const routeRoutes = require("./routes/routeRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const seatRoutes = require("./routes/seatRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const otpRoutes = require("./routes/otpRoutes");

const app = express();

app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "LankaTransit API", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/otp", otpRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, async () => {
  console.log(`LankaTransit API running on http://localhost:${config.port}`);
  await testConnection();
});
