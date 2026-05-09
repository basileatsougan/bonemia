import React from "react";
import { useTranslation } from "react-i18next";
import "./HowItWorks.css";

const steps = [
  {
    index: "01",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    arrow: "→",
    titleKey: "how.step1.title",
    descKey: "how.step1.desc",
  },
  {
    index: "02",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    arrow: "→",
    titleKey: "how.step2.title",
    descKey: "how.step2.desc",
  },
  {
    index: "03",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    arrow: "✓",
    titleKey: "how.step3.title",
    descKey: "how.step3.desc",
  },
];

const HowItWorks = () => {
  const { t } = useTranslation();

  return (
    <section className="hiw-section" id="comment-ca-marche">
      <div className="hiw-container container">

        {/* Badge */}
        <div className="hiw-badge">{t("how.badge")}</div>

        {/* Titre */}
        <h2 className="hiw-title">
          {t("how.title_start")}
          <br />
          <span className="hiw-title__accent">{t("how.title_accent")}</span>
          {" "}{t("how.title_end")}
        </h2>

        {/* Cards */}
        <div className="hiw-cards">
          {steps.map((step, i) => (
            <div className="hiw-card" key={i}>
              <div className="hiw-card__header">
                <span className="hiw-card__counter">
                  {step.index} / 03
                </span>
                <span className="hiw-card__arrow">{step.arrow}</span>
              </div>

              <div className="hiw-card__icon">
                {step.icon}
              </div>

              <h3 className="hiw-card__title">{t(step.titleKey)}</h3>
              <p className="hiw-card__desc">{t(step.descKey)}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;