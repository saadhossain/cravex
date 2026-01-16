"use client";

import {
  OrderStatusChart,
  RecentOrdersTable,
  RevenueChart,
  StatsCard,
  StatsCardCarousel,
  StatsCardSlide,
  TopSellingDishes,
  type TopDish,
} from "@/components/dashboard";
import {
  useGetDashboardStatsQuery,
  useGetTopSellingDishesQuery,
} from "@/store/api/adminApi";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";

// Mock data for top selling dishes - replace with API call later
const mockTopDishes: TopDish[] = [
  {
    id: "1",
    name: "Cheese & Corn Momos",
    price: 8.99,
    orderCount: 156,
    orderRate: 32,
    isPositive: true,
  },
  {
    id: "2",
    name: "French Fry",
    price: 4.99,
    orderCount: 134,
    orderRate: 24,
    isPositive: true,
  },
  {
    id: "3",
    name: "Cheese Burger",
    price: 12.99,
    orderCount: 98,
    orderRate: 18,
    isPositive: true,
  },
  {
    id: "4",
    name: "Margherita Pizza",
    price: 14.99,
    orderCount: 87,
    orderRate: 5,
    isPositive: false,
  },
  {
    id: "5",
    name: "Chicken Wings",
    price: 9.99,
    orderCount: 76,
    orderRate: 12,
    isPositive: true,
  },
];

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();
  const { data: topDishesData, isLoading: topDishesLoading } =
    useGetTopSellingDishesQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        {/* Stats Cards Skeleton */}
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-[calc(16.666%-13px)] h-32 bg-card rounded-xl animate-pulse"
            />
          ))}
        </div>
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-card rounded-xl animate-pulse" />
          <div className="h-80 bg-card rounded-xl animate-pulse" />
        </div>
        {/* Table Skeleton */}
        <div className="h-96 bg-card rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Failed to load dashboard
          </h2>
          <p className="text-muted-foreground">
            Please check if the backend is running and you are logged in as
            superadmin.
          </p>
        </div>
      </div>
    );
  }

  // Calculate mock trends (in real app, this would come from API)
  const trends = {
    totalOrders: { value: 12.5, isPositive: true },
    totalRevenue: { value: 8.3, isPositive: true },
    restaurants: { value: 2.1, isPositive: true },
    customers: { value: 15.7, isPositive: true },
    pendingOrders: { value: 5.2, isPositive: false },
    avgOrderValue: { value: 3.4, isPositive: true },
  };

  return (
    <div className="space-y-6 p-4 md:p-6 overflow-x-hidden">
      {/* Stats Cards Carousel - with title that includes nav arrows */}
      <StatsCardCarousel title="Overview Stats">
        <StatsCardSlide>
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            subtitle="All time"
            icon={ShoppingCart}
            variant="default"
            trend={trends.totalOrders}
            showFilter
          />
        </StatsCardSlide>
        <StatsCardSlide>
          <StatsCard
            title="Pending Orders"
            value={stats.pendingOrders}
            subtitle="Need attention"
            icon={Package}
            variant="warning"
            trend={trends.pendingOrders}
            showFilter
          />
        </StatsCardSlide>
        <StatsCardSlide>
          <StatsCard
            title="Avg. Order Value"
            value={`£${stats.averageOrderValue.toFixed(2)}`}
            subtitle="Per order"
            icon={TrendingUp}
            variant="success"
            trend={trends.avgOrderValue}
            showFilter
          />
        </StatsCardSlide>
        <StatsCardSlide>
          <StatsCard
            title="Total Revenue"
            value={`£${stats.totalRevenue.toLocaleString("en-GB", {
              minimumFractionDigits: 2,
            })}`}
            subtitle="All time"
            icon={DollarSign}
            variant="success"
            trend={trends.totalRevenue}
            showFilter
          />
        </StatsCardSlide>
        <StatsCardSlide>
          <StatsCard
            title="Restaurants"
            value={stats.totalRestaurants}
            subtitle="Active partners"
            icon={Store}
            variant="default"
            trend={trends.restaurants}
            showFilter
          />
        </StatsCardSlide>
        <StatsCardSlide>
          <StatsCard
            title="Customers"
            value={stats.totalCustomers.toLocaleString()}
            subtitle="Registered users"
            icon={Users}
            variant="default"
            trend={trends.customers}
            showFilter
          />
        </StatsCardSlide>
      </StatsCardCarousel>

      {/* Charts Row - Equal Width (w-1/2 each on large screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="w-full">
          <OrderStatusChart data={stats.ordersByStatus} />
        </div>
        <div className="w-full">
          <RevenueChart data={stats.revenueByDay} />
        </div>
      </div>

      {/* Recent Orders (8 cols) & Top Selling Dishes (4 cols) - Swapped positions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Recent Orders - Left, 8 columns */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          <RecentOrdersTable orders={stats.recentOrders} />
        </div>

        {/* Top Selling Dishes - Right, 4 columns */}
        <div className="lg:col-span-4 order-1 lg:order-2">
          <TopSellingDishes
            dishes={topDishesData?.dishes || []}
            overallRate={
              topDishesData?.overallRate || { value: 0, isPositive: true }
            }
            isLoading={topDishesLoading}
          />
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-gradient-to-r from-primary/10 to-warning/10 border border-primary/20 rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              📊 Business Summary
            </h3>
            <p className="text-muted-foreground mt-1">
              Your platform is performing well with {stats.totalOrders} total
              orders.
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {(
                  ((stats.ordersByStatus.delivered || 0) /
                    Math.max(stats.totalOrders, 1)) *
                  100
                ).toFixed(1)}
                %
              </p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-success">
                {(
                  ((stats.ordersByStatus.cancelled || 0) /
                    Math.max(stats.totalOrders, 1)) *
                  100
                ).toFixed(1)}
                %
              </p>
              <p className="text-sm text-muted-foreground">Cancellation Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
