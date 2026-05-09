import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/home/navbar/Navbar";
import Aide from "../../components/aide/Aide";
import Footer from "../../components/home/footer/Footer";

const AidePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("aide.meta_title")}</title>
        <meta name="description" content={t("aide.meta_desc")} />
      </Helmet>
      <Navbar />
      <main>
        <Aide />
      </main>
      <Footer />
    </>
  );
};

export default AidePage;