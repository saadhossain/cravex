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

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, PeriodQuery | void>({
      query: (params) => ({
        url: "/admin/dashboard/stats",
        params: params || undefined,
      }),
      providesTags: ["Order"],
    }),
    getTopSellingDishes: builder.query<
      TopSellingDishesResponse,
      PeriodQuery | void
    >({
      query: (params) => ({
        url: "/admin/dashboard/top-selling-dishes",
        params: params || undefined,
      }),
      providesTags: ["Order"],
    }),
    getAdminOrders: builder.query<AdminOrdersResponse, AdminOrdersQuery>({
      query: (params) => ({
        url: "/admin/orders",
        params,
      }),
      providesTags: ["Order"],
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
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetTopSellingDishesQuery,
  useGetAdminOrdersQuery,
  useGetRestaurantsForFilterQuery,
  useGetRestaurantsQuery,
} = adminApi;
