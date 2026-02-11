"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Whiskey } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/ui/star-rating";
import { MiniBottle } from "@/components/collection/bottle-tracker";
import {
  Building2,
  Globe,
  Wine,
  DollarSign,
  Star,
  ArrowLeft,
  ChevronRight,
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

interface DistilleryDetailProps {
  distilleryName: string;
  whiskeys: Whiskey[];
}

export function DistilleryDetail({
  distilleryName,
  whiskeys,
}: DistilleryDetailProps) {
  const country = whiskeys.find((w) => w.country)?.country ?? null;
  const region = whiskeys.find((w) => w.region)?.region ?? null;

  const totalBottles = whiskeys.reduce(
    (sum, w) => sum + (w.number_of_bottles || 1),
    0
  );
  const totalValue = whiskeys.reduce(
    (sum, w) => sum + (w.purchase_price || 0),
    0
  );
  const ratings = whiskeys
    .filter((w) => w.rating != null && w.rating > 0)
    .map((w) => w.rating!);
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

  const typeSet = new Set(whiskeys.map((w) => w.type));
  const types = Array.from(typeSet);

  const fullBottles = whiskeys.filter(
    (w) => (w.current_bottle_fill_percentage ?? 100) >= 90
  ).length;
  const partialBottles = whiskeys.filter((w) => {
    const fill = w.current_bottle_fill_percentage ?? 100;
    return fill > 10 && fill < 90;
  }).length;
  const nearEmpty = whiskeys.filter(
    (w) => (w.current_bottle_fill_percentage ?? 100) <= 10
  ).length;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/distilleries"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4" />
        All Distilleries
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-whiskey-gold/20 to-amber-900/20 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-7 h-7 text-whiskey-gold" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-serif font-bold">
              {distilleryName}
            </h1>
            {(country || region) && (
              <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span>
                  {region && country
                    ? `${region}, ${country}`
                    : country || region}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Bottles",
            value: totalBottles.toString(),
            icon: Wine,
            color: "from-whiskey-gold/20 to-amber-900/20",
          },
          {
            label: "Total Value",
            value: formatCurrency(totalValue),
            icon: DollarSign,
            color: "from-green-500/20 to-emerald-900/20",
          },
          {
            label: "Avg Rating",
            value: avgRating > 0 ? avgRating.toFixed(1) : "--",
            icon: Star,
            color: "from-yellow-500/20 to-amber-900/20",
          },
          {
            label: "Types",
            value: types.length.toString(),
            icon: Building2,
            color: "from-blue-500/20 to-indigo-900/20",
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
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

      {/* Fill Status */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-5"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Bottle Status
        </h2>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <MiniBottle fillPercentage={100} />
            <div>
              <p className="text-sm font-semibold">{fullBottles}</p>
              <p className="text-xs text-muted-foreground">Full</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MiniBottle fillPercentage={50} />
            <div>
              <p className="text-sm font-semibold">{partialBottles}</p>
              <p className="text-xs text-muted-foreground">Partial</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MiniBottle fillPercentage={5} />
            <div>
              <p className="text-sm font-semibold">{nearEmpty}</p>
              <p className="text-xs text-muted-foreground">Low/Empty</p>
            </div>
          </div>
          {avgRating > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <StarRating
                rating={Math.round(avgRating)}
                size="sm"
                readonly
              />
              <span className="text-xs text-muted-foreground">
                ({avgRating.toFixed(1)})
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Type Breakdown */}
      {types.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-5"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Types
          </h2>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => {
              const count = whiskeys.filter((b) => b.type === type).length;
              return (
                <span
                  key={type}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2"
                  style={{
                    background: `${TYPE_COLORS[type] || "#666"}15`,
                    color: TYPE_COLORS[type] || "#999",
                  }}
                >
                  {type}
                  <span
                    className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center"
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
        </motion.div>
      )}

      {/* Bottles List */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-5 pb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            All Bottles ({whiskeys.length})
          </h2>
        </div>
        <div className="px-3 pb-3">
          {whiskeys.map((bottle, i) => (
            <div key={bottle.id}>
              <Link
                href={`/bottle/${bottle.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors min-h-[56px]"
              >
                <MiniBottle
                  fillPercentage={
                    bottle.current_bottle_fill_percentage ?? 100
                  }
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{bottle.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {bottle.type}
                    {bottle.age_statement
                      ? ` \u00b7 ${bottle.age_statement}yr`
                      : ""}
                    {bottle.abv ? ` \u00b7 ${bottle.abv}%` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {bottle.rating != null && bottle.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium">
                        {bottle.rating}
                      </span>
                    </div>
                  )}
                  {bottle.purchase_price != null &&
                    bottle.purchase_price > 0 && (
                      <span className="text-xs font-semibold text-whiskey-gold">
                        {formatCurrency(bottle.purchase_price)}
                      </span>
                    )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
              {i < whiskeys.length - 1 && (
                <Separator className="bg-white/[0.04] mx-3" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
