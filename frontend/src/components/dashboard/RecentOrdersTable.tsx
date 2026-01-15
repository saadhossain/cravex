"use client";

import { RecentOrder } from "@/store/api/adminApi";
import { format, parseISO } from "date-fns";

interface RecentOrdersTableProps {
  orders: RecentOrder[];
  isLoading?: boolean;
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  preparing: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  ready: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  out_for_delivery: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function RecentOrdersTable({
  orders,
  isLoading,
}: RecentOrdersTableProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
        <a
          href="/admin/orders"
          className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
        >
          View all →
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Order
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Customer
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Restaurant
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Type
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-white">
                      {order.orderNumber}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-300">
                      {order.customerName}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-300">
                      {order.restaurantName}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-white">
                      £{order.total.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                        statusStyles[order.status] ||
                        "bg-gray-500/10 text-gray-500 border-gray-500/20"
                      }`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-400 capitalize">
                      {order.deliveryType === "delivery" ? "🚚" : "🏃"}{" "}
                      {order.deliveryType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-400">
                      {format(parseISO(order.createdAt), "MMM d, HH:mm")}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
