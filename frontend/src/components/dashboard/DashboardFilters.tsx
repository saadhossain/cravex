"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RestaurantOption } from "@/store/api/adminApi";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface DashboardFiltersProps {
  restaurants: RestaurantOption[];
  onFiltersChange: (filters: FilterState) => void;
  isLoadingRestaurants?: boolean;
}

export interface FilterState {
  status?: string;
  restaurantId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

const statuses = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function DashboardFilters({
  restaurants,
  onFiltersChange,
  isLoadingRestaurants,
}: DashboardFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | number | undefined
  ) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        {/* Status filter */}
        <select
          value={filters.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        {/* Restaurant filter */}
        <select
          value={filters.restaurantId || ""}
          onChange={(e) => handleFilterChange("restaurantId", e.target.value)}
          disabled={isLoadingRestaurants}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        >
          <option value="">All Restaurants</option>
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        {/* Toggle advanced filters */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
        >
          {isExpanded ? "Less Filters" : "More Filters"}
        </Button>

        {/* Clear filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced filters */}
      {isExpanded && (
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-800">
          {/* Date range */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">From:</span>
            <Input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-auto bg-gray-800 border-gray-700 text-gray-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">To:</span>
            <Input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-auto bg-gray-800 border-gray-700 text-gray-300"
            />
          </div>

          {/* Amount range */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Amount:</span>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minAmount || ""}
              onChange={(e) =>
                handleFilterChange(
                  "minAmount",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              className="w-24 bg-gray-800 border-gray-700 text-gray-300"
            />
            <span className="text-gray-500">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxAmount || ""}
              onChange={(e) =>
                handleFilterChange(
                  "maxAmount",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              className="w-24 bg-gray-800 border-gray-700 text-gray-300"
            />
          </div>
        </div>
      )}
    </div>
  );
}
