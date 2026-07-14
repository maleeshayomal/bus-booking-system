-- ============================================================
-- LankaTransit - Sri Lanka Online Bus Booking System
-- MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS lankatransit CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lankatransit;

-- ------------------------------------------------------------
-- Users (customers, auto-created after OTP verification + booking)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(150) DEFAULT NULL,
  password_hash VARCHAR(255) DEFAULT NULL,
  is_verified TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Admins
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Buses (fleet)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS buses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bus_name VARCHAR(120) NOT NULL,
  bus_number VARCHAR(30) NOT NULL UNIQUE,
  bus_type ENUM('Normal', 'Semi-Luxury', 'AC Luxury', 'Super Luxury', 'Express') DEFAULT 'AC Luxury',
  total_seats INT DEFAULT 52,
  image_url VARCHAR(255) DEFAULT NULL,
  operator_name VARCHAR(150) DEFAULT NULL,
  status ENUM('Active', 'Maintenance', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Routes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  route_type ENUM('Normal', 'Expressway', 'Coastal') DEFAULT 'Normal',
  distance_km DECIMAL(6,2) DEFAULT NULL,
  duration_minutes INT DEFAULT NULL,
  frequency VARCHAR(50) DEFAULT 'Daily',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Stops (transit points along a route, ordered)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_id INT NOT NULL,
  stop_name VARCHAR(120) NOT NULL,
  stop_order INT NOT NULL,
  arrival_time TIME DEFAULT NULL,
  departure_time TIME DEFAULT NULL,
  is_terminal TINYINT(1) DEFAULT 0,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Schedules (a bus running a route on a recurring/specific basis)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bus_id INT NOT NULL,
  route_id INT NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  travel_date DATE DEFAULT NULL,
  price DECIMAL(10,2) NOT NULL,
  status ENUM('Scheduled', 'Departed', 'Cancelled', 'Completed') DEFAULT 'Scheduled',
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Seats (the 52-seat physical layout belonging to a bus)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bus_id INT NOT NULL,
  seat_number VARCHAR(10) NOT NULL,
  seat_row INT NOT NULL,
  seat_column INT NOT NULL,
  seat_type ENUM('Window', 'Aisle') DEFAULT 'Window',
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_seat_per_bus (bus_id, seat_number)
);

-- ------------------------------------------------------------
-- Schedule Seat Status (per-trip seat availability; resets per travel date)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schedule_seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  schedule_id INT NOT NULL,
  seat_id INT NOT NULL,
  travel_date DATE NOT NULL,
  status ENUM('Available', 'Selected', 'Booked', 'Female Reserved') DEFAULT 'Available',
  FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE,
  FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE,
  UNIQUE KEY unique_schedule_seat_date (schedule_id, seat_id, travel_date)
);

-- ------------------------------------------------------------
-- Bookings
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_reference VARCHAR(20) NOT NULL UNIQUE,
  user_id INT DEFAULT NULL,
  schedule_id INT NOT NULL,
  passenger_name VARCHAR(120) NOT NULL,
  passenger_phone VARCHAR(20) NOT NULL,
  passenger_email VARCHAR(150) DEFAULT NULL,
  travel_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
  qr_code_data TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Booking Seats (many-to-many: which seats belong to a booking)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS booking_seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  seat_id INT NOT NULL,
  gender_preference ENUM('Male', 'Female', 'Any') DEFAULT 'Any',
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Payments
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('Card', 'Mobile Wallet', 'Bank Transfer') DEFAULT 'Card',
  payment_status ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Pending',
  transaction_ref VARCHAR(100) DEFAULT NULL,
  paid_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- OTP Verifications
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS otp_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  otp_code VARCHAR(10) NOT NULL,
  is_used TINYINT(1) DEFAULT 0,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Helpful Indexes
-- ------------------------------------------------------------
CREATE INDEX idx_routes_origin_destination ON routes(origin, destination);
CREATE INDEX idx_schedules_route_date ON schedules(route_id, travel_date);
CREATE INDEX idx_bookings_phone ON bookings(passenger_phone);
CREATE INDEX idx_otp_phone ON otp_verifications(phone);

-- ------------------------------------------------------------
-- Seed: Sample Admin (password: Admin@123 -> replace hash via /backend/config/seed.js)
-- ------------------------------------------------------------
-- INSERT INTO admins (full_name, email, password_hash) VALUES
-- ('System Administrator', 'admin@lankatransit.lk', '$2a$10$REPLACE_WITH_BCRYPT_HASH');

-- ------------------------------------------------------------
-- Seed: Sample Routes
-- ------------------------------------------------------------
INSERT INTO routes (origin, destination, route_type, distance_km, duration_minutes, frequency) VALUES
('Colombo', 'Kandy', 'Expressway', 115.00, 195, 'Daily'),
('Colombo', 'Galle', 'Coastal', 125.00, 150, 'Daily'),
('Colombo', 'Jaffna', 'Normal', 396.00, 480, 'Daily');

-- ------------------------------------------------------------
-- Seed: Sample Buses
-- ------------------------------------------------------------
INSERT INTO buses (bus_name, bus_number, bus_type, total_seats, operator_name, status) VALUES
('Yutong C12 Pro', 'NB-4521', 'AC Luxury', 52, 'Sunline Travels', 'Active'),
('King Long XMQ', 'NC-7789', 'Super Luxury', 52, 'Sunline Travels', 'Active');
