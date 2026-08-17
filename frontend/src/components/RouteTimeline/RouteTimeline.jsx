import "./RouteTimeline.css";

export default function RouteTimeline({ stops = [] }) {
  return (
    <div className="route-timeline card">
      <h3 className="route-timeline-title">Journey Timeline</h3>
      <ul className="route-timeline-list">
        {stops.map((stop, idx) => (
          <li key={idx} className="route-timeline-item">
            <span
              className={`route-timeline-dot ${idx === 0 ? "start" : idx === stops.length - 1 ? "end" : ""}`}
            />
            <div className="route-timeline-content">
              <div className="route-timeline-name">{stop.name}</div>
              <div className="route-timeline-time">{stop.time}</div>
              {stop.note && <div className="route-timeline-note">{stop.note}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
