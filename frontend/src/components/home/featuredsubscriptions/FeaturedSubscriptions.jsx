import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";
import "./FeaturedSubscriptions.css";

const FeaturedSubscriptions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/subscriptions/`);
        if (!response.ok) throw new Error("Erreur chargement");
        const data = await response.json();
        setSubscriptions(data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  const handleSeeAll = () => navigate(`/${lang || "fr"}/abonnements`);
  const handleAccess = (slug) => navigate(`/${lang || "fr"}/abonnements/${slug}`);

  const getCategoryName = (category) => {
    switch(category) {
      case "streaming": return "Streaming";
      case "musique": return "Musique";
      case "ia": return "Intelligence Artificielle";
      case "design": return "Design";
      case "productivite": return "Productivité";
      case "jeux": return "Jeux Vidéo";
      default: return "";
    }
  };

  if (loading) {
    return (
      <section className="fs-section">
        <div className="fs-container container">
          <div className="fs-loading">Chargement...</div>
        </div>
      </section>
    );
  }

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
          {subscriptions.map((sub) => (
            <div className="fs-card" key={sub.id}>
              <div className="fs-card__logo">
                {sub.image ? (
                  <img src={sub.image} alt={sub.name} />
                ) : (
                  <div className="fs-card__logo-placeholder">{sub.name.charAt(0)}</div>
                )}
              </div>
              <div className="fs-card__meta">
                <span className="fs-card__category">{getCategoryName(sub.category)}</span>
                {sub.discount_percentage > 0 && (
                  <span className="fs-card__badge">−{sub.discount_percentage}% économie</span>
                )}
              </div>
              <h3 className="fs-card__name">{sub.name}</h3>
              <p className="fs-card__desc">{sub.description || `Abonnez-vous à ${sub.name} et économisez chaque mois.`}</p>
              <div className="fs-card__price">
                <span className="fs-card__price-current">{sub.price_cfa} CFA</span>
                {sub.original_price_cfa && (
                  <span className="fs-card__price-original">{sub.original_price_cfa} CFA</span>
                )}
                <span className="fs-card__price-period">/ {sub.period === "monthly" ? "mois" : "an"}</span>
              </div>
              <div
                className="fs-card__cta"
                onClick={() => handleAccess(sub.slug)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleAccess(sub.slug)}
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