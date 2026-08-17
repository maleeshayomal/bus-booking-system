import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OTPBox from "../../components/OTPBox/OTPBox";
import PaymentCard from "../../components/PaymentCard/PaymentCard";
import { BookingContext } from "../../context/BookingContext";
import { sendOtp, verifyOtp, createBooking, processPayment } from "../../services/bookingService";
import "./Payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const { booking, setOtpVerified, setBookingResult } = useContext(BookingContext);
  const bus = booking.selectedBus;

  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!bus || booking.selectedSeats.length === 0) navigate("/search");
  }, [bus, booking.selectedSeats, navigate]);

  useEffect(() => {
    if (bus && !otpSent && !booking.otpVerified) {
      sendOtp(booking.passenger.phone).then(() => setOtpSent(true));
    }
  }, [bus, otpSent, booking.otpVerified, booking.passenger.phone]);

  if (!bus) return null;

  const fare = booking.selectedSeats.length * bus.price;
  const total = fare + Math.round(fare * 0.1);

  const handleOtpComplete = async (code) => {
    const res = await verifyOtp(booking.passenger.phone, code);
    if (res.success) {
      setOtpError("");
      setOtpVerified(true);
    } else {
      setOtpError("Invalid code, please try again.");
    }
  };

  const handlePay = async (method) => {
    setProcessing(true);
    try {
      await processPayment({ amount: total, method });
      const result = await createBooking({
        busId: bus.id,
        seats: booking.selectedSeats,
        passenger: booking.passenger,
        amount: total,
        method,
      });
      setBookingResult(result.booking || result);
      navigate("/booking-success");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container payment-page">
      <h1 className="page-title">Complete Your Booking</h1>
      <p className="page-subtitle">
        {bus.from} → {bus.to} · Seats: {booking.selectedSeats.join(", ")}
      </p>

      {!booking.otpVerified ? (
        <div className="card otp-card">
          <h3>Verify Your Phone Number</h3>
          <p>We sent a 6-digit code to <strong>{booking.passenger.phone || "your phone"}</strong></p>
          <OTPBox length={6} onComplete={handleOtpComplete} />
          {otpError && <p className="otp-error">{otpError}</p>}
          <button className="btn btn-outline" onClick={() => sendOtp(booking.passenger.phone)}>
            Resend Code
          </button>
        </div>
      ) : (
        <PaymentCard amount={total} onPay={handlePay} loading={processing} />
      )}
    </div>
  );
}
