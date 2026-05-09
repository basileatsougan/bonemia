import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Footer.css";
import FeedbackModal from "../../modals/feedback/FeedbackModal";


const Footer = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const prefix = `/${lang || "fr"}`;

  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <footer className="ft-footer">
        <div className="ft-container container">

          {/* Top */}
          <div className="ft-top">

            {/* Brand */}
            <div className="ft-brand">
              <Link to={prefix}>
                <img src="/bonemialogoWhite.png" alt="Bonemia" className="ft-brand__logo" />
              </Link>
              <p className="ft-brand__desc">{t("footer.desc")}</p>
              <button className="ft-feedback-btn" onClick={() => setFeedbackOpen(true)}>
                {t("footer.feedback_cta")}
              </button>
            </div>

            {/* Liens */}
            <div className="ft-links">

              <div className="ft-col">
                <span className="ft-col__title">{t("footer.col_product")}</span>
                <Link to={`${prefix}/abonnements`} className="ft-col__link">{t("navbar.abonnements")}</Link>
                <a href="#comment-ca-marche" className="ft-col__link">{t("navbar.comment_ca_marche")}</a>
                <Link to={`${prefix}/aide`} className="ft-col__link">{t("navbar.aide_faq")}</Link>
              </div>

              <div className="ft-col">
                <span className="ft-col__title">{t("footer.col_account")}</span>
                <Link to={`${prefix}/auth/login`} className="ft-col__link">{t("navbar.connexion")}</Link>
                <Link to={`${prefix}/auth/register`} className="ft-col__link">{t("navbar.creer_compte")}</Link>
              </div>

              <div className="ft-col">
                <span className="ft-col__title">{t("footer.col_legal")}</span>
                <Link to={`${prefix}/legal/cgu`} className="ft-col__link">{t("footer.cgu")}</Link>
                <Link to={`${prefix}/legal/confidentialite`} className="ft-col__link">{t("footer.confidentialite")}</Link>
                <Link to={`${prefix}/legal/cookies`} className="ft-col__link">{t("footer.cookies")}</Link>
              </div>

            </div>
          </div>

          {/* Bottom */}
          <div className="ft-bottom">
            <span className="ft-bottom__copy">
              © {new Date().getFullYear()} Bonemia. {t("footer.rights")}
            </span>
            <div className="ft-bottom__langs">
              <Link to="/fr" className={`ft-lang${(lang || "fr") === "fr" ? " ft-lang--active" : ""}`}>FR</Link>
              <span className="ft-lang-sep">·</span>
              <Link to="/en" className={`ft-lang${lang === "en" ? " ft-lang--active" : ""}`}>EN</Link>
            </div>
          </div>

        </div>
      </footer>

      {/* Modal feedback — composant séparé */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
};

export default Footer;