"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Whiskey } from "@/lib/types";
import type { AnimeRecommendation } from "@/lib/bourbon-anime-matcher";
import { cn } from "@/lib/utils";
import { Tv, Loader2, Star, RefreshCw, ExternalLink } from "lucide-react";

interface AnimeRecommendationsProps {
  whiskey: Whiskey;
}

export function AnimeRecommendations({ whiskey }: AnimeRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<
    AnimeRecommendation[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);

  async function fetchRecommendations() {
    setLoading(true);
    try {
      const res = await fetch("/api/anime-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whiskey }),
      });
      const data = await res.json();
      setRecommendations(data.recommendations ?? []);
      setRevealed(true);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Tv className="w-4.5 h-4.5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Anime Pairing</h3>
              <p className="text-[11px] text-muted-foreground">
                Matched to this bottle&apos;s profile
              </p>
            </div>
          </div>
          {!revealed && (
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRecommendations}
              disabled={loading}
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Discover"
              )}
            </Button>
          )}
          {revealed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchRecommendations}
              disabled={loading}
              className="h-8 w-8 text-muted-foreground hover:text-purple-400"
            >
              <RefreshCw
                className={cn("w-4 h-4", loading && "animate-spin")}
              />
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {revealed && recommendations.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              <div className="h-px bg-white/[0.06]" />

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
                      <h4 className="font-semibold text-sm truncate">
                        {anime.title}
                      </h4>
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
                        {anime.matchScore}%
                      </span>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-[10px] text-muted-foreground">
                          {anime.malScore}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
