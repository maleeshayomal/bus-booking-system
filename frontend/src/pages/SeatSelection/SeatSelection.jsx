import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SeatLayout from "../../components/SeatLayout/SeatLayout";
import BookingPanel from "../../components/BookingPanel/BookingPanel";
import EmailOtpModal from "../../components/EmailOtpModal/EmailOtpModal";
import { BookingContext } from "../../context/BookingContext";
import { useSeats } from "../../hooks/useSeats";
import { sampleBookedSeats, sampleFemaleSeats } from "../../services/mockData";
import "./SeatSelection.css";

export default function SeatSelection() {
  const navigate = useNavigate();
  const { booking, toggleSeat, updatePassenger, setOtpVerified } = useContext(BookingContext);
  const bus = booking.selectedBus;
  const [showOtpModal, setShowOtpModal] = useState(false);

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

  const handleProceedClick = () => {
    // 1. Sync selected seats
    selected.forEach((s) => {
      if (!booking.selectedSeats.includes(s)) toggleSeat(s);
    });

    // 2. If OTP already verified, navigate directly to payment
    if (booking.otpVerified) {
      navigate("/payment");
      return;
    }

    // 3. Otherwise open Email OTP verification modal
    setShowOtpModal(true);
  };

  const handleOtpSuccess = () => {
    setOtpVerified(true);
    setShowOtpModal(false);
    navigate("/payment");
  };

  const isFormValid =
    selected.length > 0 &&
    Boolean(booking.passenger.fullName?.trim()) &&
    Boolean(booking.passenger.phone?.trim()) &&
    Boolean(booking.passenger.email?.trim());

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
          onSubmit={handleProceedClick}
          submitLabel={booking.otpVerified ? "Proceed to Payment" : "Verify Email & Proceed"}
          disabled={!isFormValid}
        />
      </div>

      {/* Email OTP Verification Modal */}
      <EmailOtpModal
        isOpen={showOtpModal}
        email={booking.passenger.email}
        passengerName={booking.passenger.fullName}
        onClose={() => setShowOtpModal(false)}
        onSuccess={handleOtpSuccess}
      />
    </div>
  );
}
