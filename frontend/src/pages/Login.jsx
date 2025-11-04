// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import {
  FiPhone,
  FiLock,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
} from "react-icons/fi";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, requestCode, verifyCode } = useAuth();

  useEffect(() => {
    setIsPhoneValid(/^05\d{8}$/.test(phone));
  }, [phone]);

  useEffect(() => {
    setIsCodeValid(/^\d{4}$/.test(code));
  }, [code]);

  const formatPhone = (phone) => phone.replace(/^0/, "+972");

  const submitPhone = async (e) => {
    e.preventDefault();
    if (!isPhoneValid) {
      setStatus("error");
      return;
    }
    setLoading(true);
    setStatus("loading");

    try {
      await requestCode(formatPhone(phone));
      setStatus("success");
      setStep(2);
      setCode("");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async (e) => {
    e.preventDefault();
    if (!isCodeValid) {
      setStatus("error");
      return;
    }
    setLoading(true);
    setStatus("loading");

    try {
      const token = await verifyCode(formatPhone(phone), code);
      if (token) {
        login(token);
        setStatus("success");
        navigate("/");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const IconDisplay = () => {
    switch (status) {
      case "loading":
        return <FiLoader className="icon spin" />;
      case "success":
        return <FiCheckCircle className="icon success" />;
      case "error":
        return <FiXCircle className="icon error" />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      {step === 1 && (
        <form className="form" onSubmit={submitPhone} noValidate>
          <div className={`input-group ${!isPhoneValid && phone ? "error" : ""}`}>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              inputMode="numeric"
              required
              autoFocus
              autoComplete="tel"
            />
            <label htmlFor="phone">מספר טלפון</label>
            <FiPhone className="input-icon" />
            <div className="status-icon">{IconDisplay()}</div>
          </div>
          <button disabled={!isPhoneValid || loading} className={loading ? "loading" : ""}>
            {loading ? <FiLoader className="btn-icon spin" /> : "שלח קוד"}
          </button>
          <div className="footer">By SmartCo</div>
        </form>
      )}

      {step === 2 && (
        <form className="form" onSubmit={submitCode} noValidate>
          <div className={`input-group ${!isCodeValid && code ? "error" : ""}`}>
            <input
              type="tel"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
              maxLength={4}
              inputMode="numeric"
              required
              autoFocus
              autoComplete="one-time-code"
            />
            <label htmlFor="code">קוד אימות</label>
            <FiLock className="input-icon" />
            <div className="status-icon">{IconDisplay()}</div>
          </div>
          <button disabled={!isCodeValid || loading} className={loading ? "loading" : ""}>
            {loading ? <FiLoader className="btn-icon spin" /> : "אמת קוד"}
          </button>
          <div
            className="footer link"
            onClick={() => {
              setStep(1);
              setStatus(null);
              setCode("");
            }}
          >
            חזור להזנת טלפון
          </div>
        </form>
      )}
    </div>
  );
}
