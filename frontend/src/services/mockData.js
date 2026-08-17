// Centralized mock data - in production this is replaced by real API responses
// from the Node/Express backend (see services/api.js for the fetch layer).

export const cities = [
  "Colombo", "Kandy", "Galle", "Jaffna", "Kurunegala", "Anuradhapura",
  "Batticaloa", "Trincomalee", "Matara", "Nuwara Eliya", "Badulla", "Ratnapura",
];

export const buses = [
  {
    id: "BUS-001",
    name: "Yutong C12 Pro",
    type: "AC Luxury",
    operator: "SuperLine Travels",
    from: "Colombo",
    to: "Kandy",
    departure: "08:30 AM",
    arrival: "11:45 AM",
    duration: "3h 15m",
    distance: "115 km",
    price: 1500,
    totalSeats: 52,
    status: "Available",
    stops: [
      { name: "Colombo (Fort)", type: "Start Terminal", time: "06:00 AM", note: "Boarding" },
      { name: "Kadawatha Interchange", type: "Pick-up Only", time: "06:45 AM", note: "Boarding" },
      { name: "Kegalle", type: "Rest Stop", time: "09:15 AM", note: "15 min stop" },
      { name: "Kandy (Goodshed)", type: "End Terminal", time: "11:45 AM", note: "Arrival" },
    ],
  },
  {
    id: "BUS-002",
    name: "King Long XMQ",
    type: "AC Luxury",
    operator: "SuperLine Travels",
    from: "Colombo",
    to: "Galle",
    departure: "09:00 AM",
    arrival: "11:30 AM",
    duration: "2h 30m",
    distance: "120 km",
    price: 1200,
    totalSeats: 52,
    status: "Available",
    stops: [
      { name: "Colombo (Fort)", type: "Start Terminal", time: "09:00 AM", note: "Boarding" },
      { name: "Kalutara", type: "Pick-up Only", time: "09:45 AM", note: "Boarding" },
      { name: "Galle (Bus Stand)", type: "End Terminal", time: "11:30 AM", note: "Arrival" },
    ],
  },
  {
    id: "BUS-003",
    name: "Volvo 9400",
    type: "Express",
    operator: "Lanka Express",
    from: "Colombo",
    to: "Jaffna",
    departure: "10:00 PM",
    arrival: "06:00 AM",
    duration: "8h 00m",
    distance: "398 km",
    price: 2800,
    totalSeats: 52,
    status: "Available",
    stops: [
      { name: "Colombo (Fort)", type: "Start Terminal", time: "10:00 PM", note: "Boarding" },
      { name: "Anuradhapura", type: "Rest Stop", time: "02:00 AM", note: "20 min stop" },
      { name: "Jaffna (Bus Stand)", type: "End Terminal", time: "06:00 AM", note: "Arrival" },
    ],
  },
];

// 52-seat layout: 13 rows x 4 seats (2 + aisle + 2), last row 5 across (back row)
export function generateSeatLayout(bookedSeatIds = [], femaleSeatIds = []) {
  const seats = [];
  const rows = 13;
  const cols = ["A", "B", "C", "D"];
  let seatNum = 1;
  for (let r = 1; r <= rows; r++) {
    for (const col of cols) {
      const id = `${r}${col}`;
      seats.push({
        id,
        number: seatNum++,
        row: r,
        col,
        status: bookedSeatIds.includes(id)
          ? "booked"
          : femaleSeatIds.includes(id)
          ? "female"
          : "available",
      });
    }
  }
  return seats;
}

export const sampleBookedSeats = ["3A", "3B", "5C", "7A", "7B", "9D", "11C", "2A"];
export const sampleFemaleSeats = ["1A", "1B", "4C", "6A", "10D"];

export const sampleBookings = [
  { id: "SK-8829", passenger: "Kamal Perera", route: "Colombo → Kandy", date: "Today, 13:00", status: "Confirmed", amount: 2500, method: "Paid (Card)" },
  { id: "SK-8830", passenger: "Nimali Silva", route: "Galle → Colombo", date: "Today, 18:00", status: "Pending", amount: 1800, method: "Unpaid" },
  { id: "SK-8831", passenger: "Kasun Fernando", route: "Colombo → Jaffna", date: "Tomorrow, 22:00", status: "Confirmed", amount: 2800, method: "Paid (Genie)" },
  { id: "SK-8832", passenger: "Ruwan Silva", route: "Kandy → Nuwara Eliya", date: "Today, 09:00", status: "Confirmed", amount: 900, method: "Paid (Card)" },
  { id: "SK-8833", passenger: "Sandum De Silva", route: "Jaffna → Colombo", date: "Today, 20:00", status: "Pending", amount: 2800, method: "Unpaid" },
];

export const adminStats = {
  totalBuses: 24,
  totalBookings: 1240,
  revenue: 1800000,
  activeRoutes: 12,
  todayRevenue: 245000,
  pendingPayments: 42500,
  pendingCount: 14,
  refundsToday: 12000,
  refundsCount: 3,
};

export const dailyBookingAnalytics = [42, 55, 38, 61, 70, 48, 65, 80, 58, 72, 66, 90, 75, 68];

export const routesList = [
  { id: 1, name: "Colombo ↔ Kandy", frequency: "Daily, 4 Trips", stops: 3, status: "Active" },
  { id: 2, name: "Colombo ↔ Galle", frequency: "Daily, 6 Trips", stops: 2, status: "Active" },
  { id: 3, name: "Colombo ↔ Jaffna", frequency: "Weekdays, 1 Trip", stops: 6, status: "Scheduled" },
];
