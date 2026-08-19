import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Bus, Search, ArrowRight } from "lucide-react";
import { buses, cities } from "../../services/mockData";
import "./Schedules.css";

export default function Schedules() {
  const [fromFilter, setFromFilter] = useState("All");
  const [toFilter, setToFilter] = useState("All");

  const filteredBuses = buses.filter((bus) => {
    const matchFrom = fromFilter === "All" || bus.from === fromFilter;
    const matchTo = toFilter === "All" || bus.to === toFilter;
    return matchFrom && matchTo;
  });

  return (
    <div className="container schedules-page">
      <div className="schedules-header">
        <div className="badge badge-info schedules-badge">
          <Calendar size={14} /> Timetable & Routes
        </div>
        <h1 className="page-title">Bus Schedules & Timetables</h1>
        <p className="page-subtitle">
          Explore daily intercity bus routes across Sri Lanka with real-time departure times.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card schedules-filter-bar">
        <div className="filter-group">
          <label>
            <MapPin size={15} /> From Station
          </label>
          <select value={fromFilter} onChange={(e) => setFromFilter(e.target.value)}>
            <option value="All">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>
            <MapPin size={15} /> To Destination
          </label>
          <select value={toFilter} onChange={(e) => setToFilter(e.target.value)}>
            <option value="All">All Destinations</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="btn btn-outline reset-btn"
          onClick={() => { setFromFilter("All"); setToFilter("All"); }}
        >
          Reset Filters
        </button>
      </div>

      {/* Schedules List */}
      <div className="schedules-list">
        {filteredBuses.length === 0 ? (
          <div className="card empty-schedules">
            <Bus size={40} className="empty-icon" />
            <h3>No schedules found</h3>
            <p>Try selecting different departure and arrival locations.</p>
          </div>
        ) : (
          filteredBuses.map((bus) => (
            <div key={bus.id} className="card schedule-card">
              <div className="schedule-card-top">
                <div className="schedule-operator">
                  <span className="badge badge-info">{bus.type}</span>
                  <strong className="operator-name">{bus.operator}</strong>
                  <span className="bus-model">({bus.name})</span>
                </div>
                <div className="schedule-price">
                  <span className="price-label">Fare from</span>
                  <span className="price-val">Rs {bus.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="schedule-card-body">
                <div className="time-station">
                  <div className="time">{bus.departure}</div>
                  <div className="station">{bus.from}</div>
                </div>

                <div className="route-duration-visual">
                  <span className="duration-text"><Clock size={13} /> {bus.duration}</span>
                  <div className="route-line-bar">
                    <span className="line-dot start" />
                    <span className="line-bar" />
                    <span className="line-dot end" />
                  </div>
                  <span className="distance-text">{bus.distance}</span>
                </div>

                <div className="time-station">
                  <div className="time">{bus.arrival}</div>
                  <div className="station">{bus.to}</div>
                </div>

                <div className="schedule-action">
                  <Link to={`/bus/${bus.id}`} className="btn btn-primary book-btn">
                    Book Seats <ArrowRight size={15} />
                  </Link>
                </div>
              </div>

              {bus.stops && (
                <div className="schedule-stops-preview">
                  <span className="stops-title">Key Stops:</span>
                  {bus.stops.map((stop, idx) => (
                    <span key={idx} className="stop-pill">
                      {stop.name} ({stop.time})
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
