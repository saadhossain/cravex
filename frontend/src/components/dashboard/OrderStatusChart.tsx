"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export type TimePeriod = "daily" | "weekly" | "monthly";

export interface OrdersByStatus {
  pending: number;
  confirmed: number;
  preparing: number;
  ready: number;
  out_for_delivery: number;
  delivered: number;
  cancelled: number;
}

interface OrderStatusChartProps {
  data: OrdersByStatus;
  onPeriodChange?: (period: TimePeriod) => void;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b", // amber
  confirmed: "#3b82f6", // blue
  preparing: "#8b5cf6", // violet
  ready: "#06b6d4", // cyan
  out_for_delivery: "#6366f1", // indigo
  delivered: "#10b981", // emerald
  cancelled: "#ef4444", // red
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const periodLabels: Record<TimePeriod, string> = {
  daily: "Today",
  weekly: "This Week",
  monthly: "This Month",
};

export function OrderStatusChart({
  data,
  onPeriodChange,
}: OrderStatusChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("weekly");
  const [isOpen, setIsOpen] = useState(false);

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    setIsOpen(false);
    onPeriodChange?.(period);
  };

  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: STATUS_LABELS[key] || key,
      value,
      color: STATUS_COLORS[key] || "#6b7280",
    }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Order Status
          </h3>
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
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No orders to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Orders by Status
        </h3>
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
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--popover-foreground))",
              }}
              formatter={(value: number | undefined) => {
                if (value === undefined) return ["N/A", ""];
                return [`${value} orders`, ""];
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span
                  style={{
                    color: "hsl(var(--muted-foreground))",
                    fontSize: "12px",
                  }}
                >
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Total: <span className="text-foreground font-semibold">{total}</span>{" "}
          orders
        </p>
      </div>
    </div>
  );
}
