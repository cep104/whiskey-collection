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
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/collection", label: "Collection", icon: Wine },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/add", label: "Add", icon: PlusCircle },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass border-t border-white/[0.06] px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
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
                  "relative flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors",
                  isActive
                    ? "text-whiskey-gold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-[1px] w-8 h-0.5 bg-gradient-to-r from-whiskey-gold to-amber-500 rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isActive && "scale-110"
                  )}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
