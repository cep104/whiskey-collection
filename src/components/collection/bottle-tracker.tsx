"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Minus, Plus, Wine, Package } from "lucide-react";

interface BottleTrackerProps {
  currentFillPercentage: number;
  bottleSizeML: number;
  currentML: number | null;
  onFillChange: (percentage: number, ml: number) => void;
  numberOfBottles: number;
  bottlesOpened: number;
  onOpenNewBottle?: () => void;
  compact?: boolean;
}

const PRESETS = [
  { label: "Full", value: 100 },
  { label: "3/4", value: 75 },
  { label: "1/2", value: 50 },
  { label: "1/4", value: 25 },
  { label: "Empty", value: 0 },
];

// Whiskey bottle SVG path - classic bourbon/whiskey silhouette
// Neck (44-56), shoulders widen to body (22-78), rounded base
const BOTTLE_PATH =
  "M44,8 C44,4 46,2 50,2 C54,2 56,4 56,8 L56,30 C60,36 70,46 76,56 L76,174 C76,184 64,192 50,192 C36,192 24,184 24,174 L24,56 C30,46 40,36 44,30 Z";

// Fill range: liquid fills from bodyTop (inside neck) to bodyBottom (near base)
const BODY_TOP = 10;
const BODY_BOTTOM = 188;
const BODY_HEIGHT = BODY_BOTTOM - BODY_TOP;

function getFillGradientStops(pct: number) {
  if (pct > 75) return { top: "#fbbf24", bottom: "#b45309" };
  if (pct > 50) return { top: "#d97706", bottom: "#92400e" };
  if (pct > 25) return { top: "#b45309", bottom: "#78350f" };
  return { top: "#92400e", bottom: "#451a03" };
}

function getWarningLabel(pct: number): string | null {
  if (pct <= 0) return "Empty";
  if (pct <= 25) return "Almost Empty";
  if (pct <= 50) return "Low";
  return null;
}

export function BottleTracker({
  currentFillPercentage,
  bottleSizeML,
  currentML,
  onFillChange,
  numberOfBottles,
  bottlesOpened,
  onOpenNewBottle,
  compact = false,
}: BottleTrackerProps) {
  const [mlInput, setMlInput] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);

  const pct = Math.max(0, Math.min(100, currentFillPercentage));
  const ml = currentML ?? Math.round((pct / 100) * bottleSizeML);
  const unopened = numberOfBottles - bottlesOpened - (pct > 0 ? 1 : 0);
  const warning = getWarningLabel(pct);
  const gradientStops = getFillGradientStops(pct);

  const fillY = BODY_BOTTOM - (pct / 100) * BODY_HEIGHT;

  const setFill = useCallback(
    (newPct: number) => {
      const clamped = Math.max(0, Math.min(100, Math.round(newPct)));
      const newMl = Math.round((clamped / 100) * bottleSizeML);
      onFillChange(clamped, newMl);
    },
    [bottleSizeML, onFillChange]
  );

  const handleSvgInteraction = useCallback(
    (clientY: number) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const svgHeight = rect.height;
      const scale = 200 / svgHeight;
      const relY = (clientY - rect.top) * scale;
      const fillPct = ((BODY_BOTTOM - relY) / BODY_HEIGHT) * 100;
      setFill(fillPct);
    },
    [setFill]
  );

  function handlePointerDown(e: React.PointerEvent) {
    if (compact) return;
    isDragging.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    handleSvgInteraction(e.clientY);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging.current || compact) return;
    handleSvgInteraction(e.clientY);
  }

  function handlePointerUp() {
    isDragging.current = false;
  }

  function handleMlSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseInt(mlInput);
    if (!isNaN(val)) {
      const newPct = Math.round((val / bottleSizeML) * 100);
      setFill(newPct);
      setMlInput("");
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <MiniBottle fillPercentage={pct} />
        <span className="text-xs text-muted-foreground">{pct}%</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Inventory header */}
      {numberOfBottles > 1 && (
        <div className="flex items-center gap-3 glass p-3 rounded-xl">
          <Package className="w-5 h-5 text-whiskey-gold" />
          <div className="flex-1">
            <p className="text-sm font-medium">
              {unopened > 0
                ? `${unopened} unopened bottle${unopened !== 1 ? "s" : ""}`
                : "All bottles opened"}
            </p>
            <p className="text-xs text-muted-foreground">
              {numberOfBottles} total &middot; {bottlesOpened} finished
            </p>
          </div>
        </div>
      )}

      {/* Bottle SVG + controls row */}
      <div className="flex items-start gap-6">
        {/* Interactive SVG bottle */}
        <div className="flex flex-col items-center">
          <svg
            ref={svgRef}
            width="100"
            height="200"
            viewBox="0 0 100 200"
            className="cursor-pointer select-none touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <defs>
              <linearGradient id="liquid-gradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={gradientStops.bottom} />
                <stop offset="100%" stopColor={gradientStops.top} />
              </linearGradient>
              <linearGradient id="glass-sheen" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0.02)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <clipPath id="bottle-clip">
                <path d={BOTTLE_PATH} />
              </clipPath>
            </defs>

            {/* Bottle shape */}
            <path
              d={BOTTLE_PATH}
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
            />

            {/* Liquid fill */}
            <motion.rect
              x="0"
              width="100"
              height={200 - fillY}
              fill="url(#liquid-gradient)"
              clipPath="url(#bottle-clip)"
              initial={false}
              animate={{ y: fillY }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />

            {/* Glass sheen */}
            <path
              d={BOTTLE_PATH}
              fill="url(#glass-sheen)"
            />

            {/* Label band on body */}
            <rect
              x="26"
              y="90"
              width="48"
              height="40"
              rx="3"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />

            {/* Graduation marks */}
            {[25, 50, 75].map((mark) => {
              const markY = BODY_BOTTOM - (mark / 100) * BODY_HEIGHT;
              return (
                <g key={mark}>
                  <line
                    x1="26"
                    y1={markY}
                    x2="34"
                    y2={markY}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.5"
                  />
                  <text
                    x="18"
                    y={markY + 3}
                    fontSize="6"
                    fill="rgba(255,255,255,0.25)"
                    textAnchor="middle"
                  >
                    {mark}
                  </text>
                </g>
              );
            })}

            {/* Fill level indicator line */}
            {pct > 0 && pct < 100 && (
              <motion.line
                x1="22"
                x2="78"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.5"
                strokeDasharray="3,2"
                initial={false}
                animate={{ y1: fillY, y2: fillY }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              />
            )}

            {/* Cap / cork */}
            <rect x="43" y="0" width="14" height="4" rx="1.5" fill="rgba(255,255,255,0.18)" />
          </svg>

          {/* Percentage */}
          <div className="text-center mt-2">
            <p className="text-2xl font-bold text-whiskey-gold">{pct}%</p>
            <p className="text-xs text-muted-foreground">
              {ml}ml / {bottleSizeML}ml
            </p>
          </div>

          {/* Warning badge */}
          <AnimatePresence>
            {warning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold",
                  pct <= 0
                    ? "bg-red-500/20 text-red-400"
                    : pct <= 25
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-yellow-500/20 text-yellow-400"
                )}
              >
                {warning}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-4">
          {/* Quick presets */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
              Quick Set
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  type="button"
                  variant={pct === preset.value ? "amber" : "outline"}
                  size="sm"
                  className="text-xs h-7 px-2.5"
                  onClick={() => setFill(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Pour tracking */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
              Pour Tracker
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setFill(pct - (30 / bottleSizeML) * 100)}
                disabled={pct <= 0}
              >
                <Minus className="w-3 h-3 mr-1" />
                30ml
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setFill(pct + (30 / bottleSizeML) * 100)}
                disabled={pct >= 100}
              >
                <Plus className="w-3 h-3 mr-1" />
                30ml
              </Button>
            </div>
          </div>

          {/* Manual ML input */}
          <form onSubmit={handleMlSubmit} className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Enter Amount
            </p>
            <div className="flex gap-2">
              <Input
                type="number"
                value={mlInput}
                onChange={(e) => setMlInput(e.target.value)}
                placeholder={`0–${bottleSizeML}`}
                className="h-8 text-xs w-24"
                min={0}
                max={bottleSizeML}
              />
              <span className="text-xs text-muted-foreground self-center">ml</span>
              <Button type="submit" variant="outline" size="sm" className="text-xs h-8">
                Set
              </Button>
            </div>
          </form>

          {/* Open new bottle */}
          {onOpenNewBottle && unopened > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs border-whiskey-gold/30 text-whiskey-gold hover:bg-whiskey-gold/10"
              onClick={onOpenNewBottle}
            >
              <Wine className="w-3 h-3 mr-1.5" />
              Finish & Open New Bottle
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Small inline bottle for cards and lists */
export function MiniBottle({ fillPercentage }: { fillPercentage: number }) {
  const pct = Math.max(0, Math.min(100, fillPercentage));
  const fillY = BODY_BOTTOM - (pct / 100) * BODY_HEIGHT;
  const gradientStops = getFillGradientStops(pct);
  const uid = `mini-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg width="16" height="32" viewBox="0 0 100 200" className="flex-shrink-0">
      <defs>
        <linearGradient id={`f-${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={gradientStops.bottom} />
          <stop offset="100%" stopColor={gradientStops.top} />
        </linearGradient>
        <clipPath id={`c-${uid}`}>
          <path d={BOTTLE_PATH} />
        </clipPath>
      </defs>
      <path
        d={BOTTLE_PATH}
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="3"
      />
      <rect
        x="0"
        y={fillY}
        width="100"
        height={200 - fillY}
        fill={`url(#f-${uid})`}
        clipPath={`url(#c-${uid})`}
      />
    </svg>
  );
}
