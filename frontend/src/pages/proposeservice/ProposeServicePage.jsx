import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/home/navbar/Navbar";
import Footer from "../../components/home/footer/Footer";
import ProposeServiceForm from "../../components/home/proposeserviceform/ProposeServiceForm";

const ProposeServicePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("propose.meta.title")}</title>
        <meta name="description" content={t("propose.meta.description")} />
      </Helmet>
      <Navbar />
      <main>
        <ProposeServiceForm />
      </main>
      <Footer />
    </>
  );
};

export default ProposeServicePage;