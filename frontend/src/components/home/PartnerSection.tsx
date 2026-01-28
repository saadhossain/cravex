"use client";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const PartnerSection = () => {
  return (
    <section className="py-16 px-4 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Partner Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-orange-50 min-h-[300px]">
          <div className="p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Partner with us
            </h3>
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              Grow your business by reaching thousands of new customers through
              Cravex.
            </p>
            <a
              href="/become-partner"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold w-fit transition-all hover:gap-3"
            >
              Get Started
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="relative min-h-[250px] md:min-h-[300px]">
            <Image
              src="/images/home/partner-woman.png"
              alt="Partner with us"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* Rider Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden bg-gradient-to-br from-yellow-200 to-yellow-400 min-h-[300px]">
          <div className="p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ride with us
            </h3>
            <p className="text-base text-gray-700 leading-relaxed mb-6">
              Join our fleet of riders and earn money on your own schedule.
              Flexible hours, great pay.
            </p>
            <a
              href="/become-rider"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold w-fit transition-all hover:gap-3"
            >
              Get Started
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="relative min-h-[250px] md:min-h-[300px] flex items-center justify-center bg-gradient-to-br from-white/20 to-transparent">
            <span className="text-8xl drop-shadow-lg">🛵</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
