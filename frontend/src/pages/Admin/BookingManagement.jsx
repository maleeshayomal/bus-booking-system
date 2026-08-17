import { useState } from "react";
import { adminStats, sampleBookings } from "../../services/mockData";

export default function BookingManagement() {
  const [query, setQuery] = useState("");
  const filtered = sampleBookings.filter(
    (b) =>
      b.id.toLowerCase().includes(query.toLowerCase()) ||
      b.passenger.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Bookings & Payments</h1>

      <div className="stat-grid stat-grid-3">
        <div className="card stat-card">
          <div className="stat-card-icon" style={{ background: "#dcfce71a", color: "#16a34a" }}>💰</div>
          <div>
            <div className="stat-card-value">Rs {adminStats.todayRevenue.toLocaleString()}</div>
            <div className="stat-card-label">Total Revenue (Today)</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-icon" style={{ background: "#fef9c31a", color: "#a16207" }}>⏳</div>
          <div>
            <div className="stat-card-value">Rs {adminStats.pendingPayments.toLocaleString()}</div>
            <div className="stat-card-label">Pending Payments ({adminStats.pendingCount} Bookings)</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-icon" style={{ background: "#fee2e21a", color: "#b91c1c" }}>↩️</div>
          <div>
            <div className="stat-card-value">Rs {adminStats.refundsToday.toLocaleString()}</div>
            <div className="stat-card-label">Recent Refunds ({adminStats.refundsCount} Processed Today)</div>
          </div>
        </div>
      </div>

      <div className="admin-panel-header" style={{ margin: "18px 0 10px" }}>
        <h3>Booking Management</h3>
        <input
          type="text"
          placeholder="Search by Booking ID, Name or Phone..."
          className="admin-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Passenger</th>
              <th>Route & Time</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id}>
                <td className="admin-table-title">#{b.id}</td>
                <td>{b.passenger}</td>
                <td>
                  <div>{b.route}</div>
                  <div className="muted">{b.date}</div>
                </td>
                <td>
                  <span className={`badge ${b.status === "Confirmed" ? "badge-success" : "badge-warning"}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  <div>Rs {b.amount.toLocaleString()}</div>
                  <div className="muted">{b.method}</div>
                </td>
                <td className="admin-actions">
                  <button className="btn btn-outline btn-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
