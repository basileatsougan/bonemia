import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import "./CTAPropose.css";
import { useAuth } from "../../../contexts/AuthContext";

const CTAPropose = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { isAuthenticated } = useAuth();

  const handleClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(`/${lang || "fr"}/auth/login`);
    } else {
      navigate(`/${lang || "fr"}/proposer`);
    }
  };

  return (
    <section className="cta-propose">
      <div className="cta-propose__inner container">
        <div className="cta-propose__content">
          <p className="cta-propose__label">{t("cta_propose.label")}</p>
          <h2 className="cta-propose__title">{t("cta_propose.title")}</h2>
          <p className="cta-propose__sub">{t("cta_propose.sub")}</p>
        </div>
        <div className="cta-propose__action">
          <button type="button" className="btn-primary" onClick={handleClick}>
            {t("cta_propose.cta")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTAPropose;