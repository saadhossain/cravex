"use client";

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
    <div className="flex min-h-screen bg-gray-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 border-r border-gray-800">
        <div className="flex h-16 items-center px-6 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🍕</span>
            <span className="text-xl font-bold text-white">Cravex</span>
            <span className="text-xs text-orange-500 font-medium px-2 py-0.5 bg-orange-500/10 rounded">
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
                    ? "bg-orange-500/10 text-orange-500"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Separator className="my-4 bg-gray-800" />
        <div className="px-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <span className="text-lg">🏠</span>
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        <header className="h-16 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-white">
            Super Admin Panel
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Welcome, Admin</span>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
