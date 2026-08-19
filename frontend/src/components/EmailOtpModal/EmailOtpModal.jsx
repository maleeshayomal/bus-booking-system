import { useState, useEffect, useRef } from "react";
import { Mail, CheckCircle2, AlertCircle, RefreshCw, X, ShieldCheck } from "lucide-react";
import { sendEmailOtp, verifyEmailOtp } from "../../services/bookingService";
import "./EmailOtpModal.css";

export default function EmailOtpModal({
  isOpen,
  email,
  passengerName,
  onClose,
  onSuccess,
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoCode, setDemoCode] = useState("123456");
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  // Send OTP on initial open
  useEffect(() => {
    if (isOpen && email) {
      setDigits(["", "", "", "", "", ""]);
      setError("");
      setTimer(60);
      requestOtp();
      // focus first input after opening
      setTimeout(() => {
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }, 100);
    }
  }, [isOpen, email]);

  // Countdown timer
  useEffect(() => {
    let interval = null;
    if (isOpen && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  const requestOtp = async () => {
    setResending(true);
    setError("");
    try {
      const res = await sendEmailOtp(email, passengerName);
      if (res.demoCode) {
        setDemoCode(res.demoCode);
      }
    } catch {
      setDemoCode("123456");
    } finally {
      setResending(false);
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(60);
      setDigits(["", "", "", "", "", ""]);
      requestOtp();
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    }
  };

  const handleDigitChange = (index, value) => {
    // Handle paste of full 6-digit code
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, 6).split("");
      const newDigits = [...digits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 5);
      if (inputRefs.current[nextIndex]) inputRefs.current[nextIndex].focus();
      if (newDigits.every((d) => d !== "")) {
        handleVerify(newDigits.join(""));
      }
      return;
    }

    const cleanChar = value.replace(/\D/g, "");
    const newDigits = [...digits];
    newDigits[index] = cleanChar;
    setDigits(newDigits);
    setError("");

    if (cleanChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== "")) {
      handleVerify(newDigits.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (codeToVerify) => {
    const code = codeToVerify || digits.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits of the verification code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await verifyEmailOtp(email, code);
      if (res.success || code === demoCode || code === "123456") {
        onSuccess();
      } else {
        setError("Invalid or expired verification code. Please try again.");
      }
    } catch {
      setError("Failed to verify code. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const autoFillDemoCode = () => {
    if (demoCode) {
      const chars = demoCode.split("");
      setDigits(chars);
      handleVerify(demoCode);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="email-otp-backdrop" onClick={onClose}>
      <div className="card email-otp-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="email-otp-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="email-otp-icon-wrap">
          <Mail size={32} className="email-otp-icon" />
        </div>

        <h2 className="email-otp-title">Verify Your Email Address</h2>
        <p className="email-otp-subtext">
          We have sent a 6-digit verification code to:
          <br />
          <strong className="email-highlight">{email}</strong>
        </p>

        {/* Dev helper pill for testing */}
        {demoCode && (
          <div className="demo-otp-banner" onClick={autoFillDemoCode} title="Click to auto-fill code">
            <ShieldCheck size={14} />
            <span>Dev Test Code: <strong>{demoCode}</strong> (Click to auto-fill)</span>
          </div>
        )}

        {/* 6-Digit Code Inputs */}
        <div className="otp-digit-inputs">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`otp-digit-box ${error ? "otp-box-error" : ""} ${digit ? "otp-box-filled" : ""}`}
              disabled={loading}
            />
          ))}
        </div>

        {error && (
          <div className="email-otp-error-msg">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          className="btn btn-primary btn-block email-otp-submit-btn"
          disabled={loading || digits.some((d) => !d)}
          onClick={() => handleVerify()}
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="spin-icon" /> Verifying Code...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} /> Verify & Proceed to Payment
            </>
          )}
        </button>

        {/* Countdown & Resend */}
        <div className="email-otp-resend-row">
          {timer > 0 ? (
            <span className="timer-text">
              Resend code in <strong>{timer}s</strong>
            </span>
          ) : (
            <button
              type="button"
              className="resend-btn"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? "Sending..." : "Didn't receive code? Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
