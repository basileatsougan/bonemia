import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import RegisterEmail from "./RegisterEmail";
import RegisterConfirm from "./RegisterConfirm";
import "./Register.css";
import AlreadyLoggedIn from "../alreadyloggedIn/AlreadyLoggedIn";



const Register = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState("choice");
  const [email, setEmail] = useState("");

  // Rediriger si déjà connecté
  if (isAuthenticated) {
    return <AlreadyLoggedIn />;
  }

  const handleGoogleRegister = () => {
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
        <a href={`/${lang || "fr"}`} className="rg-logo">
          <img src="/bonemialogo.png" alt="Bonemia" className="rg-logo__img" />
        </a>

        <h1 className="rg-title">{t("auth.register.title")}</h1>
        <p className="rg-subtitle">{t("auth.register.subtitle")}</p>

        <button className="rg-btn-google" onClick={handleGoogleRegister}>
          <img src="/Google__G__logo.svg.png" alt="Google" className="rg-btn-google__icon" />
          {t("auth.register.google")}
        </button>

        <div className="rg-divider">
          <span className="rg-divider__line" />
          <span className="rg-divider__text">{t("auth.register.or")}</span>
          <span className="rg-divider__line" />
        </div>

        <button className="rg-btn-email" onClick={() => setStep("email")}>
          {t("auth.register.email")}
        </button>

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