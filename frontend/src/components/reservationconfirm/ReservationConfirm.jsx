import React from "react";
import { useTranslation } from "react-i18next";
import "./ReservationConfirm.css";

const ReservationConfirm = ({ serviceName, months, whatsapp }) => {
  const { t } = useTranslation();

  const monthLabel = months === 1
    ? t("reservation.confirm_months_label")
    : t("reservation.confirm_months_label");

  return (
    <section className="rc-section">
      <div className="rc-confirm">

        <div className="rc-confirm__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div className="rc-confirm__badge">{t("reservation.confirm_badge")}</div>
        <h2 className="rc-confirm__title">{t("reservation.confirm_title")}</h2>
        <p className="rc-confirm__sub">{t("reservation.confirm_sub")}</p>

        <div className="rc-confirm__info">
          <div className="rc-confirm__info-item">
            <span className="rc-confirm__info-label">{t("reservation.confirm_service")}</span>
            <span className="rc-confirm__info-value">{serviceName ?? "—"}</span>
          </div>
          <div className="rc-confirm__info-item">
            <span className="rc-confirm__info-label">{t("reservation.confirm_months")}</span>
            <span className="rc-confirm__info-value">{months} {monthLabel}</span>
          </div>
          <div className="rc-confirm__info-item">
            <span className="rc-confirm__info-label">{t("reservation.confirm_contact")}</span>
            <span className="rc-confirm__info-value">{whatsapp ?? "—"}</span>
          </div>
        </div>

        <p className="rc-confirm__note">{t("reservation.confirm_note")}</p>

      </div>
    </section>
  );
};

export default ReservationConfirm;
