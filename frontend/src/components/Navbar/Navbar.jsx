import { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Bus,
  Calendar,
  RotateCcw,
  Phone,
  Moon,
  Sun,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import TripimateLogo from "./TripimateLogo";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      document.documentElement.getAttribute("data-theme") === "dark"
    );
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        {/* Left: Brand Logo */}
        <Link to="/" className="brand-link" onClick={closeMobileMenu}>
          <TripimateLogo />
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
          >
            <Home className="nav-item-icon" size={18} strokeWidth={2} />
            <span className="nav-item-text">Home</span>
            <span className="nav-active-bar" />
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
          >
            <Bus className="nav-item-icon" size={18} strokeWidth={2} />
            <span className="nav-item-text">Book Tickets</span>
            <span className="nav-active-bar" />
          </NavLink>

          <NavLink
            to="/schedules"
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
          >
            <Calendar className="nav-item-icon" size={18} strokeWidth={2} />
            <span className="nav-item-text">Schedules</span>
            <span className="nav-active-bar" />
          </NavLink>

          <NavLink
            to="/refund"
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
          >
            <RotateCcw className="nav-item-icon" size={18} strokeWidth={2} />
            <span className="nav-item-text">Refund</span>
            <span className="nav-active-bar" />
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
          >
            <Phone className="nav-item-icon" size={18} strokeWidth={2} />
            <span className="nav-item-text">Contact</span>
            <span className="nav-active-bar" />
          </NavLink>
        </nav>

        {/* Right: Actions (Theme Toggle, Phone, Sign In) */}
        <div className="header-actions">
          {/* Dark Mode Toggle */}
          <button
            type="button"
            className="action-icon-btn theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Contact Phone Number */}
          <a
            href="tel:0779915391"
            className="phone-contact-link"
            title="Call Support: 077-9915391"
          >
            <Phone size={16} className="phone-icon" strokeWidth={2.2} />
            <span className="phone-number-text">077-9915391</span>
          </a>

          {/* Sign In / User Auth Button */}
          {user ? (
            <div className="user-dropdown-container">
              <Link
                to="/my-bookings"
                className="user-profile-badge"
                title="View My Bookings"
              >
                <User size={16} />
                <span>{user.name || "My Account"}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="logout-icon-btn"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-signin">
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-backdrop" onClick={closeMobileMenu}>
          <div
            className="mobile-nav-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-nav-links">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `mobile-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileMenu}
              >
                <Home size={20} />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/search"
                className={({ isActive }) =>
                  `mobile-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileMenu}
              >
                <Bus size={20} />
                <span>Book Tickets</span>
              </NavLink>

              <NavLink
                to="/schedules"
                className={({ isActive }) =>
                  `mobile-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileMenu}
              >
                <Calendar size={20} />
                <span>Schedules</span>
              </NavLink>

              <NavLink
                to="/refund"
                className={({ isActive }) =>
                  `mobile-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileMenu}
              >
                <RotateCcw size={20} />
                <span>Refund</span>
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `mobile-nav-item ${isActive ? "active" : ""}`
                }
                onClick={closeMobileMenu}
              >
                <Phone size={20} />
                <span>Contact</span>
              </NavLink>
            </div>

            <div className="mobile-nav-footer">
              <a href="tel:0779915391" className="mobile-phone-link">
                <Phone size={18} />
                <span>077-9915391</span>
              </a>

              {user ? (
                <div className="mobile-auth-actions">
                  <Link
                    to="/my-bookings"
                    className="btn btn-outline mobile-btn"
                    onClick={closeMobileMenu}
                  >
                    My Bookings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-primary mobile-btn"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn-signin mobile-btn"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
