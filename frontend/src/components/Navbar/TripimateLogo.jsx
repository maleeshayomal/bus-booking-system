export default function TripimateLogo({ className = "" }) {
  return (
    <div className={`tripimate-logo-container ${className}`}>
      <div className="tripimate-logo-graphic-wrap">
        {/* Stylized Bus Line-Art Illustration */}
        <svg
          className="tripimate-bus-svg"
          viewBox="0 0 160 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Blue Coach Roof and Windshield Contour */}
          <path
            d="M 6 30 C 10 16, 22 7, 44 6 C 68 5, 110 5, 136 11 C 148 14, 154 20, 152 27 C 148 31, 138 33, 126 33"
            stroke="#0284c7"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Blue Windshield & Side Windows */}
          <path
            d="M 40 8 L 34 23 M 57 7 L 54 22 M 78 7 L 76 22 M 99 8 L 98 22 M 120 10 L 118 24"
            stroke="#0284c7"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Lower Speed Wave & Orange Accents */}
          <path
            d="M 4 34 C 12 36, 22 41, 33 41 C 45 41, 52 35, 60 34 C 76 32, 102 38, 132 35 C 146 34, 156 29, 158 24"
            stroke="#f97316"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 8 28 C 5 30, 4 33, 7 35"
            stroke="#f97316"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Wheel Outlines */}
          <circle cx="34" cy="38" r="3.5" stroke="#f97316" strokeWidth="2.2" fill="#ffffff" />
          <circle cx="128" cy="33" r="3.2" stroke="#f97316" strokeWidth="2.2" fill="#ffffff" />
        </svg>

        {/* Brand Text */}
        <div className="tripimate-brand-title">
          <span className="brand-tripi">Tripi</span>
          <span className="brand-mate">mate</span>
        </div>
      </div>
      <div className="tripimate-subtext">Bus Ticket Booking</div>
    </div>
  );
}
