import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import "./FeaturedSubscriptions.css";

import netflixLogo from "/netflixlogo.png";
import spotifyLogo from "/spotifylogo.png";
import chatgptLogo from "/gptlogo.png";

const plans = [
  { logo: netflixLogo, alt: "Netflix", key: "netflix_premium" },
  { logo: spotifyLogo, alt: "Spotify", key: "spotify_famille" },
  { logo: chatgptLogo, alt: "ChatGPT", key: "chatgpt_plus"    },
  { logo: netflixLogo, alt: "Netflix", key: "netflix_premium" },
  { logo: spotifyLogo, alt: "Spotify", key: "spotify_famille" },
  { logo: chatgptLogo, alt: "ChatGPT", key: "chatgpt_plus"    },
];

const FeaturedSubscriptions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();

  const handleSeeAll = () => navigate(`/${lang || "fr"}/abonnements`);
  const handleAccess = (key) => navigate(`/${lang || "fr"}/abonnements/${key}`);

  return (
    <section className="fs-section">
      <div className="fs-container container">

        <div className="fs-badge">{t("fs.badge")}</div>

        <h2 className="fs-title">
          {t("fs.title_line1")}{" "}
          <span className="fs-title__accent">{t("fs.title_accent")}</span>{" "}
          {t("fs.title_line2")}
          <br />
          {t("fs.title_line3")}
        </h2>

        <div className="fs-grid">
          {plans.map((plan, i) => (
            <div className="fs-card" key={i}>
              <div className="fs-card__logo">
                <img src={plan.logo} alt={plan.alt} />
              </div>
              <div className="fs-card__meta">
                <span className="fs-card__category">{t(`fs.plans.${plan.key}.category`)}</span>
                <span className="fs-card__badge">{t(`fs.plans.${plan.key}.badge`)}</span>
              </div>
              <h3 className="fs-card__name">{t(`fs.plans.${plan.key}.name`)}</h3>
              <p className="fs-card__desc">{t(`fs.plans.${plan.key}.desc`)}</p>
              <div className="fs-card__price">
                <span className="fs-card__price-current">{t(`fs.plans.${plan.key}.price`)}</span>
                <span className="fs-card__price-original">{t(`fs.plans.${plan.key}.original`)}</span>
                <span className="fs-card__price-period">{t(`fs.plans.${plan.key}.period`)}</span>
              </div>
              <div
                className="fs-card__cta"
                onClick={() => handleAccess(plan.key)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleAccess(plan.key)}
              >
                {t("fs.card_cta")} →
              </div>
            </div>
          ))}
        </div>

        <div className="fs-cta-wrap">
          <button className="btn-primary" onClick={handleSeeAll}>
            {t("fs.cta")}
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturedSubscriptions;