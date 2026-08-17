import "./SeatLayout.css";

// seats: [{id, number, row, col, status}] status: available | selected | booked | female
export default function SeatLayout({ seats, onSeatClick, readOnly = false }) {
  const rows = [...new Set(seats.map((s) => s.row))].sort((a, b) => a - b);

  const seatIcon = (status) => {
    if (status === "female") return "👩";
    if (status === "booked") return "👤";
    return "💺";
  };

  return (
    <div className="seat-layout">
      <div className="seat-layout-wheel" title="Driver">🚘</div>
      <div className="seat-layout-grid">
        {rows.map((rowNum) => {
          const rowSeats = seats.filter((s) => s.row === rowNum);
          const left = rowSeats.filter((s) => s.col === "A" || s.col === "B");
          const right = rowSeats.filter((s) => s.col === "C" || s.col === "D");
          return (
            <div className="seat-row" key={rowNum}>
              <div className="seat-group">
                {left.map((seat) => (
                  <SeatButton key={seat.id} seat={seat} onSeatClick={onSeatClick} readOnly={readOnly} seatIcon={seatIcon} />
                ))}
              </div>
              <div className="seat-aisle" />
              <div className="seat-group">
                {right.map((seat) => (
                  <SeatButton key={seat.id} seat={seat} onSeatClick={onSeatClick} readOnly={readOnly} seatIcon={seatIcon} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SeatButton({ seat, onSeatClick, readOnly, seatIcon }) {
  return (
    <button
      className={`seat seat-${seat.status}`}
      disabled={readOnly || seat.status === "booked"}
      title={`Seat ${seat.id} - ${seat.status}`}
      onClick={() => onSeatClick && onSeatClick(seat)}
      type="button"
    >
      {seatIcon(seat.status)}
    </button>
  );
}
