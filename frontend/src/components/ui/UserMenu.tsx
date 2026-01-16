"use client";

import { logout } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    router.push("/login");
  };

  const getUserInitial = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    return "A";
  };

  const getUserName = () => {
    if (user?.firstName) {
      return `${user.firstName} ${user.lastName || ""}`.trim();
    }
    return "Admin";
  };

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          aria-label="User menu"
          aria-expanded={isOpen}
        >
          {getUserInitial()}
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-lg py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-foreground">
              {getUserName()}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || "admin@cravex.com"}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/admin/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <User className="w-4 h-4 text-muted-foreground" />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
