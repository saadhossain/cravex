"use client";

import {
  OrderStatusChart,
  RecentOrdersTable,
  RevenueChart,
  StatsCard,
} from "@/components/dashboard";
import {
  useGetDashboardStatsQuery,
  useGetRestaurantsForFilterQuery,
} from "@/store/api/adminApi";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();
  const { data: restaurants = [] } = useGetRestaurantsForFilterQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-900 rounded-xl animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-900 rounded-xl animate-pulse" />
          <div className="h-80 bg-gray-900 rounded-xl animate-pulse" />
        </div>
        <div className="h-96 bg-gray-900 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Failed to load dashboard
          </h2>
          <p className="text-gray-400">
            Please check if the backend is running and you are logged in as
            superadmin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Welcome back! Here&apos;s your business overview.
          </p>
        </div>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          subtitle="All time"
          icon={ShoppingCart}
          variant="default"
        />
        <StatsCard
          title="Total Revenue"
          value={`£${stats.totalRevenue.toLocaleString("en-GB", {
            minimumFractionDigits: 2,
          })}`}
          subtitle="All time"
          icon={DollarSign}
          variant="success"
        />
        <StatsCard
          title="Restaurants"
          value={stats.totalRestaurants}
          subtitle="Active partners"
          icon={Store}
          variant="default"
        />
        <StatsCard
          title="Customers"
          value={stats.totalCustomers.toLocaleString()}
          subtitle="Registered users"
          icon={Users}
          variant="default"
        />
        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          subtitle="Need attention"
          icon={Package}
          variant="warning"
        />
        <StatsCard
          title="Avg. Order Value"
          value={`£${stats.averageOrderValue.toFixed(2)}`}
          subtitle="Per order"
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart data={stats.ordersByStatus} />
        <RevenueChart data={stats.revenueByDay} />
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable orders={stats.recentOrders} />

      {/* Quick Stats Summary */}
      <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              📊 Business Summary
            </h3>
            <p className="text-gray-400 mt-1">
              Your platform is performing well with {stats.totalOrders} total
              orders.
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500">
                {(
                  ((stats.ordersByStatus.delivered || 0) /
                    Math.max(stats.totalOrders, 1)) *
                  100
                ).toFixed(1)}
                %
              </p>
              <p className="text-sm text-gray-400">Completion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-500">
                {(
                  ((stats.ordersByStatus.cancelled || 0) /
                    Math.max(stats.totalOrders, 1)) *
                  100
                ).toFixed(1)}
                %
              </p>
              <p className="text-sm text-gray-400">Cancellation Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
