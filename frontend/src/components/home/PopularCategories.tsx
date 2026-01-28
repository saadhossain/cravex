"use client";

import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const categories = [
  { id: 1, name: "Pizza", emoji: "🍕", color: "bg-orange-100" },
  { id: 2, name: "Burgers", emoji: "🍔", color: "bg-amber-100" },
  { id: 3, name: "Chicken", emoji: "🍗", color: "bg-red-100" },
  { id: 4, name: "Sushi", emoji: "🍣", color: "bg-blue-100" },
  { id: 5, name: "Pasta", emoji: "🍝", color: "bg-yellow-100" },
  { id: 6, name: "Salads", emoji: "🥗", color: "bg-green-100" },
  { id: 7, name: "Desserts", emoji: "🍰", color: "bg-pink-100" },
  { id: 8, name: "Drinks", emoji: "🥤", color: "bg-cyan-100" },
];

const PopularCategories = () => {
  return (
    <section className="py-16 px-4 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Cravex Popular Categories <span className="ml-2">😋</span>
          </h2>
          <a
            href="/categories"
            className="flex items-center gap-2 text-orange-500 font-semibold hover:gap-3 transition-all"
          >
            See all
            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
          </a>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.name.toLowerCase()}`}
              className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 hover:border-orange-500 transition-all"
            >
              <div
                className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mb-3 transition-transform hover:scale-110`}
              >
                <span className="text-3xl">{category.emoji}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {category.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
