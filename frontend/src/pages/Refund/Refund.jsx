import { useState } from "react";
import { RotateCcw, CheckCircle2, AlertCircle, ShieldCheck, Clock, FileText } from "lucide-react";
import "./Refund.css";

export default function Refund() {
  const [bookingId, setBookingId] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("Change of Travel Plans");
  const [notes, setNotes] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookingId.trim() || !phone.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please provide both Booking Reference ID and registered phone number.",
      });
      return;
    }

    setStatusMessage({
      type: "success",
      text: `Refund request for Booking #${bookingId.toUpperCase()} has been submitted successfully. Our team will process it within 2-4 business hours.`,
    });
    setBookingId("");
    setPhone("");
    setNotes("");
  };

  return (
    <div className="container refund-page">
      <div className="refund-header">
        <div className="badge badge-warning refund-badge">
          <RotateCcw size={14} /> Hassle-Free Cancellations
        </div>
        <h1 className="page-title">Ticket Cancellation & Refund Request</h1>
        <p className="page-subtitle">
          Submit your ticket cancellation request online or track existing refund requests.
        </p>
      </div>

      <div className="refund-layout">
        {/* Refund Form Card */}
        <div className="card refund-form-card">
          <h2 className="card-heading">
            <FileText size={20} /> Request Ticket Refund
          </h2>
          <p className="card-sub">
            Enter the details associated with your booking to initiate cancellation.
          </p>

          {statusMessage && (
            <div className={`refund-alert ${statusMessage.type}`}>
              {statusMessage.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="refund-form">
            <div className="form-group">
              <label>Booking Reference ID *</label>
              <input
                type="text"
                placeholder="e.g. SK-8829"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                required
              />
              <span className="input-hint">Found in your SMS / ticket confirmation email</span>
            </div>

            <div className="form-group">
              <label>Passenger Phone Number *</label>
              <input
                type="tel"
                placeholder="e.g. 0771234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Reason for Cancellation</label>
              <select value={reason} onChange={(e) => setReason(e.target.value)}>
                <option value="Change of Travel Plans">Change of Travel Plans</option>
                <option value="Bus Timing Rescheduled">Bus Timing Rescheduled</option>
                <option value="Booked by Mistake">Booked by Mistake</option>
                <option value="Medical / Emergency">Medical / Emergency</option>
                <option value="Other">Other Reason</option>
              </select>
            </div>

            <div className="form-group">
              <label>Additional Notes (Optional)</label>
              <textarea
                rows={3}
                placeholder="Provide any additional details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary submit-refund-btn">
              <RotateCcw size={16} /> Submit Refund Request
            </button>
          </form>
        </div>

        {/* Policy & Guarantee Sidebar */}
        <div className="refund-sidebar">
          <div className="card policy-card">
            <h3>
              <ShieldCheck size={20} className="policy-icon" /> Tripimate Refund Policy
            </h3>
            <ul className="policy-list">
              <li>
                <strong>24+ Hours before departure:</strong>
                <span>100% full refund (minimal processing fee).</span>
              </li>
              <li>
                <strong>12 - 24 Hours before departure:</strong>
                <span>75% refund of ticket fare.</span>
              </li>
              <li>
                <strong>6 - 12 Hours before departure:</strong>
                <span>50% refund of ticket fare.</span>
              </li>
              <li>
                <strong>Under 6 Hours:</strong>
                <span>Non-refundable as seat cannot be reallocated.</span>
              </li>
            </ul>
          </div>

          <div className="card help-card">
            <h3>
              <Clock size={20} className="help-icon" /> Need Immediate Assistance?
            </h3>
            <p>
              For urgent cancellations within 2 hours of departure, please call our 24/7 hotline directly:
            </p>
            <a href="tel:0779915391" className="urgent-phone-link">
              📞 077-9915391
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
