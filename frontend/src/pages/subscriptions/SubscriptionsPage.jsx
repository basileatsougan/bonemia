import React from "react";
import Navbar from "../../components/home/navbar/Navbar";
import SubscriptionsHero from "../../components/subscriptions/subscriptionshero/SubscriptionsHero";
import SubscriptionsList from "../../components/subscriptions/subscriptionslist/SubscriptionsList";
import Footer from "../../components/home/footer/Footer";

const SubscriptionsPage = () => {
  return (
    <>
      <Navbar />
      <main>
        <SubscriptionsHero />
        <SubscriptionsList />
      </main>
      <Footer />
    </>
  );
};

export default SubscriptionsPage;