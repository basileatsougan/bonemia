import React from "react";
import { useTranslation } from "react-i18next";
import "./SubscriptionsHero.css";
import outilsImg from "/outils.png";

const SubscriptionsHero = () => {
  const { t } = useTranslation();

  return (
    <section className="sp-hero-section">
      <div className="sp-hero-container container">
        <div className="sp-hero__content">
          {/* <div className="sp-hero__badge">{t("sp.badge")}</div> */}
          <h1 className="sp-hero__title">
            {t("sp.title_line1")}{" "}
            <span className="sp-hero__title-accent">{t("sp.title_accent")} </span>
            {t("sp.title_line2")}
          </h1>
          <p className="sp-hero__subtitle">{t("sp.subtitle")}</p>
        </div>
        <div className="sp-hero__visual">
          <img src={outilsImg} alt="Services disponibles" />
        </div>
      </div>
    </section>
  );
};

export default SubscriptionsHero;