"use client";

import {
  PublicRestaurant,
  useGetPopularRestaurantsQuery,
} from "@/store/api/publicApi";
import {
  faChevronLeft,
  faChevronRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";

// Fallback restaurant data
const fallbackRestaurants: PublicRestaurant[] = [
  {
    id: "1",
    name: "McDonald's",
    slug: "mcdonalds",
    logoUrl: null,
    rating: 4.5,
    reviewCount: 100,
    deliveryTimeMinutes: 25,
    deliveryFee: 2.99,
    cuisineTypes: ["Fast Food"],
    isFeatured: false,
  },
  {
    id: "2",
    name: "Papa John's",
    slug: "papa-johns",
    logoUrl: null,
    rating: 4.6,
    reviewCount: 80,
    deliveryTimeMinutes: 35,
    deliveryFee: 3.49,
    cuisineTypes: ["Pizza"],
    isFeatured: false,
  },
  {
    id: "3",
    name: "KFC",
    slug: "kfc",
    logoUrl: null,
    rating: 4.4,
    reviewCount: 120,
    deliveryTimeMinutes: 30,
    deliveryFee: 2.49,
    cuisineTypes: ["Chicken"],
    isFeatured: false,
  },
  {
    id: "4",
    name: "Testy's",
    slug: "testys",
    logoUrl: null,
    rating: 4.7,
    reviewCount: 60,
    deliveryTimeMinutes: 20,
    deliveryFee: 1.99,
    cuisineTypes: ["Mexican"],
    isFeatured: false,
  },
  {
    id: "5",
    name: "Shawarma King",
    slug: "shawarma-king",
    logoUrl: null,
    rating: 4.8,
    reviewCount: 90,
    deliveryTimeMinutes: 25,
    deliveryFee: 2.99,
    cuisineTypes: ["Middle Eastern"],
    isFeatured: false,
  },
  {
    id: "6",
    name: "Burger King",
    slug: "burger-king",
    logoUrl: null,
    rating: 4.3,
    reviewCount: 110,
    deliveryTimeMinutes: 28,
    deliveryFee: 2.99,
    cuisineTypes: ["Burgers"],
    isFeatured: false,
  },
  {
    id: "7",
    name: "Subway",
    slug: "subway",
    logoUrl: null,
    rating: 4.5,
    reviewCount: 70,
    deliveryTimeMinutes: 15,
    deliveryFee: 1.49,
    cuisineTypes: ["Sandwiches"],
    isFeatured: false,
  },
  {
    id: "8",
    name: "Domino's",
    slug: "dominos",
    logoUrl: null,
    rating: 4.4,
    reviewCount: 95,
    deliveryTimeMinutes: 35,
    deliveryFee: 0,
    cuisineTypes: ["Pizza"],
    isFeatured: false,
  },
];

// Logo emoji fallback based on cuisine type
const getLogoEmoji = (cuisineTypes: string[] | null, name: string) => {
  const cuisine = cuisineTypes?.[0]?.toLowerCase() || name.toLowerCase();
  const emojiMap: Record<string, { emoji: string; bg: string }> = {
    "fast food": { emoji: "🍔", bg: "bg-yellow-400" },
    pizza: { emoji: "🍕", bg: "bg-red-600" },
    chicken: { emoji: "🍗", bg: "bg-red-500" },
    mexican: { emoji: "🌮", bg: "bg-orange-500" },
    "middle eastern": { emoji: "🥙", bg: "bg-green-500" },
    burgers: { emoji: "👑", bg: "bg-blue-800" },
    sandwiches: { emoji: "🥪", bg: "bg-green-600" },
    chinese: { emoji: "🥡", bg: "bg-red-500" },
    indian: { emoji: "🍛", bg: "bg-orange-600" },
    sushi: { emoji: "🍣", bg: "bg-blue-500" },
    thai: { emoji: "🍜", bg: "bg-green-500" },
  };
  return emojiMap[cuisine] || { emoji: "🍽️", bg: "bg-gray-600" };
};

const PopularRestaurants = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const {
    data: restaurants,
    isLoading,
    error,
  } = useGetPopularRestaurantsQuery(8);

  const displayRestaurants =
    restaurants && restaurants.length > 0 ? restaurants : fallbackRestaurants;

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex gap-6 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-48 p-6 bg-white rounded-2xl shadow-md animate-pulse"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-2xl mx-auto mb-4" />
                <div className="h-4 w-24 bg-gray-200 rounded mx-auto mb-2" />
                <div className="h-3 w-20 bg-gray-200 rounded mx-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Restaurants Slider */}
        {!isLoading && (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2"
            onScroll={handleScroll}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayRestaurants.map((restaurant) => {
              const logoStyle = getLogoEmoji(
                restaurant.cuisineTypes,
                restaurant.name,
              );
              return (
                <a
                  key={restaurant.id}
                  href={`/restaurant/${restaurant.slug}`}
                  className="shrink-0 w-48 p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:border-orange-500 transition-all snap-start flex flex-col items-center text-center"
                >
                  <div
                    className={`w-20 h-20 ${logoStyle.bg} rounded-2xl flex items-center justify-center mb-4 overflow-hidden`}
                  >
                    {restaurant.logoUrl ? (
                      <img
                        src={restaurant.logoUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">{logoStyle.emoji}</span>
                    )}
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
                      <span>{restaurant.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-orange-500">
                      {restaurant.deliveryTimeMinutes}-
                      {restaurant.deliveryTimeMinutes + 10} min
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularRestaurants;
