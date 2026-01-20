"use client";

import {
  ColumnDef,
  DataTable,
  SingleSelectFilter,
} from "@/components/dashboard";
import { AddCouponSheet } from "@/components/dashboard/coupons/AddCouponSheet";
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
  useDeleteCouponMutation,
  useGetCouponsQuery,
  useGetRestaurantsForFilterQuery,
} from "@/store/api/adminApi";
import {
  faCopy,
  faPencil,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrder?: number;
  maxDiscount?: number;
  validFrom?: string;
  validTo?: string;
  maxUsageCount?: number;
  usageCount: number;
  isActive: boolean;
  restaurantId?: string;
  restaurant?: { id: string; name: string };
  menuItem?: { id: string; name: string };
  createdAt: string;
}

export default function CouponsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [restaurantId, setRestaurantId] = useState<string | undefined>(
    undefined,
  );
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const { data, isLoading } = useGetCouponsQuery({
    page,
    limit,
    search,
    restaurantId,
    isActive,
  });

  const { data: restaurants } = useGetRestaurantsForFilterQuery();
  const [deleteCoupon] = useDeleteCouponMutation();

  const handleDelete = async () => {
    if (!couponToDelete) return;
    try {
      await deleteCoupon(couponToDelete).unwrap();
      toast.success("Coupon deleted successfully");
      setCouponToDelete(null);
    } catch (error) {
      toast.error("Failed to delete coupon");
      console.error(error);
    }
  };

  const columns: ColumnDef<Coupon>[] = [
    {
      header: "Code",
      cell: (coupon) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{coupon.code}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(coupon.code);
                toast.success("Code copied to clipboard");
              } else {
                toast.error("Clipboard access not available");
              }
            }}
          >
            <FontAwesomeIcon icon={faCopy} className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
    {
      header: "Discount",
      cell: (coupon) => (
        <span className="text-sm">
          {coupon.discountType === "percentage"
            ? `${coupon.discountValue}%`
            : `$${coupon.discountValue}`}
        </span>
      ),
    },
    {
      header: "Restaurant",
      cell: (coupon) => (
        <span className="text-sm text-muted-foreground">
          {coupon.restaurant?.name || "Site-wide"}
        </span>
      ),
    },
    {
      header: "Food",
      cell: (coupon) => (
        <span className="text-sm text-muted-foreground">
          {coupon.menuItem?.name || "All Foods"}
        </span>
      ),
    },
    {
      header: "Usage",
      cell: (coupon) => (
        <span className="text-sm">
          {coupon.usageCount}
          {coupon.maxUsageCount ? ` / ${coupon.maxUsageCount}` : ""}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (coupon) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
            ${
              coupon.isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }
         `}
        >
          {coupon.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Validity",
      cell: (coupon) => (
        <div className="flex flex-col text-xs text-muted-foreground">
          {coupon.validFrom && !isNaN(new Date(coupon.validFrom).getTime()) && (
            <span>
              From: {format(new Date(coupon.validFrom), "MMM d, yyyy")}
            </span>
          )}
          {coupon.validTo && !isNaN(new Date(coupon.validTo).getTime()) && (
            <span>To: {format(new Date(coupon.validTo), "MMM d, yyyy")}</span>
          )}
          {!coupon.validFrom && !coupon.validTo && <span>Always valid</span>}
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (coupon) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-500 hover:text-blue-700"
            onClick={() => {
              setEditingCoupon(coupon);
              setIsAddSheetOpen(true);
            }}
          >
            <FontAwesomeIcon icon={faPencil} className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700"
            onClick={() => setCouponToDelete(coupon.id)}
          >
            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const restaurantOptions = [
    { value: "all", label: "All Restaurants" },
    ...(restaurants?.map((r) => ({
      value: r.id,
      label: r.name,
    })) || []),
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 overflow-x-hidden">
      <div className="w-full flex justify-between">
        <div className="flex gap-4 w-4/5">
          <input
            placeholder="Search by code..."
            className="p-2 border border-border rounded-lg bg-background text-sm w-full max-w-xs focus:ring-2 focus:ring-primary focus:outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <SingleSelectFilter
            label="Restaurant"
            options={restaurantOptions}
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
          <Button onClick={() => setIsAddSheetOpen(true)}>
            <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
            Add Coupon
          </Button>
        </div>
      </div>

      <DataTable
        title="Recent Coupons"
        data={data?.data || []}
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

      <AddCouponSheet
        open={isAddSheetOpen}
        onOpenChange={(open) => {
          setIsAddSheetOpen(open);
          if (!open) setEditingCoupon(null);
        }}
        couponToEdit={editingCoupon}
      />

      <AlertDialog
        open={!!couponToDelete}
        onOpenChange={(open) => !open && setCouponToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              coupon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
