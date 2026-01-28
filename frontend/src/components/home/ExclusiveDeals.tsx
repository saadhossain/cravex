"use client";

import { faChevronRight, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

const categories = [
  { id: "all", name: "All" },
  { id: "pizza", name: "Pizza" },
  { id: "burger", name: "Burger" },
  { id: "chicken", name: "Chicken" },
  { id: "salads", name: "Salads" },
  { id: "drinks", name: "Drinks" },
];

const deals = [
  {
    id: 1,
    name: "Crispy Fried Chicken",
    restaurant: "KFC",
    originalPrice: 12.99,
    discountPrice: 8.99,
    discount: 30,
    rating: 4.8,
    image: "/images/home/fried-chicken.png",
    deliveryTime: "25-30 min",
    category: "chicken",
  },
  {
    id: 2,
    name: "Classic Cheeseburger",
    restaurant: "Burger King",
    originalPrice: 10.99,
    discountPrice: 6.59,
    discount: 40,
    rating: 4.7,
    image: "/images/home/burger.png",
    deliveryTime: "20-25 min",
    category: "burger",
  },
  {
    id: 3,
    name: "Fresh Garden Salad",
    restaurant: "Healthy Bites",
    originalPrice: 14.99,
    discountPrice: 11.99,
    discount: 20,
    rating: 4.9,
    image: "/images/home/fresh-salad.png",
    deliveryTime: "15-20 min",
    category: "salads",
  },
  {
    id: 4,
    name: "Pepperoni Pizza",
    restaurant: "Pizza Hut",
    originalPrice: 18.99,
    discountPrice: 12.99,
    discount: 35,
    rating: 4.8,
    image: "/images/home/pizza.png",
    deliveryTime: "30-35 min",
    category: "pizza",
  },
];

const ExclusiveDeals = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredDeals =
    activeCategory === "all"
      ? deals
      : deals.filter((deal) => deal.category === activeCategory);

  return (
    <section className="py-16 px-4 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Up to 40% OFF
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              Cravex exclusive deals
            </h2>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    activeCategory === category.id
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <a
              href="/deals"
              className="flex items-center gap-2 text-orange-500 font-semibold hover:gap-3 transition-all"
            >
              See all
              <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={deal.image}
                  alt={deal.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  -{deal.discount}%
                </span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
                  <span>{deal.restaurant}</span>
                  <span className="text-orange-500 font-medium">
                    {deal.deliveryTime}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  {deal.name}
                </h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-orange-500">
                      ${deal.discountPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ${deal.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="w-3.5 h-3.5 text-yellow-400"
                    />
                    <span>{deal.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <span className="text-5xl block mb-4">🔍</span>
            <p>No deals found in this category. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExclusiveDeals;
