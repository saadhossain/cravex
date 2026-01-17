"use client";

import {
  ColumnDef,
  DataTable,
  SingleSelectFilter,
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from "@/store/api/adminApi";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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

  console.log("Users data:", data);

  const [updateUserStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();

  const handleStatusChange = async (id: string, currentStatus: boolean) => {
    try {
      await updateUserStatus({ id, isActive: !currentStatus }).unwrap();
    } catch (error) {
      console.error("Failed to update status", error);
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
      header: "Role",
      cell: (user) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
            ${
              user.role === "restaurant"
                ? "bg-blue-100 text-blue-800"
                : user.role === "superadmin"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
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
              user.isActive ? "bg-primary" : "bg-gray-200"
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
      header: "Versions",
      cell: (user) => (
        <span className="text-xs text-muted-foreground">
          {/* Not sure what to put here based on "Versions", defaulting to Date */}
          {format(new Date(user.createdAt), "MMM d, yyyy")}
        </span>
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
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 overflow-x-hidden">
      <div className="flex justify-between">
        <div className="w-3/4 flex gap-4">
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
          <Button>
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
    </div>
  );
}
