"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, Loader2, Check, X } from "lucide-react";
import type { ImageSearchResult } from "@/lib/types";

interface ImagePickerProps {
  whiskeyName: string;
  whiskeyType: string;
  selectedUrl: string | null;
  onSelect: (url: string) => void;
  onClear: () => void;
}

export function ImagePicker({
  whiskeyName,
  whiskeyType,
  selectedUrl,
  onSelect,
  onClear,
}: ImagePickerProps) {
  const [images, setImages] = useState<ImageSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState(whiskeyName);

  // Keep search query in sync when the bottle name changes (e.g. auto-fill)
  useEffect(() => {
    if (whiskeyName) setSearchQuery(whiskeyName);
  }, [whiskeyName]);

  const searchImages = useCallback(async () => {
    const query = searchQuery.trim() || whiskeyName.trim();
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/images/search?name=${encodeURIComponent(query)}&type=${encodeURIComponent(whiskeyType)}`
      );
      const data = await res.json();
      setImages(data.images || []);
      setSearched(true);
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, whiskeyName, whiskeyType]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search for bottle images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); searchImages(); } }}
          className="flex-1 h-9 text-sm"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={searchImages}
          disabled={loading || (!searchQuery.trim() && !whiskeyName.trim())}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
          ) : (
            <Search className="w-4 h-4 mr-1.5" />
          )}
          Search
        </Button>
        {selectedUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Searching for &ldquo;{searchQuery.trim() || whiskeyName}&rdquo;...
        </div>
      )}

      {searched && images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(img.url)}
              className={cn(
                "relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all hover:opacity-90",
                selectedUrl === img.url
                  ? "border-whiskey-gold ring-1 ring-whiskey-gold/50"
                  : "border-transparent hover:border-white/20"
              )}
            >
              <Image
                src={img.thumbnail}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="120px"
              />
              {selectedUrl === img.url && (
                <div className="absolute inset-0 bg-whiskey-gold/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-whiskey-gold flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 p-1">
                <p className="text-[8px] text-white/70 truncate">{img.source}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {searched && images.length === 0 && !loading && (
        <p className="text-xs text-muted-foreground">
          No images found. You can upload your own photo instead.
        </p>
      )}
    </div>
  );
}
