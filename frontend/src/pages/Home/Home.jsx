import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BusCard from "../../components/BusCard/BusCard";
import { BookingContext } from "../../context/BookingContext";
import { cities } from "../../services/mockData";
import { getPopularRoutes } from "../../services/busService";
import "./Home.css";

export default function Home() {
  const { booking, updateSearch } = useContext(BookingContext);
  const navigate = useNavigate();
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    getPopularRoutes().then(setPopular);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/search");
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <h1>Travel Sri Lanka with Comfort</h1>
          <p>Premium intercity bus booking for a reliable and efficient journey.</p>
        </div>
      </section>

      <div className="container">
        <form className="search-panel card" onSubmit={handleSearch}>
          <div className="search-field">
            <label>From</label>
            <select
              value={booking.searchParams.from}
              onChange={(e) => updateSearch({ from: e.target.value })}
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="search-field">
            <label>To</label>
            <select
              value={booking.searchParams.to}
              onChange={(e) => updateSearch({ to: e.target.value })}
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="search-field">
            <label>Date</label>
            <input
              type="date"
              value={booking.searchParams.date}
              onChange={(e) => updateSearch({ date: e.target.value })}
            />
          </div>
          <div className="search-field search-field-small">
            <label>Seats</label>
            <input
              type="number"
              min="1"
              max="10"
              value={booking.searchParams.seats}
              onChange={(e) => updateSearch({ seats: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary search-btn">🔍 Search</button>
        </form>

        <section className="popular-routes">
          <div className="popular-routes-header">
            <h2>Popular Routes</h2>
            <a href="#!" onClick={(e) => { e.preventDefault(); navigate("/search"); }}>View All →</a>
          </div>
          <div className="bus-grid">
            {popular.map((bus) => (
              <BusCard key={bus.id} bus={bus} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
