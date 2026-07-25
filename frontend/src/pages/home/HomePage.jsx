import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/home/navbar/Navbar";
import Hero from "../../components/home/hero/Hero";
import HowItWorks from "../../components/home/howItworks/HowItWorks";
import FeaturedSubscriptions from "../../components/home/featuredsubscriptions/FeaturedSubscriptions";
import Footer from "../../components/home/footer/Footer";
import CTAPropose from "../../components/home/ctapropose/CTAPropose";
import CTAReferral from "../../components/home/ctareferral/CTAReferral";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("home.meta.title")}</title>
        <meta name="description" content={t("home.meta.description")} />
      </Helmet>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturedSubscriptions />
        <CTAPropose />
        <CTAReferral />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;