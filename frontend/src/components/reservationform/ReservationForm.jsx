import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./ReservationForm.css";
import ReservationConfirm from "../reservationconfirm/ReservationConfirm";

const MONTHS = [1, 2, 3, 6, 12];

// Exemple de prix par durée — à adapter selon votre logique métier
const PRICE_MAP = { 1: 9900, 2: 18900, 3: 27500, 6: 52000, 12: 99000 };
const formatPrice = (p) =>
  new Intl.NumberFormat("fr-TG", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(p);

const ReservationForm = () => {
  const { t, i18n } = useTranslation();
  const { key } = useParams();
  const navigate = useNavigate();

  // Nom lisible du service depuis les données i18n (fallback: key brut)
  const serviceName = (() => {
    const data = i18n.getResourceBundle(i18n.language, "translation");
    return data?.sp?.plans?.[key]?.name
      ?? data?.fs?.plans?.[key]?.name
      ?? key ?? "—";
  })();

  // Prix mensuel depuis les données i18n, ex: "1 200 CFA" → 1200
  const monthlyPrice = (() => {
    const data = i18n.getResourceBundle(i18n.language, "translation");
    const raw = data?.sp?.plans?.[key]?.price ?? data?.fs?.plans?.[key]?.price ?? "";
    const digits = raw.replace(/\s/g, "").match(/\d+/);
    return digits ? parseInt(digits[0], 10) : 0;
  })();

  // TODO: récupérer depuis contexte auth
  const userEmail = "";

  const [form, setForm] = useState({ fullName: "", whatsapp: "", months: 1 });
  const [errors, setErrors]   = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const isFormValid = form.fullName.trim() !== "" && form.whatsapp !== "";

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = true;
    if (!form.whatsapp)        e.whatsapp = true;
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
    // TODO: appel API réel
    await new Promise((r) => setTimeout(r, 1800));
    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <ReservationConfirm
        serviceName={serviceName}
        months={form.months}
        whatsapp={form.whatsapp}
      />
    );
  }

  const price = monthlyPrice * form.months;
  const monthLabel = form.months === 1
    ? t("reservation.month_singular")
    : t("reservation.month_plural");

  return (
    <section className="rf-section">
      <div className="rf-container container">

        {/* Header */}
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

        {/* Two-column layout */}
        <div className="rf-layout">

          {/* ── LEFT : formulaire ── */}
          <div className="rf-card">

            {/* Email auto-rempli */}
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

            {/* Nom complet */}
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

            {/* WhatsApp */}
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

            {/* Durée */}
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

            {/* Footer */}
            <div className="rf-footer">
              <p className="rf-footer__note">{t("reservation.required_note")}</p>
              <button
                type="button"
                className={`btn-primary rf-submit${!isFormValid && !sending ? " rf-submit--disabled" : ""}`}
                onClick={handleSubmit}
                disabled={sending || !isFormValid}
              >
                {sending ? <span className="rf-spinner" /> : t("reservation.submit")}
              </button>
            </div>

          </div>

          {/* ── RIGHT : résumé de commande ── */}
          <aside className="rf-summary">
            <div className="rf-summary__inner">

              <div className="rf-summary__header">
                <span className="rf-summary__label">{t("reservation.summary_title", "Résumé")}</span>
              </div>

              {/* Service */}
              <div className="rf-summary__row">
                <span className="rf-summary__key">{t("reservation.confirm_service", "Service")}</span>
                <span className="rf-summary__val rf-summary__val--highlight">{serviceName}</span>
              </div>

              {/* Durée */}
              <div className="rf-summary__row">
                <span className="rf-summary__key">{t("reservation.confirm_months", "Durée")}</span>
                <span className="rf-summary__val">{form.months} {monthLabel}</span>
              </div>

              {/* Contact */}
              <div className="rf-summary__row">
                <span className="rf-summary__key">{t("reservation.confirm_contact", "WhatsApp")}</span>
                <span className="rf-summary__val">{form.whatsapp || "—"}</span>
              </div>

              <div className="rf-summary__divider" />

              {/* Prix */}
              <div className="rf-summary__price-row">
                <span className="rf-summary__price-label">{t("reservation.summary_total", "Total")}</span>
                <span className="rf-summary__price-value">{formatPrice(price)}</span>
              </div>

              <p className="rf-summary__note">
                {t("reservation.summary_note", "Vous serez contacté via WhatsApp pour confirmer votre réservation.")}
              </p>

              {/* Badges de confiance */}
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