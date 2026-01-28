"use client";

import {
  PublicDish,
  useGetFeaturedDishesQuery,
  useGetPublicCategoriesQuery,
} from "@/store/api/publicApi";
import { faChevronRight, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

// Fallback deals
const fallbackDeals: PublicDish[] = [
  {
    id: "1",
    name: "Crispy Fried Chicken",
    description: "Delicious crispy fried chicken",
    price: 8.99,
    imageUrl: "/images/home/fried-chicken.png",
    preparationTime: 25,
    restaurant: { id: "1", name: "KFC", rating: 4.8 },
  },
  {
    id: "2",
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with cheese",
    price: 6.59,
    imageUrl: "/images/home/burger.png",
    preparationTime: 20,
    restaurant: { id: "2", name: "Burger King", rating: 4.7 },
  },
  {
    id: "3",
    name: "Fresh Garden Salad",
    description: "Fresh vegetables with dressing",
    price: 11.99,
    imageUrl: "/images/home/fresh-salad.png",
    preparationTime: 15,
    restaurant: { id: "3", name: "Healthy Bites", rating: 4.9 },
  },
  {
    id: "4",
    name: "Pepperoni Pizza",
    description: "Classic pepperoni pizza",
    price: 12.99,
    imageUrl: "/images/home/pizza.png",
    preparationTime: 30,
    restaurant: { id: "4", name: "Pizza Hut", rating: 4.8 },
  },
];

const ExclusiveDeals = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: dishes, isLoading: dishesLoading } =
    useGetFeaturedDishesQuery(8);
  const { data: categories } = useGetPublicCategoriesQuery(6);

  const displayDeals = dishes && dishes.length > 0 ? dishes : fallbackDeals;

  // Filter by category if one is selected
  const filteredDeals =
    activeCategory === "all"
      ? displayDeals
      : displayDeals.filter(
          (deal) =>
            deal.category?.name.toLowerCase() === activeCategory.toLowerCase(),
        );

  // Build filter categories from API or use defaults
  const filterCategories = [
    { id: "all", name: "All" },
    ...(categories?.slice(0, 5).map((c) => ({ id: c.slug, name: c.name })) || [
      { id: "pizza", name: "Pizza" },
      { id: "burger", name: "Burger" },
      { id: "chicken", name: "Chicken" },
      { id: "salads", name: "Salads" },
    ]),
  ];

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
              {filterCategories.map((category) => (
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

        {/* Loading State */}
        {dishesLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse"
              >
                <div className="h-44 bg-gray-200" />
                <div className="p-4">
                  <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
                  <div className="flex justify-between">
                    <div className="h-5 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-10 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Deals Grid */}
        {!dishesLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  {deal.imageUrl ? (
                    <Image
                      src={deal.imageUrl}
                      alt={deal.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🍽️
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Featured
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
                    <span>{deal.restaurant?.name || "Restaurant"}</span>
                    <span className="text-orange-500 font-medium">
                      {deal.preparationTime
                        ? `${deal.preparationTime}-${deal.preparationTime + 5} min`
                        : "20-25 min"}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    {deal.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-orange-500">
                        ${deal.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                      <FontAwesomeIcon
                        icon={faStar}
                        className="w-3.5 h-3.5 text-yellow-400"
                      />
                      <span>
                        {deal.restaurant?.rating?.toFixed(1) || "4.5"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!dishesLoading && filteredDeals.length === 0 && (
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
