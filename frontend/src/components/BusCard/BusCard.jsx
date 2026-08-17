import { useNavigate } from "react-router-dom";
import "./BusCard.css";

export default function BusCard({ bus }) {
  const navigate = useNavigate();
  return (
    <div className="bus-card card">
      <div className="bus-card-image">
        <span className="bus-card-tag">{bus.type}</span>
      </div>
      <div className="bus-card-body">
        <h3 className="bus-card-route">
          {bus.from} <span className="arrow">→</span> {bus.to}
        </h3>
        {bus.operator && <p className="bus-card-operator">{bus.operator}</p>}
        <p className="bus-card-time">
          <span>🕒</span> {bus.departure} → {bus.arrival}
        </p>
        <div className="bus-card-footer">
          <span className="badge badge-success">{bus.status}</span>
          <span className="bus-card-price">LKR {Number(bus?.price || 0).toLocaleString()}</span>
        </div>
        <button className="btn btn-primary btn-block" onClick={() => navigate(`/bus/${bus.id}`)}>
          View Details
        </button>
      </div>
    </div>
  );
}
