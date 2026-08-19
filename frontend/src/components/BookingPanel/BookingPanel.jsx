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

  const currentGender = passenger?.gender || "gent";

  const handleGenderSelect = (gender) => {
    // When primary gender is clicked, also reset/update per-seat defaults
    const updatedSeatGenders = {};
    selectedSeats.forEach((seatId) => {
      updatedSeatGenders[seatId] = gender;
    });
    onPassengerChange({
      gender,
      seatGenders: updatedSeatGenders,
    });
  };

  const handleSeatGenderToggle = (seatId, newGender) => {
    const updatedSeatGenders = {
      ...(passenger?.seatGenders || {}),
      [seatId]: newGender,
    };
    onPassengerChange({
      seatGenders: updatedSeatGenders,
    });
  };

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

          <div className="form-field-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Kamal Perera"
              value={passenger.fullName || ""}
              onChange={(e) => onPassengerChange({ fullName: e.target.value })}
              required
            />
          </div>

          {/* Gender Selection */}
          <div className="form-field-group">
            <label className="form-label">
              Passenger Gender *
              <span className="gender-note">
                (Gent = <strong className="gent-text">Red Seat</strong>, Female = <strong className="female-text">Rose Seat</strong>)
              </span>
            </label>
            <div className="gender-selector-grid">
              <button
                type="button"
                className={`gender-select-btn gent-btn ${currentGender === "gent" ? "active" : ""}`}
                onClick={() => handleGenderSelect("gent")}
              >
                <span className="gender-btn-icon">👨</span>
                <span className="gender-btn-label">Gent (Male)</span>
                <span className="gender-btn-badge red-badge">Red 🔴</span>
              </button>

              <button
                type="button"
                className={`gender-select-btn female-btn ${currentGender === "female" ? "active" : ""}`}
                onClick={() => handleGenderSelect("female")}
              >
                <span className="gender-btn-icon">👩</span>
                <span className="gender-btn-label">Female (Lady)</span>
                <span className="gender-btn-badge rose-badge">Rose 🌸</span>
              </button>
            </div>
          </div>

          {/* Per-Seat Gender Allocation (when multiple seats are selected) */}
          {selectedSeats.length > 1 && (
            <div className="per-seat-gender-wrap">
              <label className="form-label per-seat-label">Seat-by-Seat Gender:</label>
              <div className="per-seat-list">
                {selectedSeats.map((seatId) => {
                  const seatGen = passenger.seatGenders?.[seatId] || currentGender;
                  return (
                    <div key={seatId} className="per-seat-row">
                      <span className="per-seat-name">Seat {seatId}:</span>
                      <div className="per-seat-toggle-btns">
                        <button
                          type="button"
                          className={`mini-gender-btn mini-gent ${seatGen === "gent" ? "active" : ""}`}
                          onClick={() => handleSeatGenderToggle(seatId, "gent")}
                        >
                          👨 Gent (Red)
                        </button>
                        <button
                          type="button"
                          className={`mini-gender-btn mini-female ${seatGen === "female" ? "active" : ""}`}
                          onClick={() => handleSeatGenderToggle(seatId, "female")}
                        >
                          👩 Female (Rose)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="form-field-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              placeholder="e.g. +94 77 123 4567"
              value={passenger.phone || ""}
              onChange={(e) => onPassengerChange({ phone: e.target.value })}
              required
            />
          </div>

          <div className="form-field-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="e.g. passenger@example.com"
              value={passenger.email || ""}
              onChange={(e) => onPassengerChange({ email: e.target.value })}
            />
          </div>
        </div>
      )}

      <button className="btn btn-primary btn-block proceed-btn" disabled={disabled} onClick={onSubmit}>
        {submitLabel} →
      </button>
      <p className="booking-panel-terms">By clicking proceed, you agree to our Terms of Service</p>
    </div>
  );
}
