import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "./AlreadyLoggedIn.css";

const AlreadyLoggedIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { user, logout } = useAuth();
  const token = localStorage.getItem('access_token');

  // Modifier l'URL pour inclure le token comme un hash (invisible pour l'utilisateur moyen)
  useEffect(() => {
    if (token) {
      // Utiliser le hash de l'URL (ce qui est après #)
      // Le hash n'est pas envoyé au serveur et reste dans le navigateur
      window.location.hash = token;
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate(`/${lang || "fr"}`);
  };

  const handleGoHome = () => {
    navigate(`/${lang || "fr"}`);
  };

  return (
    <div className="ali-page">
      <div className="ali-card">
        <div className="ali-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#E8F5E9"/>
            <path d="M16 24L22 30L34 18" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 className="ali-title">{t("auth.already.title")}</h1>
        <p className="ali-subtitle">{t("auth.already.subtitle")}</p>

        <div className="ali-user-info">
          <p className="ali-user-name">{user?.name || user?.email?.split("@")[0]}</p>
          <p className="ali-user-email">{user?.email}</p>
        </div>

        <div className="ali-actions">
          <button className="ali-btn-logout" onClick={handleLogout}>
            {t("navbar.logout")}
          </button>
          <button className="ali-btn-home" onClick={handleGoHome}>
            {t("auth.already.go_home")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlreadyLoggedIn;