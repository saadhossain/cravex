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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateCategoryMutation,
  useGetCategoryQuery,
  useGetRestaurantsForFilterQuery,
  useUpdateCategoryMutation,
} from "@/store/api/adminApi";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddCategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryToEdit?: string | null;
}

interface CategoryFormData {
  name: string;
  description?: string;
  restaurantId: string;
  displayOrder?: number;
  imageUrl?: string;
  isActive: boolean;
}

export function AddCategorySheet({
  open,
  onOpenChange,
  categoryToEdit,
}: AddCategorySheetProps) {
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const { data: restaurants } = useGetRestaurantsForFilterQuery();
  const [isDragging, setIsDragging] = useState(false);
  // Remove redundant local state

  // Fetch category details if editing
  const { data: categoryData, isFetching: isCategoryFetching } =
    useGetCategoryQuery(categoryToEdit || "", {
      skip: !categoryToEdit,
    });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      isActive: true,
      displayOrder: 0,
    },
  });

  const currentRestaurantId = watch("restaurantId");

  const isLoading = isCreating || isUpdating || isCategoryFetching;

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

  const handleRestaurantChange = (val: string) => {
    setValue("restaurantId", val, { shouldValidate: true });
  };

  // Reset form when opening for a new category
  useEffect(() => {
    if (open && !categoryToEdit) {
      reset({
        name: "",
        description: "",
        restaurantId: "",
        displayOrder: 0,
        imageUrl: "",
        isActive: true,
      });
    }
  }, [open, categoryToEdit, reset]);

  // Populate form when categoryData is available (for editing)
  useEffect(() => {
    if (
      open &&
      categoryToEdit &&
      categoryData &&
      !isCategoryFetching &&
      restaurants
    ) {
      // Use restaurantId directly, or fallback to restaurant.id from the relation
      const restaurantId =
        categoryData.restaurantId || categoryData.restaurant?.id || "";

      reset({
        name: categoryData.name,
        description: categoryData.description || "",
        restaurantId: restaurantId,
        displayOrder: categoryData.displayOrder,
        imageUrl: categoryData.imageUrl || "",
        isActive: categoryData.isActive,
      });
    }
  }, [
    open,
    categoryToEdit,
    categoryData,
    isCategoryFetching,
    reset,
    restaurants,
  ]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (categoryToEdit) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { restaurantId, ...updateData } = data;
        await updateCategory({
          id: categoryToEdit,
          data: {
            ...updateData,
            displayOrder: data.displayOrder ? Number(data.displayOrder) : 0,
          },
        }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await createCategory({
          ...data,
          displayOrder: data.displayOrder ? Number(data.displayOrder) : 0,
        }).unwrap();
        toast.success("Category created successfully");
      }

      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to save category",
      );
      console.error("Save category error:", JSON.stringify(error, null, 2));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle>
            {categoryToEdit ? "Edit Category" : "Add New Category"}
          </SheetTitle>
          <SheetDescription>
            {categoryToEdit
              ? "Update category details."
              : "Create a new category for a restaurant menu."}
          </SheetDescription>
        </SheetHeader>

        {categoryToEdit && isCategoryFetching ? (
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
                key={currentRestaurantId || "empty"}
                onValueChange={handleRestaurantChange}
                value={currentRestaurantId || ""}
                disabled={!!categoryToEdit} // Generally, moving category between restaurants is not common, but can enable if needed
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select restaurant" />
                </SelectTrigger>
                <SelectContent>
                  {restaurants?.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("restaurantId", {
                  required: "Restaurant is required",
                })}
              />
              {errors.restaurantId && (
                <p className="text-sm text-red-500">
                  {errors.restaurantId.message}
                </p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Burgers, Drinks"
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
                placeholder="Category description..."
                {...register("description")}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Image</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
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
                  document
                    .getElementById("category-image-upload-input")
                    ?.click()
                }
              >
                {watch("imageUrl") ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <img
                      src={watch("imageUrl")}
                      alt="Category preview"
                      className="w-full h-full object-cover"
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
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
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
                id="category-image-upload-input"
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

            {/* Display Order */}
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                placeholder="0"
                {...register("displayOrder", { min: 0 })}
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first in the menu.
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-base">
                  Active Status
                </Label>
                <p className="text-sm text-muted-foreground">
                  {watch("isActive")
                    ? "Category is visible in the menu"
                    : "Category is hidden from the menu"}
                </p>
              </div>
              <Switch
                id="isActive"
                checked={watch("isActive")}
                onCheckedChange={(checked) => setValue("isActive", checked)}
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
                {categoryToEdit ? "Update Category" : "Create Category"}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
