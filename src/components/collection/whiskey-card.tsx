"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Whiskey } from "@/lib/types";
import { StarRating } from "@/components/ui/star-rating";
import { MiniBottle } from "@/components/collection/bottle-tracker";
import { formatCurrency } from "@/lib/utils";
import { Wine, AlertTriangle } from "lucide-react";

interface WhiskeyCardProps {
  whiskey: Whiskey;
  index: number;
}

export function WhiskeyCard({ whiskey, index }: WhiskeyCardProps) {
  const fillPct = whiskey.current_bottle_fill_percentage ?? 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/bottle/${whiskey.id}`}>
        <div className="glass-card overflow-hidden group hover:border-whiskey-gold/20 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/10 cursor-pointer">
          {/* Image */}
          <div className="relative h-48 bg-gradient-to-br from-whiskey-dark to-black overflow-hidden">
            {whiskey.image_url ? (
              <Image
                src={whiskey.image_url}
                alt={whiskey.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Wine className="w-12 h-12 text-whiskey-gold/20" />
              </div>
            )}
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider glass text-whiskey-gold">
                {whiskey.type}
              </span>
              {whiskey.age_statement && (
                <span className="px-2 py-1 rounded-full text-[10px] font-semibold glass text-amber-300">
                  {whiskey.age_statement}yr
                </span>
              )}
            </div>
            {/* Bottle count badge */}
            {whiskey.number_of_bottles > 1 && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 rounded-full text-[10px] font-semibold glass text-blue-300">
                  ×{whiskey.number_of_bottles}
                </span>
              </div>
            )}
            {/* Almost empty warning */}
            {fillPct > 0 && fillPct <= 25 && (
              <div className="absolute bottom-3 right-3">
                <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-red-500/80 text-white flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />Low
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-2.5">
            <div>
              <h3 className="font-serif font-semibold text-lg leading-tight line-clamp-1 group-hover:text-whiskey-gold transition-colors">
                {whiskey.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {whiskey.distillery || whiskey.store || whiskey.type}
                {whiskey.country ? ` · ${whiskey.country}` : ""}
                {whiskey.abv ? ` · ${whiskey.abv}%` : ""}
              </p>
            </div>

            {whiskey.rating && (
              <StarRating rating={whiskey.rating} size="sm" readonly />
            )}

            {/* Bottle fill + price row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MiniBottle fillPercentage={fillPct} />
                <span className="text-xs text-muted-foreground">{fillPct}%</span>
              </div>
              {whiskey.purchase_price != null && whiskey.purchase_price > 0 && (
                <p className="text-sm font-semibold text-whiskey-gold">
                  {formatCurrency(whiskey.purchase_price)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
