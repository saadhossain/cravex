"use client";

import {
  ColumnDef,
  DataTable,
  SingleSelectFilter,
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import {
  useGetDishesQuery,
  useGetRestaurantsForFilterQuery,
} from "@/store/api/adminApi";
import { format } from "date-fns";
import { ArrowUpDown, ChevronDown, ChevronUp, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface AdminDish {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  restaurantId: string;
  restaurant?: {
    name: string;
  };
  categoryId?: string;
  category?: {
    name: string;
  };
  createdAt: string;
}

export default function DishesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [restaurantId, setRestaurantId] = useState<string | undefined>(
    undefined,
  );
  const [isAvailable, setIsAvailable] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    undefined,
  );

  const { data: restaurantsData } = useGetRestaurantsForFilterQuery();
  const restaurantsOptions = [
    { value: "all", label: "All Restaurants" },
    ...(restaurantsData?.map((r) => ({ value: r.id, label: r.name })) || []),
  ];

  const { data, isLoading, error } = useGetDishesQuery({
    page,
    limit,
    search,
    restaurantId: restaurantId === "all" ? undefined : restaurantId,
    isAvailable:
      isAvailable === "active"
        ? true
        : isAvailable === "inactive"
          ? false
          : undefined,
    sortBy,
    sortOrder,
  });

  if (error) {
    console.error("Error fetching dishes:", error);
  }

  console.log("Dishes data:", data);

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

  const columns: ColumnDef<AdminDish>[] = [
    {
      header: "Dish Idea",
      cell: (dish) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
            {dish.imageUrl ? (
              <Image
                src={dish.imageUrl}
                alt={dish.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg bg-primary/10 text-primary">
                🍽️
              </div>
            )}
          </div>
          <div>
            <span className="text-sm font-medium text-foreground block">
              {dish.name}
            </span>
            {dish.description && (
              <span className="text-xs text-muted-foreground truncate max-w-[200px] block">
                {dish.description}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      cell: (dish) => (
        <span className="text-sm text-muted-foreground">
          {dish.category?.name || "N/A"}
        </span>
      ),
    },
    {
      header: "Restaurant",
      cell: (dish) => (
        <span className="text-sm text-foreground">
          {dish.restaurant?.name || "Unknown"}
        </span>
      ),
    },
    {
      header: ({ sort }) => (
        <button
          onClick={() =>
            sort(
              sortBy === "price"
                ? sortOrder === "ASC"
                  ? "desc"
                  : "asc"
                : "asc",
            )
          }
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          Price
          {sortBy === "price" ? (
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
      cell: (dish) => (
        <span className="text-sm font-semibold text-foreground">
          £{Number(dish.price).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (dish) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
            dish.isAvailable
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              : "bg-red-500/10 text-red-500 border-red-500/20"
          }`}
        >
          {dish.isAvailable ? "Available" : "Unavailable"}
        </span>
      ),
    },
    {
      header: "Created At",
      cell: (dish) => (
        <span className="text-xs text-muted-foreground">
          {format(new Date(dish.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div className="w-3/4 flex gap-4">
          <input
            placeholder="Search dishes..."
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm w-full max-w-xs focus:ring-2 focus:ring-primary focus:outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <SingleSelectFilter
            label="Restaurant"
            options={restaurantsOptions}
            value={restaurantId || "all"}
            onChange={(val) => {
              setRestaurantId(val === "all" ? undefined : val);
              setPage(1);
            }}
          />
          <SingleSelectFilter
            label="Availability"
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Available" },
              { value: "inactive", label: "Unavailable" },
            ]}
            value={isAvailable || "all"}
            onChange={(val) => {
              setIsAvailable(val === "all" ? undefined : val);
              setPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Dish
          </Button>
        </div>
      </div>
      <DataTable
        title="All Dishes"
        data={(data?.data || []) as AdminDish[]}
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
        filters={null}
      />
    </div>
  );
}
