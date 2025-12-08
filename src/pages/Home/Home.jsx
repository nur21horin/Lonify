import React from 'react'
import HeroSection from '../../Components/Hero/HeroSection'
import { HowItWorks } from '../../Components/HowItWorks/HowWEWork'
import Revieus from '../../Components/Revieus/Revieus'

const Home = () => {
  return (
    <div>
      <HeroSection></HeroSection>
      
      <HowItWorks/>
      <Revieus/>
    </div>
  )
}

export default Home
