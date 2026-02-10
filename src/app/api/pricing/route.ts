import { NextRequest, NextResponse } from "next/server";

/**
 * Mock Pricing API
 *
 * In production, replace this with a real pricing integration:
 *
 * Option 1: Wine-Searcher API (https://www.wine-searcher.com/api)
 *   - Requires a paid API key
 *   - Endpoint: GET https://api.wine-searcher.com/json/select/<api_key>/<search_term>
 *   - Returns pricing data from retailers worldwide
 *
 * Option 2: Web scraping (with caching)
 *   - Scrape pricing from public retail sites
 *   - Cache results in Supabase or Redis for 24h to minimize requests
 *
 * Option 3: Community-sourced data
 *   - Build a pricing database from user-submitted purchase prices
 *   - Average across users for market estimates
 *
 * This mock endpoint returns realistic pricing based on whiskey type and name.
 */

// Simulated price ranges by type
const TYPE_PRICING: Record<string, { min: number; max: number }> = {
  Bourbon: { min: 25, max: 80 },
  Scotch: { min: 40, max: 200 },
  Rye: { min: 30, max: 100 },
  Irish: { min: 30, max: 90 },
  Japanese: { min: 50, max: 400 },
  "Single Malt": { min: 45, max: 500 },
  Blended: { min: 25, max: 250 },
};

// Known bottles with realistic market prices
const KNOWN_PRICES: Record<string, number> = {
  "buffalo trace": 32,
  "lagavulin 16": 95,
  "hibiki harmony": 75,
  "redbreast 12": 62,
  "whistlepig 10": 85,
  "macallan 18": 380,
  "johnnie walker blue": 200,
  "maker's mark": 30,
  "maker's mark cask strength": 45,
  "woodford reserve": 38,
  "wild turkey 101": 25,
  "glenfiddich 12": 42,
  "glenlivet 12": 40,
  "jameson": 28,
  "bulleit bourbon": 30,
  "four roses single barrel": 45,
  "angel's envy": 55,
  "yamazaki 12": 180,
  "nikka from the barrel": 65,
  "laphroaig 10": 55,
  "ardbeg 10": 55,
  "oban 14": 80,
  "talisker 10": 65,
  "balvenie 12 doublewood": 65,
  "elijah craig small batch": 32,
  "knob creek 9": 38,
  "pappy van winkle 15": 1200,
  "blanton's single barrel": 65,
  "eagle rare": 35,
  "weller special reserve": 30,
};

// Simple in-memory cache (in production, use Redis or Supabase)
const priceCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const type = searchParams.get("type") || "Bourbon";

  if (!name) {
    return NextResponse.json(
      { error: "Missing 'name' parameter" },
      { status: 400 }
    );
  }

  // Check cache
  const cacheKey = `${name.toLowerCase()}-${type}`;
  const cached = priceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  // Look up known price or generate realistic estimate
  const nameLower = name.toLowerCase();
  let basePrice: number;

  const knownMatch = Object.keys(KNOWN_PRICES).find((key) =>
    nameLower.includes(key)
  );

  if (knownMatch) {
    basePrice = KNOWN_PRICES[knownMatch];
  } else {
    // Generate a semi-deterministic price based on the name
    const range = TYPE_PRICING[type] || TYPE_PRICING["Bourbon"];
    const hash = nameLower
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const normalizedHash = (hash % 100) / 100;
    basePrice = range.min + normalizedHash * (range.max - range.min);
  }

  // Add realistic variance for min/max
  const variance = basePrice * 0.15;
  const result = {
    name,
    avg_price: Math.round(basePrice * 100) / 100,
    min_price: Math.round((basePrice - variance) * 100) / 100,
    max_price: Math.round((basePrice + variance) * 100) / 100,
    currency: "USD",
    source: "mock",
    cached_at: new Date().toISOString(),
  };

  // Store in cache
  priceCache.set(cacheKey, { data: result, timestamp: Date.now() });

  return NextResponse.json(result);
}
