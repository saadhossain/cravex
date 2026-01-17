"use client";

import { ThemeToggle } from "@/components/theme";
import { UserMenu } from "@/components/ui/UserMenu";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Orders", href: "/orders", icon: "📦" },
  { label: "Restaurants", href: "/restaurants", icon: "🍽️" },
  { label: "Dishes", href: "/dishes", icon: "🍔" },
  { label: "Users", href: "/users", icon: "👥" },
  { label: "Coupons", href: "/coupons", icon: "🎟️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when screen gets larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = isCollapsed ? "w-16" : "w-56";
  const mainMargin = isCollapsed ? "lg:ml-16" : "lg:ml-56";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out",
          sidebarWidth,
          // Mobile: hidden by default, shown when menu is open
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2 transition-opacity",
              isCollapsed && "lg:opacity-0 lg:pointer-events-none",
            )}
          >
            <span className="text-2xl">🍕</span>
            {!isCollapsed && (
              <>
                <span className="text-xl font-bold text-foreground">
                  Cravex
                </span>
              </>
            )}
          </Link>

          {/* Collapse button - only on desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {/* Close button - only on mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex lg:hidden items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors"
            aria-label="Close menu"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  isCollapsed && "lg:justify-center lg:px-0",
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="text-lg shrink-0">{item.icon}</span>
                <span
                  className={cn(
                    "transition-opacity duration-200",
                    isCollapsed && "lg:hidden",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="my-4 mx-2 border-t border-border" />

        {/* Back to Home */}
        <div className="px-2">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
              isCollapsed && "lg:justify-center lg:px-0",
            )}
            title={isCollapsed ? "Back to Home" : undefined}
          >
            <span className="text-lg shrink-0">🏠</span>
            <span
              className={cn(
                "transition-opacity duration-200",
                isCollapsed && "lg:hidden",
              )}
            >
              Back to Home
            </span>
          </Link>
        </div>

        {/* Collapse indicator at bottom */}
        {isCollapsed && (
          <div className="absolute bottom-4 left-0 right-0 hidden lg:flex justify-center">
            <div className="w-8 h-1 bg-muted-foreground/20 rounded-full" />
          </div>
        )}
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out min-w-0",
          mainMargin,
        )}
      >
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex lg:hidden items-center justify-center w-10 h-10 rounded-lg hover:bg-accent transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>

          {/* Logo for mobile */}
          <Link href="/dashboard" className="flex lg:hidden items-center gap-2">
            <span className="text-xl">🍕</span>
            <span className="text-lg font-bold text-foreground">Cravex</span>
          </Link>

          {/* Spacer for desktop */}
          <div className="hidden lg:block" />

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>
        <div className="w-full overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}
