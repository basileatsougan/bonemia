import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../../../config/api";
import "./Register.css";

const RegisterEmail = ({ onSubmit, onBack }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async () => {
    if (!validate(email)) {
      setError(t("auth.register.email_invalid"));
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.email && data.email[0].includes('already exists')) {
          setError(t("auth.register.email_exists"));
        } else {
          setError(t("auth.register.error_generic"));
        }
        setLoading(false);
        return;
      }

      setLoading(false);
      onSubmit(email);
      
    } catch (err) {
      console.error('Register error:', err);
      setError(t("auth.register.error_network"));
      setLoading(false);
    }
  };

  return (
    <div className="rg-page">
      <div className="rg-card">

        <button className="rg-back" onClick={onBack} disabled={loading}>
          ← {t("auth.back")}
        </button>

        <h1 className="rg-title">{t("auth.register.email_title")}</h1>
        <p className="rg-subtitle">{t("auth.register.email_subtitle")}</p>

        <div className="rg-field">
          <label className="rg-field__label">{t("auth.register.email_label")}</label>
          <input
            className={`rg-field__input ${error ? "rg-field__input--error" : ""}`}
            type="email"
            placeholder={t("auth.register.email_placeholder")}
            value={email}
            autoComplete="on"
            disabled={loading}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {error && <span className="rg-field__error">{error}</span>}
        </div>

        <button
          className="rg-btn-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="rg-spinner" />
          ) : (
            t("auth.register.email_cta")
          )}
        </button>

      </div>
    </div>
  );
};

export default RegisterEmail;