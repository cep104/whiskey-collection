"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
}

const THRESHOLD = 80;

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const pulling = useRef(false);

  const pullDistance = useMotionValue(0);
  const indicatorOpacity = useTransform(pullDistance, [0, THRESHOLD], [0, 1]);
  const indicatorScale = useTransform(pullDistance, [0, THRESHOLD], [0.5, 1]);
  const indicatorRotation = useTransform(
    pullDistance,
    [0, THRESHOLD],
    [0, 180]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (refreshing) return;
      const scrollTop = containerRef.current?.scrollTop ?? window.scrollY;
      if (scrollTop <= 0) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      }
    },
    [refreshing]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!pulling.current || refreshing) return;
      const diff = e.touches[0].clientY - startY.current;
      if (diff > 0) {
        // Resistance factor: harder to pull as you go further
        const dampened = Math.min(diff * 0.4, THRESHOLD + 20);
        pullDistance.set(dampened);
      }
    },
    [refreshing, pullDistance]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current || refreshing) return;
    pulling.current = false;

    if (pullDistance.get() >= THRESHOLD) {
      setRefreshing(true);
      pullDistance.set(THRESHOLD * 0.6);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        pullDistance.set(0);
      }
    } else {
      pullDistance.set(0);
    }
  }, [refreshing, pullDistance, onRefresh]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull indicator */}
      <motion.div
        style={{
          height: pullDistance,
          opacity: indicatorOpacity,
        }}
        className="flex items-center justify-center overflow-hidden"
      >
        <motion.div
          style={{
            scale: indicatorScale,
            rotate: refreshing ? undefined : indicatorRotation,
          }}
          animate={refreshing ? { rotate: 360 } : undefined}
          transition={
            refreshing
              ? { duration: 0.8, repeat: Infinity, ease: "linear" }
              : undefined
          }
        >
          <Loader2 className="w-6 h-6 text-whiskey-gold" />
        </motion.div>
      </motion.div>

      {children}
    </div>
  );
}
