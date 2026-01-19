"use client";

import {
  DataTable,
  OrderStatusChart,
  RevenueChart,
  StatsCard,
  StatsCardCarousel,
  StatsCardSlide,
  TopSellingDishes,
} from "@/components/dashboard";
import { StatsSummery } from "@/components/dashboard/StatsSummery";
import DashboardSkeletonLoader from "@/components/loader/dashboard-skeleton-loader";
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
import Image from "next/image";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();
  const { data: topDishesData, isLoading: topDishesLoading } =
    useGetTopSellingDishesQuery();

  if (isLoading) {
    return <DashboardSkeletonLoader />;
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
          {/* Quick Stats Summary */}
          <StatsSummery stats={stats} />
        </div>
        <div className="w-full">
          <RevenueChart data={stats.revenueByDay} />
        </div>
      </div>

      {/* Recent Orders (8 cols) & Top Selling Dishes (4 cols) - Swapped positions */}
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Recent Orders - Left, 8 columns */}
        <div className="w-full">
          <DataTable
            title="Recent Order Details"
            data={stats.recentOrders}
            columns={[
              {
                header: "Item",
                cell: (order) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                      {order.image ? (
                        <Image
                          src={order.image}
                          alt={order.title || "Order"}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">
                          🍽️
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                      {order.title || `Order Items`}
                    </span>
                  </div>
                ),
              },
              {
                header: "Customer",
                cell: (order) => (
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      #{order.orderNumber}
                    </p>
                  </div>
                ),
              },
              {
                header: "Amount",
                cell: (order) => (
                  <span className="text-sm font-semibold text-foreground">
                    £{order.total.toFixed(2)}
                  </span>
                ),
              },
              {
                header: "Status",
                cell: (order) => (
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium border bg-muted text-muted-foreground border-border">
                    {order.status}
                  </span>
                ),
              },
            ]}
            filters={
              <Link
                href="/dashboard/orders"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                View all →
              </Link>
            }
          />
        </div>

        {/* Top Selling Dishes - Right, 4 columns */}
        <div className="w-full">
          <TopSellingDishes
            dishes={topDishesData?.dishes || []}
            overallRate={
              topDishesData?.overallRate || { value: 0, isPositive: true }
            }
            isLoading={topDishesLoading}
          />
        </div>
      </div>
    </div>
  );
}
