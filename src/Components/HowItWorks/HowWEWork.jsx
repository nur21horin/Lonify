import { motion } from "framer-motion";
import { FileCheck, Clock, CreditCard, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: FileCheck,
    title: "Apply Online",
    description:
      "Fill out our simple online application form in just a few minutes.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Clock,
    title: "Quick Review",
    description:
      "Our team reviews your application and gets back to you within 24 hours.",
    color: "bg-yellow-100 text-yellow-500",
  },
  {
    icon: CreditCard,
    title: "Get Approved",
    description:
      "Receive approval with competitive rates tailored to your profile.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: CheckCircle,
    title: "Receive Funds",
    description:
      "Funds are disbursed directly to your account within 48 hours.",
    color: "bg-purple-100 text-purple-600",
  },
];

export function HowItWorks() {
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
            Simple Process
          </span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Get your loan approved in 4 simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-xl ${step.color} mb-6`}
              >
                <step.icon className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-700">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
