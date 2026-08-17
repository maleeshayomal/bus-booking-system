import { createContext, useState } from "react";

export const BookingContext = createContext(null);

const initialState = {
  searchParams: { from: "Colombo", to: "Kandy", date: "", seats: 1 },
  selectedBus: null,
  selectedSeats: [],
  passenger: { fullName: "", phone: "", email: "" },
  otpVerified: false,
  bookingResult: null,
};

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(initialState);

  const updateSearch = (params) =>
    setBooking((prev) => ({ ...prev, searchParams: { ...prev.searchParams, ...params } }));

  const selectBus = (bus) => setBooking((prev) => ({ ...prev, selectedBus: bus }));

  const toggleSeat = (seatId) =>
    setBooking((prev) => {
      const exists = prev.selectedSeats.includes(seatId);
      return {
        ...prev,
        selectedSeats: exists
          ? prev.selectedSeats.filter((s) => s !== seatId)
          : [...prev.selectedSeats, seatId],
      };
    });

  const updatePassenger = (fields) =>
    setBooking((prev) => ({ ...prev, passenger: { ...prev.passenger, ...fields } }));

  const setOtpVerified = (val) => setBooking((prev) => ({ ...prev, otpVerified: val }));

  const setBookingResult = (result) => setBooking((prev) => ({ ...prev, bookingResult: result }));

  const resetBooking = () => setBooking(initialState);

  return (
    <BookingContext.Provider
      value={{
        booking,
        updateSearch,
        selectBus,
        toggleSeat,
        updatePassenger,
        setOtpVerified,
        setBookingResult,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}
