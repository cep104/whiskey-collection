import { NextRequest, NextResponse } from "next/server";
import {
  searchWhiskeyDatabase,
  type WhiskeyEntry,
} from "@/lib/whiskey-database";

/**
 * Whiskey Search API
 *
 * Searches local database of 60+ popular whiskeys.
 * Optionally calls Whisky Hunter API if WHISKY_HUNTER_API_URL is set.
 */

const searchCache = new Map<string, { data: WhiskeyEntry[]; ts: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Cache the full distillery list so we only fetch once
let distilleryCache: { data: Record<string, unknown>[]; ts: number } | null =
  null;
const DISTILLERY_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

async function searchExternalAPI(query: string): Promise<WhiskeyEntry[]> {
  const baseUrl = process.env.WHISKY_HUNTER_API_URL;
  if (!baseUrl) return [];

  try {
    // Fetch full list once (API doesn't support server-side search)
    if (!distilleryCache || Date.now() - distilleryCache.ts > DISTILLERY_CACHE_TTL) {
      const res = await fetch(`${baseUrl}/distilleries_info/?format=json`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) return [];
      const data = await res.json();
      if (!Array.isArray(data)) return [];
      distilleryCache = { data, ts: Date.now() };
    }

    // Filter client-side by query
    const q = query.toLowerCase();
    const matches = distilleryCache.data.filter((item) => {
      const name = String(item.name || "").toLowerCase();
      const slug = String(item.slug || "").toLowerCase();
      return name.includes(q) || slug.includes(q);
    });

    return matches.slice(0, 5).map((item) => ({
      name: String(item.name || ""),
      distillery: String(item.name || ""),
      type: "Scotch" as const,
      country: String(item.country || "Scotland"),
      region: String(item.region || ""),
      age_statement: null,
      abv: null,
      bottle_size_ml: 700,
      description: "",
    }));
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // Check cache
  const cacheKey = query.toLowerCase().trim();
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json({ results: cached.data });
  }

  // Search local database (instant)
  const localResults = searchWhiskeyDatabase(query);

  // Try external API for additional results
  const externalResults = await searchExternalAPI(query);

  // Merge: local results first, then external (dedup by name)
  const seenNames = new Set(localResults.map((r) => r.name.toLowerCase()));
  const merged = [
    ...localResults,
    ...externalResults.filter((r) => !seenNames.has(r.name.toLowerCase())),
  ].slice(0, 8);

  searchCache.set(cacheKey, { data: merged, ts: Date.now() });

  return NextResponse.json({ results: merged });
}
