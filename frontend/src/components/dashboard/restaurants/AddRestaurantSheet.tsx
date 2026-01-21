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
  useCreateRestaurantMutation,
  useGetUsersQuery,
} from "@/store/api/adminApi";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddRestaurantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RestaurantFormData {
  name: string;
  logoUrl?: string;
  address: string;
  ownerId?: string;
  // New owner fields
  newOwnerFirstName?: string;
  newOwnerLastName?: string;
  newOwnerEmail?: string;
  newOwnerPassword?: string;
  newOwnerPhone?: string;

  minimumDelivery: number;
  deliveryFee: number;
  deliveryTimeMinutes: number;
  description: string;
  phone: string;
  email: string;
}

export function AddRestaurantSheet({
  open,
  onOpenChange,
}: AddRestaurantSheetProps) {
  const [createRestaurant, { isLoading }] = useCreateRestaurantMutation();
  // Fetch users to assign as owner
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery({
    limit: 100,
  });

  const [isNewOwner, setIsNewOwner] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<RestaurantFormData>({
    defaultValues: {
      minimumDelivery: 0,
      deliveryFee: 0,
      deliveryTimeMinutes: 30,
    },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (data: RestaurantFormData) => {
    try {
      const payload: any = {
        name: data.name,
        address: data.address,
        logoUrl: data.logoUrl,
        minimumDelivery: Number(data.minimumDelivery),
        deliveryFee: Number(data.deliveryFee),
        deliveryTimeMinutes: Number(data.deliveryTimeMinutes),
        description: data.description,
        phone: data.phone,
        email: data.email,
        latitude: 0, // Default or handle geo later
        longitude: 0,
      };

      if (isNewOwner) {
        payload.newOwner = {
          firstName: data.newOwnerFirstName || "",
          lastName: data.newOwnerLastName || "",
          email: data.newOwnerEmail || "",
          password: data.newOwnerPassword || "",
          phone: data.newOwnerPhone,
        };
      } else {
        payload.ownerId = data.ownerId;
      }

      await createRestaurant(payload).unwrap();

      toast.success("Restaurant created successfully");
      reset();
      setIsNewOwner(false);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create restaurant");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-[400px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>Add Restaurant</SheetTitle>
          <SheetDescription>
            Create a new restaurant and assign an owner.
          </SheetDescription>
        </SheetHeader>

        {isUsersLoading ? (
          <div className="flex justify-center items-center py-10">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="h-8 w-8 text-primary"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Restaurant Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                placeholder="https://..."
                {...register("logoUrl")}
              />
            </div>

            <div className="space-y-2 border p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <Label>
                  Owner Information <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsNewOwner(!isNewOwner);
                    setValue("ownerId", undefined); // Clear selection
                  }}
                >
                  {isNewOwner ? "Select Existing Owner" : "Add New Admin"}
                </Button>
              </div>

              {!isNewOwner ? (
                <div className="space-y-2">
                  <Select onValueChange={(val) => setValue("ownerId", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an owner" />
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
                    {...register("ownerId", {
                      required: !isNewOwner ? "Owner is required" : false,
                    })}
                  />
                  {errors.ownerId && (
                    <p className="text-sm text-red-500">
                      {errors.ownerId.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newOwnerFirstName">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="newOwnerFirstName"
                        {...register("newOwnerFirstName", {
                          required: isNewOwner
                            ? "First name is required"
                            : false,
                        })}
                      />
                      {errors.newOwnerFirstName && (
                        <p className="text-sm text-red-500">
                          {errors.newOwnerFirstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newOwnerLastName">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="newOwnerLastName"
                        {...register("newOwnerLastName", {
                          required: isNewOwner
                            ? "Last name is required"
                            : false,
                        })}
                      />
                      {errors.newOwnerLastName && (
                        <p className="text-sm text-red-500">
                          {errors.newOwnerLastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newOwnerEmail">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="newOwnerEmail"
                      type="email"
                      {...register("newOwnerEmail", {
                        required: isNewOwner ? "Email is required" : false,
                      })}
                    />
                    {errors.newOwnerEmail && (
                      <p className="text-sm text-red-500">
                        {errors.newOwnerEmail.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newOwnerPassword">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="newOwnerPassword"
                      type="password"
                      {...register("newOwnerPassword", {
                        required: isNewOwner ? "Password is required" : false,
                      })}
                    />
                    {errors.newOwnerPassword && (
                      <p className="text-sm text-red-500">
                        {errors.newOwnerPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newOwnerPhone">Phone</Label>
                    <Input id="newOwnerPhone" {...register("newOwnerPhone")} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minimumDelivery">Min Order</Label>
                <Input
                  id="minimumDelivery"
                  type="number"
                  min="0"
                  {...register("minimumDelivery", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryFee">Delivery Fee</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("deliveryFee", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryTimeMinutes">Time (min)</Label>
                <Input
                  id="deliveryTimeMinutes"
                  type="number"
                  min="1"
                  {...register("deliveryTimeMinutes", { required: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Restaurant description..."
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
                Create Restaurant
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
