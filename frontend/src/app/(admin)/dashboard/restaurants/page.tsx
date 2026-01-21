"use client";

import {
  ColumnDef,
  DataTable,
  SingleSelectFilter,
} from "@/components/dashboard";
import { AddRestaurantSheet } from "@/components/dashboard/restaurants/AddRestaurantSheet";
import { EditRestaurantSheet } from "@/components/dashboard/restaurants/EditRestaurantSheet";
import { Button } from "@/components/ui/button";
import {
  AdminRestaurant,
  useDeleteRestaurantMutation,
  useGetRestaurantsQuery,
} from "@/store/api/adminApi";
import { format } from "date-fns";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function RestaurantsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    undefined,
  );
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] =
    useState<AdminRestaurant | null>(null);

  const [deleteRestaurant] = useDeleteRestaurantMutation();

  const { data, isLoading } = useGetRestaurantsQuery({
    page,
    limit,
    search,
    isActive:
      isActive === "active"
        ? true
        : isActive === "inactive"
          ? false
          : undefined,
    sortBy,
    sortOrder,
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await deleteRestaurant(id).unwrap();
        toast.success("Restaurant deleted successfully");
      } catch (error) {
        toast.error("Failed to delete restaurant");
      }
    }
  };

  const handleEdit = (restaurant: AdminRestaurant) => {
    setEditingRestaurant(restaurant);
    setIsEditSheetOpen(true);
  };

  const columns: ColumnDef<AdminRestaurant>[] = [
    {
      header: "Restaurant",
      cell: (restaurant) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
            {restaurant.logoUrl ? (
              <Image
                src={restaurant.logoUrl}
                alt={restaurant.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg bg-primary/10 text-primary uppercase font-bold">
                {restaurant.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <span className="text-sm font-medium text-foreground block">
              {restaurant.name}
            </span>
            {restaurant.description && (
              <span className="text-xs text-muted-foreground truncate max-w-[200px] block">
                {restaurant.description}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: ({ sort, sortDirection }) => (
        <button
          onClick={() =>
            sort(
              sortBy === "rating"
                ? sortOrder === "ASC"
                  ? "desc"
                  : "asc"
                : "asc",
            )
          }
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          Rating
          {sortBy === "rating" ? (
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
      cell: (r) => (
        <div className="flex items-center gap-1">
          <span className="text-amber-500">★</span>
          <span>{r.rating || "N/A"}</span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (r) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
            r.isActive
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              : "bg-red-500/10 text-red-500 border-red-500/20"
          }`}
        >
          {r.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: ({ sort }) => (
        <button
          onClick={() =>
            sort(
              sortBy === "createdAt"
                ? sortOrder === "ASC"
                  ? "desc"
                  : "asc"
                : "asc",
            )
          }
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          Joined
          {sortBy === "createdAt" ? (
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
      accessorKey: "createdAt",
      cell: (r) => format(new Date(r.createdAt), "MMM d, yyyy"),
    },
    {
      header: "Actions",
      cell: (r) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(r)}
            className="h-8 w-8 hover:bg-muted"
          >
            <Edit className="h-4 w-4 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(r.id)}
            className="h-8 w-8 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

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

  return (
    <div className="space-y-6 p-4 md:p-6 overflow-x-hidden">
      <div className="flex justify-between">
        <div className="w-4/5 flex gap-4">
          <input
            placeholder="Search restaurants..."
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm w-full max-w-xs"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <SingleSelectFilter
            label="Status"
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            value={isActive || "all"}
            onChange={(val) => {
              setIsActive(val === "all" ? undefined : val);
              setPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsAddSheetOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Restaurant
          </Button>
        </div>
      </div>
      <DataTable
        title="All Restaurants"
        data={(data?.data || []) as AdminRestaurant[]}
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
      />
      <AddRestaurantSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
      />
      <EditRestaurantSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        restaurant={editingRestaurant}
      />
    </div>
  );
}
