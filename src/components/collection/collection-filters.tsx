"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Whiskey, WhiskeyType } from "@/lib/types";

const WHISKEY_TYPES: WhiskeyType[] = [
  "Bourbon", "Scotch", "Rye", "Irish", "Japanese", "Single Malt", "Blended",
];

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
  { value: "price-desc", label: "Price High-Low" },
  { value: "price-asc", label: "Price Low-High" },
  { value: "rating-desc", label: "Rating High-Low" },
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "quantity-asc", label: "Almost Empty" },
  { value: "distillery-asc", label: "Distillery A-Z" },
  { value: "country-asc", label: "Country A-Z" },
  { value: "age-desc", label: "Age High-Low" },
];

export interface FilterState {
  search: string;
  type: string;
  country: string;
  distillery: string;
  sort: string;
}

interface CollectionFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
  whiskeys: Whiskey[];
}

export function CollectionFilters({
  filters, onChange, totalCount, filteredCount, whiskeys,
}: CollectionFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.country !== "all" ||
    filters.distillery !== "all" ||
    filters.search;

  // Derive unique countries and distilleries
  const countries = Array.from(new Set(whiskeys.map((w) => w.country).filter(Boolean) as string[])).sort();
  const distilleries = Array.from(new Set(whiskeys.map((w) => w.distillery).filter(Boolean) as string[])).sort();

  function clearFilters() {
    onChange({ search: "", type: "all", country: "all", distillery: "all", sort: "date-desc" });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search name, distillery, notes..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
          {filters.search && (
            <button onClick={() => onChange({ ...filters, search: "" })} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Button
          variant={showFilters ? "secondary" : "outline"}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {hasActiveFilters && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-whiskey-gold" />}
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 glass-card p-3">
          <Select value={filters.type} onValueChange={(v) => onChange({ ...filters, type: v })}>
            <SelectTrigger className="w-[130px]"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {WHISKEY_TYPES.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>

          {countries.length > 0 && (
            <Select value={filters.country} onValueChange={(v) => onChange({ ...filters, country: v })}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="All Countries" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          )}

          {distilleries.length > 0 && (
            <Select value={filters.distillery} onValueChange={(v) => onChange({ ...filters, distillery: v })}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Distilleries" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Distilleries</SelectItem>
                {distilleries.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          )}

          <Select value={filters.sort} onValueChange={(v) => onChange({ ...filters, sort: v })}>
            <SelectTrigger className="w-[155px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}><X className="w-3 h-3 mr-1" />Clear</Button>
          )}

          <span className="text-xs text-muted-foreground ml-auto">{filteredCount} of {totalCount} bottles</span>
        </div>
      )}
    </div>
  );
}
