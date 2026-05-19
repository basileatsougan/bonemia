import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { API_BASE_URL } from "../../../config/api";
import "./ProposeServiceForm.css";

const CATEGORIES = ["streaming", "musique", "ia", "design", "productivite", "autre"];

const ProposeServiceForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    url: "",
    category: "",
    price: "",
    description: "",
    reason: "",
  });

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirection si non connecté
  if (!isAuthenticated) {
    navigate(`/${lang || "fr"}/auth/login`);
    return null;
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.category) e.category = true;
    if (!form.description.trim()) e.description = true;
    if (!form.reason.trim()) e.reason = true;
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
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/suggestions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          url: form.url || null,
          category: form.category,
          price: form.price || null,
          description: form.description,
          reason: form.reason,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi");
      }

      setSending(false);
      setSent(true);
    } catch (err) {
      console.error(err);
      setSending(false);
      setErrors({ form: "Erreur lors de l'envoi, veuillez réessayer" });
    }
  };

  if (sent) {
    return (
      <section className="psf-section psf-section--centered">
        <div className="psf-container container">
          <div className="psf-success">
            <div className="psf-success__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="psf-success__title">{t("propose.success_title")}</h2>
            <p className="psf-success__sub">{t("propose.success_sub")}</p>
            
            <div className="psf-success__buttons">
              <button 
                className="psf-success__btn psf-success__btn--secondary"
                onClick={() => navigate(`/${lang || "fr"}/abonnements`)}
              >
                {t("propose.success_btn_subscriptions")}
              </button>
              <button 
                className="psf-success__btn psf-success__btn--primary"
                onClick={() => navigate(`/${lang || "fr"}`)}
              >
                {t("propose.success_btn_home")}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="psf-section">
      <div className="psf-container container">

        <div className="psf-header">
          <div className="psf-header__badge">{t("propose.badge")}</div>
          <h1 className="psf-header__title">{t("propose.title")}</h1>
          <p className="psf-header__sub">{t("propose.sub")}</p>
        </div>

        <div className="psf-card">

          <div className="psf-row">
            <div className="psf-field">
              <label className="psf-label">
                {t("propose.field_name")}
                <span className="psf-required">*</span>
              </label>
              <input
                className={`psf-input ${errors.name ? "psf-input--error" : ""}`}
                type="text"
                placeholder={t("propose.ph_name")}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={sending}
              />
              {errors.name && <span className="psf-error">{t("propose.error_required")}</span>}
            </div>
            <div className="psf-field">
              <label className="psf-label">{t("propose.field_url")}</label>
              <input
                className="psf-input"
                type="url"
                placeholder={t("propose.ph_url")}
                value={form.url}
                onChange={(e) => handleChange("url", e.target.value)}
                disabled={sending}
              />
            </div>
          </div>

          <div className="psf-row">
            <div className="psf-field">
              <label className="psf-label">
                {t("propose.field_category")}
                <span className="psf-required">*</span>
              </label>
              <div className="psf-categories">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`psf-cat-btn ${form.category === cat ? "psf-cat-btn--active" : ""}`}
                    onClick={() => handleChange("category", cat)}
                    disabled={sending}
                  >
                    {t(`propose.cat_${cat}`)}
                  </button>
                ))}
              </div>
              {errors.category && <span className="psf-error">{t("propose.error_required")}</span>}
            </div>
            <div className="psf-field">
              <label className="psf-label">{t("propose.field_price")}</label>
              <input
                className="psf-input"
                type="text"
                placeholder={t("propose.ph_price")}
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                disabled={sending}
              />
            </div>
          </div>

          <div className="psf-field">
            <label className="psf-label">
              {t("propose.field_description")}
              <span className="psf-required">*</span>
            </label>
            <textarea
              className={`psf-textarea ${errors.description ? "psf-input--error" : ""}`}
              placeholder={t("propose.ph_description")}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              disabled={sending}
            />
            {errors.description && <span className="psf-error">{t("propose.error_required")}</span>}
          </div>

          <div className="psf-field">
            <label className="psf-label">
              {t("propose.field_reason")}
              <span className="psf-required">*</span>
            </label>
            <textarea
              className={`psf-textarea ${errors.reason ? "psf-input--error" : ""}`}
              placeholder={t("propose.ph_reason")}
              value={form.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              rows={3}
              disabled={sending}
            />
            {errors.reason && <span className="psf-error">{t("propose.error_required")}</span>}
          </div>

          {errors.form && <div className="psf-error-form">{errors.form}</div>}

          <div className="psf-footer">
            <p className="psf-footer__note">{t("propose.required_note")}</p>
            <button
              className="btn-primary psf-submit"
              onClick={handleSubmit}
              disabled={sending}
            >
              {sending
                ? <span className="psf-spinner" />
                : t("propose.submit")
              }
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProposeServiceForm;