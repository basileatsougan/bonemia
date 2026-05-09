import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import "./Register.css";

const COOLDOWN = 60; // secondes

const RegisterConfirm = ({ email }) => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

  const handleResend = async () => {
    setResending(true);
    setResent(false);

    // TODO: appel API réel ici
    await new Promise((resolve) => setTimeout(resolve, 1800));

    setResending(false);
    setResent(true);
    setCountdown(COOLDOWN);

    setTimeout(() => setResent(false), 3000);
  };

  const isDisabled = resending || countdown > 0;

  return (
    <div className="rg-page">
      <div className="rg-card rg-card--confirm">

        <div className="rg-confirm__icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="#FFF4F0"/>
            <path d="M10 16C10 14.895 10.895 14 12 14H36C37.105 14 38 14.895 38 16V32C38 33.105 37.105 34 36 34H12C10.895 34 10 33.105 10 32V16Z" stroke="#FF5C1A" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M10 16L24 26L38 16" stroke="#FF5C1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="rg-title">{t("auth.register.confirm_title")}</h1>

        <p className="rg-confirm__text">
          {t("auth.register.confirm_text")}{" "}
          <strong className="rg-confirm__email">{email}</strong>
          {". "}{t("auth.register.confirm_text2")}
        </p>

        <p className="rg-confirm__hint">{t("auth.register.confirm_hint")}</p>

        {/* Resend */}
        <button
          className="rg-btn-resend"
          onClick={handleResend}
          disabled={isDisabled}
        >
          {resending ? (
            <span className="rg-spinner rg-spinner--primary" />
          ) : resent ? (
            t("auth.register.resent")
          ) : countdown > 0 ? (
            t("auth.register.resend_countdown", { s: countdown })
          ) : (
            t("auth.register.resend")
          )}
        </button>

        <a href={`/${lang || "fr"}/login`} className="rg-btn-submit rg-btn-submit--outline">
          {t("auth.register.confirm_cta")}
        </a>

      </div>
    </div>
  );
};

export default RegisterConfirm;