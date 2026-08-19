import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { BookingContext } from "../../context/BookingContext";
import { getPayHereParams, verifyPayHerePayment } from "../../services/bookingService";
import "./Payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const { booking, setBookingResult } = useContext(BookingContext);
  const bus = booking.selectedBus;

  const [paymentMode, setPaymentMode] = useState("payhere_sandbox");
  const [cardDetails, setCardDetails] = useState({
    number: "4111 2222 3333 4444",
    holder: booking.passenger?.fullName || "Kamal Perera",
    expiry: "12/28",
    cvv: "789",
  });
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (!bus || booking.selectedSeats.length === 0) {
      navigate("/search");
    }
  }, [bus, booking.selectedSeats, navigate]);

  if (!bus) return null;

  const fare = booking.selectedSeats.length * bus.price;
  const taxes = Math.round(fare * 0.08); // 8% service charges
  const total = fare + taxes;

  const orderId = `SK-${Math.floor(1000 + Math.random() * 9000)}`;

  const fillTestCard = (type) => {
    if (type === "visa") {
      setCardDetails({
        number: "4111 2222 3333 4444",
        holder: booking.passenger.fullName || "Kamal Perera",
        expiry: "12/28",
        cvv: "123",
      });
    } else if (type === "mastercard") {
      setCardDetails({
        number: "5200 8282 9191 3030",
        holder: booking.passenger.fullName || "Kamal Perera",
        expiry: "10/29",
        cvv: "456",
      });
    }
  };

  const handlePayHereCheckout = async () => {
    setProcessing(true);
    setStatusMessage({ type: "info", text: "Connecting to PayHere Sandbox Gateway..." });

    try {
      // 1. Fetch PayHere Hash & Parameters from Backend
      const payhereParams = await getPayHereParams({
        orderId,
        amount: total,
        currency: "LKR",
        passenger: booking.passenger,
        items: `Bus Ticket (${bus.from} → ${bus.to})`,
      });

      // 2. Simulate PayHere Gateway Processing & Verify with Backend
      setStatusMessage({ type: "info", text: "Processing test payment in PayHere Sandbox..." });

      await new Promise((resolve) => setTimeout(resolve, 1400));

      const paymentId = `PH-SANDBOX-${Date.now()}`;
      const verificationResponse = await verifyPayHerePayment({
        orderId: payhereParams.order_id || orderId,
        paymentMethod: "PayHere (Sandbox Test Card)",
        paymentId,
        amount: total,
        passenger: booking.passenger,
        bus,
        seats: booking.selectedSeats,
      });

      // 3. Set Booking = CONFIRMED
      const confirmedBooking = {
        id: verificationResponse.bookingReference || orderId,
        reference: verificationResponse.bookingReference || orderId,
        transactionRef: verificationResponse.transactionRef || paymentId,
        bus,
        seats: booking.selectedSeats,
        seatGenders: booking.passenger.seatGenders || {},
        passenger: booking.passenger,
        amount: total,
        fare,
        taxes,
        method: "PayHere Sandbox (Visa/Master)",
        status: "CONFIRMED",
        confirmedAt: new Date().toISOString(),
        qrCodeData: verificationResponse.qrCodeData,
      };

      setBookingResult(confirmedBooking);
      setStatusMessage({ type: "success", text: "Payment verified! Redirecting to confirmed ticket..." });

      setTimeout(() => {
        navigate("/booking-success");
      }, 600);
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err.message || "Payment verification failed. Please try again.",
      });
      setProcessing(false);
    }
  };

  return (
    <div className="container payment-page">
      <div className="payment-header">
        <Link to="/seat-selection" className="back-link">← Back to Seat Selection</Link>
        <h1 className="page-title">Secure Checkout & Payment</h1>
        <p className="page-subtitle">
          {bus.from} → {bus.to} · {bus.operator} · {booking.selectedSeats.length} {booking.selectedSeats.length === 1 ? "Seat" : "Seats"}
        </p>
      </div>

      <div className="payment-layout">
        {/* Left: PayHere Payment Gateway */}
        <div className="card payment-gateway-card">
          <div className="gateway-brand-header">
            <div className="payhere-badge">
              <span className="payhere-logo-txt">Pay<span className="payhere-here">Here</span></span>
              <span className="sandbox-tag">SANDBOX</span>
            </div>
            <div className="secure-badge">
              <Lock size={14} /> 256-bit Encrypted
            </div>
          </div>

          <p className="gateway-desc">
            Official Sri Lanka Payment Gateway. Supports Visa, MasterCard, Genie, FriMi & eZ Cash.
          </p>

          {/* Test Card Quick Fill Banner */}
          <div className="sandbox-helper-box">
            <div className="helper-title">
              <Sparkles size={16} /> PayHere Sandbox Test Cards:
            </div>
            <div className="helper-actions">
              <button
                type="button"
                className="test-card-btn"
                onClick={() => fillTestCard("visa")}
              >
                💳 Use Visa Test Card
              </button>
              <button
                type="button"
                className="test-card-btn"
                onClick={() => fillTestCard("mastercard")}
              >
                💳 Use MasterCard Test
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className={`payment-status-alert ${statusMessage.type}`}>
              {statusMessage.type === "info" && <RefreshCw size={16} className="spin-icon" />}
              {statusMessage.type === "success" && <CheckCircle2 size={16} />}
              {statusMessage.type === "error" && <AlertCircle size={16} />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Card Form */}
          <div className="payhere-card-form">
            <div className="form-group">
              <label>Card Number</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  placeholder="4111 2222 3333 4444"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  disabled={processing}
                />
                <CreditCard size={18} className="input-icon" />
              </div>
            </div>

            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                placeholder="Name on card"
                value={cardDetails.holder}
                onChange={(e) => setCardDetails({ ...cardDetails, holder: e.target.value })}
                disabled={processing}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  disabled={processing}
                />
              </div>

              <div className="form-group">
                <label>CVV / CVC</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  disabled={processing}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-block payhere-pay-btn"
            disabled={processing}
            onClick={handlePayHereCheckout}
          >
            {processing ? (
              <>
                <RefreshCw size={18} className="spin-icon" /> Verifying with Backend...
              </>
            ) : (
              <>
                Pay LKR {total.toLocaleString()} with PayHere <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="payment-guarantee">
            <ShieldCheck size={16} /> Instant booking confirmation & verified digital e-Ticket PDF.
          </div>
        </div>

        {/* Right: Booking & Passenger Summary */}
        <div className="payment-summary-col">
          <div className="card summary-card">
            <h3>Trip & Passenger Summary</h3>

            <div className="summary-section">
              <div className="summary-route">
                <strong>{bus.from}</strong>
                <span className="route-arrow">➔</span>
                <strong>{bus.to}</strong>
              </div>
              <div className="summary-sub">{bus.operator} · {bus.name} ({bus.type})</div>
              <div className="summary-time">🕒 Departure: {bus.departure}</div>
            </div>

            <div className="summary-divider" />

            <div className="summary-section">
              <h4>Passenger Information</h4>
              <div className="passenger-info-line">
                <span>Name:</span>
                <strong>{booking.passenger.fullName}</strong>
              </div>
              <div className="passenger-info-line">
                <span>Gender:</span>
                <strong className={booking.passenger.gender === "female" ? "female-color" : "gent-color"}>
                  {booking.passenger.gender === "female" ? "👩 Female (Rose)" : "👨 Gent (Red)"}
                </strong>
              </div>
              <div className="passenger-info-line">
                <span>Email:</span>
                <span>{booking.passenger.email} (✅ Verified)</span>
              </div>
              <div className="passenger-info-line">
                <span>Phone:</span>
                <span>{booking.passenger.phone}</span>
              </div>
            </div>

            <div className="summary-divider" />

            <div className="summary-section">
              <h4>Allocated Seats</h4>
              <div className="selected-seats-badge-list">
                {booking.selectedSeats.map((seatId) => {
                  const gen = booking.passenger.seatGenders?.[seatId] || booking.passenger.gender || "gent";
                  return (
                    <span key={seatId} className={`seat-badge-pill ${gen === "female" ? "pill-female" : "pill-gent"}`}>
                      {gen === "female" ? "👩" : "👨"} Seat {seatId} ({gen === "female" ? "Rose" : "Red"})
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="summary-divider" />

            <div className="summary-pricing">
              <div className="price-row">
                <span>Base Fare ({booking.selectedSeats.length} x {bus.price})</span>
                <span>LKR {fare.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Processing & Service Fee</span>
                <span>LKR {taxes.toLocaleString()}</span>
              </div>
              <div className="price-row total-row">
                <span>Total Amount Due</span>
                <span className="total-amount">LKR {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
