"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Wine,
  Heart,
  Plus,
  Building2,
  BarChart3,
  User,
  Tv,
} from "lucide-react";
import { motion } from "framer-motion";

const leftItems = [
  { href: "/collection", label: "Collection", icon: Wine },
  { href: "/distilleries", label: "Distilleries", icon: Building2 },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

const centerItem = { href: "/add", label: "Add", icon: Plus };

const rightItems = [
  { href: "/bourbon-anime", label: "Anime", icon: Tv },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    return (
      pathname === href ||
      (href !== "/add" && pathname.startsWith(href))
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass border-t border-white/[0.06] px-1 pb-safe">
        <div className="flex items-end justify-evenly h-[68px]">
          {/* Left 3 tabs */}
          {leftItems.map((item) => (
            <NavTab
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isActive(item.href)}
            />
          ))}

          {/* Center elevated Add button */}
          <Link
            href={centerItem.href}
            className="relative flex flex-col items-center -mb-1"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
                delay: 0.2,
              }}
              className={cn(
                "w-14 h-14 -mt-5 rounded-full flex items-center justify-center transition-all",
                "bg-gradient-to-br from-whiskey-gold to-amber-700",
                "shadow-lg shadow-amber-900/40",
                "active:scale-95"
              )}
            >
              <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
            </motion.div>
            <span className="text-[9px] font-medium text-muted-foreground mt-0.5 leading-none">
              Add
            </span>
          </Link>

          {/* Right 3 tabs */}
          {rightItems.map((item) => (
            <NavTab
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isActive(item.href)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

function NavTab({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-col items-center justify-center gap-0.5",
        "min-w-[44px] min-h-[48px] px-0.5 pt-2 pb-1 transition-colors",
        active
          ? "text-whiskey-gold"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute top-0 w-5 h-0.5 bg-gradient-to-r from-whiskey-gold to-amber-500 rounded-full"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      )}
      <Icon
        className={cn(
          "w-[20px] h-[20px] transition-transform",
          active && "scale-110"
        )}
      />
      <span className="text-[9px] font-medium leading-none max-[374px]:hidden">
        {label}
      </span>
    </Link>
  );
}
