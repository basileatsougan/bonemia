import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import LoginOTP from "./LoginOTP";
import "./Login.css";

const Login = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [step, setStep] = useState("email"); // "email" | "otp"
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

    // TODO: appel API réel — envoi OTP
    await new Promise((resolve) => setTimeout(resolve, 1800));

    setLoading(false);
    setStep("otp");
  };

  if (step === "otp") {
    return (
      <LoginOTP
        email={email}
        onBack={() => setStep("email")}
      />
    );
  }

  return (
    <div className="lg-page">
      <div className="lg-card">

        {/* Logo */}
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