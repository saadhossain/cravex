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
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateDishMutation,
  useGetCategoriesForRestaurantQuery,
  useGetDishQuery,
  useGetRestaurantsForFilterQuery,
  useUpdateDishMutation,
} from "@/store/api/adminApi";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddDishSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dishToEdit?: string | null;
}

interface DishFormData {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  restaurantId: string;
  imageUrl?: string;
  isAvailable: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  spicyLevel?: number;
  calories?: number;
  preparationTime?: number;
  allergens?: string;
  tags?: string;
}

export function AddDishSheet({
  open,
  onOpenChange,
  dishToEdit,
}: AddDishSheetProps) {
  const [createDish, { isLoading: isCreating }] = useCreateDishMutation();
  const [updateDish, { isLoading: isUpdating }] = useUpdateDishMutation();
  const [isDragging, setIsDragging] = useState(false);

  // Fetch dish details if editing
  const { data: dishData, isFetching: isDishFetching } = useGetDishQuery(
    dishToEdit || "",
    {
      skip: !dishToEdit,
    },
  );

  // Fetch restaurants for selection
  const { data: restaurants, isLoading: isRestaurantsLoading } =
    useGetRestaurantsForFilterQuery();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<DishFormData>({
    defaultValues: {
      isAvailable: true,
      isPopular: false,
      isVegetarian: false,
      isVegan: false,
      isSpicy: false,
      price: 0,
    },
  });

  const selectedRestaurantId = watch("restaurantId");

  // Fetch categories for selected restaurant
  const { data: categories, isFetching: isCategoriesFetching } =
    useGetCategoriesForRestaurantQuery(selectedRestaurantId, {
      skip: !selectedRestaurantId,
    });

  const isLoading = isCreating || isUpdating || isDishFetching;

  const processFile = (file: File) => {
    if (file.size > 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("imageUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Reset form when opening for a new dish
  useEffect(() => {
    if (open && !dishToEdit) {
      reset({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        restaurantId: "",
        imageUrl: "",
        isAvailable: true,
        isPopular: false,
        isVegetarian: false,
        isVegan: false,
        isSpicy: false,
        spicyLevel: undefined,
        calories: undefined,
        preparationTime: undefined,
        allergens: "",
        tags: "",
      });
    }
  }, [open, dishToEdit, reset]);

  // Populate form when dishData is available (for editing)
  useEffect(() => {
    if (dishToEdit && dishData && !isDishFetching) {
      reset({
        name: dishData.name,
        description: dishData.description || "",
        price: Number(dishData.price),
        categoryId: dishData.categoryId || "",
        restaurantId: dishData.restaurantId || "",
        imageUrl: dishData.imageUrl || "",
        isAvailable: dishData.isAvailable,
        isPopular: dishData.isPopular ?? false,
        isVegetarian: dishData.isVegetarian ?? false,
        isVegan: dishData.isVegan ?? false,
        isSpicy: dishData.isSpicy ?? false,
        spicyLevel: dishData.spicyLevel,
        calories: dishData.calories,
        preparationTime: dishData.preparationTime,
        allergens: dishData.allergens?.join(", ") || "",
        tags: dishData.tags?.join(", ") || "",
      });
    }
  }, [dishToEdit, dishData, isDishFetching, reset]);

  const onSubmit = async (data: DishFormData) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
        isAvailable: data.isAvailable,
        isPopular: data.isPopular,
        isVegetarian: data.isVegetarian,
        isVegan: data.isVegan,
        isSpicy: data.isSpicy,
        spicyLevel: data.spicyLevel ? Number(data.spicyLevel) : undefined,
        calories: data.calories ? Number(data.calories) : undefined,
        preparationTime: data.preparationTime
          ? Number(data.preparationTime)
          : undefined,
        allergens: data.allergens
          ? data.allergens
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : undefined,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
      };

      if (dishToEdit) {
        await updateDish({ id: dishToEdit, data: payload }).unwrap();
        toast.success("Dish updated successfully");
      } else {
        await createDish(payload).unwrap();
        toast.success("Dish created successfully");
      }

      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to save dish",
      );
      console.error("Save dish error:", JSON.stringify(error, null, 2));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-[400px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>{dishToEdit ? "Edit Dish" : "Add New Dish"}</SheetTitle>
          <SheetDescription>
            {dishToEdit
              ? "Update dish details."
              : "Create a new dish for a restaurant."}
          </SheetDescription>
        </SheetHeader>

        {(dishToEdit && (isDishFetching || isCategoriesFetching)) ||
        isRestaurantsLoading ? (
          <div className="flex justify-center items-center py-10">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="h-8 w-8 text-primary"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Restaurant Selection */}
            <div className="space-y-2">
              <Label htmlFor="restaurantId">
                Restaurant <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(val) => {
                  setValue("restaurantId", val);
                  setValue("categoryId", ""); // Reset category when restaurant changes
                }}
                value={watch("restaurantId")}
                disabled={!!dishToEdit}
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

            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="categoryId">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(val) => setValue("categoryId", val)}
                value={watch("categoryId")}
                disabled={!selectedRestaurantId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!selectedRestaurantId && (
                <p className="text-sm text-muted-foreground">
                  Select a restaurant first to see categories.
                </p>
              )}
              <input
                type="hidden"
                {...register("categoryId", { required: true })}
              />
            </div>

            {/* Dish Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Dish Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Dish description..."
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Dish Image</Label>
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
                  document.getElementById("dish-image-upload-input")?.click()
                }
              >
                {watch("imageUrl") ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <img
                      src={watch("imageUrl")}
                      alt="Image preview"
                      className="w-full h-full object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue("imageUrl", "");
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
                    <p className="text-xs text-muted-foreground">
                      Max size 1MB
                    </p>
                  </>
                )}
              </div>
              <input
                id="dish-image-upload-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                }}
              />
              <input type="hidden" {...register("imageUrl")} />
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (£) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price", { required: true, min: 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preparationTime">Prep Time (min)</Label>
                <Input
                  id="preparationTime"
                  type="number"
                  min="0"
                  {...register("preparationTime")}
                />
              </div>
            </div>

            {/* Calories & Spicy Level */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  {...register("calories")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spicyLevel">Spicy Level (1-3)</Label>
                <Input
                  id="spicyLevel"
                  type="number"
                  min="1"
                  max="3"
                  {...register("spicyLevel")}
                />
              </div>
            </div>

            {/* Flags */}
            <div className="space-y-3 border p-4 rounded-md">
              <Label>Dish Options</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isAvailable"
                    checked={watch("isAvailable")}
                    onCheckedChange={(checked) =>
                      setValue("isAvailable", checked === true)
                    }
                  />
                  <Label htmlFor="isAvailable" className="cursor-pointer">
                    Available
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPopular"
                    checked={watch("isPopular")}
                    onCheckedChange={(checked) =>
                      setValue("isPopular", checked === true)
                    }
                  />
                  <Label htmlFor="isPopular" className="cursor-pointer">
                    Popular
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isVegetarian"
                    checked={watch("isVegetarian")}
                    onCheckedChange={(checked) =>
                      setValue("isVegetarian", checked === true)
                    }
                  />
                  <Label htmlFor="isVegetarian" className="cursor-pointer">
                    Vegetarian
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isVegan"
                    checked={watch("isVegan")}
                    onCheckedChange={(checked) =>
                      setValue("isVegan", checked === true)
                    }
                  />
                  <Label htmlFor="isVegan" className="cursor-pointer">
                    Vegan
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isSpicy"
                    checked={watch("isSpicy")}
                    onCheckedChange={(checked) =>
                      setValue("isSpicy", checked === true)
                    }
                  />
                  <Label htmlFor="isSpicy" className="cursor-pointer">
                    Spicy
                  </Label>
                </div>
              </div>
            </div>

            {/* Allergens */}
            <div className="space-y-2">
              <Label htmlFor="allergens">Allergens (comma-separated)</Label>
              <Input
                id="allergens"
                {...register("allergens")}
                placeholder="e.g., Gluten, Dairy, Nuts"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                {...register("tags")}
                placeholder="e.g., Bestseller, New, Chef's Special"
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
                {dishToEdit ? "Update Dish" : "Create Dish"}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
