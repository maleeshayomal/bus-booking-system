import { useEffect, useState } from "react";
import { buses } from "../../services/mockData";

export default function BusManagement() {
  const [fleet, setFleet] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => setFleet(buses), []);

  const filtered = fleet.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase()) ||
    `${b.from} ${b.to}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = (id) => setFleet((prev) => prev.filter((b) => b.id !== id));

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Bus Management</h1>
          <p className="admin-page-subtitle">Manage your fleet, routes, and schedules.</p>
        </div>
        <button className="btn btn-primary">+ Add New Bus</button>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search buses by name or route..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-outline">Filters</button>
      </div>

      <div className="card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Bus Name</th>
              <th>Route</th>
              <th>Schedule</th>
              <th>Price (LKR)</th>
              <th>Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((bus) => (
              <tr key={bus.id}>
                <td>
                  <div className="admin-table-title">{bus.name}</div>
                  <span className="badge badge-info">{bus.type}</span>
                </td>
                <td>{bus.from} → {bus.to}</td>
                <td>
                  <div>{bus.departure}</div>
                  <div className="muted">Arr: {bus.arrival}</div>
                </td>
                <td>Rs {bus.price.toLocaleString()}</td>
                <td>
                  <div className="seat-bar">
                    <div className="seat-bar-fill" style={{ width: "62%" }} />
                  </div>
                  <span className="muted">32/{bus.totalSeats}</span>
                </td>
                <td className="admin-actions">
                  <button className="btn btn-outline btn-sm">Edit</button>
                  <button className="btn btn-outline btn-sm danger" onClick={() => handleDelete(bus.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="admin-pagination">Showing 1-{filtered.length} of {adminBusCount()} buses</div>
      </div>
    </div>
  );
}

function adminBusCount() {
  return 24;
}
