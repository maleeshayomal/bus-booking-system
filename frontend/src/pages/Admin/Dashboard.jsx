import { adminStats, dailyBookingAnalytics, sampleBookings } from "../../services/mockData";

export default function Dashboard() {
  const max = Math.max(...dailyBookingAnalytics);

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Dashboard Overview</h1>

      <div className="stat-grid">
        <StatCard label="Total Buses" value={adminStats.totalBuses} icon="🚌" color="#2563eb" />
        <StatCard label="Total Bookings" value={adminStats.totalBookings.toLocaleString()} icon="🎫" color="#16a34a" />
        <StatCard
          label="Revenue Overview"
          value={`LKR ${(adminStats.revenue / 100000).toFixed(1)}L`}
          icon="💰"
          color="#db2777"
        />
        <StatCard label="Active Routes" value={adminStats.activeRoutes} icon="🗺️" color="#0891b2" />
      </div>

      <div className="admin-grid-2">
        <div className="card admin-panel">
          <div className="admin-panel-header">
            <h3>Daily Booking Analytics</h3>
            <span className="muted">Last 30 Days</span>
          </div>
          <div className="chart-bars">
            {dailyBookingAnalytics.map((val, idx) => (
              <div
                key={idx}
                className="chart-bar"
                style={{ height: `${(val / max) * 100}%` }}
                title={`${val} bookings`}
              />
            ))}
          </div>
        </div>

        <div className="card admin-panel">
          <div className="admin-panel-header">
            <h3>Recent Bookings</h3>
            <a href="#!" className="muted-link">View All</a>
          </div>
          <ul className="recent-bookings">
            {sampleBookings.slice(0, 5).map((b) => (
              <li key={b.id}>
                <div>
                  <div className="rb-name">{b.passenger}</div>
                  <div className="muted">{b.route}</div>
                </div>
                <span className={`badge ${b.status === "Confirmed" ? "badge-success" : "badge-warning"}`}>
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="card stat-card">
      <div className="stat-card-icon" style={{ background: `${color}1a`, color }}>
        {icon}
      </div>
      <div>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  );
}
