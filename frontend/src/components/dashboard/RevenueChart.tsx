"use client";

import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type TimePeriod = "daily" | "weekly" | "monthly";

export interface RevenueByDay {
  date: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  data: RevenueByDay[];
  onPeriodChange?: (period: TimePeriod) => void;
}

type ChartType = "line" | "bar";

const periodLabels: Record<TimePeriod, string> = {
  daily: "Last 24h",
  weekly: "Last 7 Days",
  monthly: "Last 30 Days",
};

export function RevenueChart({ data, onPeriodChange }: RevenueChartProps) {
  const [chartType, setChartType] = useState<ChartType>("line");
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("weekly");
  const [isOpen, setIsOpen] = useState(false);

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    setIsOpen(false);
    onPeriodChange?.(period);
  };

  const formattedData = data.map((item) => ({
    ...item,
    date: format(parseISO(item.date), "MMM d"),
    fullDate: format(parseISO(item.date), "MMMM d, yyyy"),
  }));

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Revenue Trend
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {periodLabels[selectedPeriod]}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period Filter */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
            >
              {periodLabels[selectedPeriod]}
              <ChevronDown className="w-4 h-4" />
            </button>
            {isOpen && (
              <div className="absolute right-0 top-full mt-1 z-10 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
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

          {/* Chart Type Toggle */}
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setChartType("line")}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                chartType === "line"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Line
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                chartType === "bar"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Bar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            £
            {totalRevenue.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {totalOrders}
          </p>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={formattedData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `£${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
                formatter={(value: number | undefined) => {
                  if (value === undefined) return ["N/A", "Revenue"];
                  return [
                    `£${value.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                    })}`,
                    "Revenue",
                  ];
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.fullDate;
                  }
                  return label;
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          ) : (
            <BarChart data={formattedData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `£${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
                formatter={(value: number | undefined) => {
                  if (value === undefined) return ["N/A", "Revenue"];
                  return [
                    `£${value.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                    })}`,
                    "Revenue",
                  ];
                }}
              />
              <Bar
                dataKey="revenue"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
