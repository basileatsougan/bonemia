import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Navbar from "../../components/home/navbar/Navbar";
import ReservationForm from "../../components/reservationform/ReservationForm";
import Footer from "../../components/home/footer/Footer";

const ReservationPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams();  

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