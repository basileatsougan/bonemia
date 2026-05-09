import React from "react";
import Navbar from "../../components/home/navbar/Navbar";
import Hero from "../../components/home/hero/Hero";
import HowItWorks from "../../components/home/howItworks/HowItWorks";
import FeaturedSubscriptions from "../../components/home/featuredsubscriptions/FeaturedSubscriptions";
// import Footer from "../../components/home/footer/Footer";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturedSubscriptions />
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default HomePage;