import React from "react";
import { useTranslation } from "react-i18next";
import "./HowItWorks.css";

/* ── Flèche courbe ── */
const CurvedArrow = ({ flip }) => (
  <div className={`hiw-arrow${flip ? " hiw-arrow--flip" : ""}`}>
    <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 42 C30 42, 55 8, 95 8" stroke="#d1d5db" strokeWidth="1.8" strokeDasharray="6 5" fill="none" strokeLinecap="round"/>
      <polyline points="88,4 95,8 88,13" stroke="#d1d5db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  </div>
);

/* ── Composant principal ── */
const HowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    {
      n: "01",
      title: t("how.step1.title", "Créez votre compte"),
      desc: t("how.step1.desc", "Entrez votre email, vous recevez un lien de confirmation. Un clic suffit pour activer votre compte. La connexion se fait ensuite par code OTP envoyé à votre adresse."),
    },
    {
      n: "02",
      title: t("how.step2.title", "Choisissez et réservez"),
      desc: t("how.step2.desc", "Parcourez le catalogue, sélectionnez votre abonnement et remplissez le formulaire de réservation avec votre nom et votre numéro WhatsApp."),
    },
    {
      n: "03",
      title: t("how.step3.title", "Payez et recevez votre accès"),
      desc: t("how.step3.desc", "Notre support vous contacte sur WhatsApp pour finaliser le paiement. Une fois réglé, vous recevez vos identifiants directement dans la conversation."),
    },
  ];

  return (
    <section className="hiw-section" id="comment-ca-marche">
      <div className="hiw-container container">

        <div className="hiw-badge">{t("how.badge", "Comment ça marche")}</div>

        <h2 className="hiw-title">
          {t("how.title_start", "Accédez à vos abonnements en")}{" "}
          <span className="hiw-title__accent">
            {t("how.title_accent", "3 étapes simples")}
          </span>
        </h2>

        <p className="hiw-subtitle">
          {t("how.subtitle", "Pas de carte bancaire complexe. Pas d'attente. Juste votre accès premium.")}
        </p>

        <div className="hiw-grid">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="hiw-step">
                <div className="hiw-step__card">
                  <div className="hiw-step__illu">
                    <span className="hiw-step__big-num">{step.n}</span>
                  </div>
                  <div className="hiw-step__body">
                    <h3 className="hiw-step__title">{step.title}</h3>
                    <p className="hiw-step__desc">{step.desc}</p>
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && <CurvedArrow flip={i % 2 === 1} />}
            </React.Fragment>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;