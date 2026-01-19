import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Coupon,
  useCreateCouponMutation,
  useGetDishesQuery,
  useGetRestaurantsForFilterQuery,
  useUpdateCouponMutation,
} from "@/store/api/adminApi";
import { faCalendar, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddCouponSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  couponToEdit?: Coupon | null;
}

interface CouponFormData {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: string;
  minimumOrder?: string;
  maxDiscount?: string;
  validFrom?: Date;
  validTo?: Date;
  maxUsageCount?: string;
  restaurantId?: string;
  menuItemId?: string;
  isActive: boolean;
}

export function AddCouponSheet({
  open,
  onOpenChange,
  couponToEdit,
}: AddCouponSheetProps) {
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const { data: restaurants } = useGetRestaurantsForFilterQuery();
  const [scope, setScope] = useState<"restaurant" | "food">("restaurant");

  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CouponFormData>({
    defaultValues: {
      discountType: "percentage",
      isActive: true,
    },
  });

  const discountType = watch("discountType");
  const selectedRestaurantId = watch("restaurantId");

  // Effect to populate form when couponToEdit changes
  useEffect(() => {
    if (open) {
      if (couponToEdit) {
        // Determine scope
        const newScope = couponToEdit.menuItemId ? "food" : "restaurant";
        setScope(newScope);

        setValue("code", couponToEdit.code);
        setValue("discountType", couponToEdit.discountType);
        setValue("discountValue", couponToEdit.discountValue.toString());
        setValue(
          "minimumOrder",
          couponToEdit.minimumOrder ? couponToEdit.minimumOrder.toString() : "",
        );
        setValue(
          "maxDiscount",
          couponToEdit.maxDiscount ? couponToEdit.maxDiscount.toString() : "",
        );
        setValue(
          "validFrom",
          couponToEdit.validFrom ? new Date(couponToEdit.validFrom) : undefined,
        );
        setValue(
          "validTo",
          couponToEdit.validTo ? new Date(couponToEdit.validTo) : undefined,
        );
        setValue(
          "maxUsageCount",
          couponToEdit.maxUsageCount
            ? couponToEdit.maxUsageCount.toString()
            : "",
        );
        setValue("isActive", couponToEdit.isActive);

        // Handle relations
        const rId = couponToEdit.restaurantId || couponToEdit.restaurant?.id;
        if (rId) {
          setValue("restaurantId", rId);
        } else {
          setValue("restaurantId", "all");
        }

        // For food items we need to wait for dishes data or just set it if available
        // But since we fetch dishes based on restaurantId, setting restaurantId first is key.
        // We might need a small timeout or just set it and hope the Query picks it up.
        // However, useGetDishesQuery depends on selectedRestaurantId which is watched.
        // So setting restaurantId above should trigger the query.
        const mId = couponToEdit.menuItemId;
        if (mId) {
          setValue("menuItemId", mId);
        }
      } else {
        // Reset form for adding new coupon
        reset({
          code: "",
          discountType: "percentage",
          discountValue: "",
          minimumOrder: "",
          maxDiscount: "",
          validFrom: undefined,
          validTo: undefined,
          maxUsageCount: "",
          restaurantId: undefined,
          menuItemId: undefined,
          isActive: true,
        });
        setScope("restaurant");
      }
    }
  }, [open, couponToEdit, reset, setValue]);

  const { data: dishesData } = useGetDishesQuery(
    {
      restaurantId:
        selectedRestaurantId === "all" ? undefined : selectedRestaurantId,
      limit: 100,
    },
    {
      skip:
        scope !== "food" ||
        !selectedRestaurantId ||
        selectedRestaurantId === "all",
    },
  );

  const onSubmit = async (data: CouponFormData) => {
    try {
      const payload = {
        code: data.code,
        discountType: data.discountType,
        discountValue: Number(data.discountValue),
        minimumOrder: data.minimumOrder ? Number(data.minimumOrder) : undefined,
        maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : undefined,
        maxUsageCount: data.maxUsageCount
          ? Number(data.maxUsageCount)
          : undefined,
        restaurantId:
          data.restaurantId === "all" ? undefined : data.restaurantId,
        menuItemId: scope === "food" ? data.menuItemId : undefined,
        validFrom: data.validFrom ? data.validFrom.toISOString() : undefined,
        validTo: data.validTo ? data.validTo.toISOString() : undefined,
        isActive: data.isActive,
      };

      if (couponToEdit) {
        await updateCoupon({ id: couponToEdit.id, data: payload }).unwrap();
        toast.success("Coupon updated successfully");
      } else {
        await createCoupon(payload).unwrap();
        toast.success("Coupon created successfully");
      }

      reset();
      setScope("restaurant");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to save coupon",
      );
      console.error("Save coupon error:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {couponToEdit ? "Edit Coupon" : "Add New Coupon"}
          </SheetTitle>
          <SheetDescription>
            {couponToEdit
              ? "Update existing coupon details."
              : "Create a new coupon code for discounts."}
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
                value={discountType}
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
              <Label>Valid From</Label>
              <Controller
                control={control}
                name="validFrom"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <FontAwesomeIcon
                          icon={faCalendar}
                          className="mr-2 h-4 w-4"
                        />
                        {field.value ? (
                          format(field.value, "MMM d, yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        className="w-52"
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Valid To</Label>
              <Controller
                control={control}
                name="validTo"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <FontAwesomeIcon
                          icon={faCalendar}
                          className="mr-2 h-4 w-4"
                        />
                        {field.value ? (
                          format(field.value, "MMM d, yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        className="w-52"
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
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

          <div className="space-y-4">
            <Label>Coupon Scope</Label>
            <Tabs
              defaultValue="restaurant"
              value={scope}
              onValueChange={(val) => setScope(val as "restaurant" | "food")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="restaurant">Restaurant-wide</TabsTrigger>
                <TabsTrigger value="food">Specific Food</TabsTrigger>
              </TabsList>

              <TabsContent value="restaurant" className="space-y-2 pt-2">
                <Label htmlFor="restaurantId">Restaurant (Optional)</Label>
                <Select
                  value={watch("restaurantId") || "all"}
                  onValueChange={(val) => setValue("restaurantId", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select restaurant (or site-wide)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Restaurants (Site-wide)
                    </SelectItem>
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
              </TabsContent>

              <TabsContent value="food" className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="restaurantId-food">
                    Select Restaurant <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch("restaurantId")}
                    onValueChange={(val) => {
                      setValue("restaurantId", val);
                      setValue("menuItemId", ""); // Reset dish when restaurant changes
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a restaurant first" />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurants?.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="menuItemId">
                    Select Food Item <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch("menuItemId")}
                    onValueChange={(val) => setValue("menuItemId", val)}
                    disabled={
                      !selectedRestaurantId || selectedRestaurantId === "all"
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select food item" />
                    </SelectTrigger>
                    <SelectContent>
                      {dishesData?.data?.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name} ({d.price})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(!selectedRestaurantId ||
                    selectedRestaurantId === "all") && (
                    <p className="text-xs text-red-500">
                      Please select a restaurant to see food items.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="isActive"
              checked={watch("isActive")}
              onCheckedChange={(checked) =>
                setValue("isActive", checked as boolean)
              }
            />
            <Label htmlFor="isActive">Active immediately</Label>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  className="mr-2 h-4 w-4"
                />
              )}
              {couponToEdit ? "Update Coupon" : "Create Coupon"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
