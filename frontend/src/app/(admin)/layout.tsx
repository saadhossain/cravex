"use client";

import { ThemeToggle } from "@/components/theme";
import { UserMenu } from "@/components/ui/UserMenu";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Orders", href: "/orders", icon: "📦" },
  { label: "Restaurants", href: "/restaurants", icon: "🍽️" },
  { label: "Users", href: "/users", icon: "👥" },
  { label: "Coupons", href: "/coupons", icon: "🎟️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border">
        <div className="flex h-16 items-center px-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🍕</span>
            <span className="text-xl font-bold text-foreground">Cravex</span>
            <span className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded">
              Admin
            </span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Separator className="my-4 bg-border" />
        <div className="px-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <span className="text-lg">🏠</span>
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-foreground">
            Super Admin Panel
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
