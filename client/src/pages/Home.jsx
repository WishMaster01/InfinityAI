import React from "react";

import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import AITools from "../components/AITools.jsx";
import Testimonial from "../components/Testimonial.jsx";
import Plan from "../components/Plan.jsx";
import Footer from "../components/Footer.jsx";

const Home = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_48%,#eef8ff_100%)]">
      <Navbar />
      <Hero />
      <AITools />
      <Testimonial />
      <Plan />
      <Footer />
    </main>
  );
};

export default Home;
