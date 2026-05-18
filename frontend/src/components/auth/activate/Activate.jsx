import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import "./Activate.css";

const Activate = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const hasActivated = useRef(false);

  useEffect(() => {
    if (hasActivated.current) return;
    hasActivated.current = true;

    const activate = async () => {
      try {
        const response = await fetch(`http://localhost:8000/auth/activate/${token}/`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Compte activé avec succès");
        } else {
          setStatus("error");
          setMessage(data.error || "Lien invalide ou expiré");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Erreur de connexion au serveur");
      }
    };

    if (token) {
      activate();
    } else {
      setStatus("error");
      setMessage("Token manquant");
    }
  }, [token]);

  return (
    <div className="activate-page">
      <div className="activate-card">
        <div className="activate-icon">
          {status === "loading" && (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#FFF4F0"/>
              <circle cx="24" cy="24" r="14" stroke="#FF5C1A" strokeWidth="1.8"/>
              <path d="M24 16V24L28 28" stroke="#FF5C1A" strokeWidth="1.8"/>
            </svg>
          )}
          {status === "success" && (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#E8F5E9"/>
              <path d="M14 24L20 30L34 16" stroke="#4CAF50" strokeWidth="2"/>
            </svg>
          )}
          {status === "error" && (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#FFEBEE"/>
              <circle cx="24" cy="24" r="8" stroke="#F44336" strokeWidth="1.8"/>
              <path d="M24 21V25M24 28V29" stroke="#F44336" strokeWidth="1.8"/>
            </svg>
          )}
        </div>

        <h1 className="activate-title">
          {status === "loading" && "Activation en cours..."}
          {status === "success" && "Compte activé !"}
          {status === "error" && "Erreur d'activation"}
        </h1>

        <p className="activate-subtitle">{message}</p>

        {status !== "loading" && (
          <button 
            className="activate-btn" 
            onClick={() => window.location.href = "http://localhost:5173/fr/auth/login"}
          >
            Aller à la connexion
          </button>
        )}
      </div>
    </div>
  );
};

export default Activate;