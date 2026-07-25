import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { API_BASE_URL } from "../../../config/api";
import "./CTAReferral.css";

const CTAReferral = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleGenerateCode = () => {
    const currentLang = lang || "fr";
    if (!isAuthenticated) {
      navigate(`/${currentLang}/auth/login`);
      return;
    }

    setShowCode(true);
    if (!referralData) {
      const token = localStorage.getItem("access_token");
      if (token) {
        setLoading(true);
        fetch(`${API_BASE_URL}/api/referral/my-code/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data) {
              setReferralData(data);
            }
          })
          .catch((err) => console.error("Erreur lors de la génération du code:", err))
          .finally(() => setLoading(false));
      }
    }
  };

  const referralCode =
    referralData?.code ||
    user?.referral_code ||
    user?.invite_code ||
    (user?.email
      ? `BON-${user.email.split("@")[0].toUpperCase().slice(0, 6)}`
      : "BONEMIA10");

  const currentLang = lang || "fr";
  const shareUrl = `${window.location.origin}/${currentLang}?ref=${referralCode}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleShareWhatsApp = () => {
    const message =
      currentLang === "fr"
        ? `🎁 Profite de 10% de réduction sur tes abonnements premium (Netflix, Spotify, ChatGPT...) sur Bonemia avec mon code de parrainage : *${referralCode}* !\n\n👉 Accède à l'offre ici : ${shareUrl}`
        : `🎁 Get a 10% discount on your favorite premium subscriptions (Netflix, Spotify, ChatGPT...) on Bonemia using my referral code: *${referralCode}* !\n\n👉 Check it out here: ${shareUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="cta-referral">
      <div className="cta-referral__inner container">
        <div className="cta-referral__content">
          <div className="cta-referral__badge">
            <svg
              className="cta-referral__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 12 20 22 4 22 4 12" />
              <rect x="2" y="7" width="20" height="5" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
            <span>{t("cta_referral.badge", "Programme de parrainage")}</span>
          </div>

          <h2 className="cta-referral__title">
            {t("cta_referral.title", "Parrainez vos proches & économisez ensemble !")}
          </h2>

          <p className="cta-referral__sub">
            {t(
              "cta_referral.sub",
              "Offrez 10 % de réduction à vos amis sur leur premier abonnement. En retour, recevez 10 % de réduction (ou 1 000 FCFA de crédit) sur votre prochain renouvellement dès leur inscription !"
            )}
          </p>

          <div className="cta-referral__benefits">
            <div className="cta-referral__benefit-item">
              <span className="cta-referral__benefit-pill">🎁 Filleul</span>
              <span className="cta-referral__benefit-text">
                {t("cta_referral.benefit_friend", "−10% pour votre ami")}
              </span>
            </div>
            <div className="cta-referral__benefit-item">
              <span className="cta-referral__benefit-pill cta-referral__benefit-pill--owner">
                ⭐ Parrain
              </span>
              <span className="cta-referral__benefit-text">
                {t("cta_referral.benefit_owner", "−10% ou 1 000 FCFA pour vous")}
              </span>
            </div>
          </div>
        </div>

        <div className="cta-referral__action">
          {isAuthenticated && showCode ? (
            <div className="cta-referral__card">
              <div className="cta-referral__card-header">
                <span className="cta-referral__code-label">
                  {t("cta_referral.your_code", "Votre code de parrainage")}
                </span>
                {referralData && referralData.total_referrals > 0 && (
                  <span className="cta-referral__stats-pill">
                    👥 {referralData.total_referrals} invité(s)
                  </span>
                )}
              </div>

              <div className="cta-referral__code-box">
                <span className="cta-referral__code-value">
                  {loading ? "..." : referralCode}
                </span>
                <button
                  type="button"
                  className={`cta-referral__copy-btn ${copied ? "copied" : ""}`}
                  onClick={handleCopyCode}
                  title={t("cta_referral.copy_code", "Copier le code")}
                >
                  {copied ? (
                    <>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{t("cta_referral.copied", "Copié !")}</span>
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      <span>{t("cta_referral.copy_code", "Copier")}</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                className="btn-whatsapp"
                onClick={handleShareWhatsApp}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>{t("cta_referral.share_whatsapp", "Partager sur WhatsApp")}</span>
              </button>
            </div>
          ) : (
            <div className="cta-referral__card cta-referral__card--guest">
              <div className="cta-referral__code-preview">
                <span className="cta-referral__code-preview-text">OFFRE-10%</span>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={handleGenerateCode}
              >
                {t("cta_referral.generate_code", "Générer mon code de parrainage")}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTAReferral;
