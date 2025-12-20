import React, { useEffect, useState } from "react";
import HeroSection from "../../Components/Hero/HeroSection";
import { HowItWorks } from "../../Components/HowItWorks/HowWEWork";
import Revieus from "../../Components/Revieus/Revieus";
import Feature from "../../Components/Feature/Feature";
import FeatureLoans from "../AllLoans/FeatureLoans";
import loanData from "../../Api/LoanDetails.json";

const Home = () => {
  const [featuredLoans, setFeaturedLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    setFeaturedLoans(loanData.slice(0, 4));
    setLoading(false);
  }, []);

  return (
    <div>
      <HeroSection />
      
      <FeatureLoans
        featuredLoans={featuredLoans}
        isLoading={loading}
      />

      <HowItWorks />
      <Feature />
      <Revieus />
    </div>
  );
};

export default Home;
