import { NavLink, Outlet } from "react-router-dom";
import "./Admin.css";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/buses", label: "Bus Management", icon: "🚌" },
  { to: "/admin/routes", label: "Routes & Schedules", icon: "🗺️" },
  { to: "/admin/seats", label: "Seat Management", icon: "💺" },
  { to: "/admin/bookings", label: "Bookings & Payments", icon: "💳" },
];

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">LankaTransit <span>Admin</span></div>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-user">
          <div className="admin-user-avatar">A</div>
          <div>
            <div className="admin-user-name">Admin User</div>
            <div className="admin-user-role">System Administrator</div>
          </div>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
