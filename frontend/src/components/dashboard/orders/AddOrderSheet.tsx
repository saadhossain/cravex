import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateAdminOrderMutation,
  useGetDishesQuery,
  useGetRestaurantsForFilterQuery,
  useGetUsersQuery,
} from "@/store/api/adminApi";
import { faPlus, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Assuming installed
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddOrderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OrderItemForm {
  menuItemId: string;
  quantity: number;
}

interface OrderFormData {
  userId: string;
  restaurantId: string;
  items: OrderItemForm[];
  deliveryType: "delivery" | "collection";
  paymentMethod: "cash" | "card" | "cod";
  paymentStatus: string;
  note: string;
}

export function AddOrderSheet({ open, onOpenChange }: AddOrderSheetProps) {
  const [createOrder, { isLoading }] = useCreateAdminOrderMutation();
  const { data: restaurants } = useGetRestaurantsForFilterQuery();
  // Fetch users (customers) - limiting to 100 for now
  const { data: usersData } = useGetUsersQuery({
    role: "customer",
    limit: 100,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderFormData>({
    defaultValues: {
      deliveryType: "delivery",
      paymentMethod: "cod",
      paymentStatus: "pending",
      items: [{ menuItemId: "", quantity: 1 }],
      note: "",
    },
  });

  const selectedRestaurantId = watch("restaurantId");

  const { data: dishesData } = useGetDishesQuery(
    {
      restaurantId: selectedRestaurantId,
      limit: 100,
      isAvailable: true,
    },
    {
      skip: !selectedRestaurantId,
    },
  );

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  // Reset items when restaurant changes
  useEffect(() => {
    // Only reset if we actually have items that don't belong to the new restaurant
    // But simplest is to just clear items when restaurant changes manually
    // However, setValue inside useEffect for watched value can cause loops if not careful.
    // We'll handle this in the onValueChange of the restaurant select.
  }, [selectedRestaurantId]);

  const onSubmit = async (data: OrderFormData) => {
    try {
      if (data.items.length === 0) {
        toast.error("Please add at least one item");
        return;
      }

      await createOrder({
        userId: data.userId,
        restaurantId: data.restaurantId,
        items: data.items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: Number(item.quantity),
        })),
        deliveryType: data.deliveryType,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        note: data.note,
      }).unwrap();

      toast.success("Order created successfully");
      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to create order",
      );
      console.error("Create order error:", JSON.stringify(error, null, 2));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-[400px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>Create New Order</SheetTitle>
          <SheetDescription>
            Place a new order on behalf of a customer.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Customer Selection */}
          <div className="space-y-2">
            <Label htmlFor="userId">
              Customer <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(val) => setValue("userId", val)}
              value={watch("userId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {usersData?.data?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.userId && ( // Note: useForm validation (required: true) isn't directly on Select without Controller, but we can check watch or use Controller. For simplicity, checking watch in onSubmit or trusting Select required?
              // React Hook Form with UI components usually needs Controller or setValue/register hidden input.
              // I'll use simple validation or Controller if needed. For now, let's just make it required in logic or rely on html5 validation of hidden input if I added one.
              // Actually, simpler is to check in onSubmit or use Controller. I'll use Controller pattern implicitly by checking validity or just required constraint in register if I could register a hidden input.
              // But standard shadcn pattern often uses Controller. I'll stick to setValue and visual validation.
              <span className="text-xs text-red-500">Required</span>
            )}
            <input type="hidden" {...register("userId", { required: true })} />
          </div>

          {/* Restaurant Selection */}
          <div className="space-y-2">
            <Label htmlFor="restaurantId">
              Restaurant <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(val) => {
                setValue("restaurantId", val);
                setValue("items", [{ menuItemId: "", quantity: 1 }]); // Reset items
              }}
              value={watch("restaurantId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a restaurant" />
              </SelectTrigger>
              <SelectContent>
                {restaurants?.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register("restaurantId", { required: true })}
            />
          </div>

          {/* Items Selection */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Order Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ menuItemId: "", quantity: 1 })}
                disabled={!selectedRestaurantId}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2 h-3 w-3" />
                Add Item
              </Button>
            </div>

            {!selectedRestaurantId && (
              <p className="text-sm text-muted-foreground">
                Select a restaurant to add items.
              </p>
            )}

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-2 items-start bg-muted/40 p-2 rounded-md"
                >
                  <div className="flex-1 space-y-1">
                    <Select
                      value={watch(`items.${index}.menuItemId`)}
                      onValueChange={(val) =>
                        setValue(`items.${index}.menuItemId`, val)
                      }
                      disabled={!selectedRestaurantId}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select dish" />
                      </SelectTrigger>
                      <SelectContent>
                        {dishesData?.data?.map((dish) => (
                          <SelectItem key={dish.id} value={dish.id}>
                            {dish.name} - £{dish.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="hidden"
                      {...register(`items.${index}.menuItemId`, {
                        required: true,
                      })}
                    />
                  </div>

                  <div className="w-20">
                    <Input
                      type="number"
                      min="1"
                      className="h-9"
                      {...register(`items.${index}.quantity`, {
                        required: true,
                        min: 1,
                      })}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => remove(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Delivery Type</Label>
              <Select
                value={watch("deliveryType")}
                onValueChange={(val: any) => setValue("deliveryType", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="collection">
                    Pickup (Collection)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={watch("paymentMethod")}
                onValueChange={(val: any) => setValue("paymentMethod", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Status</Label>
            <Select
              value={watch("paymentStatus")}
              onValueChange={(val: any) => setValue("paymentStatus", val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Special Instructions</Label>
            <Textarea
              id="note"
              {...register("note")}
              placeholder="Any notes for the restaurant..."
            />
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
              Create Order
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
