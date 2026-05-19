import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";
import "./SubscriptionsList.css";

const FILTERS = ["all", "streaming", "musique", "ia", "design", "productivite", "jeux", "autre"];

const getCategoryName = (category) => {
  switch(category) {
    case "streaming": return "Streaming";
    case "musique": return "Musique";
    case "ia": return "Intelligence Artificielle";
    case "design": return "Design";
    case "productivite": return "Productivité";
    case "jeux": return "Jeux Vidéo";
    case "autre": return "Autre";
    default: return "";
  }
};

const SubscriptionsList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/subscriptions/`);
        if (!response.ok) throw new Error("Erreur chargement");
        const data = await response.json();
        setSubscriptions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  const filtered = activeFilter === "all"
    ? subscriptions
    : subscriptions.filter((sub) => sub.category === activeFilter);

  // Utiliser le slug au lieu de l'id
  const handleAccess = (slug) => {
    navigate(`/${lang || "fr"}/abonnements/${slug}`);
  };

  if (loading) {
    return (
      <section className="sl-section">
        <div className="sl-container container">
          <div className="sl-loading">Chargement des abonnements...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="sl-section">
        <div className="sl-container container">
          <div className="sl-error">Erreur: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="sl-section">
      <div className="sl-container container">

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

        <div className="sl-grid">
          {filtered.length === 0 ? (
            <div className="sl-empty">
              <p className="sl-empty__message">
                Aucun abonnement disponible dans cette catégorie pour le moment.
              </p>
            </div>
          ) : (
            filtered.map((sub) => (
              <div className="sl-card" key={sub.id}>

                <div className="sl-card__logo">
                  {sub.image ? (
                    <img src={sub.image} alt={sub.name} />
                  ) : (
                    <div className="sl-card__logo-placeholder">{sub.name.charAt(0)}</div>
                  )}
                </div>

                <div className="sl-card__meta">
                  <span className="sl-card__category">{getCategoryName(sub.category)}</span>
                  {sub.discount_percentage > 0 && (
                    <span className="sl-card__badge">−{sub.discount_percentage}% économie</span>
                  )}
                </div>

                <h3 className="sl-card__name">{sub.name}</h3>
                <p className="sl-card__desc">{sub.description || `Abonnez-vous à ${sub.name} et économisez chaque mois.`}</p>

                <div className="sl-card__price">
                  <span className="sl-card__price-current">{sub.price_cfa} CFA</span>
                  {sub.original_price_cfa && (
                    <span className="sl-card__price-original">{sub.original_price_cfa} CFA</span>
                  )}
                  <span className="sl-card__price-period">/ {sub.period === "monthly" ? "mois" : "an"}</span>
                </div>

                <button
                  type="button"
                  className="sl-card__cta"
                  onClick={() => handleAccess(sub.slug)}
                >
                  {t("sp.card_cta")} →
                </button>

              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default SubscriptionsList;