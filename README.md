# LankaTransit — Sri Lanka Online Bus Booking System

A full-stack web platform for booking intercity bus tickets in Sri Lanka: route search, a
visual 52-seat layout with gender-reserved seats, OTP verification, online payment,
QR ticket generation, and a complete admin dashboard for managing buses, routes, bookings,
and payments.

No account is required up front — a customer account is created automatically the first
time someone books a ticket, right after OTP verification.

## Project Structure

```
bus-booking-system/
├── frontend/     React (Vite) single-page app — customer site + admin dashboard
├── backend/      Node.js + Express REST API
├── database/     MySQL schema (schema.sql) with seed data
└── docs/         Additional project documentation
```

## Tech Stack

- **Frontend:** React 19, React Router, Vite, plain CSS
- **Backend:** Node.js, Express
- **Database:** MySQL (via `mysql2`)
- **Auth:** JWT (admin dashboard)
- **Other:** QR code generation (`qrcode` / `qrcode.react`), OTP verification

## Getting Started

### 1. Database

1. Install MySQL locally (or use a hosted instance).
2. Create the schema and seed data:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

### 2. Backend API

```bash
cd backend
cp .env.example .env      # then edit DB_USER / DB_PASSWORD / JWT_SECRET
npm install
npm run dev                # starts on http://localhost:5000
```

Health check: `GET http://localhost:5000/api/health`

### 3. Frontend

```bash
cd frontend
cp .env.example .env       # points the app at the backend API
npm install
npm run dev                 # starts on http://localhost:5173
```

The frontend also works stand-alone (without the backend running) — every API call
gracefully falls back to realistic mock data, so you can demo the full UI/UX flow
immediately with `npm run dev` in `frontend/` alone.

## Key User Flow

```
Search Bus → Select Bus → Select Seats → Enter Passenger Details
   → OTP Verification → Payment → Booking Confirmation → QR Ticket
```

## Admin Dashboard

Visit `/admin` in the running frontend for:

- Dashboard overview (buses, bookings, revenue, active routes, daily analytics)
- Bus Management (fleet CRUD)
- Routes & Schedules (route editor with stop timeline)
- Seat Management (real-time seat monitoring per trip)
- Bookings & Payments (revenue, pending payments, refunds, booking search)

## Notes for Production

- Replace the placeholder admin password hash in `database/schema.sql` with a real
  bcrypt hash before deploying (see the comment above the `INSERT INTO admins...` line).
- `backend/utils/sendOTP.js` currently logs OTP codes to the console in development.
  Swap in a real SMS gateway (Twilio, Notify.lk, Dialog, etc.) for production.
- `backend/controllers/paymentController.js` simulates a successful payment gateway
  call. Replace with a real gateway integration (PayHere, Stripe, Genie, eZ Cash).
