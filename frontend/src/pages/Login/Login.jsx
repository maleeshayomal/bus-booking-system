import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ name: "Guest User", phone });
    navigate("/my-bookings");
  };

  return (
    <div className="container login-page">
      <form className="card login-card" onSubmit={handleSubmit}>
        <h1>Login / Signup</h1>
        <p className="page-subtitle">
          No password needed — bus tickets are booked instantly with OTP verification,
          and an account is created for you automatically.
        </p>
        <label>Phone Number</label>
        <input
          type="tel"
          placeholder="+94 77 123 4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary btn-block">Continue</button>
      </form>
    </div>
  );
}
