import React from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Hero.css";

const Hero = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const prefix = `/${lang || "fr"}`;

  return (
    <section className="hero-section">
      <div className="hero-container container">

        {/* Badge */}
        <div className="hero-badge">
          <span className="hero-badge__dot" />
          {t("hero.badge")}
        </div>

        {/* Headline wrapper */}
        <div className="hero-headline-wrapper">

          {/* Icônes flottantes — gauche */}
          <div className="hero-float hero-float--spotify">
            <img src="/spotifyicon.png" alt="Spotify" className="hero-float__icon" />
          </div>
          <div className="hero-float hero-float--canva">
            <img src="/canvaicon.png" alt="Canva" className="hero-float__icon" />
          </div>

          {/* Titre */}
          <h1 className="hero-title">
            {t("hero.title_line1")}
            <img src="/starblack.png" alt="" className="hero-title__star hero-title__star--color" aria-hidden="true" />
            <br />
            <span className="hero-title__accent">
              <img src="/starcolor.png" alt="" className="hero-title__star hero-title__star--inline" aria-hidden="true" />
              {t("hero.title_accent")}
            </span>
            {" "}{t("hero.title_line2")}
          </h1>

          {/* Icônes flottantes — droite */}
          <div className="hero-float hero-float--gpt">
            <img src="/gpticon.png" alt="ChatGPT" className="hero-float__icon" />
          </div>
          <div className="hero-float hero-float--claude">
            <img src="/cluadicon.png" alt="Claude" className="hero-float__icon" />
          </div>
        </div>

        {/* Sous-titre */}
        <p className="hero-subtitle">{t("hero.subtitle")}</p>

        {/* CTA */}
        <div className="hero-cta">
          <Link to={`${prefix}/abonnements`} className="hero-cta__btn btn-primary">
            {t("hero.cta")}
          </Link>
        </div>
      </div>

      {/* Barre de stats */}
      <div className="hero-stats">
        <div className="hero-stats__item">
          <span className="hero-stats__value">100+</span>
          <span className="hero-stats__label">{t("hero.stats.membres")}</span>
        </div>
        <div className="hero-stats__divider" aria-hidden="true" />
        <div className="hero-stats__item">
          <span className="hero-stats__value">75%</span>
          <span className="hero-stats__label">{t("hero.stats.economie")}</span>
        </div>
        <div className="hero-stats__divider" aria-hidden="true" />
        <div className="hero-stats__item">
          <span className="hero-stats__value">30+</span>
          <span className="hero-stats__label">{t("hero.stats.abonnements")}</span>
        </div>
        <div className="hero-stats__divider" aria-hidden="true" />
        <div className="hero-stats__item">
          <span className="hero-stats__value">24/7</span>
          <span className="hero-stats__label">{t("hero.stats.support")}</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;