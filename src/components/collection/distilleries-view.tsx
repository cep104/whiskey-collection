"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Whiskey } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  ChevronRight,
  Layers,
} from "lucide-react";

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
  slug: string;
  country: string | null;
  region: string | null;
  bottles: Whiskey[];
  totalBottles: number;
  totalValue: number;
  avgRating: number;
  ratedCount: number;
  types: string[];
  avgFill: number;
}

function toSlug(name: string): string {
  return encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"));
}

export function DistilleriesView({ whiskeys }: DistilleriesViewProps) {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sort, setSort] = useState("bottles-desc");

  const { allGroups, filteredGroups, globalStats } = useMemo(() => {
    const map = new Map<string, DistilleryGroup>();

    whiskeys.forEach((w) => {
      const key = w.distillery || "Unknown Distillery";
      const existing = map.get(key);
      if (existing) {
        existing.bottles.push(w);
      } else {
        map.set(key, {
          name: key,
          slug: toSlug(key),
          country: w.country,
          region: w.region,
          bottles: [w],
          totalBottles: 0,
          totalValue: 0,
          avgRating: 0,
          ratedCount: 0,
          types: [],
          avgFill: 0,
        });
      }
    });

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

      return g;
    });

    const uniqueCountries = Array.from(
      new Set(whiskeys.map((w) => w.country).filter(Boolean) as string[])
    ).sort();

    const gStats = {
      totalDistilleries: groups.length,
      totalBottleCount: whiskeys.reduce(
        (sum, w) => sum + (w.number_of_bottles || 1),
        0
      ),
      totalValue: whiskeys.reduce(
        (sum, w) => sum + (w.purchase_price || 0),
        0
      ),
      uniqueCountries,
    };

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

    return { allGroups: groups, filteredGroups: filtered, globalStats: gStats };
  }, [whiskeys, search, countryFilter, sort]);

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
              className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center"
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

      {/* Distillery Cards */}
      {filteredGroups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group, i) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.5) }}
            >
              <Link
                href={`/distilleries/${group.slug}`}
                className={cn(
                  "glass-card block overflow-hidden transition-all duration-300",
                  "hover:border-whiskey-gold/20 active:scale-[0.98]"
                )}
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
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
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
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
