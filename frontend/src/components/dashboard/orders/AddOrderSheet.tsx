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
  useGetOrderQuery,
  useGetRestaurantsForFilterQuery,
  useGetUsersQuery,
  useUpdateOrderMutation,
} from "@/store/api/adminApi";
import { faPlus, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddOrderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderToEdit?: string | null;
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
  status?: string;
}

export function AddOrderSheet({
  open,
  onOpenChange,
  orderToEdit,
}: AddOrderSheetProps) {
  const [createOrder, { isLoading: isCreating }] =
    useCreateAdminOrderMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  // Fetch full order details if editing
  const { data: orderData, isFetching: isOrderFetching } = useGetOrderQuery(
    orderToEdit || "",
    {
      skip: !orderToEdit,
    },
  );

  const { data: restaurants, isLoading: isRestaurantsLoading } =
    useGetRestaurantsForFilterQuery();
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery({
    role: "customer",
    limit: 100,
  });

  const isLoading = isCreating || isUpdating || isOrderFetching;

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

  const { data: dishesData, isFetching: isDishesFetching } = useGetDishesQuery(
    {
      restaurantId: selectedRestaurantId,
      limit: 100,
      isAvailable: true,
    },
    {
      skip: !selectedRestaurantId,
    },
  );

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "items",
  });

  // Reset form when opening for a new order (no orderToEdit)
  useEffect(() => {
    if (open && !orderToEdit) {
      reset({
        userId: "",
        restaurantId: "",
        items: [{ menuItemId: "", quantity: 1 }],
        deliveryType: "delivery",
        paymentMethod: "cod",
        paymentStatus: "pending",
        note: "",
      });
    }
  }, [open, orderToEdit, reset]);

  // Populate form when orderData is available (for editing)
  useEffect(() => {
    if (orderToEdit && orderData && !isOrderFetching) {
      reset({
        userId: orderData.userId || orderData.user?.id || "",
        restaurantId: orderData.restaurantId || orderData.restaurant?.id || "",
        deliveryType: orderData.deliveryType,
        paymentMethod: orderData.paymentMethod || "cod",
        paymentStatus: orderData.paymentStatus || "pending",
        status: orderData.status,
        note: orderData.specialInstructions || "",
        items:
          orderData.items?.map((item: any) => ({
            menuItemId: item.menuItemId || item.menuItem?.id,
            quantity: Number(item.quantity),
          })) || [],
      });
    }
  }, [orderToEdit, orderData, isOrderFetching, reset]);

  const onSubmit = async (data: OrderFormData) => {
    try {
      if (data.items.length === 0) {
        toast.error("Please add at least one item");
        return;
      }

      const payload = {
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
        status: data.status, // Include status update if editing
      };

      if (orderToEdit) {
        await updateOrder({ id: orderToEdit, data: payload }).unwrap();
        toast.success("Order updated successfully");
      } else {
        await createOrder(payload).unwrap();
        toast.success("Order created successfully");
      }

      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to save order",
      );
      console.error("Save order error:", JSON.stringify(error, null, 2));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-[400px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>
            {orderToEdit ? "Edit Order" : "Create New Order"}
          </SheetTitle>
          <SheetDescription>
            {orderToEdit
              ? "Update order details and items."
              : "Place a new order on behalf of a customer."}
          </SheetDescription>
        </SheetHeader>

        {(orderToEdit && (isOrderFetching || isDishesFetching)) ||
        isRestaurantsLoading ||
        isUsersLoading ? (
          <div className="flex justify-center items-center py-10">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="h-8 w-8 text-primary"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Customer Selection */}
            <div className="space-y-2">
              <Label htmlFor="userId">
                Customer <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(val) => setValue("userId", val)}
                value={watch("userId")}
                disabled={!!orderToEdit}
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
              <input
                type="hidden"
                {...register("userId", { required: true })}
              />
            </div>

            {/* Restaurant Selection */}
            <div className="space-y-2">
              <Label htmlFor="restaurantId">
                Restaurant <span className="text-red-500">*</span>
              </Label>
              <Select
                disabled={!!orderToEdit}
                onValueChange={(val) => {
                  setValue("restaurantId", val);
                  // For manual change (only relevant if not disabled, i.e. new order):
                  setValue("items", [{ menuItemId: "", quantity: 1 }]);
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
                      disabled={fields.length <= 1}
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

            <div className="grid grid-cols-2 gap-4">
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

              {orderToEdit && (
                <div className="space-y-2">
                  <Label>Order Status</Label>
                  <Select
                    value={watch("status")}
                    onValueChange={(val: any) => setValue("status", val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="out_for_delivery">
                        Out for Delivery
                      </SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
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
                {orderToEdit ? "Update Order" : "Create Order"}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
