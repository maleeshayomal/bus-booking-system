import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">LankaTransit</Link>
        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Find Bus
          </NavLink>
          <NavLink to="/my-bookings" className={({ isActive }) => (isActive ? "active" : "")}>
            My Bookings
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
            Language
          </NavLink>
        </nav>
        <Link to="/login" className="btn btn-primary">Login/Signup</Link>
      </div>
    </header>
  );
}
