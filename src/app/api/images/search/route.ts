import { NextRequest, NextResponse } from "next/server";

/**
 * Image Search API for Whiskey Bottles
 *
 * Integration priority:
 * 1. Unsplash API (free tier: 50 req/hr) — set UNSPLASH_ACCESS_KEY env var
 * 2. Pexels API (free, generous limits) — set PEXELS_API_KEY env var
 * 3. Fallback: curated mock images based on whiskey type
 *
 * To enable real API:
 * - Sign up at https://unsplash.com/developers
 * - Create an app to get an access key
 * - Add UNSPLASH_ACCESS_KEY to .env.local
 */

// Curated fallback images by whiskey type (royalty-free stock photos)
const FALLBACK_IMAGES: Record<string, { url: string; thumbnail: string }[]> = {
  Bourbon: [
    { url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&h=1000&fit=crop", thumbnail: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=200&h=250&fit=crop" },
    { url: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=1000&fit=crop", thumbnail: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=200&h=250&fit=crop" },
    { url: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&h=1000&fit=crop", thumbnail: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&h=250&fit=crop" },
  ],
  Scotch: [
    { url: "https://images.unsplash.com/photo-1582819509237-d24b15a16135?w=800&h=1000&fit=crop", thumbnail: "https://images.unsplash.com/photo-1582819509237-d24b15a16135?w=200&h=250&fit=crop" },
    { url: "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?w=800&h=1000&fit=crop", thumbnail: "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?w=200&h=250&fit=crop" },
    { url: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=1000&fit=crop", thumbnail: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=200&h=250&fit=crop" },
  ],
  default: [
    { url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&h=1000&fit=crop", thumbnail: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=200&h=250&fit=crop" },
    { url: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=1000&fit=crop", thumbnail: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=200&h=250&fit=crop" },
    { url: "https://images.unsplash.com/photo-1582819509237-d24b15a16135?w=800&h=1000&fit=crop", thumbnail: "https://images.unsplash.com/photo-1582819509237-d24b15a16135?w=200&h=250&fit=crop" },
    { url: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&h=1000&fit=crop", thumbnail: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&h=250&fit=crop" },
  ],
};

const imageCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

async function searchUnsplash(query: string) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=portrait`,
    { headers: { Authorization: `Client-ID ${key}` } }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.results.map((photo: any) => ({
    url: photo.urls.regular,
    thumbnail: photo.urls.thumb,
    source: `Photo by ${photo.user.name} on Unsplash`,
    alt: photo.alt_description || query,
  }));
}

async function searchPexels(query: string) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;

  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=portrait`,
    { headers: { Authorization: key } }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.photos.map((photo: any) => ({
    url: photo.src.large,
    thumbnail: photo.src.tiny,
    source: `Photo by ${photo.photographer} on Pexels`,
    alt: query,
  }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const type = searchParams.get("type") || "";

  if (!name) {
    return NextResponse.json(
      { error: "Missing 'name' parameter" },
      { status: 400 }
    );
  }

  // Check cache
  const cacheKey = `img:${name.toLowerCase()}`;
  const cached = imageCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const query = `${name} whiskey bottle`;

  // Try Unsplash first
  let images = await searchUnsplash(query);

  // Fallback to Pexels
  if (!images) {
    images = await searchPexels(query);
  }

  // Fallback to curated images
  if (!images) {
    const typeImages = FALLBACK_IMAGES[type] || FALLBACK_IMAGES.default;
    images = typeImages.map((img) => ({
      ...img,
      source: "Stock photo",
      alt: name,
    }));
  }

  const result = { images, query: name };
  imageCache.set(cacheKey, { data: result, timestamp: Date.now() });

  return NextResponse.json(result);
}
