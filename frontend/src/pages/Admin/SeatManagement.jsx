import SeatLayout from "../../components/SeatLayout/SeatLayout";
import { useSeats } from "../../hooks/useSeats";
import { sampleBookedSeats, sampleFemaleSeats } from "../../services/mockData";

export default function SeatManagement() {
  const { seats } = useSeats(sampleBookedSeats, sampleFemaleSeats);
  const availableCount = seats.filter((s) => s.status === "available").length;
  const bookedCount = seats.filter((s) => s.status === "booked").length;
  const femaleCount = seats.filter((s) => s.status === "female").length;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Real-time Seat Monitoring</h1>
          <p className="admin-page-subtitle">Manage assignments and track availability.</p>
        </div>
        <div className="card trip-selector">
          <div className="muted">Yutong C12 Pro - Col to Kandy - 08:30 AM</div>
          <button className="btn btn-outline btn-sm">Reset Next Trip</button>
        </div>
      </div>

      <div className="card seat-summary">
        <span className="badge badge-success">Available ({availableCount})</span>
        <span className="badge" style={{ background: "#e2e8f0", color: "#475569" }}>
          Booked ({bookedCount})
        </span>
        <span className="badge" style={{ background: "#fce7f3", color: "#be185d" }}>
          Female Res. ({femaleCount})
        </span>
      </div>

      <div className="card seat-monitor-card">
        <SeatLayout seats={seats} readOnly />
      </div>
    </div>
  );
}
