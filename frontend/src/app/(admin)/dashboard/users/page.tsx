"use client";

import {
  ColumnDef,
  DataTable,
  SingleSelectFilter,
} from "@/components/dashboard";
import { AddUserSheet } from "@/components/dashboard/users/AddUserSheet";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from "@/store/api/adminApi";
import { faPen, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "restaurant" | "customer" | "superadmin";
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<
    "restaurant" | "customer" | "superadmin" | undefined
  >(undefined);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<string | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const { data, isLoading, error } = useGetUsersQuery({
    page,
    limit,
    search,
    role,
    isActive,
  });

  if (error) {
    console.error("Error fetching users:", error);
  }

  const [updateUserStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleStatusChange = async (id: string, currentStatus: boolean) => {
    try {
      await updateUserStatus({ id, isActive: !currentStatus }).unwrap();
      toast.success(
        `User ${!currentStatus ? "activated" : "deactivated"} successfully`,
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
      console.error("Failed to update status", error);
    }
  };

  const handleAddUser = () => {
    setUserToEdit(null);
    setIsSheetOpen(true);
  };

  const handleEditUser = (userId: string) => {
    setUserToEdit(userId);
    setIsSheetOpen(true);
  };

  const handleDeleteClick = (user: AdminUser) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id).unwrap();
      toast.success("User deleted successfully");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user");
      console.error("Failed to delete user", error);
    }
  };

  const columns: ColumnDef<AdminUser>[] = [
    {
      header: "User",
      cell: (user) => (
        <div>
          <span className="font-medium text-foreground block">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-xs text-muted-foreground block">
            {user.email}
          </span>
        </div>
      ),
    },
    {
      header: "Phone",
      cell: (user) => (
        <span className="text-sm text-muted-foreground">
          {user.phone || "-"}
        </span>
      ),
    },
    {
      header: "Role",
      cell: (user) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
            ${
              user.role === "restaurant"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                : user.role === "superadmin"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
            }
         `}
        >
          {user.role}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (user) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStatusChange(user.id, user.isActive)}
            disabled={isUpdating}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              user.isActive ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <span
              className={`${
                user.isActive ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
          <span className="text-xs text-muted-foreground">
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      header: "Created At",
      cell: (user) => (
        <span className="text-xs text-muted-foreground">
          {format(new Date(user.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (user) => (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => handleEditUser(user.id)}
                >
                  <FontAwesomeIcon icon={faPen} className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit User</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => handleDeleteClick(user)}
                >
                  <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete User</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 overflow-x-hidden">
      <div className="flex justify-between">
        <div className="w-4/5 flex gap-4">
          <input
            placeholder="Search users..."
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm w-full max-w-xs focus:ring-2 focus:ring-primary focus:outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <SingleSelectFilter
            label="Role"
            options={[
              { value: "all", label: "All Roles" },
              { value: "customer", label: "Customer" },
              { value: "restaurant", label: "Restaurant" },
            ]}
            value={role || "all"}
            onChange={(val) => {
              setRole(val === "all" ? undefined : (val as any));
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
          <Button onClick={handleAddUser}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      <DataTable
        title="Recent Users"
        data={(data?.data || []) as AdminUser[]}
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

      {/* Add/Edit User Sheet */}
      <AddUserSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        userToEdit={userToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {userToDelete?.firstName} {userToDelete?.lastName}
              </span>
              ? This action cannot be undone and will permanently remove the
              user from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting && (
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  className="mr-2 h-4 w-4"
                />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
