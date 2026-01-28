"use client";

import { useGetPublicCategoriesQuery } from "@/store/api/publicApi";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Fallback emoji map for categories
const categoryEmojis: Record<string, { emoji: string; color: string }> = {
  pizza: { emoji: "🍕", color: "bg-orange-100" },
  burgers: { emoji: "🍔", color: "bg-amber-100" },
  burger: { emoji: "🍔", color: "bg-amber-100" },
  chicken: { emoji: "🍗", color: "bg-red-100" },
  sushi: { emoji: "🍣", color: "bg-blue-100" },
  pasta: { emoji: "🍝", color: "bg-yellow-100" },
  salads: { emoji: "🥗", color: "bg-green-100" },
  salad: { emoji: "🥗", color: "bg-green-100" },
  desserts: { emoji: "🍰", color: "bg-pink-100" },
  dessert: { emoji: "🍰", color: "bg-pink-100" },
  drinks: { emoji: "🥤", color: "bg-cyan-100" },
  drink: { emoji: "🥤", color: "bg-cyan-100" },
  coffee: { emoji: "☕", color: "bg-amber-100" },
  seafood: { emoji: "🦐", color: "bg-blue-100" },
  mexican: { emoji: "🌮", color: "bg-yellow-100" },
  indian: { emoji: "🍛", color: "bg-orange-100" },
  chinese: { emoji: "🥡", color: "bg-red-100" },
  thai: { emoji: "🍜", color: "bg-green-100" },
  breakfast: { emoji: "🥞", color: "bg-amber-100" },
  healthy: { emoji: "🥗", color: "bg-green-100" },
};

// Fallback categories if no API data
const fallbackCategories = [
  { id: "1", name: "Pizza", slug: "pizza", imageUrl: null },
  { id: "2", name: "Burgers", slug: "burgers", imageUrl: null },
  { id: "3", name: "Chicken", slug: "chicken", imageUrl: null },
  { id: "4", name: "Sushi", slug: "sushi", imageUrl: null },
  { id: "5", name: "Pasta", slug: "pasta", imageUrl: null },
  { id: "6", name: "Salads", slug: "salads", imageUrl: null },
  { id: "7", name: "Desserts", slug: "desserts", imageUrl: null },
  { id: "8", name: "Drinks", slug: "drinks", imageUrl: null },
];

const getCategoryStyle = (name: string) => {
  const key = name.toLowerCase();
  if (categoryEmojis[key]) {
    return categoryEmojis[key];
  }
  // Default fallback
  return { emoji: "🍽️", color: "bg-gray-100" };
};

const PopularCategories = () => {
  const { data: categories, isLoading, error } = useGetPublicCategoriesQuery(8);

  const displayCategories =
    categories && categories.length > 0
      ? categories.filter(
          (cat, index, self) =>
            index === self.findIndex((c) => c.name === cat.name),
        )
      : fallbackCategories;

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

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-6 bg-white rounded-2xl animate-pulse"
              >
                <div className="w-16 h-16 rounded-full bg-gray-200 mb-3" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8 text-gray-500">
            <p>Unable to load categories. Showing default categories.</p>
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {displayCategories.map((category) => {
              const style = getCategoryStyle(category.name);
              return (
                <a
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 hover:border-orange-500 transition-all"
                >
                  <div
                    className={`w-16 h-16 rounded-full ${style.color} flex items-center justify-center mb-3 transition-transform hover:scale-110`}
                  >
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <span className="text-3xl">{style.emoji}</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 text-center">
                    {category.name}
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularCategories;
