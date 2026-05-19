import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../../../config/api";
import "./FeedbackModal.css";

const FEEDBACK_TYPES = ["suggestion", "bug", "other"];

const FeedbackModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (!sending) onClose();
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) return;
    setSending(true);
    setError("");

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/feedbacks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          type: feedbackType,
          email: feedbackEmail || null,
          message: feedbackText,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi");
      }

      setSent(true);
      setTimeout(() => {
        setSent(false);
        onClose();
        setFeedbackText("");
        setFeedbackEmail("");
        setFeedbackType("suggestion");
      }, 2500);
    } catch (err) {
      setError(t("footer.feedback_error_network"));
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fm-overlay" onClick={handleClose}>
      <div className="fm-modal" onClick={(e) => e.stopPropagation()}>

        <div className="fm-head">
          <h3 className="fm-title">{t("footer.feedback_title")}</h3>
          <button className="fm-close" onClick={handleClose} disabled={sending}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {sent ? (
          <div className="fm-sent">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p>{t("footer.feedback_sent")}</p>
          </div>
        ) : (
          <>
            <div className="fm-types">
              {FEEDBACK_TYPES.map((type) => (
                <button
                  key={type}
                  className={`fm-type ${feedbackType === type ? "fm-type--active" : ""}`}
                  onClick={() => setFeedbackType(type)}
                >
                  {t(`footer.feedback_${type}`)}
                </button>
              ))}
            </div>

            <div className="fm-field">
              <label className="fm-label">{t("footer.feedback_email_label")}</label>
              <input
                className="fm-input"
                type="email"
                placeholder={t("footer.feedback_email_placeholder")}
                value={feedbackEmail}
                onChange={(e) => setFeedbackEmail(e.target.value)}
                disabled={sending}
              />
            </div>

            <div className="fm-field">
              <label className="fm-label">{t("footer.feedback_message_label")}</label>
              <textarea
                className="fm-textarea"
                placeholder={t(`footer.feedback_placeholder_${feedbackType}`)}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                disabled={sending}
              />
            </div>

            {error && <div className="fm-error">{error}</div>}

            <button
              className="fm-submit"
              onClick={handleFeedbackSubmit}
              disabled={sending || !feedbackText.trim()}
            >
              {sending ? <span className="fm-spinner" /> : t("footer.feedback_submit")}
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default FeedbackModal;