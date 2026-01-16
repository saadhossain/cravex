"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, LucideIcon } from "lucide-react";
import { useState } from "react";

export type TimePeriod = "daily" | "weekly" | "monthly";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger";
  showFilter?: boolean;
  onFilterChange?: (period: TimePeriod) => void;
}

const variantStyles = {
  default: {
    card: "bg-card border-border",
    icon: "bg-primary/10 text-primary",
  },
  success: {
    card: "bg-card border-border",
    icon: "bg-success/10 text-success",
  },
  warning: {
    card: "bg-card border-border",
    icon: "bg-warning/10 text-warning",
  },
  danger: {
    card: "bg-card border-border",
    icon: "bg-destructive/10 text-destructive",
  },
};

const periodLabels: Record<TimePeriod, string> = {
  daily: "Today",
  weekly: "This Week",
  monthly: "This Month",
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  showFilter = false,
  onFilterChange,
}: StatsCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("daily");
  const [isOpen, setIsOpen] = useState(false);
  const styles = variantStyles[variant];

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    setIsOpen(false);
    onFilterChange?.(period);
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-all hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/20 relative",
        styles.card
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            {showFilter && (
              <div className="relative ml-2">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                >
                  {periodLabels[selectedPeriod]}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {isOpen && (
                  <div className="absolute right-0 top-full mt-1 z-10 bg-popover border border-border rounded-md shadow-lg py-1 min-w-[100px]">
                    {(Object.keys(periodLabels) as TimePeriod[]).map(
                      (period) => (
                        <button
                          key={period}
                          onClick={() => handlePeriodChange(period)}
                          className={cn(
                            "w-full px-3 py-1.5 text-xs text-left hover:bg-accent transition-colors",
                            selectedPeriod === period
                              ? "text-primary bg-primary/5"
                              : "text-popover-foreground"
                          )}
                        >
                          {periodLabels[period]}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-foreground truncate">
              {value}
            </h3>
            {trend && (
              <span
                className={cn(
                  "text-sm font-medium flex items-center gap-0.5",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg shrink-0 ml-3", styles.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
