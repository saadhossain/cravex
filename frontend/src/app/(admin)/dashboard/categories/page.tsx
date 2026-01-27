"use client";

import {
  AddCategorySheet,
  ColumnDef,
  DataTable,
  SingleSelectFilter,
} from "@/components/dashboard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AdminCategory,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetRestaurantsForFilterQuery,
  useUpdateCategoryMutation,
} from "@/store/api/adminApi";
import { faPen, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { ArrowUpDown, ChevronDown, ChevronUp, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [restaurantId, setRestaurantId] = useState<string | undefined>(
    undefined,
  );
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    undefined,
  );

  // Sheet states
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<string | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<AdminCategory | null>(null);

  const { data: restaurantsData } = useGetRestaurantsForFilterQuery();
  const restaurantsOptions = [
    { value: "all", label: "All Restaurants" },
    ...(restaurantsData?.map((r) => ({ value: r.id, label: r.name })) || []),
  ];

  const { data, isLoading, error } = useGetCategoriesQuery({
    page,
    limit,
    search,
    restaurantId: restaurantId === "all" ? undefined : restaurantId,
    isActive,
    sortBy,
    sortOrder,
  });

  if (error) {
    console.error("Error fetching categories:", error);
  }

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const handleStatusChange = async (category: AdminCategory) => {
    try {
      await updateCategory({
        id: category.id,
        data: { isActive: !category.isActive },
      }).unwrap();
      toast.success(
        `Category ${!category.isActive ? "activated" : "deactivated"} successfully`,
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
      console.error("Failed to update status", error);
    }
  };

  const handleEdit = (id: string) => {
    setCategoryToEdit(id);
    setIsSheetOpen(true);
  };

  const handleDeleteClick = (category: AdminCategory) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id).unwrap();
      toast.success("Category deleted successfully");
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete category");
      console.error("Failed to delete category", error);
    }
  };

  const columns: ColumnDef<AdminCategory>[] = [
    {
      header: "Category",
      cell: (category) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt={category.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg bg-primary/10 text-primary">
                📑
              </div>
            )}
          </div>
          <div>
            <span className="text-sm font-medium text-foreground block">
              {category.name}
            </span>
            <span className="text-xs text-muted-foreground block">
              /{category.slug}
            </span>
            {category.description && (
              <span className="text-xs text-muted-foreground truncate max-w-[200px] block">
                {category.description}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Restaurant",
      cell: (category) => (
        <span className="text-sm text-muted-foreground">
          {category.restaurant?.name || "Unknown"}
        </span>
      ),
    },
    {
      header: () => (
        <button
          onClick={() => {
            if (sortBy === "displayOrder") {
              if (sortOrder === "ASC") {
                setSortOrder("DESC");
              } else {
                setSortBy(undefined);
                setSortOrder(undefined);
              }
            } else {
              setSortBy("displayOrder");
              setSortOrder("ASC");
            }
          }}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          Order
          {sortBy === "displayOrder" ? (
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
      cell: (category) => (
        <span className="text-sm text-foreground font-medium bg-muted px-2 py-1 rounded">
          {category.displayOrder}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (category) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStatusChange(category)}
            disabled={isUpdating}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              category.isActive ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <span
              className={`${
                category.isActive ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
          <span className="text-xs text-muted-foreground">
            {category.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      header: "Created At",
      cell: (category) => (
        <span className="text-xs text-muted-foreground">
          {format(new Date(category.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (category) => (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => handleEdit(category.id)}
                >
                  <FontAwesomeIcon icon={faPen} className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Category</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => handleDeleteClick(category)}
                >
                  <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Category</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 overflow-x-hidden">
      <div className="flex justify-between items-center">
        <div className="w-4/5 flex gap-4">
          <input
            placeholder="Search categories..."
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
            label="Status"
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            value={
              isActive === undefined ? "all" : isActive ? "active" : "inactive"
            }
            onChange={(val) => {
              setIsActive(val === "all" ? undefined : val === "active");
              setPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              setCategoryToEdit(null);
              setIsSheetOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>
      <DataTable
        title="All Categories"
        data={(data?.data || []) as AdminCategory[]}
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

      {/* Add/Edit Category Sheet */}
      <AddCategorySheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        categoryToEdit={categoryToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{categoryToDelete?.name}</span>?
              This action cannot be undone.
              {categoryToDelete && (
                <div className="mt-2 text-red-500 font-medium text-sm">
                  Note: Categories with associated menu items cannot be deleted.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting && (
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  className="mr-2 h-4 w-4"
                />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
