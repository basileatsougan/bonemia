import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/home/navbar/Navbar";
import SubscriptionsHero from "../../components/subscriptions/subscriptionshero/SubscriptionsHero";
import SubscriptionsList from "../../components/subscriptions/subscriptionslist/SubscriptionsList";
import Footer from "../../components/home/footer/Footer";
import CTAPropose from "../../components/home/ctapropose/CTAPropose";

const SubscriptionsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("sp.meta.title")}</title>
        <meta name="description" content={t("sp.meta.description")} />
      </Helmet>
      <Navbar />
      <main>
        <SubscriptionsHero />
        <SubscriptionsList />
        <CTAPropose />
      </main>
      <Footer />
    </>
  );
};

export default SubscriptionsPage;