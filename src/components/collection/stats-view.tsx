"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Whiskey, WhiskeyType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { StarRating } from "@/components/ui/star-rating";
import { MiniBottle } from "@/components/collection/bottle-tracker";
import {
  Wine,
  DollarSign,
  TrendingUp,
  Star,
  BarChart3,
  Droplets,
  Globe,
  Building2,
  Clock,
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

const COUNTRY_COLORS = [
  "#d97706", "#ea580c", "#f59e0b", "#b45309", "#92400e",
  "#78350f", "#fbbf24", "#dc2626", "#16a34a", "#2563eb",
];

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

    // Total ML remaining
    const totalMlRemaining = whiskeys.reduce(
      (sum, w) => sum + (w.current_quantity_ml || 0),
      0
    );

    // Average age statement
    const withAge = whiskeys.filter((w) => w.age_statement);
    const avgAge =
      withAge.length > 0
        ? withAge.reduce((sum, w) => sum + (w.age_statement || 0), 0) / withAge.length
        : 0;

    // Bottle status breakdown
    const fullBottles = whiskeys.filter(
      (w) => (w.current_bottle_fill_percentage ?? 100) >= 90
    ).length;
    const partialBottles = whiskeys.filter(
      (w) => {
        const fill = w.current_bottle_fill_percentage ?? 100;
        return fill > 10 && fill < 90;
      }
    ).length;
    const nearEmpty = whiskeys.filter(
      (w) => (w.current_bottle_fill_percentage ?? 100) <= 10
    ).length;

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

    // Country breakdown
    const countryMap = new Map<string, number>();
    whiskeys.forEach((w) => {
      const country = w.country || "Unknown";
      countryMap.set(country, (countryMap.get(country) || 0) + 1);
    });
    const countryBreakdown = Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);

    // Top distilleries
    const distilleryMap = new Map<string, number>();
    whiskeys.forEach((w) => {
      if (w.distillery) {
        distilleryMap.set(w.distillery, (distilleryMap.get(w.distillery) || 0) + 1);
      }
    });
    const topDistilleries = Array.from(distilleryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

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
      totalMlRemaining,
      avgAge,
      fullBottles,
      partialBottles,
      nearEmpty,
      typeBreakdown,
      countryBreakdown,
      topDistilleries,
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

  const countryPieData = stats.countryBreakdown.map((c, i) => ({
    name: c.country,
    value: c.count,
    color: COUNTRY_COLORS[i % COUNTRY_COLORS.length],
  }));

  const distilleryBarData = stats.topDistilleries.map((d) => ({
    name: d.name,
    count: d.count,
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
            value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—",
            icon: Star,
            color: "from-yellow-500/20 to-orange-900/20",
          },
          {
            label: "Total ML Left",
            value: stats.totalMlRemaining > 0 ? `${(stats.totalMlRemaining / 1000).toFixed(1)}L` : "—",
            icon: Droplets,
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

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-900/20 flex items-center justify-center">
            <MiniBottle fillPercentage={100} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Full</p>
            <p className="text-lg font-bold">{stats.fullBottles}</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-900/20 flex items-center justify-center">
            <MiniBottle fillPercentage={50} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Partial</p>
            <p className="text-lg font-bold">{stats.partialBottles}</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-900/20 flex items-center justify-center">
            <MiniBottle fillPercentage={5} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Empty</p>
            <p className="text-lg font-bold">{stats.nearEmpty}</p>
          </div>
        </motion.div>
      </div>

      {/* Additional info chips */}
      {(stats.avgAge > 0 || stats.typeBreakdown.length > 0) && (
        <div className="flex flex-wrap gap-3">
          {stats.avgAge > 0 && (
            <div className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-whiskey-gold" />
              <span className="text-xs text-muted-foreground">Avg Age:</span>
              <span className="text-xs font-semibold">{stats.avgAge.toFixed(1)} yrs</span>
            </div>
          )}
          <div className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-whiskey-gold" />
            <span className="text-xs text-muted-foreground">Types:</span>
            <span className="text-xs font-semibold">{stats.typeBreakdown.length}</span>
          </div>
          {stats.countryBreakdown.length > 0 && (
            <div className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-whiskey-gold" />
              <span className="text-xs text-muted-foreground">Countries:</span>
              <span className="text-xs font-semibold">{stats.countryBreakdown.length}</span>
            </div>
          )}
        </div>
      )}

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

        {/* Country Distribution Pie Chart */}
        {countryPieData.length > 0 && countryPieData[0].name !== "Unknown" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Collection by Country
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={countryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {countryPieData.map((entry, i) => (
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
              {countryPieData.map((item) => (
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
        )}

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

        {/* Top Distilleries Bar Chart */}
        {distilleryBarData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Top Distilleries
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distilleryBarData} layout="vertical">
                  <XAxis
                    type="number"
                    fontSize={11}
                    stroke="#6b7280"
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    fontSize={11}
                    stroke="#6b7280"
                    tick={{ fill: "#9ca3af" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(13, 9, 6, 0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [
                      `${value} bottle${value !== 1 ? "s" : ""}`,
                      "Bottles",
                    ]}
                  />
                  <Bar dataKey="count" fill="#d97706" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
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
                <MiniBottle fillPercentage={whiskey.current_bottle_fill_percentage ?? 100} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {whiskey.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {whiskey.type}
                    {whiskey.distillery ? ` · ${whiskey.distillery}` : ""}
                  </p>
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
                <MiniBottle fillPercentage={whiskey.current_bottle_fill_percentage ?? 100} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {whiskey.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {whiskey.type}
                    {whiskey.distillery ? ` · ${whiskey.distillery}` : ""}
                  </p>
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
