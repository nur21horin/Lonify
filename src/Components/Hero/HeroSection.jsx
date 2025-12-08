import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, TrendingUp } from "lucide-react";
import heroImg from "./../../../public/hero-image.jpg";
const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Happy family in front of their new home"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent dark:from-background/95 dark:via-background/80" />
      </div>
      <div className="container relative z-10 mx-auto flex min-h-[90vh] items-center px-4 py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Shield className="h-4 w-4" />
              Trusted by 50,000+ customers
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-heading text-4xl font-bold leading-tight text-primary-foreground dark:text-foreground sm:text-5xl md:text-6xl"
          >
            Your Dreams, <span className="text-accent">Our Commitment</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg leading-relaxed text-primary-foreground/80 dark:text-muted-foreground sm:text-xl"
          >
            Get fast, flexible loans with competitive rates tailored to your
            needs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              to="/apply"
              className="inline-flex items-center px-8 py-4 text-xl font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300"
            >
              Apply for Loan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/loans"
              className="inline-block px-8 py-4 text-xl font-semibold text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-colors duration-300"
            >
              Explore Loans
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid grid-cols-3 gap-6"
          >
            {[
              { icon: Clock, label: "Quick Approval", value: "24hrs" },
              { icon: TrendingUp, label: "Interest From", value: "5.9%" },
              { icon: Shield, label: "Max Loan", value: "$500K" },
            ].map((stat, index) => (
              <div key={index} className="text-center sm:text-left">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <stat.icon className="h-5 w-5 text-accent" />
                  <span className="text-2xl font-bold text-primary-foreground dark:text-foreground sm:text-3xl">
                    {stat.value}
                  </span>
                </div>
                <p className="mt-1 text-sm text-primary-foreground/70 dark:text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
