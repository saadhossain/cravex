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

export interface PeriodQuery {
  period?: TimePeriod;
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, PeriodQuery | void>({
      query: (args) => ({
        url: "/dashboard/stats",
        params: args || {},
      }),
    }),
    getTopSellingDishes: builder.query<
      TopSellingDishesResponse,
      PeriodQuery | void
    >({
      query: (args) => ({
        url: "/dashboard/top-selling-dishes",
        params: args || {},
      }),
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetTopSellingDishesQuery } =
  dashboardApi;
