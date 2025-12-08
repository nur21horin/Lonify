import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Small Business Owner",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    rating: 5,
    content:
      "Loanify made my dream of expanding my business a reality. The application process was seamless, and I received the funds within 48 hours.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "First-time Homeowner",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    rating: 5,
    content:
      "I was nervous about applying for a home loan, but the team at Loanify guided me through every step.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Graduate Student",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
    rating: 5,
    content:
      "Thanks to Loanify's education loan, I could focus on my studies without worrying about finances.",
  },
];

const Revieus = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () =>
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  return (
    <section className="py-20 bg-white text-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Testimonials
          </span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="relative mt-12">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-gray-50 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-8 md:p-12"
              >
                <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 md:mb-0 md:mr-8">
                    <Quote className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-4 flex justify-center gap-1 md:justify-start">
                      {[...Array(testimonials[currentIndex].rating)].map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-yellow-400"
                          />
                        )
                      )}
                    </div>
                    <blockquote className="text-lg leading-relaxed">
                      "{testimonials[currentIndex].content}"
                    </blockquote>
                    <div className="mt-6 flex items-center justify-center gap-4 md:justify-start">
                      <img
                        src={testimonials[currentIndex].avatar}
                        alt={testimonials[currentIndex].name}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-100"
                      />
                      <div>
                        <div className="font-semibold">
                          {testimonials[currentIndex].name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonials[currentIndex].role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="flex items-center justify-center h-10 w-10 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-8 bg-blue-600"
                      : "w-2 bg-gray-300"
                  }`}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="flex items-center justify-center h-10 w-10 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Revieus;
