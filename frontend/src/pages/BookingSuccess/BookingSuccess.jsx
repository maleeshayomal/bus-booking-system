import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { BookingContext } from "../../context/BookingContext";
import "./BookingSuccess.css";

export default function BookingSuccess() {
  const { booking, resetBooking } = useContext(BookingContext);
  const navigate = useNavigate();
  const bus = booking.selectedBus;
  const result = booking.bookingResult;

  useEffect(() => {
    if (!result) navigate("/");
  }, [result, navigate]);

  if (!result) return null;

  const ticketId = result.id || "SK-0000";

  return (
    <div className="container booking-success-page">
      <div className="card success-card">
        <div className="success-icon">✅</div>
        <h1>Booking Confirmed!</h1>
        <p>Your ticket has been generated and a copy sent to your email.</p>

        <div className="ticket">
          <div className="ticket-info">
            <div><span>Booking ID</span><strong>{ticketId}</strong></div>
            <div><span>Route</span><strong>{bus?.from} → {bus?.to}</strong></div>
            <div><span>Seats</span><strong>{booking.selectedSeats.join(", ")}</strong></div>
            <div><span>Passenger</span><strong>{booking.passenger.fullName} ({booking.passenger.gender === "female" ? "Female" : "Gent"})</strong></div>
            <div><span>Departure</span><strong>{bus?.departure}</strong></div>
          </div>
          <div className="ticket-qr">
            <QRCodeSVG value={`LankaTransit|${ticketId}`} size={110} />
          </div>
        </div>

        <div className="success-actions">
          <button className="btn btn-outline" onClick={() => window.print()}>Download Ticket</button>
          <Link
            to="/my-bookings"
            className="btn btn-primary"
            onClick={resetBooking}
          >
            View My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
