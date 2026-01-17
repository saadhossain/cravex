"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

/**
 * Interface definition for a single column in the DataTable
 */
export interface ColumnDef<T> {
  header:
    | ReactNode
    | ((props: {
        sort: (direction: "asc" | "desc" | null) => void;
        sortDirection: "asc" | "desc" | null;
      }) => ReactNode);
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string; // Additional classes for the th/td
}

/**
 * Filter definition
 */
export interface FilterDef {
  key: string;
  label: string;
  // ... we might need more complex filter support but let's stick to what we have or accept children for filters
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;

  // Pagination
  totalCount?: number;
  page?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;

  // Header Actions / Filters (Render prop or children)
  filters?: ReactNode;
  title?: string;
}

export function DataTable<T extends { id: string | number }>(
  props: DataTableProps<T>,
) {
  const {
    data,
    columns,
    isLoading,
    filters,
    title = "Details",
    page = 1,
    itemsPerPage = 10,
    totalCount = 0,
    onPageChange,
    onItemsPerPageChange,
  } = props;

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Helper for pagination
  const goToPage = (newPage: number) => {
    const p = Math.max(1, Math.min(newPage, totalPages));
    onPageChange?.(p);
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
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
      {/* Header with Title and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalCount} items
            {totalPages > 1 && ` • Page ${page} of ${totalPages}`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">{filters}</div>
      </div>

      {/* Table Content */}
      <div className="overflow-auto h-[calc(100vh-320px)] min-h-[400px] relative">
        <table className="w-full relative">
          <thead className="sticky top-0 z-20">
            <tr className="border-b border-border bg-card">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={cn(
                    "sticky top-0 text-left py-3 px-4 text-sm font-medium text-muted-foreground bg-card z-10",
                    col.className,
                  )}
                >
                  {typeof col.header === "function"
                    ? col.header({ sort: () => {}, sortDirection: null })
                    : col.header}
                  {/* Note: Sort logic needs to be hoisted or handled via header callback if we want generic sort */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-muted-foreground"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  {columns.map((col, index) => (
                    <td key={index} className={cn("py-3 px-4", col.className)}>
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                          ? String(item[col.accessorKey])
                          : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
              className="px-2 py-1 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-sm text-muted-foreground">
              of {totalCount} items
            </span>
          </div>

          {/* Page navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(1)}
                disabled={page === 1}
                className={cn(
                  "p-2 rounded-lg border transition-colors flex items-center",
                  page === 1
                    ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                    : "border-border hover:bg-accent hover:border-primary/30",
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className={cn(
                  "p-2 rounded-lg border transition-colors",
                  page === 1
                    ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                    : "border-border hover:bg-accent hover:border-primary/30",
                )}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {/* Simplified pagination for generic usage */}
                <span className="text-sm font-medium">
                  Page {page} of {totalPages}
                </span>
              </div>

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className={cn(
                  "p-2 rounded-lg border transition-colors",
                  page === totalPages
                    ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                    : "border-border hover:bg-accent hover:border-primary/30",
                )}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages}
                className={cn(
                  "p-2 rounded-lg border transition-colors flex items-center",
                  page === totalPages
                    ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                    : "border-border hover:bg-accent hover:border-primary/30",
                )}
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
