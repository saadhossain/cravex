import { apiSlice } from "./apiSlice";

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

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/admin/dashboard/stats",
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
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAdminOrdersQuery,
  useGetRestaurantsForFilterQuery,
} = adminApi;
