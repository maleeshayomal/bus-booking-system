import { useState } from "react";
import { routesList } from "../../services/mockData";

export default function RouteManagement() {
  const [origin, setOrigin] = useState("Colombo");
  const [destination, setDestination] = useState("Kandy");
  const [stops, setStops] = useState([
    { name: "Colombo (Fort)", type: "Start Terminal", time: "06:00", note: "" },
    { name: "Kadawatha Interchange", type: "Pick-up Only", time: "06:45", note: "" },
    { name: "Kandy (Goodshed)", type: "End Terminal", time: "09:30", note: "" },
  ]);

  const addStop = () => setStops((prev) => [...prev, { name: "", type: "Pick-up Only", time: "", note: "" }]);

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Routes & Schedules</h1>

      <div className="admin-grid-2 route-grid">
        <div className="card admin-panel">
          <div className="admin-panel-header">
            <h3>Edit Route Details</h3>
            <span className="badge badge-info">EXPRESS-01</span>
          </div>

          <div className="form-row">
            <div>
              <label>Origin</label>
              <input value={origin} onChange={(e) => setOrigin(e.target.value)} />
            </div>
            <div>
              <label>Destination</label>
              <input value={destination} onChange={(e) => setDestination(e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Route Type</label>
              <select defaultValue="Expressway">
                <option>Expressway</option>
                <option>A-Road</option>
              </select>
            </div>
            <div>
              <label>Frequency</label>
              <select defaultValue="Daily">
                <option>Daily</option>
                <option>Weekdays</option>
              </select>
            </div>
          </div>

          <h4 className="section-label">Timeline & Stops</h4>
          <div className="stops-list">
            {stops.map((stop, idx) => (
              <div className="stop-row" key={idx}>
                <span className={`stop-dot ${idx === 0 ? "start" : idx === stops.length - 1 ? "end" : ""}`} />
                <input
                  className="stop-name"
                  value={stop.name}
                  placeholder="Stop name"
                  onChange={(e) => {
                    const next = [...stops];
                    next[idx].name = e.target.value;
                    setStops(next);
                  }}
                />
                <span className="stop-type muted">{stop.type}</span>
                <input
                  className="stop-time"
                  type="time"
                  value={stop.time}
                  onChange={(e) => {
                    const next = [...stops];
                    next[idx].time = e.target.value;
                    setStops(next);
                  }}
                />
              </div>
            ))}
          </div>
          <button className="btn btn-outline" onClick={addStop}>+ Add Stop</button>

          <div className="form-actions">
            <button className="btn btn-outline">Discard</button>
            <button className="btn btn-primary">Save Route</button>
          </div>
        </div>

        <div className="card admin-panel">
          <div className="admin-panel-header">
            <h3>Active Routes</h3>
            <button className="btn btn-primary btn-sm">+</button>
          </div>
          <ul className="active-routes-list">
            {routesList.map((r) => (
              <li key={r.id}>
                <div>
                  <div className="rb-name">{r.name}</div>
                  <div className="muted">{r.frequency} · {r.stops} Stops</div>
                </div>
                <span className={`badge ${r.status === "Active" ? "badge-success" : "badge-warning"}`}>
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
