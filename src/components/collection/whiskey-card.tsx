"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Whiskey } from "@/lib/types";
import { StarRating } from "@/components/ui/star-rating";
import { MiniBottle } from "@/components/collection/bottle-tracker";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Wine, AlertTriangle } from "lucide-react";

interface WhiskeyCardProps {
  whiskey: Whiskey;
  index: number;
}

function FillBar({ percentage }: { percentage: number }) {
  const color =
    percentage > 60
      ? "from-emerald-500 to-emerald-400"
      : percentage > 25
        ? "from-amber-500 to-yellow-400"
        : "from-red-500 to-orange-400";

  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full bg-gradient-to-r", color)}
        />
      </div>
      <span className="text-[10px] text-muted-foreground tabular-nums w-7 text-right">
        {percentage}%
      </span>
    </div>
  );
}

export function WhiskeyCard({ whiskey, index }: WhiskeyCardProps) {
  const fillPct = whiskey.current_bottle_fill_percentage ?? 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link href={`/bottle/${whiskey.id}`}>
        <div className="group overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-amber-900/10 hover:border-whiskey-gold/20 transition-all duration-300 active:scale-[0.98]">
          {/* Image - Larger on mobile */}
          <div className="relative h-52 sm:h-48 bg-gradient-to-br from-whiskey-dark to-black overflow-hidden">
            {whiskey.image_url ? (
              <Image
                src={whiskey.image_url}
                alt={whiskey.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-whiskey-dark via-amber-950/20 to-black">
                <Wine className="w-14 h-14 text-whiskey-gold/15" />
              </div>
            )}

            {/* Gradient overlay at bottom for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-black/50 backdrop-blur-md border border-white/10 text-whiskey-gold">
                {whiskey.type}
              </span>
              {whiskey.age_statement && (
                <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-black/50 backdrop-blur-md border border-white/10 text-amber-300">
                  {whiskey.age_statement}yr
                </span>
              )}
            </div>

            {/* Bottle count badge */}
            {whiskey.number_of_bottles > 1 && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-black/50 backdrop-blur-md border border-white/10 text-blue-300">
                  x{whiskey.number_of_bottles}
                </span>
              </div>
            )}

            {/* Almost empty warning */}
            {fillPct > 0 && fillPct <= 25 && (
              <div className="absolute bottom-3 right-3">
                <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-red-500/80 backdrop-blur-sm text-white flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Low
                </span>
              </div>
            )}

            {/* Mini bottle indicator overlaid at bottom-left */}
            <div className="absolute bottom-3 left-3">
              <MiniBottle fillPercentage={fillPct} />
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-serif font-semibold text-base leading-tight line-clamp-1 group-hover:text-whiskey-gold transition-colors">
                {whiskey.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {whiskey.distillery || whiskey.store || whiskey.type}
                {whiskey.country ? ` \u00b7 ${whiskey.country}` : ""}
                {whiskey.abv ? ` \u00b7 ${whiskey.abv}%` : ""}
              </p>
            </div>

            {/* Rating */}
            {whiskey.rating != null && whiskey.rating > 0 && (
              <StarRating rating={whiskey.rating} size="sm" readonly />
            )}

            {/* Fill bar + price row */}
            <div className="flex items-center gap-3">
              <FillBar percentage={fillPct} />
              {whiskey.purchase_price != null &&
                whiskey.purchase_price > 0 && (
                  <span className="text-sm font-semibold text-whiskey-gold">
                    {formatCurrency(whiskey.purchase_price)}
                  </span>
                )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
