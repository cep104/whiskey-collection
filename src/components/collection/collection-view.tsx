"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Whiskey } from "@/lib/types";
import { WhiskeyCard } from "./whiskey-card";
import { CollectionFilters, type FilterState } from "./collection-filters";
import { EmptyState } from "./empty-state";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { PageTransition } from "@/components/ui/page-transition";

interface CollectionViewProps {
  whiskeys: Whiskey[];
  initialDistillery?: string;
}

export function CollectionView({ whiskeys, initialDistillery }: CollectionViewProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "all",
    country: "all",
    distillery: initialDistillery || "all",
    sort: "date-desc",
  });

  const filtered = useMemo(() => {
    let result = [...whiskeys];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.type.toLowerCase().includes(q) ||
          w.store?.toLowerCase().includes(q) ||
          w.distillery?.toLowerCase().includes(q) ||
          w.country?.toLowerCase().includes(q) ||
          w.region?.toLowerCase().includes(q) ||
          w.tasting_notes?.toLowerCase().includes(q)
      );
    }

    if (filters.type !== "all") {
      result = result.filter((w) => w.type === filters.type);
    }

    if (filters.country !== "all") {
      result = result.filter((w) => w.country === filters.country);
    }

    if (filters.distillery !== "all") {
      result = result.filter((w) => w.distillery === filters.distillery);
    }

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
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "quantity":
          cmp =
            (a.current_bottle_fill_percentage ?? 100) -
            (b.current_bottle_fill_percentage ?? 100);
          break;
        case "distillery":
          cmp = (a.distillery || "").localeCompare(b.distillery || "");
          break;
        case "country":
          cmp = (a.country || "").localeCompare(b.country || "");
          break;
        case "age":
          cmp = (a.age_statement || 0) - (b.age_statement || 0);
          break;
      }
      return dir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [whiskeys, filters]);

  const handleRefresh = useCallback(async () => {
    router.refresh();
    // Small delay so the spinner is visible
    await new Promise((r) => setTimeout(r, 600));
  }, [router]);

  if (whiskeys.length === 0) {
    return <EmptyState />;
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageTransition>
        <div className="space-y-6">
          <CollectionFilters
            filters={filters}
            onChange={setFilters}
            totalCount={whiskeys.length}
            filteredCount={filtered.length}
            whiskeys={whiskeys}
          />

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No bottles match your search. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((whiskey, i) => (
                <WhiskeyCard key={whiskey.id} whiskey={whiskey} index={i} />
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </PullToRefresh>
  );
}
