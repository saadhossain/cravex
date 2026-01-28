"use client";

import {
  faChevronLeft,
  faChevronRight,
  faQuoteLeft,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Food Enthusiast",
    avatar: "👩‍💼",
    rating: 5,
    text: "Cravex has completely changed how I order food. The variety of restaurants and the quick delivery is amazing. I've recommended it to all my friends!",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Busy Professional",
    avatar: "👨‍💻",
    rating: 5,
    text: "As someone who works late hours, Cravex is a lifesaver. The app is super easy to use and the food always arrives fresh and on time.",
  },
  {
    id: 3,
    name: "Emily Williams",
    role: "Mom of Two",
    avatar: "👩‍👧‍👦",
    rating: 5,
    text: "Finding food that the whole family loves is easy with Cravex. The filters and categories make it simple to order for everyone's tastes.",
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Foodie Blogger",
    avatar: "🧑‍🍳",
    rating: 5,
    text: "I've tried many food delivery apps, and Cravex stands out for its quality restaurant partnerships and excellent customer service.",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-20 px-4 lg:px-8 bg-gray-50 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            What our customers say
          </h2>
          <p className="text-gray-600 text-lg">
            Don&apos;t just take our word for it - hear from our happy customers
          </p>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center gap-4">
          <button
            className="hidden md:flex w-12 h-12 rounded-full border border-gray-200 bg-white items-center justify-center text-gray-900 hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all shrink-0"
            onClick={goToPrev}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
          </button>

          <div className="flex-1 overflow-hidden relative h-[350px] md:h-[300px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute w-full bg-white p-8 rounded-3xl shadow-lg transition-all duration-500 ${
                  index === currentIndex
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-full"
                }`}
              >
                <FontAwesomeIcon
                  icon={faQuoteLeft}
                  className="w-8 h-8 text-orange-500 opacity-30 mb-4"
                />
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {testimonial.text}
                </p>
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className="w-4 h-4 text-yellow-400"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{testimonial.avatar}</span>
                  <div>
                    <span className="font-semibold text-gray-900 block">
                      {testimonial.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="hidden md:flex w-12 h-12 rounded-full border border-gray-200 bg-white items-center justify-center text-gray-900 hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all shrink-0"
            onClick={goToNext}
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-orange-500 scale-125"
                  : "bg-gray-300"
              }`}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
