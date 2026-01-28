"use client";

import {
  faChevronLeft,
  faChevronRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";

const restaurants = [
  {
    id: 1,
    name: "McDonald's",
    logo: "🍔",
    rating: 4.5,
    deliveryTime: "15-25 min",
    bgColor: "bg-yellow-400",
  },
  {
    id: 2,
    name: "Papa John's",
    logo: "🍕",
    rating: 4.6,
    deliveryTime: "25-35 min",
    bgColor: "bg-red-600",
  },
  {
    id: 3,
    name: "KFC",
    logo: "🍗",
    rating: 4.4,
    deliveryTime: "20-30 min",
    bgColor: "bg-red-500",
  },
  {
    id: 4,
    name: "Testy's",
    logo: "🌮",
    rating: 4.7,
    deliveryTime: "15-20 min",
    bgColor: "bg-orange-500",
  },
  {
    id: 5,
    name: "Shawarma King",
    logo: "🥙",
    rating: 4.8,
    deliveryTime: "20-25 min",
    bgColor: "bg-green-500",
  },
  {
    id: 6,
    name: "Burger King",
    logo: "👑",
    rating: 4.3,
    deliveryTime: "18-28 min",
    bgColor: "bg-blue-800",
  },
  {
    id: 7,
    name: "Subway",
    logo: "🥪",
    rating: 4.5,
    deliveryTime: "10-15 min",
    bgColor: "bg-green-600",
  },
  {
    id: 8,
    name: "Domino's",
    logo: "🍕",
    rating: 4.4,
    deliveryTime: "25-35 min",
    bgColor: "bg-blue-600",
  },
];

const PopularRestaurants = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        scrollRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 0);
      setShowRightArrow(
        scrollRef.current.scrollLeft <
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10,
      );
    }
  };

  return (
    <section className="py-16 px-4 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Popular Restaurants
          </h2>
          <div className="flex items-center gap-4">
            <a
              href="/restaurants"
              className="flex items-center gap-2 text-orange-500 font-semibold hover:gap-3 transition-all"
            >
              View all
              <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
            </a>
            <div className="hidden sm:flex gap-2">
              <button
                className={`w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center transition-all ${
                  showLeftArrow
                    ? "hover:bg-orange-500 hover:border-orange-500 hover:text-white text-gray-900"
                    : "opacity-40 cursor-not-allowed"
                }`}
                onClick={() => scroll("left")}
                disabled={!showLeftArrow}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
              </button>
              <button
                className={`w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center transition-all ${
                  showRightArrow
                    ? "hover:bg-orange-500 hover:border-orange-500 hover:text-white text-gray-900"
                    : "opacity-40 cursor-not-allowed"
                }`}
                onClick={() => scroll("right")}
                disabled={!showRightArrow}
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Restaurants Slider */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2"
          onScroll={handleScroll}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {restaurants.map((restaurant) => (
            <a
              key={restaurant.id}
              href={`/restaurant/${restaurant.id}`}
              className="flex-shrink-0 w-48 p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:border-orange-500 transition-all snap-start flex flex-col items-center text-center"
            >
              <div
                className={`w-20 h-20 ${restaurant.bgColor} rounded-2xl flex items-center justify-center mb-4`}
              >
                <span className="text-4xl">{restaurant.logo}</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {restaurant.name}
              </h3>
              <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="w-3 h-3 text-yellow-400"
                  />
                  <span>{restaurant.rating}</span>
                </div>
                <span className="text-orange-500">
                  {restaurant.deliveryTime}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRestaurants;
