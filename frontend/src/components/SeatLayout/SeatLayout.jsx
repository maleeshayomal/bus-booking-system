import "./SeatLayout.css";

// seats: [{id, number, row, col, status}] status: available | selected | booked | female
export default function SeatLayout({
  seats,
  selectedGender = "gent",
  seatGenders = {},
  onSeatClick,
  readOnly = false,
}) {
  const rows = [...new Set(seats.map((s) => s.row))].sort((a, b) => a - b);

  return (
    <div className="seat-layout">
      <div className="seat-layout-wheel" title="Driver Cabin">
        <span className="wheel-icon">🚌</span>
        <span className="wheel-text">Front / Driver</span>
      </div>

      <div className="seat-layout-grid">
        {rows.map((rowNum) => {
          const rowSeats = seats.filter((s) => s.row === rowNum);
          const left = rowSeats.filter((s) => s.col === "A" || s.col === "B");
          const right = rowSeats.filter((s) => s.col === "C" || s.col === "D");
          return (
            <div className="seat-row" key={rowNum}>
              <div className="seat-group">
                {left.map((seat) => (
                  <SeatButton
                    key={seat.id}
                    seat={seat}
                    selectedGender={selectedGender}
                    seatGenders={seatGenders}
                    onSeatClick={onSeatClick}
                    readOnly={readOnly}
                  />
                ))}
              </div>
              <div className="seat-aisle" />
              <div className="seat-group">
                {right.map((seat) => (
                  <SeatButton
                    key={seat.id}
                    seat={seat}
                    selectedGender={selectedGender}
                    seatGenders={seatGenders}
                    onSeatClick={onSeatClick}
                    readOnly={readOnly}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SeatButton({ seat, selectedGender, seatGenders, onSeatClick, readOnly }) {
  const isSelected = seat.status === "selected";
  const seatGen = seatGenders?.[seat.id] || selectedGender || "gent";

  let statusClass = `seat-${seat.status}`;
  if (isSelected) {
    statusClass = seatGen === "female" ? "seat-selected-female" : "seat-selected-gent";
  }

  const getSeatIcon = () => {
    if (isSelected) {
      return seatGen === "female" ? "👩" : "👨";
    }
    if (seat.status === "female") return "👩";
    if (seat.status === "booked") return "✖";
    return seat.id;
  };

  const getTooltip = () => {
    if (isSelected) {
      return `Seat ${seat.id} - Selected for ${seatGen === "female" ? "Female (Rose)" : "Gent (Red)"}`;
    }
    if (seat.status === "female") return `Seat ${seat.id} - Reserved for Female`;
    if (seat.status === "booked") return `Seat ${seat.id} - Already Booked`;
    return `Seat ${seat.id} - Available`;
  };

  return (
    <button
      className={`seat ${statusClass}`}
      disabled={readOnly || seat.status === "booked"}
      title={getTooltip()}
      onClick={() => onSeatClick && onSeatClick(seat)}
      type="button"
      aria-label={getTooltip()}
    >
      <span className="seat-icon-view">{getSeatIcon()}</span>
    </button>
  );
}
