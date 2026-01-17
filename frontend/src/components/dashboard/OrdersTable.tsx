"use client";

import { cn } from "@/lib/utils";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Filter,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export type TimePeriod = "daily" | "weekly" | "monthly";
export type OrderStatus =
  | "pending"
  | "hold"
  | "cooking"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "cancelled";
export type SortDirection = "asc" | "desc" | null;

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

interface RecentOrdersTableProps {
  orders: RecentOrder[];
  isLoading?: boolean;
  onPeriodChange?: (period: TimePeriod) => void;
  onStatusFilter?: (statuses: OrderStatus[]) => void;
  onSortChange?: (field: string, direction: SortDirection) => void;
  isServerSide?: boolean;
  totalCount?: number;
  page?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
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

const periodLabels: Record<TimePeriod, string> = {
  daily: "Today",
  weekly: "This Week",
  monthly: "This Month",
};

const allStatuses: OrderStatus[] = [
  "pending",
  "hold",
  "cooking",
  "out_for_delivery",
  "delivered",
  "failed",
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export function OrdersTable(props: RecentOrdersTableProps) {
  const { orders, isLoading, onPeriodChange, onStatusFilter, onSortChange } =
    props;
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("daily");
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([]);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [amountSort, setAmountSort] = useState<SortDirection>(null);
  const [statusSort, setStatusSort] = useState<SortDirection>(null);

  // Pagination state
  const [localPage, setLocalPage] = useState(1);
  const [localItemsPerPage, setLocalItemsPerPage] = useState(5);

  const currentPage = props.page || localPage;
  const itemsPerPage = props.itemsPerPage || localItemsPerPage;

  const periodRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        periodRef.current &&
        !periodRef.current.contains(event.target as Node)
      ) {
        setIsPeriodOpen(false);
      }
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        setIsStatusOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    setIsPeriodOpen(false);
    onPeriodChange?.(period);
  };

  const handleStatusToggle = (status: OrderStatus) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    setSelectedStatuses(newStatuses);
    if (!props.isServerSide) {
      setLocalPage(1); // Reset to first page when filtering locally
    }
    onStatusFilter?.(newStatuses);
  };

  const clearStatusFilter = () => {
    setSelectedStatuses([]);
    if (!props.isServerSide) {
      setLocalPage(1);
    }
    onStatusFilter?.([]);
  };

  const handleAmountSort = () => {
    const newSort: SortDirection =
      amountSort === null ? "asc" : amountSort === "asc" ? "desc" : null;
    setAmountSort(newSort);
    setStatusSort(null);
    onSortChange?.("total", newSort);
  };

  const handleStatusSort = () => {
    const newSort: SortDirection =
      statusSort === null ? "asc" : statusSort === "asc" ? "desc" : null;
    setStatusSort(newSort);
    setAmountSort(null);
    onSortChange?.("status", newSort);
  };

  // Filter and sort orders locally if NOT server-side
  const displayOrders = useMemo(() => {
    if (props.isServerSide) {
      return orders;
    }

    let result = [...orders];

    // Filter by status
    if (selectedStatuses.length > 0) {
      result = result.filter((order) =>
        selectedStatuses.includes(order.status as OrderStatus),
      );
    }

    // Sort
    if (amountSort) {
      result.sort((a, b) =>
        amountSort === "asc" ? a.total - b.total : b.total - a.total,
      );
    } else if (statusSort) {
      result.sort((a, b) =>
        statusSort === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status),
      );
    }

    return result;
  }, [orders, selectedStatuses, amountSort, statusSort, props.isServerSide]);

  // Calculate pagination
  const totalItems = props.isServerSide
    ? props.totalCount || 0
    : displayOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedOrders = props.isServerSide
    ? displayOrders
    : displayOrders.slice(
        (currentPage - 1) * itemsPerPage,
        (currentPage - 1) * itemsPerPage + itemsPerPage,
      );

  // Pagination handlers
  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    if (props.isServerSide && props.onPageChange) {
      props.onPageChange(newPage);
    } else {
      setLocalPage(newPage);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    if (props.isServerSide && props.onItemsPerPageChange) {
      props.onItemsPerPageChange(newItemsPerPage);
    } else {
      setLocalItemsPerPage(newItemsPerPage);
      setLocalPage(1); // Reset to first page when changing items per page
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Order Details
        </h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-secondary animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Order Details
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalItems} orders
            {selectedStatuses.length > 0 && " (filtered)"}
            {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Period Filter */}
          <div className="relative" ref={periodRef}>
            <button
              onClick={() => setIsPeriodOpen(!isPeriodOpen)}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
            >
              {periodLabels[selectedPeriod]}
              <ChevronDown className="w-4 h-4" />
            </button>
            {isPeriodOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
                {(Object.keys(periodLabels) as TimePeriod[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    className={cn(
                      "w-full px-4 py-2 text-sm text-left hover:bg-accent transition-colors",
                      selectedPeriod === period
                        ? "text-primary bg-primary/5"
                        : "text-popover-foreground",
                    )}
                  >
                    {periodLabels[period]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative" ref={statusRef}>
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                selectedStatuses.length > 0
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-secondary-foreground hover:bg-accent",
              )}
            >
              <Filter className="w-4 h-4" />
              Status
              {selectedStatuses.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                  {selectedStatuses.length}
                </span>
              )}
            </button>
            {isStatusOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg py-2 min-w-[180px]">
                <div className="px-3 pb-2 mb-2 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Filter by Status
                  </span>
                  {selectedStatuses.length > 0 && (
                    <button
                      onClick={clearStatusFilter}
                      className="text-xs text-primary hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {allStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusToggle(status)}
                    className="w-full px-3 py-1.5 text-sm text-left hover:bg-accent transition-colors flex items-center gap-2"
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center",
                        selectedStatuses.includes(status)
                          ? "bg-primary border-primary"
                          : "border-border",
                      )}
                    >
                      {selectedStatuses.includes(status) && (
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded text-xs",
                        statusStyles[status],
                      )}
                    >
                      {statusLabels[status]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View All Link */}
          {!props.isServerSide && (
            <a
              href="/dashboard/orders"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View all →
            </a>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {selectedStatuses.length > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {selectedStatuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusToggle(status)}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded text-xs",
                statusStyles[status],
              )}
            >
              {statusLabels[status]}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto h-[calc(100vh-320px)] min-h-[400px] relative">
        <table className="w-full relative">
          <thead className="sticky top-0 z-20">
            <tr className="border-b border-border bg-card">
              <th className="sticky top-0 text-left py-3 px-4 text-sm font-medium text-muted-foreground bg-card z-10">
                Item
              </th>
              <th className="sticky top-0 text-left py-3 px-4 text-sm font-medium text-muted-foreground bg-card z-10">
                Customer & Order
              </th>
              <th className="sticky top-0 text-left py-3 px-4 text-sm font-medium text-muted-foreground bg-card z-10">
                Restaurant
              </th>
              <th className="sticky top-0 text-left py-3 px-4 text-sm font-medium text-muted-foreground bg-card z-10">
                <button
                  onClick={handleAmountSort}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Amount
                  {amountSort === "asc" ? (
                    <ChevronUp className="w-4 h-4 text-primary" />
                  ) : amountSort === "desc" ? (
                    <ChevronDown className="w-4 h-4 text-primary" />
                  ) : (
                    <ArrowUpDown className="w-4 h-4 opacity-50" />
                  )}
                </button>
              </th>
              <th className="sticky top-0 text-left py-3 px-4 text-sm font-medium text-muted-foreground bg-card z-10">
                <button
                  onClick={handleStatusSort}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Status
                  {statusSort === "asc" ? (
                    <ChevronUp className="w-4 h-4 text-primary" />
                  ) : statusSort === "desc" ? (
                    <ChevronDown className="w-4 h-4 text-primary" />
                  ) : (
                    <ArrowUpDown className="w-4 h-4 opacity-50" />
                  )}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  {/* Item with Image */}
                  <td className="py-3 px-4">
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
                  </td>

                  {/* Customer & Order ID */}
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        #{order.orderNumber}
                      </p>
                    </div>
                  </td>

                  {/* Restaurant */}
                  <td className="py-3 px-4">
                    <span className="text-sm text-muted-foreground">
                      {order.restaurantName}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold text-foreground">
                      £{order.total.toFixed(2)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        "inline-flex px-2.5 py-1 rounded-full text-xs font-medium border",
                        statusStyles[order.status] ||
                          "bg-muted text-muted-foreground border-border",
                      )}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-sm text-muted-foreground">
              of {totalItems} orders
            </span>
          </div>

          {/* Page navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              {/* First page */}
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={cn(
                  "p-2 rounded-lg border transition-colors flex items-center",
                  currentPage === 1
                    ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                    : "border-border hover:bg-accent hover:border-primary/30",
                )}
                aria-label="First page"
              >
                <ChevronLeft className="w-4 h-4" />
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Previous page */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                  "p-2 rounded-lg border transition-colors",
                  currentPage === 1
                    ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                    : "border-border hover:bg-accent hover:border-primary/30",
                )}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={cn(
                        "w-8 h-8 text-sm rounded-lg border transition-colors",
                        currentPage === pageNum
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-accent hover:border-primary/30",
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next page */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                  "p-2 rounded-lg border transition-colors",
                  currentPage === totalPages
                    ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                    : "border-border hover:bg-accent hover:border-primary/30",
                )}
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last page */}
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className={cn(
                  "p-2 rounded-lg border transition-colors flex items-center",
                  currentPage === totalPages
                    ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                    : "border-border hover:bg-accent hover:border-primary/30",
                )}
                aria-label="Last page"
              >
                <ChevronRight className="w-4 h-4" />
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
