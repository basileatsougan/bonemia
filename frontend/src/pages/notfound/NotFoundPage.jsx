import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import "./NotFoundPage.css";
import Footer from "../../components/home/footer/Footer";
import Navbar from "../../components/home/navbar/Navbar";

const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();

  return (
    <>
      <Navbar />
      <section className="notfound-section">
        <div className="notfound-container container">
          <div className="notfound-content">
            <div className="notfound-code">404</div>
            <h1 className="notfound-title">{t("notfound.title")}</h1>
            <p className="notfound-subtitle">{t("notfound.subtitle")}</p>
            <div className="notfound-buttons">
              <button 
                className="notfound-btn notfound-btn--primary"
                onClick={() => navigate(`/${lang || "fr"}`)}
              >
                {t("notfound.btn_home")}
              </button>
              <button 
                className="notfound-btn notfound-btn--secondary"
                onClick={() => navigate(`/${lang || "fr"}/abonnements`)}
              >
                {t("notfound.btn_subscriptions")}
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default NotFoundPage;