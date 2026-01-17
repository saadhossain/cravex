"use client";

import {
  ColumnDef,
  DataTable,
  MultiSelectFilter,
  SingleSelectFilter,
  TimePeriod,
} from "@/components/dashboard";
import { cn } from "@/lib/utils";
import { useGetAdminOrdersQuery } from "@/store/api/adminApi";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  restaurantName: string;
  customerName: string;
  createdAt: string;
  image?: string;
  title?: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  hold: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  cooking: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  preparing: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  ready: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  out_for_delivery: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  failed: "bg-red-500/10 text-red-500 border-red-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  hold: "Hold",
  cooking: "Cooking",
  preparing: "Preparing",
  confirmed: "Confirmed",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  failed: "Failed",
  cancelled: "Cancelled",
};

const periodOptions = [
  { value: "daily", label: "Today" },
  { value: "weekly", label: "This Week" },
  { value: "monthly", label: "This Month" },
];

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [period, setPeriod] = useState<TimePeriod>("monthly");
  const [status, setStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    undefined,
  );

  // Calculate date range based on period
  const getDateRange = (period: TimePeriod) => {
    const now = new Date();
    switch (period) {
      case "daily":
        return {
          startDate: format(startOfDay(now), "yyyy-MM-dd"),
          endDate: format(endOfDay(now), "yyyy-MM-dd"),
        };
      case "weekly":
        return {
          startDate: format(
            startOfWeek(now, { weekStartsOn: 1 }),
            "yyyy-MM-dd",
          ),
          endDate: format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
        };
      case "monthly":
        return {
          startDate: format(startOfMonth(now), "yyyy-MM-dd"),
          endDate: format(endOfMonth(now), "yyyy-MM-dd"),
        };
      default:
        return {};
    }
  };

  const { startDate, endDate } = getDateRange(period);

  const { data, isLoading } = useGetAdminOrdersQuery({
    page,
    limit,
    status: status.length > 0 ? status.join(",") : undefined,
    startDate,
    endDate,
    sortBy,
    sortOrder,
  });

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod as TimePeriod);
    setPage(1);
  };

  const handleStatusFilter = (statuses: string[]) => {
    setStatus(statuses);
    setPage(1);
  };

  const handleSort = (field: string, direction: "asc" | "desc" | null) => {
    if (!direction) {
      setSortBy(undefined);
      setSortOrder(undefined);
    } else {
      setSortBy(field);
      setSortOrder(direction === "asc" ? "ASC" : "DESC");
    }
    setPage(1);
  };

  const columns: ColumnDef<AdminOrder>[] = [
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
      header: "Customer & Order",
      cell: (order) => (
        <div>
          <p className="text-sm font-medium text-foreground">
            {order.customerName}
          </p>
          <p className="text-xs text-muted-foreground">#{order.orderNumber}</p>
        </div>
      ),
    },
    {
      header: "Restaurant",
      accessorKey: "restaurantName",
      cell: (order) => (
        <span className="text-sm text-muted-foreground">
          {order.restaurantName}
        </span>
      ),
    },
    {
      header: ({ sort, sortDirection }) => (
        <button
          onClick={() =>
            sort(
              sortBy === "total"
                ? sortOrder === "ASC"
                  ? "desc"
                  : "asc"
                : "asc",
            )
          }
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          Amount
          {sortBy === "total" ? (
            sortOrder === "ASC" ? (
              <ChevronUp className="w-4 h-4 text-primary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-primary" />
            )
          ) : (
            <ArrowUpDown className="w-4 h-4 opacity-50" />
          )}
        </button>
      ),
      cell: (order) => (
        <span className="text-sm font-semibold text-foreground">
          £{order.total.toFixed(2)}
        </span>
      ),
    },
    {
      header: ({ sort, sortDirection }) => (
        <button
          onClick={() =>
            sort(
              sortBy === "status"
                ? sortOrder === "ASC"
                  ? "desc"
                  : "asc"
                : "asc",
            )
          }
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          Status
          {sortBy === "status" ? (
            sortOrder === "ASC" ? (
              <ChevronUp className="w-4 h-4 text-primary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-primary" />
            )
          ) : (
            <ArrowUpDown className="w-4 h-4 opacity-50" />
          )}
        </button>
      ),
      cell: (order) => (
        <span
          className={cn(
            "inline-flex px-2.5 py-1 rounded-full text-xs font-medium border",
            statusStyles[order.status] ||
              "bg-muted text-muted-foreground border-border",
          )}
        >
          {statusLabels[order.status] || order.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 overflow-x-hidden">
      <DataTable
        title="Orders"
        data={(data?.data || []) as AdminOrder[]}
        columns={columns}
        isLoading={isLoading}
        totalCount={data?.meta?.total || 0}
        page={page}
        itemsPerPage={limit}
        onPageChange={setPage}
        onItemsPerPageChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        filters={
          <>
            <SingleSelectFilter
              label="Period"
              options={periodOptions}
              value={period}
              onChange={handlePeriodChange}
            />
            <MultiSelectFilter
              label="Status"
              options={statusOptions}
              selectedValues={status}
              onFilterChange={handleStatusFilter}
            />
          </>
        }
      />
    </div>
  );
}
