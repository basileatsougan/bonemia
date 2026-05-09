import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import "./SubscriptionsList.css";

import netflixLogo from "/netflixlogo.png";
import spotifyLogo from "/spotifylogo.png";
import chatgptLogo from "/gptlogo.png";

const plans = [
  { logo: netflixLogo, alt: "Netflix", key: "netflix_premium", category: "streaming" },
  { logo: spotifyLogo, alt: "Spotify", key: "spotify_famille", category: "musique" },
  { logo: chatgptLogo, alt: "ChatGPT", key: "chatgpt_plus",    category: "ia" },
  { logo: netflixLogo, alt: "Netflix", key: "netflix_premium", category: "streaming" },
  { logo: spotifyLogo, alt: "Spotify", key: "spotify_famille", category: "musique" },
  { logo: chatgptLogo, alt: "ChatGPT", key: "chatgpt_plus",    category: "ia" },
  { logo: chatgptLogo, alt: "ChatGPT", key: "chatgpt_plusd",   category: "ia" },
];

const FILTERS = ["all", "streaming", "musique", "ia"];

const SubscriptionsList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activeFilter === "all"
    ? plans
    : plans.filter((p) => p.category === activeFilter);

  const handleAccess = (key) => {
    navigate(`/${lang || "fr"}/abonnements/${key}`);
  };

  return (
    <section className="sl-section">
      <div className="sl-container container">

        {/* Filters */}
        <div className="sl-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`sl-filter-btn ${activeFilter === f ? "sl-filter-btn--active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {t(`sp.filters.${f}`)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="sl-grid">
          {filtered.map((plan, i) => (
            <div className="sl-card" key={i}>

              <div className="sl-card__logo">
                <img src={plan.logo} alt={plan.alt} />
              </div>

              <div className="sl-card__meta">
                <span className="sl-card__category">{t(`sp.plans.${plan.key}.category`)}</span>
                <span className="sl-card__badge">{t(`sp.plans.${plan.key}.badge`)}</span>
              </div>

              <h3 className="sl-card__name">{t(`sp.plans.${plan.key}.name`)}</h3>
              <p className="sl-card__desc">{t(`sp.plans.${plan.key}.desc`)}</p>

              <div className="sl-card__price">
                <span className="sl-card__price-current">{t(`sp.plans.${plan.key}.price`)}</span>
                <span className="sl-card__price-original">{t(`sp.plans.${plan.key}.original`)}</span>
                <span className="sl-card__price-period">{t(`sp.plans.${plan.key}.period`)}</span>
              </div>

              <button
                type="button"
                className="sl-card__cta"
                onClick={() => handleAccess(plan.key)}
              >
                {t("sp.card_cta")} →
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SubscriptionsList;