import { apiSlice } from "./apiSlice";

// Order types
export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  restaurantName: string;
  restaurantId: string;
  customerName: string;
  customerId: string;
  deliveryType: string;
  paymentStatus: string;
  createdAt: string;
}

export interface AdminOrdersResponse {
  data: AdminOrder[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminOrdersQuery {
  page?: number;
  limit?: number;
  status?: string;
  restaurantId?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface RestaurantOption {
  id: string;
  name: string;
}

// Restaurant types
export interface AdminRestaurantsQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface AdminRestaurant {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  rating?: number;
  logoUrl?: string;
  createdAt: string;
  minimumDelivery?: number;
  deliveryFee?: number;
  deliveryTimeMinutes?: number;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface AdminRestaurantsResponse {
  data: AdminRestaurant[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Dish types
export interface AdminDishesQuery {
  page?: number;
  limit?: number;
  search?: string;
  restaurantId?: string;
  categoryId?: string;
  isAvailable?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface AdminDish {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isSpicy?: boolean;
  spicyLevel?: number;
  calories?: number;
  preparationTime?: number;
  allergens?: string[];
  tags?: string[];
  displayOrder?: number;
  restaurantId: string;
  restaurant?: {
    name: string;
  };
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface AdminDishesResponse {
  data: AdminDish[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateDishPayload {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  isAvailable?: boolean;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isSpicy?: boolean;
  spicyLevel?: number;
  calories?: number;
  preparationTime?: number;
  allergens?: string[];
  tags?: string[];
  displayOrder?: number;
}

export interface CategoryOption {
  id: string;
  name: string;
  description?: string;
}

// User types
export interface AdminUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: "restaurant" | "customer" | "superadmin";
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "restaurant" | "customer" | "superadmin";
  isActive: boolean;
  createdAt: string;
}

export interface AdminUsersResponse {
  data: AdminUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Coupon types
export interface AdminCouponsQuery {
  page?: number;
  limit?: number;
  search?: string;
  restaurantId?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface CreateCouponPayload {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrder?: number;
  maxDiscount?: number;
  validFrom?: string;
  validTo?: string;
  maxUsageCount?: number;
  restaurantId?: string;
  menuItemId?: string;
  isActive?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrder?: number;
  maxDiscount?: number;
  validFrom?: string;
  validTo?: string;
  maxUsageCount?: number;
  usageCount: number;
  isActive: boolean;
  restaurantId?: string;
  restaurant?: { id: string; name: string };
  menuItemId?: string;
  createdAt: string;
}

export interface AdminCouponsResponse {
  data: Coupon[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Order payload types
export interface CreateAdminOrderPayload {
  userId: string;
  restaurantId: string;
  items: { menuItemId: string; quantity: number }[];
  deliveryType: "delivery" | "collection";
  paymentMethod: "cash" | "card" | "cod";
  paymentStatus?: string;
  note?: string;
  deliveryAddress?: string;
  status?: string;
}

// Restaurant payload types
export interface CreateRestaurantPayload {
  name: string;
  address: string;
  ownerId?: string;
  newOwner?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  };
  minimumDelivery: number;
  deliveryFee: number;
  deliveryTimeMinutes: number;
  description?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Orders
    getAdminOrders: builder.query<AdminOrdersResponse, AdminOrdersQuery>({
      query: (params) => ({
        url: "/orders/admin/all",
        params,
      }),
      providesTags: ["Order"],
    }),
    createAdminOrder: builder.mutation<void, CreateAdminOrderPayload>({
      query: (body) => ({
        url: "/orders/admin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "User", "Restaurant"],
    }),
    getOrder: builder.query<any, string>({
      query: (id) => `/orders/admin/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    updateOrder: builder.mutation<
      void,
      { id: string; data: Partial<CreateAdminOrderPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/orders/admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Order", "User", "Restaurant"],
    }),

    // Restaurants
    getRestaurantsForFilter: builder.query<RestaurantOption[], void>({
      query: () => "/restaurants/admin/list",
      providesTags: ["Restaurant"],
    }),
    getRestaurants: builder.query<
      AdminRestaurantsResponse,
      AdminRestaurantsQuery
    >({
      query: (params) => ({
        url: "/restaurants/admin/all",
        params,
      }),
      providesTags: ["Restaurant"],
    }),
    createRestaurant: builder.mutation<void, CreateRestaurantPayload>({
      query: (body) => ({
        url: "/restaurants/admin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Restaurant"],
    }),
    updateRestaurant: builder.mutation<
      void,
      { id: string; data: Partial<CreateRestaurantPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/restaurants/admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Restaurant"],
    }),
    deleteRestaurant: builder.mutation<void, string>({
      query: (id) => ({
        url: `/restaurants/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Restaurant"],
    }),

    // Dishes
    getDishes: builder.query<AdminDishesResponse, AdminDishesQuery>({
      query: (params) => ({
        url: "/menu/admin/dishes",
        params,
      }),
      providesTags: ["Menu"],
    }),
    getDish: builder.query<AdminDish, string>({
      query: (id) => `/menu/admin/dishes/${id}`,
      providesTags: (result, error, id) => [{ type: "Menu", id }],
    }),
    createDish: builder.mutation<AdminDish, CreateDishPayload>({
      query: (body) => ({
        url: "/menu/admin/dishes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Menu"],
    }),
    updateDish: builder.mutation<
      AdminDish,
      { id: string; data: Partial<CreateDishPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/menu/admin/dishes/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Menu"],
    }),
    deleteDish: builder.mutation<void, string>({
      query: (id) => ({
        url: `/menu/admin/dishes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Menu"],
    }),
    getCategoriesForRestaurant: builder.query<CategoryOption[], string>({
      query: (restaurantId) => `/menu/admin/categories/${restaurantId}`,
      providesTags: ["Menu"],
    }),

    // Users
    getUsers: builder.query<AdminUsersResponse, AdminUsersQuery>({
      query: (params) => ({
        url: "/users/admin/all",
        params,
      }),
      providesTags: ["User"],
    }),
    updateUserStatus: builder.mutation<void, { id: string; isActive: boolean }>(
      {
        query: ({ id, isActive }) => ({
          url: `/users/admin/${id}/status`,
          method: "PATCH",
          body: { isActive },
        }),
        invalidatesTags: ["User", "Restaurant"],
      },
    ),

    // Coupons
    getCoupons: builder.query<AdminCouponsResponse, AdminCouponsQuery>({
      query: (params) => ({
        url: "/coupons/admin/all",
        params,
      }),
      providesTags: ["Coupon"],
    }),
    createCoupon: builder.mutation<void, CreateCouponPayload>({
      query: (body) => ({
        url: "/coupons/admin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Coupon"],
    }),
    updateCoupon: builder.mutation<
      void,
      { id: string; data: CreateCouponPayload }
    >({
      query: ({ id, data }) => ({
        url: `/coupons/admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),
    deleteCoupon: builder.mutation<void, string>({
      query: (id) => ({
        url: `/coupons/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});

export const {
  useGetAdminOrdersQuery,
  useGetRestaurantsForFilterQuery,
  useGetRestaurantsQuery,
  useGetDishesQuery,
  useGetDishQuery,
  useCreateDishMutation,
  useUpdateDishMutation,
  useDeleteDishMutation,
  useGetCategoriesForRestaurantQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useCreateAdminOrderMutation,
  useGetOrderQuery,
  useUpdateOrderMutation,
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,
} = adminApi;
