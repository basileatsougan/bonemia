import React from "react";
import { useTranslation } from "react-i18next";
import "./HowItWorks.css";

/* ── Illustration étape 1 : Email de validation ── */
const IlluAccount = () => (
  <div className="hiw-illu">
    <div className="hiw-mock">
      <div className="hiw-mock__bar">
        <span className="hiw-mock__dot" style={{ background: "#ff5f57" }} />
        <span className="hiw-mock__dot" style={{ background: "#ffbd2e" }} />
        <span className="hiw-mock__dot" style={{ background: "#28c840" }} />
        <span className="hiw-mock__bartitle">Boîte de réception</span>
      </div>
      <div className="hiw-mock__body hiw-mock__body--email">
        <div className="hiw-mock__email-header">
          <div className="hiw-mock__email-from">
            <span className="hiw-mock__email-avatar">B</span>
            <div>
              <div className="hiw-mock__email-sender">Bonemia</div>
              <div className="hiw-mock__email-addr">noreply@bonemia.com</div>
            </div>
          </div>
          <span className="hiw-mock__email-time">Il y a 1 min</span>
        </div>
        <div className="hiw-mock__email-subject">Confirmez votre adresse email</div>
        <div className="hiw-mock__email-body">
          Cliquez sur le lien ci-dessous pour activer votre compte Bonemia.
        </div>
        <div className="hiw-mock__email-btn">✓ Valider mon compte</div>
        <div className="hiw-mock__email-note">Lien valable 24h</div>
      </div>
    </div>
  </div>
);

/* ── Illustration étape 2 : Réserver un abonnement ── */
const IlluChoose = () => (
  <div className="hiw-illu">
    <div className="hiw-mock">
      <div className="hiw-mock__bar">
        <span className="hiw-mock__dot" style={{ background: "#ff5f57" }} />
        <span className="hiw-mock__dot" style={{ background: "#ffbd2e" }} />
        <span className="hiw-mock__dot" style={{ background: "#28c840" }} />
        <span className="hiw-mock__bartitle">Réserver un accès</span>
      </div>
      <div className="hiw-mock__body hiw-mock__body--form">
        {/* Service sélectionné */}
        <div className="hiw-mock__selected">
          <span className="hiw-mock__selected-dot" style={{ background: "#e50914" }} />
          <span className="hiw-mock__selected-name">Netflix Premium</span>
          <span className="hiw-mock__selected-badge">−75%</span>
          <span className="hiw-mock__selected-price">3 750 F</span>
        </div>
        {/* Champ nom */}
        <div className="hiw-mock__field">
          <div className="hiw-mock__flabel">Nom complet</div>
          <div className="hiw-mock__finput">Kofi Mensah</div>
        </div>
        {/* Champ whatsapp */}
        <div className="hiw-mock__field">
          <div className="hiw-mock__flabel">Numéro WhatsApp</div>
          <div className="hiw-mock__finput">+228 99 99 99 99</div>
        </div>
        {/* Durée */}
        <div className="hiw-mock__field">
          <div className="hiw-mock__flabel">Durée</div>
          <div className="hiw-mock__months">
            {["1 mois", "2 mois", "3 mois"].map((m, i) => (
              <span key={i} className={`hiw-mock__month${i === 0 ? " hiw-mock__month--active" : ""}`}>{m}</span>
            ))}
          </div>
        </div>
        <div className="hiw-mock__cta">Envoyer ma demande →</div>
      </div>
    </div>
  </div>
);

/* ── Illustration étape 3 : Paiement + accès WhatsApp ── */
const IlluAccess = () => (
  <div className="hiw-illu">
    <div className="hiw-mock">
      <div className="hiw-mock__bar hiw-mock__bar--wa">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.137.564 4.14 1.542 5.873L0 24l6.327-1.617A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.014-1.374l-.36-.214-3.754.96.998-3.648-.235-.374A9.818 9.818 0 1 1 12 21.818z"/>
        </svg>
        <span className="hiw-mock__wa-name">Bonemia Support</span>
        <span className="hiw-mock__wa-status">● En ligne</span>
      </div>
      <div className="hiw-mock__body hiw-mock__body--chat">
        <div className="hiw-mock__bubble hiw-mock__bubble--in">
          Bonjour ! Nous avons bien reçu votre demande Netflix 🎉
        </div>
        <div className="hiw-mock__bubble hiw-mock__bubble--in">
          Voici comment procéder au paiement :<br />
          <strong>Mobile Money : +228 XX XX XX XX</strong>
        </div>
        <div className="hiw-mock__bubble hiw-mock__bubble--out">
          Paiement effectué ✅
        </div>
        <div className="hiw-mock__bubble hiw-mock__bubble--in">
          Accès confirmé 🔑<br />
          <code style={{ fontSize: "8.5px" }}>bonemia@share.com / ••••••••</code>
        </div>
        <div className="hiw-mock__typing">
          <span /><span /><span />
        </div>
      </div>
    </div>
  </div>
);

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
      num: t("how.step_label", "Étape") + " 01",
      illu: <IlluAccount />,
      title: t("how.step1.title", "Créez votre compte"),
      desc: t("how.step1.desc", "Entrez votre email, vous recevez un lien de confirmation. Un clic suffit pour activer votre compte. La connexion se fait ensuite par code OTP envoyé à votre adresse."),
    },
    {
      num: t("how.step_label", "Étape") + " 02",
      illu: <IlluChoose />,
      title: t("how.step2.title", "Choisissez et réservez"),
      desc: t("how.step2.desc", "Parcourez le catalogue, sélectionnez votre abonnement et remplissez le formulaire de réservation avec votre nom et votre numéro WhatsApp."),
    },
    {
      num: t("how.step_label", "Étape") + " 03",
      illu: <IlluAccess />,
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
                <div className="hiw-step__num">{step.num}</div>
                <div className="hiw-step__card">
                  <div className="hiw-step__illu">{step.illu}</div>
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