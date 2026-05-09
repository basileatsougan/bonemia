import React from "react";
import Navbar from "../../components/home/navbar/Navbar";
import SubscriptionsHero from "../../components/subscriptionshero/SubscriptionsHero";

const SubscriptionsPage = () => {
  return (
    <>
      <Navbar />
      <main>
        <SubscriptionsHero />
        {/* <SubscriptionsList /> */}
      </main>
    </>
  );
};

export default SubscriptionsPage;