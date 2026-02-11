"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Whiskey } from "@/lib/types";
import type { AnimeRecommendation } from "@/lib/bourbon-anime-matcher";
import {
  getAnimeRecommendations,
  getCollectionAnimeProfile,
  POPULAR_PAIRINGS,
} from "@/lib/bourbon-anime-matcher";
import { cn, formatCurrency } from "@/lib/utils";
import { MiniBottle } from "@/components/collection/bottle-tracker";
import {
  Tv,
  Wine,
  Star,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";

interface BourbonAnimeViewProps {
  whiskeys: Whiskey[];
}

export function BourbonAnimeView({ whiskeys }: BourbonAnimeViewProps) {
  const [selectedWhiskey, setSelectedWhiskey] = useState<Whiskey | null>(null);
  const [recommendations, setRecommendations] = useState<
    AnimeRecommendation[]
  >([]);
  const [showCollectionProfile, setShowCollectionProfile] = useState(false);
  const [collectionRecs, setCollectionRecs] = useState<{
    topCategory: string;
    recommendations: AnimeRecommendation[];
  } | null>(null);

  function handleSelectWhiskey(whiskey: Whiskey) {
    setSelectedWhiskey(whiskey);
    setShowCollectionProfile(false);
    const recs = getAnimeRecommendations(whiskey);
    setRecommendations(recs);
  }

  function handleCollectionProfile() {
    setSelectedWhiskey(null);
    setShowCollectionProfile(true);
    const profile = getCollectionAnimeProfile(whiskeys);
    setCollectionRecs(profile);
  }

  const topRated = whiskeys
    .filter((w) => w.rating != null && w.rating > 0)
    .slice(0, 8);
  const recentBottles = [...whiskeys]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 8);
  const displayBottles =
    topRated.length >= 3 ? topRated : recentBottles.slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-whiskey-gold/20 to-amber-900/20 flex items-center justify-center">
            <Wine className="w-6 h-6 text-whiskey-gold" />
          </div>
          <Zap className="w-5 h-5 text-purple-400" />
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Tv className="w-6 h-6 text-purple-400" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold">
          <span className="text-gradient">Bourbon</span>
          <span className="text-muted-foreground mx-2">meets</span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Anime
          </span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          We match your whiskey&apos;s flavor profile to anime with similar
          vibes. Sweet and smooth? Intense and complex? There&apos;s an anime
          for that.
        </p>
      </motion.div>

      {/* Collection Profile Button */}
      {whiskeys.length >= 3 && (
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={handleCollectionProfile}
          className={cn(
            "w-full glass-card p-5 text-left transition-all hover:border-purple-500/30",
            showCollectionProfile && "border-purple-500/30"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">
                Analyze Your Full Collection
              </p>
              <p className="text-xs text-muted-foreground">
                Get anime recs based on your entire {whiskeys.length}-bottle
                collection profile
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          </div>
        </motion.button>
      )}

      {/* Collection Profile Results */}
      <AnimatePresence>
        {showCollectionProfile && collectionRecs && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-5 border-purple-500/20 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="font-semibold text-sm">
                  Your Collection Vibe:{" "}
                  <span className="text-purple-400 capitalize">
                    {collectionRecs.topCategory}
                  </span>
                </h3>
              </div>
              <RecommendationList
                recommendations={collectionRecs.recommendations}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Select a Bottle */}
      {displayBottles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {topRated.length >= 3
              ? "Your Top-Rated Bottles"
              : "Your Collection"}
          </h2>
          <div className="space-y-2">
            {displayBottles.map((w) => (
              <button
                key={w.id}
                onClick={() => handleSelectWhiskey(w)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left min-h-[56px]",
                  selectedWhiskey?.id === w.id
                    ? "bg-purple-500/10 border border-purple-500/30"
                    : "bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/20"
                )}
              >
                <MiniBottle
                  fillPercentage={w.current_bottle_fill_percentage ?? 100}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{w.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {w.type}
                    {w.distillery ? ` \u00b7 ${w.distillery}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {w.rating != null && w.rating > 0 && (
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs">{w.rating}</span>
                    </div>
                  )}
                  {w.purchase_price != null && w.purchase_price > 0 && (
                    <span className="text-xs text-whiskey-gold font-semibold">
                      {formatCurrency(w.purchase_price)}
                    </span>
                  )}
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-colors",
                      selectedWhiskey?.id === w.id
                        ? "text-purple-400"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Selected Bottle Results */}
      <AnimatePresence>
        {selectedWhiskey && recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-5 border-purple-500/20 space-y-4">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-purple-400" />
                <h3 className="font-semibold text-sm">
                  If you love{" "}
                  <span className="text-whiskey-gold">
                    {selectedWhiskey.name}
                  </span>
                  , try&hellip;
                </h3>
              </div>
              <RecommendationList recommendations={recommendations} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular Pairings */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Popular Pairings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {POPULAR_PAIRINGS.map((pairing, i) => (
            <motion.div
              key={pairing.bourbon}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Wine className="w-3.5 h-3.5 text-whiskey-gold" />
                <span className="text-xs font-semibold text-whiskey-gold">
                  {pairing.bourbon}
                </span>
                <span className="text-muted-foreground text-xs">+</span>
                <Tv className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-semibold text-purple-400">
                  {pairing.anime}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground italic">
                {pairing.reasoning}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Empty state */}
      {whiskeys.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
            <Tv className="w-8 h-8 text-purple-400/50" />
          </div>
          <p className="text-muted-foreground text-sm">
            Add some bottles to your collection to get personalized anime
            recommendations!
          </p>
        </div>
      )}
    </div>
  );
}

function RecommendationList({
  recommendations,
}: {
  recommendations: AnimeRecommendation[];
}) {
  return (
    <div className="space-y-3">
      {recommendations.map((anime, i) => (
        <motion.div
          key={anime.title}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/20 transition-colors"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <h4 className="font-semibold text-sm truncate">{anime.title}</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {anime.genre.map((g) => (
                  <span
                    key={g}
                    className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-purple-500/10 text-purple-300"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs font-semibold text-purple-400">
                {anime.matchScore}% match
              </span>
              <div className="flex items-center gap-0.5 mt-0.5">
                <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] text-muted-foreground">
                  {anime.malScore}/10
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground italic leading-relaxed">
            &ldquo;{anime.reasoning}&rdquo;
          </p>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {anime.streaming.map((platform) => (
              <span
                key={platform}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] text-muted-foreground bg-white/[0.04]"
              >
                <ExternalLink className="w-2 h-2" />
                {platform}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
