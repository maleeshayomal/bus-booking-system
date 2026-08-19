import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  CheckCircle2,
  Download,
  Printer,
  Calendar,
  Clock,
  MapPin,
  Bus,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { BookingContext } from "../../context/BookingContext";
import "./BookingSuccess.css";

export default function BookingSuccess() {
  const { booking, resetBooking } = useContext(BookingContext);
  const navigate = useNavigate();
  const bus = booking.selectedBus;
  const result = booking.bookingResult;

  const ticketRef = useRef(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    if (!result && !bus) {
      navigate("/");
    }
  }, [result, bus, navigate]);

  if (!result && !bus) return null;

  const ticketId = result?.id || result?.reference || `SK-${Math.floor(1000 + Math.random() * 9000)}`;
  const passengerName = result?.passenger?.fullName || booking.passenger?.fullName || "Kamal Perera";
  const passengerGender = result?.passenger?.gender || booking.passenger?.gender || "gent";
  const passengerEmail = result?.passenger?.email || booking.passenger?.email || "passenger@tripimate.lk";
  const passengerPhone = result?.passenger?.phone || booking.passenger?.phone || "0770000000";
  const selectedSeats = result?.seats || booking.selectedSeats || ["1A"];
  const seatGenders = result?.seatGenders || booking.passenger?.seatGenders || {};
  const amountPaid = result?.amount || (selectedSeats.length * (bus?.price || 1500) * 1.08);
  const transactionRef = result?.transactionRef || `PH-TXN-${Date.now()}`;
  const departureDate = bus?.departure || "08:30 AM Today";
  const fromCity = bus?.from || "Colombo";
  const toCity = bus?.to || "Kandy";
  const operatorName = bus?.operator || "SuperLine Travels";
  const busName = bus?.name || "Yutong C12 Pro";
  const busType = bus?.type || "AC Luxury";

  const downloadTicketAsPdf = async () => {
    if (!ticketRef.current) return;
    setDownloadingPdf(true);

    try {
      const element = ticketRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Tripimate-Ticket-${ticketId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed, falling back to print:", err);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="container booking-success-page">
      <div className="success-banner-top">
        <div className="success-icon-badge">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="success-title">Booking Confirmed!</h1>
        <p className="success-subtitle">
          Your payment has been verified and your official e-ticket is ready.
        </p>
      </div>

      {/* Action Buttons Bar */}
      <div className="ticket-actions-bar">
        <button
          type="button"
          className="btn btn-primary download-pdf-btn"
          onClick={downloadTicketAsPdf}
          disabled={downloadingPdf}
        >
          {downloadingPdf ? (
            <>
              <RefreshCw size={17} className="spin-icon" /> Generating PDF...
            </>
          ) : (
            <>
              <Download size={17} /> Download Ticket PDF
            </>
          )}
        </button>

        <button
          type="button"
          className="btn btn-outline print-btn"
          onClick={() => window.print()}
        >
          <Printer size={17} /> Print Ticket
        </button>

        <Link
          to="/my-bookings"
          className="btn btn-outline"
          onClick={resetBooking}
        >
          View in My Bookings
        </Link>
      </div>

      {/* Official e-Ticket Printable Container */}
      <div className="ticket-container-wrapper">
        <div className="official-ticket-card" ref={ticketRef} id="official-ticket-card">
          {/* Ticket Header */}
          <div className="ticket-header-strip">
            <div className="ticket-logo-block">
              <div className="ticket-brand-text">
                <span className="brand-tripi">Tripi</span>
                <span className="brand-mate">mate</span>
              </div>
              <span className="ticket-tagline">Official Bus E-Ticket</span>
            </div>

            <div className="ticket-status-block">
              <span className="ticket-badge-confirmed">
                <ShieldCheck size={14} /> CONFIRMED
              </span>
              <div className="ticket-id-display">
                Ref: <strong>{ticketId}</strong>
              </div>
            </div>
          </div>

          {/* Journey Route Banner */}
          <div className="ticket-journey-strip">
            <div className="journey-point">
              <span className="journey-label">Boarding Station</span>
              <span className="journey-city">{fromCity}</span>
              <span className="journey-time"><Clock size={13} /> {departureDate}</span>
            </div>

            <div className="journey-divider-line">
              <Bus size={18} className="bus-travel-icon" />
              <div className="dashed-line" />
              <span className="duration-pill">{bus?.duration || "3h 15m"}</span>
            </div>

            <div className="journey-point end-point">
              <span className="journey-label">Destination Station</span>
              <span className="journey-city">{toCity}</span>
              <span className="journey-time"><MapPin size={13} /> Arrival Terminal</span>
            </div>
          </div>

          {/* Ticket Details Grid */}
          <div className="ticket-details-grid">
            <div className="ticket-info-group">
              <span className="info-label">Bus Operator</span>
              <span className="info-value">{operatorName}</span>
              <span className="info-sub">{busName} ({busType})</span>
            </div>

            <div className="ticket-info-group">
              <span className="info-label">Primary Passenger</span>
              <span className="info-value">{passengerName}</span>
              <span className="info-sub">
                Gender: <strong className={passengerGender === "female" ? "female-txt" : "gent-txt"}>
                  {passengerGender === "female" ? "👩 Female (Rose)" : "👨 Gent (Red)"}
                </strong>
              </span>
            </div>

            <div className="ticket-info-group">
              <span className="info-label">Contact Details</span>
              <span className="info-value">{passengerPhone}</span>
              <span className="info-sub">{passengerEmail}</span>
            </div>

            <div className="ticket-info-group">
              <span className="info-label">Payment & Transaction</span>
              <span className="info-value price-highlight">LKR {amountPaid.toLocaleString()}</span>
              <span className="info-sub">Txn: {transactionRef}</span>
            </div>
          </div>

          {/* Allocated Seats & QR Code Strip */}
          <div className="ticket-seats-qr-strip">
            <div className="allocated-seats-section">
              <span className="info-label">Reserved Seats ({selectedSeats.length}):</span>
              <div className="ticket-seats-list">
                {selectedSeats.map((seatId) => {
                  const gen = seatGenders[seatId] || passengerGender || "gent";
                  return (
                    <span
                      key={seatId}
                      className={`ticket-seat-pill ${gen === "female" ? "seat-pill-rose" : "seat-pill-red"}`}
                    >
                      {gen === "female" ? "👩" : "👨"} Seat {seatId}
                    </span>
                  );
                })}
              </div>
              <p className="boarding-notice">
                ⚠️ Please arrive at the boarding terminal at least 15 minutes prior to departure. Show this QR code to the bus conductor.
              </p>
            </div>

            <div className="ticket-qr-section">
              <div className="qr-box">
                <QRCodeSVG
                  value={`TRIPIMATE|${ticketId}|${passengerName}|${fromCity}-${toCity}|${selectedSeats.join(",")}|CONFIRMED`}
                  size={100}
                />
              </div>
              <span className="qr-caption">Scan for Boarding</span>
            </div>
          </div>

          {/* Ticket Footer */}
          <div className="ticket-footer-strip">
            <span>Customer Support: 📞 077-9915391 · support@tripimate.lk</span>
            <span>Generated on {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
