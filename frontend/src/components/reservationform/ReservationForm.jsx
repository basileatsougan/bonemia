import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import { API_BASE_URL } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import "react-phone-number-input/style.css";
import "./ReservationForm.css";
import ReservationConfirm from "../reservationconfirm/ReservationConfirm";

const MONTHS = [1, 2, 3, 6, 12];

const ReservationForm = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loadingService, setLoadingService] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/subscriptions/`);
        if (!response.ok) throw new Error("Erreur chargement");
        const data = await response.json();
        const found = data.find(s => s.slug === slug);
        setSubscription(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingService(false);
      }
    };
    if (slug) {
      fetchSubscription();
    } else {
      setLoadingService(false);
    }
  }, [slug]);

  const [form, setForm] = useState({ 
    fullName: user?.name || "", 
    whatsapp: user?.phone_number || "", 
    months: 1,
    promoCode: "" 
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showPromoCode, setShowPromoCode] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        whatsapp: user.phone_number || prev.whatsapp
      }));
    }
  }, [user]);

  if (loadingService) {
    return (
      <section className="rf-section">
        <div className="rf-container container">
          <div className="rf-loading">Chargement...</div>
        </div>
      </section>
    );
  }

  if (!subscription) {
    return (
      <section className="rf-section">
        <div className="rf-container container">
          <div className="rf-error">Service non trouvé</div>
        </div>
      </section>
    );
  }

  const userEmail = user?.email || "";
  const monthlyPrice = parseInt(subscription.price_cfa, 10);
  const isFormValid = form.fullName.trim() !== "" && form.whatsapp !== "";

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = true;
    if (!form.whatsapp) e.whatsapp = true;
    return e;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          name: form.fullName,
          phone_number: form.whatsapp,
          subscription: subscription.id,
          promo_code: form.promoCode || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi");
      }

      // Attendre 3 secondes avant de rediriger
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
      setSent(true);
    }
  };

  if (sent) {
    return (
      <ReservationConfirm
        serviceName={subscription.name}
        months={form.months}
        whatsapp={form.whatsapp}
      />
    );
  }

  const price = monthlyPrice * form.months;
  const monthLabel = form.months === 1
    ? t("reservation.month_singular")
    : t("reservation.month_plural");

  const formatPrice = (p) =>
    new Intl.NumberFormat("fr-TG", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(p);

  return (
    <section className="rf-section">
      <div className="rf-container container">

        <div className="rf-header">
          <button
            type="button"
            className="rf-back-btn"
            onClick={() => navigate(`/${i18n.language}/abonnements`)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {t("navbar.abonnements", "Abonnements")}
          </button>
          <div className="rf-header__badge">{t("reservation.badge")}</div>
          <h1 className="rf-header__title">{t("reservation.title")}</h1>
          <p className="rf-header__sub">{t("reservation.sub")}</p>
        </div>

        <div className="rf-layout">

          <div className="rf-card">

            <div className="rf-field">
              <label className="rf-label">{t("reservation.field_email")}</label>
              <input
                className="rf-input rf-input--disabled"
                type="email"
                value={userEmail || t("reservation.email_placeholder")}
                disabled
              />
              <span className="rf-hint">{t("reservation.email_hint")}</span>
            </div>

            <div className="rf-field">
              <label className="rf-label">
                {t("reservation.field_fullname")}
                <span className="rf-required">*</span>
              </label>
              <input
                className={`rf-input ${errors.fullName ? "rf-input--error" : ""}`}
                type="text"
                placeholder={t("reservation.ph_fullname")}
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                disabled={sending}
              />
              {errors.fullName && (
                <span className="rf-error">{t("reservation.error_required")}</span>
              )}
            </div>

            <div className="rf-field">
              <label className="rf-label">
                {t("reservation.field_whatsapp")}
                <span className="rf-required">*</span>
              </label>
              <div className={`rf-phone-wrapper ${errors.whatsapp ? "rf-phone-wrapper--error" : ""}`}>
                <PhoneInput
                  international
                  defaultCountry="TG"
                  value={form.whatsapp}
                  onChange={(val) => handleChange("whatsapp", val || "")}
                  disabled={sending}
                  className="rf-phone-input"
                />
              </div>
              <span className="rf-hint">{t("reservation.whatsapp_hint")}</span>
              {errors.whatsapp && (
                <span className="rf-error">{t("reservation.error_required")}</span>
              )}
            </div>

            <div className="rf-promo-toggle">
              <button
                type="button"
                className="rf-promo-toggle__btn"
                onClick={() => setShowPromoCode(!showPromoCode)}
                disabled={sending}
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ transform: showPromoCode ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                {t("reservation.toggle_promo_code")}
              </button>
            </div>

            {showPromoCode && (
              <div className="rf-field rf-promo-field">
                <label className="rf-label">{t("reservation.field_promo_code")}</label>
                <input
                  className="rf-input"
                  type="text"
                  placeholder={t("reservation.ph_promo_code")}
                  value={form.promoCode}
                  onChange={(e) => handleChange("promoCode", e.target.value)}
                  disabled={sending}
                />
                <span className="rf-hint">{t("reservation.hint_promo_code")}</span>
              </div>
            )}

            <div className="rf-field">
              <label className="rf-label">{t("reservation.field_months")}</label>
              <div className="rf-months">
                {MONTHS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`rf-month-btn ${form.months === m ? "rf-month-btn--active" : ""}`}
                    onClick={() => handleChange("months", m)}
                    disabled={sending}
                  >
                    {m} {m === 1 ? t("reservation.month_singular") : t("reservation.month_plural")}
                  </button>
                ))}
              </div>
            </div>

            <div className="rf-footer">
              <p className="rf-footer__note">{t("reservation.required_note")}</p>
              <button
                type="button"
                className={`btn-primary rf-submit${!isFormValid || sending ? " rf-submit--disabled" : ""}`}
                onClick={handleSubmit}
                disabled={sending || !isFormValid}
              >
                {sending ? (
                  <>
                    <span className="rf-spinner" />
                    <span style={{ marginLeft: '8px' }}>Envoi en cours...</span>
                  </>
                ) : (
                  t("reservation.submit")
                )}
              </button>
            </div>

          </div>

          <aside className="rf-summary">
            <div className="rf-summary__inner">

              <div className="rf-summary__header">
                <span className="rf-summary__label">{t("reservation.summary_title", "Résumé")}</span>
              </div>

              <div className="rf-summary__row">
                <span className="rf-summary__key">{t("reservation.confirm_service", "Service")}</span>
                <span className="rf-summary__val rf-summary__val--highlight">{subscription.name}</span>
              </div>

              <div className="rf-summary__row">
                <span className="rf-summary__key">{t("reservation.confirm_months", "Durée")}</span>
                <span className="rf-summary__val">{form.months} {monthLabel}</span>
              </div>

              <div className="rf-summary__row">
                <span className="rf-summary__key">{t("reservation.confirm_contact", "WhatsApp")}</span>
                <span className="rf-summary__val">{form.whatsapp || "—"}</span>
              </div>

              {form.promoCode && (
                <div className="rf-summary__row">
                  <span className="rf-summary__key">Code promo</span>
                  <span className="rf-summary__val">{form.promoCode}</span>
                </div>
              )}

              <div className="rf-summary__divider" />

              <div className="rf-summary__price-row">
                <span className="rf-summary__price-label">{t("reservation.summary_total", "Total")}</span>
                <span className="rf-summary__price-value">{formatPrice(price)}</span>
              </div>

              <p className="rf-summary__note">
                {t("reservation.summary_note", "Vous serez contacté via WhatsApp pour confirmer votre réservation.")}
              </p>

              <div className="rf-summary__trust">
                <div className="rf-trust-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span>{t("reservation.trust_secure", "Paiement sécurisé")}</span>
                </div>
                <div className="rf-trust-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{t("reservation.trust_fast", "Activation rapide")}</span>
                </div>
                <div className="rf-trust-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span>{t("reservation.trust_support", "Support WhatsApp")}</span>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </section>
  );
};

export default ReservationForm;