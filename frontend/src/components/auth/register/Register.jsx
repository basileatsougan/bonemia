import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import "./Register.css";
import RegisterEmail from "./RegisterEmail";
import RegisterConfirm from "./RegisterConfirm";

const Register = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [step, setStep] = useState("choice"); // "choice" | "email" | "confirm"
  const [email, setEmail] = useState("");

  const handleGoogleRegister = () => {
    // TODO: connecter Google OAuth
    console.log("Google OAuth");
  };

  const handleEmailSubmit = (submittedEmail) => {
    setEmail(submittedEmail);
    setStep("confirm");
  };

  if (step === "email") {
    return (
      <RegisterEmail
        onSubmit={handleEmailSubmit}
        onBack={() => setStep("choice")}
      />
    );
  }

  if (step === "confirm") {
    return <RegisterConfirm email={email} />;
  }

  return (
    <div className="rg-page">
      <div className="rg-card">

        {/* Logo */}
        <a href={`/${lang || "fr"}`} className="rg-logo">
          <img src="/bonemialogo.png" alt="Bonemia" className="rg-logo__img" />
        </a>

        <h1 className="rg-title">{t("auth.register.title")}</h1>
        <p className="rg-subtitle">{t("auth.register.subtitle")}</p>

        {/* Google */}
        <button className="rg-btn-google" onClick={handleGoogleRegister}>
          <img src="/Google__G__logo.svg.png" alt="Google" className="rg-btn-google__icon" />
          {t("auth.register.google")}
        </button>

        {/* Divider */}
        <div className="rg-divider">
          <span className="rg-divider__line" />
          <span className="rg-divider__text">{t("auth.register.or")}</span>
          <span className="rg-divider__line" />
        </div>

        {/* Email */}
        <button className="rg-btn-email" onClick={() => setStep("email")}>
          {t("auth.register.email")}
        </button>

        {/* Login link */}
        <p className="rg-login-link">
          {t("auth.register.already")}{" "}
          <a href={`/${lang || "fr"}/auth/login`} className="rg-login-link__a">
            {t("auth.register.login")}
          </a>
        </p>

      </div>
    </div>
  );
};

export default Register;