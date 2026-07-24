import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./ReservationForm.css";
import ReservationConfirm from "../reservationconfirm/ReservationConfirm";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../config/api";

// Passe à false quand le backend promo est prêt
const USE_MOCK_PROMO = true;

const MOCK_PROMO_CODES = {
  "TEST20":    { valid: true, discount_percentage: 20,  code: "TEST20" },
  "BONEMIA50": { valid: true, discount_percentage: 50,  code: "BONEMIA50" },
  "VIP100":    { valid: true, discount_percentage: 100, code: "VIP100" },
};

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

// console.log("The user info is: ", user);
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
  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState(null);
  const [promoData, setPromoData] = useState(null);

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
    navigate(`/${i18n.language || "fr"}/404`, { replace: true });
    return null;
  }

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

  const validatePromoMock = async (code) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return MOCK_PROMO_CODES[code.toUpperCase()] || { valid: false };
  };

  const validatePromoReal = async (code) => {
    const response = await fetch(`${API_BASE_URL}/api/promo-codes/validate/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return await response.json();
  };

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoStatus('loading');
    try {
      const data = USE_MOCK_PROMO
        ? await validatePromoMock(promoInput.trim())
        : await validatePromoReal(promoInput.trim());

      if (data.valid) {
        setPromoStatus('valid');
        setPromoData(data);
        handleChange("promoCode", data.code);
      } else {
        setPromoStatus('invalid');
        setPromoData(null);
        handleChange("promoCode", "");
      }
    } catch {
      setPromoStatus('invalid');
      setPromoData(null);
    }
  };

  const handlePromoInputChange = (e) => {
    setPromoInput(e.target.value);
    if (promoStatus) {
      setPromoStatus(null);
      setPromoData(null);
      handleChange("promoCode", "");
    }
  };

  const handleRemovePromo = () => {
    setPromoInput("");
    setPromoStatus(null);
    setPromoData(null);
    handleChange("promoCode", "");
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSending(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/inquiries/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.fullName,
          phone_number: form.whatsapp,
          subscription: subscription.id,
          reservation_duration: form.months,
          promo_code: form.promoCode || null,
        }),
      });
      if (!response.ok) throw new Error("Erreur lors de l'envoi");
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
  const discountAmount = promoData ? Math.round(price * promoData.discount_percentage / 100) : 0;
  const finalPrice = price - discountAmount;

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

            <div className="rf-footer rf-footer--desktop">
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
                  <div className="rf-summary__promo-row">
                    <input
                      className={`rf-input${promoStatus === 'invalid' ? ' rf-input--error' : ''}`}
                      type="text"
                      placeholder={t("reservation.ph_promo_code")}
                      value={promoInput}
                      onChange={handlePromoInputChange}
                      disabled={sending || promoStatus === 'valid'}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                      autoFocus
                    />
                    {promoStatus === 'valid' ? (
                      <button
                        type="button"
                        className="rf-summary__promo-btn rf-summary__promo-btn--remove"
                        onClick={handleRemovePromo}
                        disabled={sending}
                      >
                        ✕
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="rf-summary__promo-btn"
                        onClick={handleApplyPromo}
                        disabled={sending || promoStatus === 'loading' || !promoInput.trim()}
                      >
                        {promoStatus === 'loading'
                          ? <span className="rf-spinner rf-spinner--dark" />
                          : t("reservation.apply_promo", "Appliquer")}
                      </button>
                    )}
                  </div>
                  {promoStatus === 'invalid' && (
                    <span className="rf-error">{t("reservation.promo_invalid", "Code invalide ou expiré")}</span>
                  )}
                  {promoStatus === 'valid' && promoData && (
                    <span className="rf-summary__promo-success">
                      -{promoData.discount_percentage}% appliqué ✓
                    </span>
                  )}
                  <span className="rf-hint">{t("reservation.hint_promo_code")}</span>
                </div>
              )}

              <div className="rf-summary__divider" />

              {promoData && (
                <>
                  <div className="rf-summary__row">
                    <span className="rf-summary__key">{t("reservation.subtotal", "Sous-total")}</span>
                    <span className="rf-summary__val">{formatPrice(price)}</span>
                  </div>
                  <div className="rf-summary__row">
                    <span className="rf-summary__key rf-summary__key--discount">
                      {t("reservation.discount", "Réduction")} ({promoData.discount_percentage}%)
                    </span>
                    <span className="rf-summary__val rf-summary__val--discount">
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                </>
              )}

              <div className="rf-summary__price-row">
                <span className="rf-summary__price-label">{t("reservation.summary_total", "Total")}</span>
                <span className="rf-summary__price-value">{formatPrice(finalPrice)}</span>
              </div>

              <div className="rf-footer rf-footer--mobile">
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