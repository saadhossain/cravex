"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export type TimePeriod = "daily" | "weekly" | "monthly";

export interface TopDish {
  id: string;
  name: string;
  image?: string;
  price: number;
  orderCount: number;
  orderRate: number;
  isPositive: boolean;
}

interface TopSellingDishesProps {
  dishes: TopDish[];
  overallRate?: {
    value: number;
    isPositive: boolean;
  };
  onPeriodChange?: (period: TimePeriod) => void;
  isLoading?: boolean;
}

const periodLabels: Record<TimePeriod, string> = {
  daily: "Today",
  weekly: "This Week",
  monthly: "This Month",
};

export function TopSellingDishes({
  dishes,
  overallRate,
  onPeriodChange,
  isLoading,
}: TopSellingDishesProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("daily");
  const [isOpen, setIsOpen] = useState(false);

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    setIsOpen(false);
    onPeriodChange?.(period);
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-40 bg-secondary animate-pulse rounded" />
          <div className="h-6 w-20 bg-secondary animate-pulse rounded" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Top Selling Dishes
          </h3>
          {overallRate && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm mt-1",
                overallRate.isPositive ? "text-success" : "text-destructive"
              )}
            >
              {overallRate.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {overallRate.value}% {overallRate.isPositive ? "more" : "fewer"}{" "}
                orders
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
            >
              {periodLabels[selectedPeriod]}
              <ChevronDown className="w-4 h-4" />
            </button>
            {isOpen && (
              <div className="absolute right-0 top-full mt-1 z-10 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
                {(Object.keys(periodLabels) as TimePeriod[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    className={cn(
                      "w-full px-4 py-2 text-sm text-left hover:bg-accent transition-colors",
                      selectedPeriod === period
                        ? "text-primary bg-primary/5"
                        : "text-popover-foreground"
                    )}
                  >
                    {periodLabels[period]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <a
            href="/admin/menu"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View all →
          </a>
        </div>
      </div>

      {/* Dishes List */}
      <div className="space-y-3">
        {dishes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No dishes data available
          </div>
        ) : (
          dishes.slice(0, 5).map((dish, index) => (
            <div
              key={dish.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              {/* Rank */}
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </div>

              {/* Dish Image */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                {dish.image ? (
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    🍽️
                  </div>
                )}
              </div>

              {/* Dish Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {dish.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {dish.orderCount} orders
                </p>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <p className="font-semibold text-foreground">
                  £{dish.price.toFixed(2)}
                </p>
              </div>

              {/* Order Rate */}
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium shrink-0",
                  dish.isPositive
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {dish.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {dish.orderRate}%
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
