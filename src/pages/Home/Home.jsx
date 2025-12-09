import React from "react";
import HeroSection from "../../Components/Hero/HeroSection";
import { HowItWorks } from "../../Components/HowItWorks/HowWEWork";
import Revieus from "../../Components/Revieus/Revieus";
import Feature from "../../Components/Feature/Feature";
import AllLoans from "../AllLoans/AllLoans";

const Home = () => {
  return (
    <div>
      <HeroSection></HeroSection>
      <AllLoans />
      <HowItWorks />
      <Feature />
      <Revieus />
    </div>
  );
};

export default Home;
