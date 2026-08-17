import { useRef, useState } from "react";
import "./OTPBox.css";

export default function OTPBox({ length = 6, onComplete }) {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...values];
    next[idx] = val;
    setValues(next);
    if (val && idx < length - 1) inputsRef.current[idx + 1]?.focus();
    if (next.every((v) => v !== "")) onComplete && onComplete(next.join(""));
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !values[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <div className="otp-box">
      {values.map((val, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="otp-input"
          value={val}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
        />
      ))}
    </div>
  );
}
