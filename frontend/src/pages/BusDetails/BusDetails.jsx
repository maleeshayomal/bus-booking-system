import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RouteTimeline from "../../components/RouteTimeline/RouteTimeline";
import { BookingContext } from "../../context/BookingContext";
import { getBusById } from "../../services/busService";
import "./BusDetails.css";

export default function BusDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectBus } = useContext(BookingContext);
  const [bus, setBus] = useState(null);

  useEffect(() => {
    getBusById(id).then(setBus);
  }, [id]);

  if (!bus) return <div className="container">Loading bus details...</div>;

  const handleSelectSeats = () => {
    selectBus(bus);
    navigate("/seat-selection");
  };

  return (
    <div className="container bus-details-page">
      <Link to="/search" className="back-link">← Back to Search Results</Link>

      <div className="bus-details-hero">
        <span className="badge badge-info">{bus.type}</span>
        <h1>{bus.from} → {bus.to}</h1>
        <p>{bus.operator} ({bus.name})</p>
        <div className="bus-details-price">LKR {bus.price.toLocaleString()}</div>
      </div>

      <div className="bus-details-grid">
        <div className="bus-details-main card">
          <h3>Trip Information</h3>
          <div className="info-grid">
            <div><span>Departure</span><strong>{bus.departure}</strong></div>
            <div><span>Arrival</span><strong>{bus.arrival}</strong></div>
            <div><span>Duration</span><strong>{bus.duration}</strong></div>
            <div><span>Distance</span><strong>{bus.distance}</strong></div>
            <div><span>Total Seats</span><strong>{bus.totalSeats}</strong></div>
            <div><span>Status</span><strong className="status-ok">{bus.status}</strong></div>
          </div>
          <button className="btn btn-primary btn-block" onClick={handleSelectSeats}>
            Select Seats →
          </button>
        </div>
        <RouteTimeline stops={bus.stops} />
      </div>
    </div>
  );
}
