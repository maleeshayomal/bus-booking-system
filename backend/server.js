const express = require("express");
const cors = require("cors");
require("dotenv").config();

const config = require("./config/config");
const { testConnection } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/busRoutes");