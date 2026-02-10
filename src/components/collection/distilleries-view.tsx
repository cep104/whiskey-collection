"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Whiskey } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/ui/star-rating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MiniBottle } from "@/components/collection/bottle-tracker";
import {
  Building2,
  Globe,
  Wine,
  DollarSign,
  Star,
  Search,
  X,
  ChevronDown,
  LayoutGrid,
  List,
  Flame,
  Trophy,
  Crown,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
  Bourbon: "#d97706",
  Scotch: "#b45309",
  Rye: "#92400e",
  Irish: "#78350f",
  Japanese: "#ea580c",
  "Single Malt": "#f59e0b",
  Blended: "#fbbf24",
};

const SORT_OPTIONS = [
  { value: "bottles-desc", label: "Most Bottles" },
  { value: "bottles-asc", label: "Fewest Bottles" },
  { value: "value-desc", label: "Highest Value" },
  { value: "value-asc", label: "Lowest Value" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
  { value: "rating-desc", label: "Best Rated" },
];

interface DistilleriesViewProps {
  whiskeys: Whiskey[];
}

interface DistilleryGroup {
  name: string;
  country: string | null;
  region: string | null;
  bottles: Whiskey[];
  totalBottles: number;
  totalValue: number;
  avgRating: number;
  ratedCount: number;
  types: string[];
  avgFill: number;
  fullBottles: number;
  partialBottles: number;
  nearEmpty: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  earned: boolean;
  progress: number;
  current: number;
  threshold: number;
  detail: string;
}

export function DistilleriesView({ whiskeys }: DistilleriesViewProps) {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sort, setSort] = useState("bottles-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedDistillery, setExpandedDistillery] = useState<string | null>(
    null
  );

  const { allGroups, filteredGroups, globalStats, achievements } =
    useMemo(() => {
      // Group whiskeys by distillery
      const map = new Map<string, DistilleryGroup>();

      whiskeys.forEach((w) => {
        const key = w.distillery || "Unknown Distillery";
        const existing = map.get(key);
        if (existing) {
          existing.bottles.push(w);
        } else {
          map.set(key, {
            name: key,
            country: w.country,
            region: w.region,
            bottles: [w],
            totalBottles: 0,
            totalValue: 0,
            avgRating: 0,
            ratedCount: 0,
            types: [],
            avgFill: 0,
            fullBottles: 0,
            partialBottles: 0,
            nearEmpty: 0,
          });
        }
      });

      // Compute stats for each group
      const groups = Array.from(map.values()).map((g) => {
        const ratings = g.bottles
          .filter((b) => b.rating != null && b.rating > 0)
          .map((b) => b.rating!);
        const typeSet = new Set(g.bottles.map((b) => b.type));

        g.totalBottles = g.bottles.reduce(
          (sum, b) => sum + (b.number_of_bottles || 1),
          0
        );
        g.totalValue = g.bottles.reduce(
          (sum, b) => sum + (b.purchase_price || 0),
          0
        );
        g.avgRating =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;
        g.ratedCount = ratings.length;
        g.types = Array.from(typeSet);
        g.avgFill =
          g.bottles.reduce(
            (sum, b) => sum + (b.current_bottle_fill_percentage ?? 100),
            0
          ) / g.bottles.length;
        g.fullBottles = g.bottles.filter(
          (b) => (b.current_bottle_fill_percentage ?? 100) >= 90
        ).length;
        g.partialBottles = g.bottles.filter((b) => {
          const fill = b.current_bottle_fill_percentage ?? 100;
          return fill > 10 && fill < 90;
        }).length;
        g.nearEmpty = g.bottles.filter(
          (b) => (b.current_bottle_fill_percentage ?? 100) <= 10
        ).length;

        return g;
      });

      // Global stats
      const uniqueCountries = Array.from(
        new Set(whiskeys.map((w) => w.country).filter(Boolean) as string[])
      ).sort();
      const totalBottleCount = whiskeys.reduce(
        (sum, w) => sum + (w.number_of_bottles || 1),
        0
      );
      const totalValue = whiskeys.reduce(
        (sum, w) => sum + (w.purchase_price || 0),
        0
      );

      const gStats = {
        totalDistilleries: groups.length,
        totalBottleCount,
        totalValue,
        uniqueCountries,
      };

      // Achievements
      const maxFromOne = Math.max(...groups.map((g) => g.bottles.length), 0);
      const topDistillery =
        groups.length > 0
          ? groups.reduce((a, b) =>
              a.bottles.length >= b.bottles.length ? a : b
            )
          : null;
      const premiumBottles = whiskeys.filter(
        (w) => (w.purchase_price || 0) > 200
      );
      const mostExpensive = premiumBottles.length
        ? premiumBottles.reduce((a, b) =>
            (a.purchase_price || 0) >= (b.purchase_price || 0) ? a : b
          )
        : null;

      const achs: Achievement[] = [
        {
          id: "completionist",
          title: "Completionist",
          description: "3+ bottles from one distillery",
          icon: Trophy,
          earned: maxFromOne >= 3,
          progress: Math.min(100, (maxFromOne / 3) * 100),
          current: maxFromOne,
          threshold: 3,
          detail: topDistillery
            ? `${topDistillery.name} (${topDistillery.bottles.length})`
            : "",
        },
        {
          id: "enthusiast",
          title: "Enthusiast",
          description: "5+ bottles from one distillery",
          icon: Flame,
          earned: maxFromOne >= 5,
          progress: Math.min(100, (maxFromOne / 5) * 100),
          current: maxFromOne,
          threshold: 5,
          detail: topDistillery
            ? `${topDistillery.name} (${topDistillery.bottles.length})`
            : "",
        },
        {
          id: "world-traveler",
          title: "World Traveler",
          description: "Collect from 5+ countries",
          icon: Globe,
          earned: uniqueCountries.length >= 5,
          progress: Math.min(100, (uniqueCountries.length / 5) * 100),
          current: uniqueCountries.length,
          threshold: 5,
          detail: `${uniqueCountries.length} countries`,
        },
        {
          id: "premium",
          title: "Premium Collector",
          description: "Own a bottle worth $200+",
          icon: Crown,
          earned: premiumBottles.length > 0,
          progress: premiumBottles.length > 0 ? 100 : 0,
          current: premiumBottles.length,
          threshold: 1,
          detail: mostExpensive
            ? `${mostExpensive.name}`
            : "No premium bottles yet",
        },
      ];

      // Filter and sort
      let filtered = [...groups];

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (g) =>
            g.name.toLowerCase().includes(q) ||
            g.country?.toLowerCase().includes(q) ||
            g.region?.toLowerCase().includes(q)
        );
      }

      if (countryFilter !== "all") {
        filtered = filtered.filter((g) => g.country === countryFilter);
      }

      const [sortField, sortDirection] = sort.split("-");
      filtered.sort((a, b) => {
        let cmp = 0;
        switch (sortField) {
          case "bottles":
            cmp = a.bottles.length - b.bottles.length;
            break;
          case "value":
            cmp = a.totalValue - b.totalValue;
            break;
          case "name":
            cmp = a.name.localeCompare(b.name);
            break;
          case "rating":
            cmp = a.avgRating - b.avgRating;
            break;
        }
        return sortDirection === "desc" ? -cmp : cmp;
      });

      return {
        allGroups: groups,
        filteredGroups: filtered,
        globalStats: gStats,
        achievements: achs,
      };
    }, [whiskeys, search, countryFilter, sort]);

  function toggleExpand(name: string) {
    setExpandedDistillery((prev) => (prev === name ? null : name));
  }

  // Empty state
  if (whiskeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-whiskey-gold/20 to-amber-900/20 flex items-center justify-center mb-6">
          <Building2 className="w-10 h-10 text-whiskey-gold/50" />
        </div>
        <h2 className="text-2xl font-serif font-bold mb-2">
          No distilleries yet
        </h2>
        <p className="text-muted-foreground max-w-md">
          Add distillery info to your bottles to see them grouped here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Achievement Badges */}
      <div className="flex gap-3 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible scrollbar-hide">
        {achievements.map((ach, i) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "glass-card p-3 min-w-[160px] flex-shrink-0 md:flex-shrink md:min-w-0 md:flex-1 transition-all",
              ach.earned
                ? "border-whiskey-gold/30"
                : "opacity-60"
            )}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  ach.earned
                    ? "bg-gradient-to-br from-whiskey-gold/30 to-amber-900/30"
                    : "bg-white/[0.05]"
                )}
              >
                <ach.icon
                  className={cn(
                    "w-4 h-4",
                    ach.earned
                      ? "text-whiskey-gold"
                      : "text-muted-foreground/40"
                  )}
                />
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-xs font-semibold truncate",
                    ach.earned ? "text-whiskey-gold" : "text-muted-foreground"
                  )}
                >
                  {ach.title}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {ach.description}
                </p>
              </div>
            </div>
            {ach.earned ? (
              <p className="text-[10px] text-muted-foreground truncate">
                {ach.detail}
              </p>
            ) : (
              <div className="space-y-1">
                <Progress value={ach.progress} className="h-1.5" />
                <p className="text-[10px] text-muted-foreground">
                  {ach.current} of {ach.threshold}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Distilleries",
            value: globalStats.totalDistilleries.toString(),
            icon: Building2,
            color: "from-whiskey-gold/20 to-amber-900/20",
          },
          {
            label: "Total Bottles",
            value: globalStats.totalBottleCount.toString(),
            icon: Wine,
            color: "from-amber-500/20 to-amber-900/20",
          },
          {
            label: "Collection Value",
            value: formatCurrency(globalStats.totalValue),
            icon: DollarSign,
            color: "from-green-500/20 to-emerald-900/20",
          },
          {
            label: "Countries",
            value: globalStats.uniqueCountries.length.toString(),
            icon: Globe,
            color: "from-blue-500/20 to-indigo-900/20",
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}
            >
              <card.icon className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {card.label}
            </p>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search distilleries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {globalStats.uniqueCountries.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex border border-white/[0.08] rounded-lg overflow-hidden">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-none h-9 w-9"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-none h-9 w-9"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        <span className="text-xs text-muted-foreground ml-auto hidden sm:block">
          {filteredGroups.length} of {allGroups.length} distilleries
        </span>
      </div>

      {/* No results */}
      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No distilleries match your filters.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => {
              setSearch("");
              setCountryFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredGroups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group, i) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.5) }}
              className={cn(
                "glass-card overflow-hidden transition-all duration-300 cursor-pointer",
                expandedDistillery === group.name
                  ? "border-whiskey-gold/30 col-span-1 sm:col-span-2 lg:col-span-3"
                  : "hover:border-whiskey-gold/20"
              )}
              onClick={() => toggleExpand(group.name)}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif font-semibold text-lg truncate">
                      {group.name}
                    </h3>
                    {(group.country || group.region) && (
                      <div className="flex items-center gap-1.5 mt-0.5 text-sm text-muted-foreground">
                        <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {group.region && group.country
                            ? `${group.region}, ${group.country}`
                            : group.country || group.region}
                        </span>
                      </div>
                    )}
                  </div>
                  <motion.div
                    animate={{
                      rotate: expandedDistillery === group.name ? 180 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Wine className="w-3.5 h-3.5 text-whiskey-gold" />
                    <span className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {group.bottles.length}
                      </span>{" "}
                      bottle{group.bottles.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs font-semibold">
                      {formatCurrency(group.totalValue)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-xs">
                      {group.avgRating > 0 ? (
                        <span className="font-semibold">
                          {group.avgRating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {group.types.length}
                      </span>{" "}
                      type{group.types.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Type badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {group.types.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        background: `${TYPE_COLORS[type] || "#666"}20`,
                        color: TYPE_COLORS[type] || "#999",
                      }}
                    >
                      {type}
                    </span>
                  ))}
                </div>

                {/* MiniBottle preview */}
                <div className="flex items-center gap-1.5">
                  {group.bottles.slice(0, 4).map((bottle) => (
                    <MiniBottle
                      key={bottle.id}
                      fillPercentage={
                        bottle.current_bottle_fill_percentage ?? 100
                      }
                    />
                  ))}
                  {group.bottles.length > 4 && (
                    <span className="text-[10px] text-muted-foreground ml-1">
                      +{group.bottles.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedDistillery === group.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExpandedContent group={group} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && filteredGroups.length > 0 && (
        <div className="space-y-3">
          {filteredGroups.map((group, i) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.5) }}
              className={cn(
                "glass-card overflow-hidden transition-all duration-300 cursor-pointer",
                expandedDistillery === group.name
                  ? "border-whiskey-gold/30"
                  : "hover:border-whiskey-gold/20"
              )}
            >
              <div
                className="flex items-center gap-3 p-4"
                onClick={() => toggleExpand(group.name)}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-whiskey-gold/20 to-amber-900/20 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-whiskey-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-semibold truncate">
                    {group.name}
                  </p>
                  {(group.country || group.region) && (
                    <p className="text-xs text-muted-foreground truncate">
                      {group.region && group.country
                        ? `${group.region}, ${group.country}`
                        : group.country || group.region}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs font-semibold text-whiskey-gold">
                    {group.bottles.length} bottle
                    {group.bottles.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {formatCurrency(group.totalValue)}
                  </span>
                  {group.avgRating > 0 && (
                    <div className="hidden md:block">
                      <StarRating
                        rating={Math.round(group.avgRating)}
                        size="sm"
                        readonly
                      />
                    </div>
                  )}
                  <motion.div
                    animate={{
                      rotate: expandedDistillery === group.name ? 180 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {expandedDistillery === group.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <ExpandedContent group={group} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Expanded detail content shared between grid and list views */
function ExpandedContent({ group }: { group: DistilleryGroup }) {
  return (
    <div className="px-5 pb-5 space-y-4">
      <Separator className="bg-white/[0.06]" />

      {/* Fill Status Breakdown */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <MiniBottle fillPercentage={100} />
          <div>
            <p className="text-xs font-semibold">{group.fullBottles}</p>
            <p className="text-[10px] text-muted-foreground">Full</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MiniBottle fillPercentage={50} />
          <div>
            <p className="text-xs font-semibold">{group.partialBottles}</p>
            <p className="text-[10px] text-muted-foreground">Partial</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MiniBottle fillPercentage={5} />
          <div>
            <p className="text-xs font-semibold">{group.nearEmpty}</p>
            <p className="text-[10px] text-muted-foreground">Low/Empty</p>
          </div>
        </div>
        {group.avgRating > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <StarRating
              rating={Math.round(group.avgRating)}
              size="sm"
              readonly
            />
            <span className="text-xs text-muted-foreground">
              ({group.avgRating.toFixed(1)} avg)
            </span>
          </div>
        )}
      </div>

      {/* Type Breakdown with Counts */}
      {group.types.length > 1 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Types
          </p>
          <div className="flex flex-wrap gap-2">
            {group.types.map((type) => {
              const count = group.bottles.filter(
                (b) => b.type === type
              ).length;
              return (
                <span
                  key={type}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5"
                  style={{
                    background: `${TYPE_COLORS[type] || "#666"}15`,
                    color: TYPE_COLORS[type] || "#999",
                  }}
                >
                  {type}
                  <span
                    className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center"
                    style={{
                      background: `${TYPE_COLORS[type] || "#666"}30`,
                    }}
                  >
                    {count}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottle List */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          Your Bottles
        </p>
        {group.bottles.map((bottle) => (
          <Link
            key={bottle.id}
            href={`/bottle/${bottle.id}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <MiniBottle
              fillPercentage={bottle.current_bottle_fill_percentage ?? 100}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{bottle.name}</p>
              <p className="text-xs text-muted-foreground">
                {bottle.type}
                {bottle.age_statement ? ` · ${bottle.age_statement}yr` : ""}
                {bottle.abv ? ` · ${bottle.abv}%` : ""}
                {bottle.rating ? ` · ${"\u2605"}${bottle.rating}` : ""}
              </p>
            </div>
            {bottle.purchase_price != null && bottle.purchase_price > 0 && (
              <span className="text-xs font-semibold text-whiskey-gold">
                {formatCurrency(bottle.purchase_price)}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
