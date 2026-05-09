import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/home/navbar/Navbar";
import Footer from "../../components/home/footer/Footer";
import ReservationForm from "../../components/reservationform/ReservationForm";

const ReservationPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("reservation.meta.title")}</title>
        <meta name="description" content={t("reservation.meta.description")} />
      </Helmet>
      <Navbar />
      <main>
        <ReservationForm />
      </main>
      <Footer />
    </>
  );
};

export default ReservationPage;