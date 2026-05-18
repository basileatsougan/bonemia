import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";
import LoginOTP from "./LoginOTP";
import "./Login.css";

const Login = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async () => {
    if (!validate(email)) {
      setError(t("auth.login.email_invalid"));
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Appel API pour envoyer le code OTP
      const response = await fetch(`${API_BASE_URL}/auth/users/resend_code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Erreur lors de l'envoi du code");
        setLoading(false);
        return;
      }

      // Succès : passer à l'écran OTP
      setLoading(false);
      setStep("otp");
    } catch (err) {
      console.error('Login error:', err);
      setError(t("auth.register.error_network"));
      setLoading(false);
    }
  };

  if (step === "otp") {
    return <LoginOTP email={email} onBack={() => setStep("email")} />;
  }

  return (
    <div className="lg-page">
      <div className="lg-card">
        <a href={`/${lang || "fr"}`} className="lg-logo">
          <img src="/bonemialogo.png" alt="Bonemia" className="lg-logo__img" />
        </a>

        <h1 className="lg-title">{t("auth.login.title")}</h1>
        <p className="lg-subtitle">{t("auth.login.subtitle")}</p>

        <div className="lg-field">
          <label className="lg-field__label">{t("auth.login.email_label")}</label>
          <input
            className={`lg-field__input ${error ? "lg-field__input--error" : ""}`}
            type="email"
            placeholder={t("auth.login.email_placeholder")}
            value={email}
            disabled={loading}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {error && <span className="lg-field__error">{error}</span>}
        </div>

        <button
          className="lg-btn-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <span className="lg-spinner" /> : t("auth.login.cta")}
        </button>

        <p className="lg-register-link">
          {t("auth.login.no_account")}{" "}
          <a href={`/${lang || "fr"}/auth/register`} className="lg-register-link__a">
            {t("auth.login.register")}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;