"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Whiskey } from "@/lib/types";
import { StarRating } from "@/components/ui/star-rating";
import { Progress } from "@/components/ui/progress";
import {
  formatCurrency,
  getQuantityPercentage,
  getQuantityColor,
} from "@/lib/utils";
import { Wine } from "lucide-react";

interface WhiskeyCardProps {
  whiskey: Whiskey;
  index: number;
}

export function WhiskeyCard({ whiskey, index }: WhiskeyCardProps) {
  const quantityPct = getQuantityPercentage(
    whiskey.current_quantity_ml,
    whiskey.bottle_size_ml
  );

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
            {/* Type badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider glass text-whiskey-gold">
                {whiskey.type}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-serif font-semibold text-lg leading-tight line-clamp-1 group-hover:text-whiskey-gold transition-colors">
                {whiskey.name}
              </h3>
              {whiskey.store && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {whiskey.store}
                </p>
              )}
            </div>

            {whiskey.rating && (
              <StarRating rating={whiskey.rating} size="sm" readonly />
            )}

            {/* Quantity bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Remaining</span>
                <span className={getQuantityColor(quantityPct)}>
                  {quantityPct}%
                </span>
              </div>
              <Progress value={quantityPct} className="h-1.5" />
            </div>

            {/* Price */}
            {whiskey.purchase_price && (
              <p className="text-sm font-semibold text-whiskey-gold">
                {formatCurrency(whiskey.purchase_price)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
