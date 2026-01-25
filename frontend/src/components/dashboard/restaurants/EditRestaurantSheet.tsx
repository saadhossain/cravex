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
  AdminRestaurant,
  useUpdateRestaurantMutation,
} from "@/store/api/adminApi";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditRestaurantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: AdminRestaurant | null;
}

interface RestaurantFormData {
  name: string;
  logoUrl?: string;
  address: string;
  minimumDelivery: number;
  deliveryFee: number;
  deliveryTimeMinutes: number;
  description: string;
  phone: string;
  email: string;
}

export function EditRestaurantSheet({
  open,
  onOpenChange,
  restaurant,
}: EditRestaurantSheetProps) {
  const [updateRestaurant, { isLoading }] = useUpdateRestaurantMutation();
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (file.size > 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("logoUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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
    if (open && restaurant) {
      reset({
        name: restaurant.name,
        logoUrl: restaurant.logoUrl || "",
        address: restaurant.address || "",
        minimumDelivery: restaurant.minimumDelivery || 0, // Ensure field exists in AdminRestaurant or fallback
        deliveryFee: restaurant.deliveryFee || 0,
        deliveryTimeMinutes: restaurant.deliveryTimeMinutes || 30,
        description: restaurant.description || "",
        phone: restaurant.phone || "",
        email: restaurant.email || "",
      });
    }
  }, [open, restaurant, reset]);

  const onSubmit = async (data: RestaurantFormData) => {
    if (!restaurant) return;

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
      };

      await updateRestaurant({ id: restaurant.id, data: payload }).unwrap();

      toast.success("Restaurant updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update restaurant");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-[400px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>Edit Restaurant</SheetTitle>
          <SheetDescription>Update restaurant details.</SheetDescription>
        </SheetHeader>

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
            <Label>Logo URL</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/25 hover:border-primary"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) processFile(file);
              }}
              onClick={() =>
                document.getElementById("edit-logo-upload-input")?.click()
              }
            >
              {watch("logoUrl") ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden">
                  <img
                    src={watch("logoUrl")}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      setValue("logoUrl", "");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-foreground">
                    Click or drag image to upload
                  </p>
                  <p className="text-xs text-muted-foreground">Max size 1MB</p>
                </>
              )}
            </div>
            <input
              id="edit-logo-upload-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processFile(file);
              }}
            />
            <input type="hidden" {...register("logoUrl")} />
          </div>

          {/* Admin Info - Read Only */}
          <div className="space-y-2 border p-4 rounded-md bg-muted/20">
            <Label>Owner Information (Read-only)</Label>
            <Select disabled value="current">
              <SelectTrigger>
                <SelectValue>
                  {restaurant?.owner?.email || "No Owner Assigned"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">
                  {restaurant?.owner?.firstName} {restaurant?.owner?.lastName} (
                  {restaurant?.owner?.email})
                </SelectItem>
              </SelectContent>
            </Select>
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
              Update Restaurant
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
