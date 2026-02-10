"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Whiskey, WhiskeyType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { StarRating } from "@/components/ui/star-rating";
import {
  Wine,
  DollarSign,
  TrendingUp,
  Star,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const TYPE_COLORS: Record<string, string> = {
  Bourbon: "#d97706",
  Scotch: "#b45309",
  Rye: "#92400e",
  Irish: "#78350f",
  Japanese: "#ea580c",
  "Single Malt": "#f59e0b",
  Blended: "#fbbf24",
};

interface StatsViewProps {
  whiskeys: Whiskey[];
}

export function StatsView({ whiskeys }: StatsViewProps) {
  const stats = useMemo(() => {
    const totalBottles = whiskeys.length;
    const totalValue = whiskeys.reduce(
      (sum, w) => sum + (w.purchase_price || 0),
      0
    );
    const ratings = whiskeys.filter((w) => w.rating);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, w) => sum + (w.rating || 0), 0) / ratings.length
        : 0;

    // Type breakdown
    const typeMap = new Map<WhiskeyType, { count: number; value: number }>();
    whiskeys.forEach((w) => {
      const existing = typeMap.get(w.type) || { count: 0, value: 0 };
      typeMap.set(w.type, {
        count: existing.count + 1,
        value: existing.value + (w.purchase_price || 0),
      });
    });
    const typeBreakdown = Array.from(typeMap.entries())
      .map(([type, data]) => ({
        type,
        count: data.count,
        value: data.value,
      }))
      .sort((a, b) => b.count - a.count);

    // Most expensive
    const mostExpensive = [...whiskeys]
      .filter((w) => w.purchase_price)
      .sort((a, b) => (b.purchase_price || 0) - (a.purchase_price || 0))
      .slice(0, 5);

    // Recently added
    const recentlyAdded = whiskeys.slice(0, 5);

    return {
      totalBottles,
      totalValue,
      avgRating,
      typeBreakdown,
      mostExpensive,
      recentlyAdded,
    };
  }, [whiskeys]);

  if (whiskeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-whiskey-gold/20 to-amber-900/20 flex items-center justify-center mb-6">
          <BarChart3 className="w-10 h-10 text-whiskey-gold/50" />
        </div>
        <h2 className="text-2xl font-serif font-bold mb-2">
          No stats yet
        </h2>
        <p className="text-muted-foreground max-w-md">
          Add bottles to your collection to see your statistics and insights.
        </p>
      </div>
    );
  }

  const pieData = stats.typeBreakdown.map((t) => ({
    name: t.type,
    value: t.count,
    color: TYPE_COLORS[t.type] || "#d97706",
  }));

  const barData = stats.typeBreakdown.map((t) => ({
    name: t.type,
    value: t.value,
    color: TYPE_COLORS[t.type] || "#d97706",
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Bottles",
            value: stats.totalBottles.toString(),
            icon: Wine,
            color: "from-whiskey-gold/20 to-amber-900/20",
          },
          {
            label: "Collection Value",
            value: formatCurrency(stats.totalValue),
            icon: DollarSign,
            color: "from-green-500/20 to-emerald-900/20",
          },
          {
            label: "Avg Rating",
            value: stats.avgRating.toFixed(1),
            icon: Star,
            color: "from-yellow-500/20 to-orange-900/20",
          },
          {
            label: "Types Collected",
            value: stats.typeBreakdown.length.toString(),
            icon: TrendingUp,
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Type Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Collection by Type
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(13, 9, 6, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name: string) => [
                    `${value} bottle${value !== 1 ? "s" : ""}`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Value by Type Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Value by Type
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <XAxis
                  type="number"
                  tickFormatter={(v) => `$${v}`}
                  fontSize={11}
                  stroke="#6b7280"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  fontSize={11}
                  stroke="#6b7280"
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(13, 9, 6, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Value"]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Expensive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Most Valuable Bottles
          </h3>
          <div className="space-y-3">
            {stats.mostExpensive.map((whiskey, i) => (
              <Link
                key={whiskey.id}
                href={`/bottle/${whiskey.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-xs font-mono text-muted-foreground w-5">
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {whiskey.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{whiskey.type}</p>
                </div>
                <span className="text-sm font-semibold text-whiskey-gold">
                  {formatCurrency(whiskey.purchase_price!)}
                </span>
              </Link>
            ))}
            {stats.mostExpensive.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No pricing data yet
              </p>
            )}
          </div>
        </motion.div>

        {/* Recently Added */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Recently Added
          </h3>
          <div className="space-y-3">
            {stats.recentlyAdded.map((whiskey) => (
              <Link
                key={whiskey.id}
                href={`/bottle/${whiskey.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {whiskey.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{whiskey.type}</p>
                </div>
                {whiskey.rating && (
                  <StarRating rating={whiskey.rating} size="sm" readonly />
                )}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
