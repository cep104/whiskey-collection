"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { Search, Loader2, Sparkles, X } from "lucide-react";
import type { WhiskeyEntry } from "@/lib/whiskey-database";

interface WhiskeySearchProps {
  onSelect: (entry: WhiskeyEntry) => void;
  onClear: () => void;
  selectedName: string | null;
}

export function WhiskeySearch({
  onSelect,
  onClear,
  selectedName,
}: WhiskeySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WhiskeyEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 250);

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/whiskey/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setResults(data.results || []);
          setOpen(true);
          setHighlightIndex(-1);
        }
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(entry: WhiskeyEntry) {
    onSelect(entry);
    setQuery("");
    setOpen(false);
    setResults([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(results[highlightIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  if (selectedName) {
    return (
      <div className="flex items-center gap-2 glass-card p-3 border-whiskey-gold/20">
        <Sparkles className="w-4 h-4 text-whiskey-gold flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">Auto-filled from database</p>
          <p className="text-sm font-medium truncate">{selectedName}</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search whiskey database (e.g., Buffalo Trace, Lagavulin)..."
          className="pl-9 pr-9"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-white/15 rounded-lg shadow-2xl max-h-[320px] overflow-y-auto">
          {results.map((entry, i) => (
            <button
              key={`${entry.name}-${i}`}
              type="button"
              onClick={() => handleSelect(entry)}
              className={cn(
                "w-full text-left px-3 py-2.5 flex items-start gap-3 transition-colors border-b border-white/[0.06] last:border-0",
                highlightIndex === i
                  ? "bg-whiskey-gold/15"
                  : "hover:bg-white/[0.06]"
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-whiskey-gold/20 to-amber-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-whiskey-gold">
                  {entry.type.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{entry.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {entry.distillery} &middot; {entry.region}, {entry.country}
                </p>
                {entry.abv && (
                  <span className="text-[10px] text-whiskey-gold/70">
                    {entry.abv}% ABV
                    {entry.age_statement ? ` · ${entry.age_statement}yr` : ""}
                  </span>
                )}
              </div>
            </button>
          ))}
          <div className="px-3 py-2 border-t border-white/[0.06]">
            <p className="text-[10px] text-muted-foreground text-center">
              Don&apos;t see it? Just type the name manually below
            </p>
          </div>
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-white/15 rounded-lg shadow-2xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            No matches found. Enter details manually below.
          </p>
        </div>
      )}
    </div>
  );
}
