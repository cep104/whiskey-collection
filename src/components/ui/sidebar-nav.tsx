"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Wine,
  Heart,
  PlusCircle,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/collection", label: "Collection", icon: Wine },
  { href: "/wishlist", label: "Wish List", icon: Heart },
  { href: "/add", label: "Add Bottle", icon: PlusCircle },
  { href: "/stats", label: "Statistics", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
];

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow glass border-r border-white/[0.06] pt-8 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-whiskey-gold to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30">
            <Wine className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-serif font-bold text-gradient">
            Cask & Carry
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/add" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-whiskey-gold/15 text-whiskey-gold border border-whiskey-gold/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 mt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-all w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
