import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SeatLayout from "../../components/SeatLayout/SeatLayout";
import BookingPanel from "../../components/BookingPanel/BookingPanel";
import { BookingContext } from "../../context/BookingContext";
import { useSeats } from "../../hooks/useSeats";
import { sampleBookedSeats, sampleFemaleSeats } from "../../services/mockData";
import "./SeatSelection.css";

export default function SeatSelection() {
  const navigate = useNavigate();
  const { booking, toggleSeat, updatePassenger } = useContext(BookingContext);
  const bus = booking.selectedBus;

  const { seats, selected, toggleSeat: toggleLocalSeat } = useSeats(
    sampleBookedSeats,
    sampleFemaleSeats
  );

  useEffect(() => {
    if (!bus) navigate("/search");
  }, [bus, navigate]);

  if (!bus) return null;

  const handleSeatClick = (seat) => {
    toggleLocalSeat(seat);
  };

  const handleProceed = () => {
    // sync selected seats into shared booking context
    selected.forEach((s) => {
      if (!booking.selectedSeats.includes(s)) toggleSeat(s);
    });
    navigate("/payment");
  };

  return (
    <div className="container seat-selection-page">
      <Link to={`/bus/${bus.id}`} className="back-link">← Back to Bus Details</Link>
      <div className="seat-selection-header">
        <div>
          <h1 className="page-title">{bus.from} → {bus.to}</h1>
          <p className="page-subtitle">{bus.operator} ({bus.name}) · LKR {bus.price.toLocaleString()}</p>
        </div>
        <div className="seat-selection-meta">
          <span>📍 {bus.distance}</span>
          <span>🕒 {bus.duration}</span>
        </div>
      </div>

      <div className="seat-selection-grid">
        <div className="card seat-selection-panel">
          <div className="seat-selection-top-bar">
            <h3>Select Seats</h3>
            <span className="selected-count-badge">
              {selected.length} {selected.length === 1 ? "seat" : "seats"} selected
            </span>
          </div>

          {/* Updated Legend with Gent (Red) and Female (Rose) */}
          <div className="seat-legend">
            <span className="seat-legend-item">
              <span className="seat-legend-dot" style={{ background: "#16a34a" }} />
              Available
            </span>
            <span className="seat-legend-item">
              <span className="seat-legend-dot" style={{ background: "#e2e8f0" }} />
              Booked
            </span>
            <span className="seat-legend-item">
              <span className="seat-legend-dot" style={{ background: "#f472b6" }} />
              Female Reserved
            </span>
            <span className="seat-legend-item">
              <span className="seat-legend-dot" style={{ background: "#dc2626" }} />
              Gent Selected (Red)
            </span>
            <span className="seat-legend-item">
              <span className="seat-legend-dot" style={{ background: "#ec4899" }} />
              Female Selected (Rose)
            </span>
          </div>

          <SeatLayout
            seats={seats}
            selectedGender={booking.passenger.gender || "gent"}
            seatGenders={booking.passenger.seatGenders || {}}
            onSeatClick={handleSeatClick}
          />
        </div>

        <BookingPanel
          selectedSeats={selected}
          basePrice={bus.price}
          passenger={booking.passenger}
          onPassengerChange={updatePassenger}
          onSubmit={handleProceed}
          disabled={selected.length === 0 || !booking.passenger.fullName || !booking.passenger.phone}
        />
      </div>
    </div>
  );
}
