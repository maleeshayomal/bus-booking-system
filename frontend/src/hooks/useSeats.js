import { useMemo, useState } from "react";
import { generateSeatLayout } from "../services/mockData";

export function useSeats(bookedSeatIds = [], femaleSeatIds = []) {
  const baseSeats = useMemo(
    () => generateSeatLayout(bookedSeatIds, femaleSeatIds),
    [bookedSeatIds, femaleSeatIds]
  );
  const [selected, setSelected] = useState([]);

  const toggleSeat = (seat) => {
    if (seat.status === "booked") return;
    setSelected((prev) =>
      prev.includes(seat.id) ? prev.filter((s) => s !== seat.id) : [...prev, seat.id]
    );
  };

  const clearSelection = () => setSelected([]);

  const seats = useMemo(
    () =>
      baseSeats.map((seat) =>
        selected.includes(seat.id) && seat.status !== "booked"
          ? { ...seat, status: "selected" }
          : seat
      ),
    [baseSeats, selected]
  );

  return { seats, selected, toggleSeat, clearSelection };
}
