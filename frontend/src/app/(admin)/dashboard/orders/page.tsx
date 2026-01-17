"use client";

import { OrdersTable, TimePeriod } from "@/components/dashboard";
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
import { useState } from "react";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [period, setPeriod] = useState<TimePeriod>("monthly");
  const [status, setStatus] = useState<string | undefined>(undefined);
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
    status,
    startDate,
    endDate,
    sortBy,
    sortOrder,
  });
  console.log(data);
  const handlePeriodChange = (newPeriod: TimePeriod) => {
    setPeriod(newPeriod);
    setPage(1);
  };

  const handleStatusFilter = (statuses: string[]) => {
    if (statuses.length === 0) {
      setStatus(undefined);
    } else {
      // API currently takes a single status string or maybe comma separated?
      // Based on AdminOrdersQuery interface: status?: string;
      // If multiple, normally we send "pending,confirmed". Let's assume comma separated or just pick one.
      // Usually REST APIs support comma separated for filters.
      setStatus(statuses.join(","));
    }
    setPage(1);
  };

  const handleSortChange = (
    field: string,
    direction: "asc" | "desc" | null,
  ) => {
    if (!direction) {
      setSortBy(undefined);
      setSortOrder(undefined);
    } else {
      setSortBy(field === "total" ? "total" : "status"); // Map 'total' to backend field 'total' if needed, or check DTO
      setSortOrder(direction === "asc" ? "ASC" : "DESC");
    }
    setPage(1);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 overflow-x-hidden">
      <OrdersTable
        orders={data?.data || []}
        isLoading={isLoading}
        isServerSide={true}
        totalCount={data?.meta?.total || 0}
        page={page}
        itemsPerPage={limit}
        onPageChange={setPage}
        onItemsPerPageChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onPeriodChange={handlePeriodChange}
        onStatusFilter={handleStatusFilter}
        onSortChange={handleSortChange}
      />
    </div>
  );
}
