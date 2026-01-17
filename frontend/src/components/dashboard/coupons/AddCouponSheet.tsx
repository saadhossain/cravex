"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useCreateCouponMutation,
  useGetRestaurantsForFilterQuery,
} from "@/store/api/adminApi";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddCouponSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CouponFormData {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: string;
  minimumOrder?: string;
  maxDiscount?: string;
  validFrom?: string;
  validTo?: string;
  maxUsageCount?: string;
  restaurantId?: string;
  isActive: boolean;
}

export function AddCouponSheet({ open, onOpenChange }: AddCouponSheetProps) {
  const [createCoupon, { isLoading }] = useCreateCouponMutation();
  const { data: restaurants } = useGetRestaurantsForFilterQuery();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CouponFormData>({
    defaultValues: {
      discountType: "percentage",
      isActive: true,
    },
  });

  const discountType = watch("discountType");

  const onSubmit = async (data: CouponFormData) => {
    try {
      await createCoupon({
        ...data,
        discountValue: Number(data.discountValue),
        minimumOrder: data.minimumOrder ? Number(data.minimumOrder) : undefined,
        maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : undefined,
        maxUsageCount: data.maxUsageCount
          ? Number(data.maxUsageCount)
          : undefined,
        restaurantId:
          data.restaurantId === "all" ? undefined : data.restaurantId,
      }).unwrap();

      toast.success("Coupon created successfully");
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create coupon");
      console.error(error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Add New Coupon</SheetTitle>
          <SheetDescription>
            Create a new coupon code for discounts.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="code">
              Coupon Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              placeholder="e.g. SUMMER50"
              {...register("code", { required: true })}
            />
            {errors.code && (
              <span className="text-xs text-red-500">Code is required</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                defaultValue="percentage"
                onValueChange={(val) =>
                  setValue("discountType", val as "percentage" | "fixed")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue">
                Value <span className="text-red-500">*</span>
              </Label>
              <Input
                id="discountValue"
                type="number"
                step="0.01"
                placeholder={discountType === "percentage" ? "10" : "5.00"}
                {...register("discountValue", { required: true, min: 0 })}
              />
              {errors.discountValue && (
                <span className="text-xs text-red-500">Value is required</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minimumOrder">Min Order Amount</Label>
              <Input
                id="minimumOrder"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("minimumOrder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Max Discount (for %)</Label>
              <Input
                id="maxDiscount"
                type="number"
                step="0.01"
                placeholder="Optional"
                disabled={discountType === "fixed"}
                {...register("maxDiscount")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="validFrom">Valid From</Label>
              <Input
                id="validFrom"
                type="datetime-local"
                {...register("validFrom")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validTo">Valid To</Label>
              <Input
                id="validTo"
                type="datetime-local"
                {...register("validTo")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxUsageCount">Max Total Usages</Label>
            <Input
              id="maxUsageCount"
              type="number"
              placeholder="Unlimited"
              {...register("maxUsageCount")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurantId">Restaurant (Optional)</Label>
            <Select onValueChange={(val) => setValue("restaurantId", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select restaurant (or site-wide)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Restaurants (Site-wide)</SelectItem>
                {restaurants?.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Leave empty or select All for site-wide coupon.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="isActive"
              defaultChecked={true}
              onCheckedChange={(checked) =>
                setValue("isActive", checked as boolean)
              }
            />
            <Label htmlFor="isActive">Active immediately</Label>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Coupon
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
