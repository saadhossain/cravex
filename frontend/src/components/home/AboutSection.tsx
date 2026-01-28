"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { id: 1, value: 546, suffix: "+", label: "Registered Riders" },
  { id: 2, value: 789900, suffix: "+", label: "Orders Delivered" },
  { id: 3, value: 690, suffix: "+", label: "Restaurants" },
  { id: 4, value: 17457, suffix: "+", label: "Food Items" },
];

const AboutSection = () => {
  const [counters, setCounters] = useState<number[]>(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounters(stats.map((stat) => Math.floor(stat.value * easeOut)));

      if (step >= steps) {
        clearInterval(timer);
        setCounters(stats.map((stat) => stat.value));
      }
    }, interval);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  return (
    <section
      className="py-20 px-4 lg:px-8 bg-gradient-to-b from-white to-gray-50"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Know more about us!
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            We&apos;re committed to delivering the best food ordering experience
            to millions of customers.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="bg-gradient-to-br from-orange-500 to-orange-400 p-8 rounded-2xl text-center text-white shadow-lg shadow-orange-500/25 hover:-translate-y-1 transition-transform"
            >
              <span className="block text-4xl font-extrabold mb-2">
                {formatNumber(counters[index])}
                {stat.suffix}
              </span>
              <span className="text-sm opacity-90">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all">
            <span className="text-4xl block mb-4">🎯</span>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Our Mission
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              To connect people with the best local restaurants and deliver
              delicious food right to their doorstep with speed and quality.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all">
            <span className="text-4xl block mb-4">💡</span>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              To become the most trusted and beloved food delivery platform,
              making every meal an extraordinary experience.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all">
            <span className="text-4xl block mb-4">❤️</span>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Values</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Customer satisfaction, quality service, innovation, and building
              lasting relationships with our partners and riders.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
