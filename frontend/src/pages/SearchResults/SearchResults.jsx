import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BusCard from "../../components/BusCard/BusCard";
import { BookingContext } from "../../context/BookingContext";
import { searchBuses } from "../../services/busService";
import "./SearchResults.css";

export default function SearchResults() {
  const { booking } = useContext(BookingContext);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    searchBuses(booking.searchParams).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, [booking.searchParams]);

  return (
    <div className="container search-results-page">
      <Link to="/" className="back-link">← Back to Search</Link>
      <h1 className="page-title">
        {booking.searchParams.from} → {booking.searchParams.to}
      </h1>
      <p className="page-subtitle">
        {booking.searchParams.date || "Any date"} · {results.length} buses found
      </p>

      {loading ? (
        <p>Loading buses...</p>
      ) : results.length === 0 ? (
        <div className="card empty-state">
          No buses found for this route. Try a different search.
        </div>
      ) : (
        <div className="bus-grid">
          {results.map((bus) => (
            <BusCard key={bus.id} bus={bus} />
          ))}
        </div>
      )}
    </div>
  );
}
