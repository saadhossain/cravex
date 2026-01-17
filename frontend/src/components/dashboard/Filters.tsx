"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Filter } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

export interface FilterOption {
  value: string;
  label: string;
  count?: number; // active count
}

export interface FilterProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onFilterChange: (values: string[]) => void;
  icon?: ReactNode;
}

export function MultiSelectFilter({
  label,
  options,
  selectedValues,
  onFilterChange,
  icon,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onFilterChange(newValues);
  };

  const handleClear = () => {
    onFilterChange([]);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
          selectedValues.length > 0
            ? "bg-primary/10 text-primary"
            : "bg-secondary text-secondary-foreground hover:bg-accent",
        )}
      >
        {icon || <Filter className="w-4 h-4" />}
        {label}
        {selectedValues.length > 0 && (
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
            {selectedValues.length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg py-2 min-w-[180px]">
          <div className="px-3 pb-2 mb-2 border-b border-border flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Filter by {label}
            </span>
            {selectedValues.length > 0 && (
              <button
                onClick={handleClear}
                className="text-xs text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleToggle(option.value)}
              className="w-full px-3 py-1.5 text-sm text-left hover:bg-accent transition-colors flex items-center gap-2"
            >
              <div
                className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center",
                  selectedValues.includes(option.value)
                    ? "bg-primary border-primary"
                    : "border-border",
                )}
              >
                {selectedValues.includes(option.value) && (
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
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export interface SingleSelectFilterProps {
  label?: string; // e.g. "Period"
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SingleSelectFilter({
  label,
  options,
  value,
  onChange,
  className,
}: SingleSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || value;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors",
          className,
        )}
      >
        {selectedLabel}
        <ChevronDown className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-4 py-2 text-sm text-left hover:bg-accent transition-colors",
                value === option.value
                  ? "text-primary bg-primary/5"
                  : "text-popover-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
