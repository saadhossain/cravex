"use client";

import { faMapMarkerAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

const HeroSection = () => {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", { location, searchQuery });
  };

  return (
    <section className="bg-gradient-to-br from-orange-50 via-white to-gray-50 min-h-[calc(100vh-140px)] py-12 px-4 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Content */}
        <div className="z-10 text-center lg:text-left">
          <p className="text-gray-500 text-sm font-medium mb-4">
            Order Restaurant food or any other home items
          </p>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight text-gray-900 mb-8">
            Feast Your Senses,
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
              Fast and Fresh
            </span>
          </h1>

          {/* Search Box */}
          <form
            className="flex flex-col lg:flex-row items-stretch bg-white rounded-full p-2 shadow-lg border border-gray-100 max-w-xl mx-auto lg:mx-0"
            onSubmit={handleSearch}
          >
            <div className="flex items-center gap-3 px-4 py-3 flex-1">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="w-4 h-4 text-orange-500"
              />
              <input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 border-none outline-none text-sm bg-transparent text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="hidden lg:block w-px h-8 bg-gray-200 self-center" />
            <div className="flex items-center gap-3 px-4 py-3 flex-1 border-t lg:border-t-0 border-gray-100">
              <FontAwesomeIcon
                icon={faSearch}
                className="w-4 h-4 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search for food or restaurants"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-none outline-none text-sm bg-transparent text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white flex items-center justify-center hover:scale-105 hover:shadow-lg transition-all shrink-0 self-center"
            >
              <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
            </button>
          </form>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-8">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <span className="text-sm text-gray-500 font-medium">
                Fast Delivery
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🍽️</span>
              <span className="text-sm text-gray-500 font-medium">
                500+ Restaurants
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span className="text-sm text-gray-500 font-medium">
                4.9 Rating
              </span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-80 lg:h-[500px] order-first lg:order-last">
          <div className="relative w-full h-full">
            <Image
              src="/images/home/hero-couple.png"
              alt="Happy couple enjoying delicious food"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
          {/* Floating Badges */}
          <div className="hidden lg:flex absolute top-[10%] right-[5%] bg-white px-4 py-2 rounded-full shadow-lg items-center gap-2 animate-bounce">
            <span className="text-xl">🍔</span>
            <span className="font-semibold text-sm text-gray-900">Burgers</span>
          </div>
          <div
            className="hidden lg:flex absolute bottom-[30%] right-0 bg-white px-4 py-2 rounded-full shadow-lg items-center gap-2 animate-bounce"
            style={{ animationDelay: "1s" }}
          >
            <span className="text-xl">🍕</span>
            <span className="font-semibold text-sm text-gray-900">Pizza</span>
          </div>
          <div
            className="hidden lg:flex absolute bottom-[10%] left-[10%] bg-white px-4 py-2 rounded-full shadow-lg items-center gap-2 animate-bounce"
            style={{ animationDelay: "2s" }}
          >
            <span className="text-xl">🥗</span>
            <span className="font-semibold text-sm text-gray-900">Healthy</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
