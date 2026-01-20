import { apiSlice } from "./apiSlice";

// Time period type
export type TimePeriod = "daily" | "weekly" | "monthly";

// Dashboard types
export interface OrdersByStatus {
  pending: number;
  confirmed: number;
  preparing: number;
  ready: number;
  out_for_delivery: number;
  delivered: number;
  cancelled: number;
}

export interface RevenueByDay {
  date: string;
  revenue: number;
  orders: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  restaurantName: string;
  customerName: string;
  deliveryType: string;
  createdAt: string;
  image?: string;
  title?: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalRestaurants: number;
  totalCustomers: number;
  pendingOrders: number;
  averageOrderValue: number;
  ordersByStatus: OrdersByStatus;
  revenueByDay: RevenueByDay[];
  recentOrders: RecentOrder[];
}

export interface TopSellingDish {
  id: string;
  name: string;
  image?: string;
  price: number;
  orderCount: number;
  orderRate: number;
  isPositive: boolean;
}

export interface TopSellingDishesResponse {
  dishes: TopSellingDish[];
  overallRate: {
    value: number;
    isPositive: boolean;
  };
}

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

export interface PeriodQuery {
  period?: TimePeriod;
}

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
  address?: string; // or Address object depending on entity
  phone?: string;
  email?: string;
  isActive: boolean;
  rating?: number;
  logoUrl?: string;
  createdAt: string;
  // Add other fields as needed
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
  restaurantId: string;
  restaurant?: {
    name: string;
  };
  categoryId?: string;
  category?: {
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

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, PeriodQuery | void>({
      query: (args) => ({
        url: "/admin/dashboard/stats",
        params: args || {},
      }),
    }),
    getTopSellingDishes: builder.query<
      TopSellingDishesResponse,
      PeriodQuery | void
    >({
      query: (args) => ({
        url: "/admin/dashboard/top-selling-dishes",
        params: args || {},
      }),
    }),
    getAdminOrders: builder.query<AdminOrdersResponse, AdminOrdersQuery>({
      query: (params) => ({
        url: "/admin/orders",
        params,
      }),
      providesTags: ["Order"],
    }),
    createAdminOrder: builder.mutation<void, CreateAdminOrderPayload>({
      query: (body) => ({
        url: "/admin/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "User", "Restaurant"],
    }),
    getRestaurantsForFilter: builder.query<RestaurantOption[], void>({
      query: () => "/admin/restaurants/list",
      providesTags: ["Restaurant"],
    }),
    getRestaurants: builder.query<
      AdminRestaurantsResponse,
      AdminRestaurantsQuery
    >({
      query: (params) => ({
        url: "/admin/restaurants",
        params,
      }),
      providesTags: ["Restaurant"],
    }),
    getDishes: builder.query<AdminDishesResponse, AdminDishesQuery>({
      query: (params) => ({
        url: "/admin/dishes",
        params,
      }),
      providesTags: ["Menu"], // Assuming Menu tag exists or should be added
    }),
    getUsers: builder.query<AdminUsersResponse, AdminUsersQuery>({
      query: (params) => ({
        url: "/admin/users",
        params,
      }),
      providesTags: ["User"],
    }),
    updateUserStatus: builder.mutation<void, { id: string; isActive: boolean }>(
      {
        query: ({ id, isActive }) => ({
          url: `/admin/users/${id}/status`,
          method: "PATCH",
          body: { isActive },
        }),
        invalidatesTags: ["User", "Restaurant"],
      },
    ),
    getCoupons: builder.query<AdminCouponsResponse, AdminCouponsQuery>({
      query: (params) => ({
        url: "/admin/coupons",
        params,
      }),
      providesTags: ["Coupon"],
    }),
    createCoupon: builder.mutation<void, CreateCouponPayload>({
      query: (body) => ({
        url: "/admin/coupons",
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
        url: `/admin/coupons/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),
    deleteCoupon: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
    getOrder: builder.query<any, string>({
      query: (id) => `/admin/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    updateOrder: builder.mutation<
      void,
      { id: string; data: Partial<CreateAdminOrderPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/orders/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Order", "User", "Restaurant"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetTopSellingDishesQuery,
  useGetAdminOrdersQuery,
  useGetRestaurantsForFilterQuery,
  useGetRestaurantsQuery,
  useGetDishesQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useCreateAdminOrderMutation,
  useGetOrderQuery,
  useUpdateOrderMutation,
} = adminApi;
