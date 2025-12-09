import React from "react";
import { motion } from "framer-motion";
import { Shield, Clock, Headphones, Percent, Users, Award } from "lucide-react";

const features = [
  {
    icon: Percent,
    title: "Competitive Rates",
    description: "We offer some of the lowest interest rates in the industry.",
  },
  {
    icon: Clock,
    title: "Fast Approval",
    description:
      "Get pre-approved in minutes and receive funds within 24-48 hours.",
  },
  {
    icon: Shield,
    title: "Secure & Safe",
    description: "Your data is protected with bank-level encryption.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is available around the clock.",
  },
  {
    icon: Users,
    title: "50K+ Customers",
    description: "Join thousands of satisfied customers.",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized as the best fintech loan provider.",
  },
];

const Feature = () => {
  return (
    <section className="bg-white py-20 lg:py-28 text-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Why Loanify
          </span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Why Choose Us
          </h2>
          <p className="mt-4 text-gray-700">
            We make your loan process simple, fast, and secure.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 mb-4">
                  <feature.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-gray-700 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
