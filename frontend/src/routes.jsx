import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import SearchResults from "./pages/SearchResults/SearchResults";
import BusDetails from "./pages/BusDetails/BusDetails";
import SeatSelection from "./pages/SeatSelection/SeatSelection";
import Payment from "./pages/Payment/Payment";
import BookingSuccess from "./pages/BookingSuccess/BookingSuccess";
import MyBookings from "./pages/MyBookings/MyBookings";
import Login from "./pages/Login/Login";
import Schedules from "./pages/Schedules/Schedules";
import Refund from "./pages/Refund/Refund";
import Contact from "./pages/Contact/Contact";
import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import BusManagement from "./pages/Admin/BusManagement";
import RouteManagement from "./pages/Admin/RouteManagement";
import SeatManagement from "./pages/Admin/SeatManagement";
import BookingManagement from "./pages/Admin/BookingManagement";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/schedules" element={<Schedules />} />
      <Route path="/refund" element={<Refund />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/bus/:id" element={<BusDetails />} />
      <Route path="/seat-selection" element={<SeatSelection />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="buses" element={<BusManagement />} />
        <Route path="routes" element={<RouteManagement />} />
        <Route path="seats" element={<SeatManagement />} />
        <Route path="bookings" element={<BookingManagement />} />
      </Route>
    </Routes>
  );
}
