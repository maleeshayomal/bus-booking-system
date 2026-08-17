import "./BookingPanel.css";

export default function BookingPanel({
  selectedSeats,
  basePrice,
  passenger,
  onPassengerChange,
  onSubmit,
  submitLabel = "Proceed to Payment",
  disabled = false,
}) {
  const fare = selectedSeats.length * basePrice;
  const taxes = Math.round(fare * 0.1);
  const total = fare + taxes;

  return (
    <div className="booking-panel card">
      <h3 className="booking-panel-title">Booking Summary</h3>
      <div className="booking-panel-row">
        <span>Selected Seats</span>
        <span className="booking-panel-seats">
          {selectedSeats.length ? selectedSeats.join(", ") : "None"}
        </span>
      </div>
      <div className="booking-panel-row">
        <span>Base Fare (x{selectedSeats.length})</span>
        <span>LKR {fare.toLocaleString()}</span>
      </div>
      <div className="booking-panel-row">
        <span>Taxes & Fees</span>
        <span>LKR {taxes.toLocaleString()}</span>
      </div>
      <div className="booking-panel-total">
        <span>Total</span>
        <span>LKR {total.toLocaleString()}</span>
      </div>

      {passenger && (
        <div className="booking-panel-form">
          <h4>Passenger Details</h4>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={passenger.fullName}
            onChange={(e) => onPassengerChange({ fullName: e.target.value })}
          />
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="+94 77 123 4567"
            value={passenger.phone}
            onChange={(e) => onPassengerChange({ phone: e.target.value })}
          />
          <label>Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={passenger.email}
            onChange={(e) => onPassengerChange({ email: e.target.value })}
          />
        </div>
      )}

      <button className="btn btn-primary btn-block" disabled={disabled} onClick={onSubmit}>
        {submitLabel} →
      </button>
      <p className="booking-panel-terms">By clicking proceed, you agree to our Terms of Service</p>
    </div>
  );
}
