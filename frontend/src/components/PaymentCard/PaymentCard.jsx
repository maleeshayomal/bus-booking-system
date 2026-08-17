import { useState } from "react";
import "./PaymentCard.css";

const methods = [
  { id: "card", label: "Card", icon: "💳" },
  { id: "genie", label: "Genie", icon: "🧞" },
  { id: "ezcash", label: "EzCash", icon: "📱" },
];

export default function PaymentCard({ amount, onPay, loading }) {
  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  return (
    <div className="payment-card card">
      <h3>Payment Method</h3>
      <div className="payment-methods">
        {methods.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`payment-method ${method === m.id ? "active" : ""}`}
            onClick={() => setMethod(m.id)}
          >
            <span>{m.icon}</span> {m.label}
          </button>
        ))}
      </div>

      {method === "card" && (
        <div className="payment-form">
          <label>Card Number</label>
          <input
            type="text"
            placeholder="4242 4242 4242 4242"
            value={card.number}
            onChange={(e) => setCard({ ...card, number: e.target.value })}
          />
          <label>Cardholder Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
          />
          <div className="payment-form-row">
            <div>
              <label>Expiry</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={(e) => setCard({ ...card, expiry: e.target.value })}
              />
            </div>
            <div>
              <label>CVV</label>
              <input
                type="text"
                placeholder="123"
                value={card.cvv}
                onChange={(e) => setCard({ ...card, cvv: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {method !== "card" && (
        <div className="payment-redirect">
          You'll be redirected to {methods.find((m) => m.id === method).label} to complete payment.
        </div>
      )}

      <button className="btn btn-primary btn-block" disabled={loading} onClick={() => onPay(method)}>
        {loading ? "Processing..." : `Pay LKR ${amount.toLocaleString()}`}
      </button>
    </div>
  );
}
