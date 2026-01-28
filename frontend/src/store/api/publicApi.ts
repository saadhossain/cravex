import { apiSlice } from "./apiSlice";

// Types
export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

export interface PublicRestaurant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  rating: number;
  reviewCount: number;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  cuisineTypes: string[] | null;
  isFeatured?: boolean;
  bannerUrl?: string | null;
}

export interface PublicDish {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string | null;
  preparationTime: number | null;
  isPopular?: boolean;
  category?: {
    id: string;
    name: string;
  } | null;
  restaurant: {
    id: string;
    name: string;
    rating: number;
  } | null;
}

export const publicApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Categories
    getPublicCategories: builder.query<PublicCategory[], number | void>({
      query: (limit) =>
        `/menu/public/categories${limit ? `?limit=${limit}` : ""}`,
    }),

    // Restaurants
    getPopularRestaurants: builder.query<PublicRestaurant[], number | void>({
      query: (limit) =>
        `/restaurants/public/popular${limit ? `?limit=${limit}` : ""}`,
    }),
    getFeaturedRestaurants: builder.query<PublicRestaurant[], number | void>({
      query: (limit) =>
        `/restaurants/public/featured${limit ? `?limit=${limit}` : ""}`,
    }),

    // Dishes
    getFeaturedDishes: builder.query<PublicDish[], number | void>({
      query: (limit) =>
        `/menu/public/featured-dishes${limit ? `?limit=${limit}` : ""}`,
    }),
    getPopularDishes: builder.query<PublicDish[], number | void>({
      query: (limit) =>
        `/menu/public/popular-dishes${limit ? `?limit=${limit}` : ""}`,
    }),
  }),
});

export const {
  useGetPublicCategoriesQuery,
  useGetPopularRestaurantsQuery,
  useGetFeaturedRestaurantsQuery,
  useGetFeaturedDishesQuery,
  useGetPopularDishesQuery,
} = publicApi;
