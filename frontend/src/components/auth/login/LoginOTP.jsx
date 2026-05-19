import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";
import { useAuth } from "../../../contexts/AuthContext";
import "./Login.css";

const COOLDOWN = 60;
const OTP_LENGTH = 6;

const LoginOTP = ({ email, onBack }) => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);  // change COOLDOWN to 0
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const inputsRef = useRef([]);

  // Countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Focus premier champ au montage
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError(t("auth.login.otp_incomplete"));
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/jwt/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email, 
          code: code 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code) {
          setError(data.code[0] || "Code invalide");
        } else if (data.detail) {
          setError("Email ou code incorrect");
        } else {
          setError(t("auth.register.error_generic"));
        }
        setLoading(false);
        return;
      }

      // Stocker les tokens
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      // Récupérer l'utilisateur connecté
      await fetchUser();

      setLoading(false);
      navigate(`/${lang || "fr"}`);
      
    } catch (err) {
      console.error('OTP login error:', err);
      setError(t("auth.register.error_network"));
      setLoading(false);
    }
  };

  const handleResend = async () => {
    console.log("Renvoyer clique pour", email);  // log pour debug
    setResending(true);
    setResent(false);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/resend_code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      if (!response.ok) {
        console.error('Erreur renvoi code');
      }
    } catch (err) {
      console.error('Resend error:', err);
    }

    setResending(false);
    setResent(true);
    setCountdown(COOLDOWN);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
    setTimeout(() => setResent(false), 3000);
  };

  const isDisabled = resending || countdown > 0;

  return (
    <div className="lg-page">
      <div className="lg-card">

        <button className="lg-back" onClick={onBack} disabled={loading}>
          ← {t("auth.back")}
        </button>

        <div className="lg-otp__icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="#FFF4F0"/>
            <rect x="13" y="20" width="22" height="16" rx="2" stroke="#FF5C1A" strokeWidth="1.8"/>
            <path d="M17 20V16C17 13.239 19.239 11 22 11H26C28.761 11 31 13.239 31 16V20" stroke="#FF5C1A" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="24" cy="28" r="2" fill="#FF5C1A"/>
          </svg>
        </div>

        <h1 className="lg-title">{t("auth.login.otp_title")}</h1>
        <p className="lg-subtitle">
          {t("auth.login.otp_subtitle")}{" "}
          <strong className="lg-otp__email">{email}</strong>
        </p>

        <div className="lg-otp__fields" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              className={`lg-otp__input ${error ? "lg-otp__input--error" : ""} ${digit ? "lg-otp__input--filled" : ""}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={loading}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>

        {error && <span className="lg-field__error">{error}</span>}

        <button
          className="lg-btn-submit"
          onClick={handleSubmit}
          disabled={loading || otp.join("").length < OTP_LENGTH}
        >
          {loading ? <span className="lg-spinner" /> : t("auth.login.otp_cta")}
        </button>

        <button
          className="lg-btn-resend"
          onClick={handleResend}
          disabled={isDisabled}
        >
          {resending ? (
            <span className="lg-spinner lg-spinner--primary" />
          ) : resent ? (
            t("auth.login.resent")
          ) : countdown > 0 ? (
            t("auth.login.resend_countdown", { s: countdown })
          ) : (
            t("auth.login.resend")
          )}
        </button>

      </div>
    </div>
  );
};

export default LoginOTP;