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
import {
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/store/api/adminApi";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddUserSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToEdit?: string | null;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  avatarUrl?: string;
  role: "restaurant" | "customer";
  isActive: boolean;
}

export function AddUserSheet({
  open,
  onOpenChange,
  userToEdit,
}: AddUserSheetProps) {
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [isDragging, setIsDragging] = useState(false);

  // Separate state for role to ensure proper Select binding
  const [selectedRole, setSelectedRole] = useState<"restaurant" | "customer">(
    "customer",
  );

  // Fetch user details if editing
  const { data: userData, isFetching: isUserFetching } = useGetUserQuery(
    userToEdit || "",
    {
      skip: !userToEdit,
    },
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      role: "customer",
      isActive: true,
    },
  });

  const isLoading = isCreating || isUpdating || isUserFetching;

  const processFile = (file: File) => {
    if (file.size > 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("avatarUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle role change from Select
  const handleRoleChange = (val: string) => {
    const role = val as "restaurant" | "customer";
    setSelectedRole(role);
    setValue("role", role);
  };

  // Reset form when opening for a new user
  useEffect(() => {
    if (open && !userToEdit) {
      setSelectedRole("customer");
      reset({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        avatarUrl: "",
        role: "customer",
        isActive: true,
      });
    }
  }, [open, userToEdit, reset]);

  // Populate form when userData is available (for editing)
  useEffect(() => {
    if (userToEdit && userData && !isUserFetching) {
      const userRole =
        userData.role === "superadmin" ? "customer" : userData.role;
      setSelectedRole(userRole as "restaurant" | "customer");
      reset({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: "", // Don't populate password for editing
        phone: userData.phone || "",
        avatarUrl: userData.avatarUrl || "",
        role: userRole as "restaurant" | "customer",
        isActive: userData.isActive,
      });
    }
  }, [userToEdit, userData, isUserFetching, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (userToEdit) {
        // For update, only send changed fields (and exclude empty password)
        const payload: any = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || undefined,
          avatarUrl: data.avatarUrl || undefined,
          role: selectedRole,
          isActive: data.isActive,
        };

        // Only include password if it's provided (for password change)
        if (data.password && data.password.trim() !== "") {
          payload.password = data.password;
        }

        await updateUser({ id: userToEdit, data: payload }).unwrap();
        toast.success("User updated successfully");
      } else {
        // For create, password is required
        if (!data.password || data.password.trim() === "") {
          toast.error("Password is required for new users");
          return;
        }

        const payload = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phone: data.phone || undefined,
          avatarUrl: data.avatarUrl || undefined,
          role: selectedRole,
          isActive: data.isActive,
        };

        await createUser(payload).unwrap();
        toast.success("User created successfully");
      }

      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to save user",
      );
      console.error("Save user error:", JSON.stringify(error, null, 2));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle>{userToEdit ? "Edit User" : "Add New User"}</SheetTitle>
          <SheetDescription>
            {userToEdit
              ? "Update user details."
              : "Create a new customer or restaurant user."}
          </SheetDescription>
        </SheetHeader>

        {userToEdit && isUserFetching ? (
          <div className="flex justify-center items-center py-10">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="h-8 w-8 text-primary"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* User Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">
                User Type <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={handleRoleChange} value={selectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-800">
                        👤
                      </span>
                      <span className="font-medium">Customer</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="restaurant">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800">
                        🏪
                      </span>
                      <span className="font-medium">Restaurant</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register("role", { required: true })} />
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password{" "}
                {!userToEdit && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={
                  userToEdit
                    ? "Leave empty to keep current password"
                    : "Min 6 characters"
                }
                {...register("password", {
                  required: !userToEdit ? "Password is required" : false,
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
              {userToEdit && (
                <p className="text-xs text-muted-foreground">
                  Leave empty to keep the current password unchanged.
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                {...register("phone")}
              />
            </div>

            {/* Avatar Upload */}
            <div className="space-y-2">
              <Label>Avatar</Label>
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
                  document.getElementById("user-avatar-upload-input")?.click()
                }
              >
                {watch("avatarUrl") ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden">
                    <img
                      src={watch("avatarUrl")}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-1 -right-1 h-5 w-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue("avatarUrl", "");
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      Click or drag avatar to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max size 1MB
                    </p>
                  </>
                )}
              </div>
              <input
                id="user-avatar-upload-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                }}
              />
              <input type="hidden" {...register("avatarUrl")} />
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-base">
                  Active Status
                </Label>
                <p className="text-sm text-muted-foreground">
                  {watch("isActive")
                    ? "User can login and access the platform"
                    : "User cannot login or access the platform"}
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
                {userToEdit ? "Update User" : "Create User"}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
