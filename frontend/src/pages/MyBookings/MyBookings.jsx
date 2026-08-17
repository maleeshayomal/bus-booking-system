import { useEffect, useState } from "react";
import { getMyBookings } from "../../services/bookingService";
import "./MyBookings.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings("guest").then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container my-bookings-page">
      <h1 className="page-title">My Bookings</h1>
      <p className="page-subtitle">Review your booking history and download tickets.</p>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="card empty-state">You have no bookings yet.</div>
      ) : (
        <div className="card bookings-table-wrap">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Passenger</th>
                <th>Route & Time</th>
                <th>Status</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="mono">#{b.id}</td>
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
                  <td><button className="btn btn-outline">Ticket</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
