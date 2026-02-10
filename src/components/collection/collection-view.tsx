"use client";

import { useState, useMemo } from "react";
import type { Whiskey } from "@/lib/types";
import { WhiskeyCard } from "./whiskey-card";
import {
  CollectionFilters,
  type FilterState,
} from "./collection-filters";
import { EmptyState } from "./empty-state";

interface CollectionViewProps {
  whiskeys: Whiskey[];
}

export function CollectionView({ whiskeys }: CollectionViewProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "all",
    sort: "date-desc",
  });

  const filtered = useMemo(() => {
    let result = [...whiskeys];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.type.toLowerCase().includes(q) ||
          w.store?.toLowerCase().includes(q) ||
          w.tasting_notes?.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (filters.type !== "all") {
      result = result.filter((w) => w.type === filters.type);
    }

    // Sort
    const [field, dir] = filters.sort.split("-");
    result.sort((a, b) => {
      let cmp = 0;
      switch (field) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "price":
          cmp = (a.purchase_price || 0) - (b.purchase_price || 0);
          break;
        case "rating":
          cmp = (a.rating || 0) - (b.rating || 0);
          break;
        case "date":
          cmp =
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime();
          break;
        case "quantity":
          cmp =
            (a.current_quantity_ml || a.bottle_size_ml) /
              a.bottle_size_ml -
            (b.current_quantity_ml || b.bottle_size_ml) /
              b.bottle_size_ml;
          break;
      }
      return dir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [whiskeys, filters]);

  if (whiskeys.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <CollectionFilters
        filters={filters}
        onChange={setFilters}
        totalCount={whiskeys.length}
        filteredCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No bottles match your search. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((whiskey, i) => (
            <WhiskeyCard key={whiskey.id} whiskey={whiskey} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
