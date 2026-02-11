"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Whiskey } from "@/lib/types";
import { StarRating } from "@/components/ui/star-rating";
import { BottleTracker } from "@/components/collection/bottle-tracker";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft, Edit, Trash2, Wine, MapPin, Calendar, DollarSign,
  Droplets, Loader2, Building2, Globe, Clock, Package,
} from "lucide-react";
import { WhiskeyForm } from "@/components/forms/whiskey-form";
import { AnimeRecommendations } from "@/components/collection/anime-recommendations";
import { motion } from "framer-motion";

interface BottleDetailProps {
  whiskey: Whiskey;
}

export function BottleDetail({ whiskey }: BottleDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [marketPrice, setMarketPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [fillPct, setFillPct] = useState(whiskey.current_bottle_fill_percentage ?? 100);
  const [currentBottlesOpened, setCurrentBottlesOpened] = useState(whiskey.bottles_opened ?? 0);
  const router = useRouter();
  const { toast } = useToast();

  async function handleDelete() {
    setDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("whiskeys").delete().eq("id", whiskey.id);
      if (error) throw error;
      toast({ title: "Bottle removed from collection" });
      router.push("/collection");
      router.refresh();
    } catch {
      toast({ title: "Error deleting bottle", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  }

  async function fetchMarketPrice() {
    setLoadingPrice(true);
    try {
      const res = await fetch(
        `/api/pricing?name=${encodeURIComponent(whiskey.name)}&type=${encodeURIComponent(whiskey.type)}`
      );
      const data = await res.json();
      if (data.avg_price) setMarketPrice(data.avg_price);
    } catch { /* silent */ } finally {
      setLoadingPrice(false);
    }
  }

  async function handleFillChange(pct: number, ml: number) {
    setFillPct(pct);
    const supabase = createClient();
    await supabase
      .from("whiskeys")
      .update({ current_bottle_fill_percentage: pct, current_quantity_ml: ml })
      .eq("id", whiskey.id);
  }

  async function handleOpenNewBottle() {
    const newOpened = currentBottlesOpened + 1;
    setCurrentBottlesOpened(newOpened);
    setFillPct(100);
    const supabase = createClient();
    await supabase
      .from("whiskeys")
      .update({
        bottles_opened: newOpened,
        current_bottle_fill_percentage: 100,
        current_quantity_ml: whiskey.bottle_size_ml,
      })
      .eq("id", whiskey.id);
    toast({ title: "New bottle opened!" });
  }

  if (isEditing) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />Cancel Editing
          </button>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">Edit Bottle</h1>
        </div>
        <div className="glass-card p-6">
          <WhiskeyForm whiskey={{ ...whiskey, current_bottle_fill_percentage: fillPct, bottles_opened: currentBottlesOpened }} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Link href="/collection" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />Back to Collection
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        {/* Hero */}
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-whiskey-dark to-black">
          {whiskey.image_url ? (
            <Image src={whiskey.image_url} alt={whiskey.name} fill className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center"><Wine className="w-20 h-20 text-whiskey-gold/15" /></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider glass text-whiskey-gold">{whiskey.type}</span>
              {whiskey.age_statement && <span className="px-3 py-1 rounded-full text-xs font-semibold glass text-amber-300">{whiskey.age_statement} Year</span>}
              {whiskey.number_of_bottles > 1 && <span className="px-3 py-1 rounded-full text-xs font-semibold glass text-blue-300">{whiskey.number_of_bottles} bottles</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">{whiskey.name}</h1>
            {whiskey.distillery && <p className="text-sm text-white/70 mt-1">{whiskey.distillery}</p>}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}><Edit className="w-4 h-4 mr-2" />Edit</Button>
            <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)} className="text-red-400 hover:text-red-300 hover:border-red-400/50"><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
            <Button variant="outline" size="sm" onClick={fetchMarketPrice} disabled={loadingPrice} className="ml-auto">
              {loadingPrice ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <DollarSign className="w-4 h-4 mr-2" />}Market Price
            </Button>
          </div>

          {/* Market Price */}
          {marketPrice && (
            <div className="glass-card p-4 border-whiskey-gold/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Est. Market Value</p>
                  <p className="text-2xl font-bold text-whiskey-gold">{formatCurrency(marketPrice)}</p>
                </div>
                {whiskey.purchase_price != null && whiskey.purchase_price > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">vs. Purchase</p>
                    <p className={`text-sm font-semibold ${marketPrice > whiskey.purchase_price ? "text-green-400" : "text-red-400"}`}>
                      {marketPrice > whiskey.purchase_price ? "+" : ""}{formatCurrency(marketPrice - whiskey.purchase_price)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {whiskey.purchase_price != null && whiskey.purchase_price > 0 && (
              <div className="glass p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-whiskey-gold" /><span className="text-xs text-muted-foreground">Price</span></div>
                <p className="font-semibold">{formatCurrency(whiskey.purchase_price)}</p>
              </div>
            )}
            {whiskey.store && (
              <div className="glass p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1"><MapPin className="w-4 h-4 text-whiskey-gold" /><span className="text-xs text-muted-foreground">Store</span></div>
                <p className="font-semibold text-sm">{whiskey.store}</p>
              </div>
            )}
            {whiskey.purchase_date && (
              <div className="glass p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1"><Calendar className="w-4 h-4 text-whiskey-gold" /><span className="text-xs text-muted-foreground">Purchased</span></div>
                <p className="font-semibold text-sm">{formatDate(whiskey.purchase_date)}</p>
              </div>
            )}
            <div className="glass p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1"><Droplets className="w-4 h-4 text-whiskey-gold" /><span className="text-xs text-muted-foreground">Size</span></div>
              <p className="font-semibold text-sm">{whiskey.bottle_size_ml}ml</p>
            </div>
            {whiskey.distillery && (
              <Link href={`/distilleries/${encodeURIComponent(whiskey.distillery.toLowerCase().replace(/\s+/g, "-"))}`} className="glass p-3 rounded-xl hover:border-whiskey-gold/20 transition-colors">
                <div className="flex items-center gap-2 mb-1"><Building2 className="w-4 h-4 text-whiskey-gold" /><span className="text-xs text-muted-foreground">Distillery</span></div>
                <p className="font-semibold text-sm text-whiskey-gold">{whiskey.distillery}</p>
              </Link>
            )}
            {whiskey.country && (
              <div className="glass p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1"><Globe className="w-4 h-4 text-whiskey-gold" /><span className="text-xs text-muted-foreground">{whiskey.region ? "Origin" : "Country"}</span></div>
                <p className="font-semibold text-sm">{whiskey.region ? `${whiskey.region}, ${whiskey.country}` : whiskey.country}</p>
              </div>
            )}
            {whiskey.age_statement && (
              <div className="glass p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1"><Clock className="w-4 h-4 text-whiskey-gold" /><span className="text-xs text-muted-foreground">Age</span></div>
                <p className="font-semibold text-sm">{whiskey.age_statement} years</p>
              </div>
            )}
            {whiskey.abv && (
              <div className="glass p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1"><Droplets className="w-4 h-4 text-whiskey-gold" /><span className="text-xs text-muted-foreground">ABV</span></div>
                <p className="font-semibold text-sm">{whiskey.abv}%</p>
              </div>
            )}
            {whiskey.number_of_bottles > 1 && (
              <div className="glass p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1"><Package className="w-4 h-4 text-whiskey-gold" /><span className="text-xs text-muted-foreground">Inventory</span></div>
                <p className="font-semibold text-sm">{whiskey.number_of_bottles} bottles</p>
              </div>
            )}
          </div>

          {/* Rating */}
          {whiskey.rating && (
            <div><h3 className="text-sm font-medium text-muted-foreground mb-2">Rating</h3><StarRating rating={whiskey.rating} size="lg" readonly /></div>
          )}

          {/* Bottle Tracker */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Bottle Level</h3>
            <div className="glass-card p-5">
              <BottleTracker
                currentFillPercentage={fillPct}
                bottleSizeML={whiskey.bottle_size_ml}
                currentML={Math.round((fillPct / 100) * whiskey.bottle_size_ml)}
                onFillChange={handleFillChange}
                numberOfBottles={whiskey.number_of_bottles}
                bottlesOpened={currentBottlesOpened}
                onOpenNewBottle={handleOpenNewBottle}
              />
            </div>
          </div>

          {whiskey.distillery && (
            <Link href={`/distilleries/${encodeURIComponent(whiskey.distillery.toLowerCase().replace(/\s+/g, "-"))}`} className="inline-flex items-center gap-2 text-sm text-whiskey-gold hover:text-amber-400 transition-colors min-h-[44px]">
              <Building2 className="w-4 h-4" />View all from {whiskey.distillery}
            </Link>
          )}

          {whiskey.tasting_notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Tasting Notes</h3>
              <p className="text-sm leading-relaxed glass p-4 rounded-xl italic">&ldquo;{whiskey.tasting_notes}&rdquo;</p>
            </div>
          )}

          {/* Anime Pairing Easter Egg */}
          <AnimeRecommendations whiskey={whiskey} />

          <p className="text-xs text-muted-foreground">
            Added {formatDate(whiskey.created_at)}
            {whiskey.updated_at !== whiskey.created_at && ` · Updated ${formatDate(whiskey.updated_at)}`}
          </p>
        </div>
      </motion.div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {whiskey.name}?</DialogTitle>
            <DialogDescription>This will permanently remove this bottle from your collection.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
