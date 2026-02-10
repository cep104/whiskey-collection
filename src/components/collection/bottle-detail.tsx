"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Whiskey } from "@/lib/types";
import { StarRating } from "@/components/ui/star-rating";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  formatCurrency,
  formatDate,
  getQuantityPercentage,
  getQuantityColor,
} from "@/lib/utils";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Wine,
  MapPin,
  Calendar,
  DollarSign,
  Droplets,
  Loader2,
} from "lucide-react";
import { WhiskeyForm } from "@/components/forms/whiskey-form";
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
  const router = useRouter();
  const { toast } = useToast();

  const quantityPct = getQuantityPercentage(
    whiskey.current_quantity_ml,
    whiskey.bottle_size_ml
  );

  async function handleDelete() {
    setDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("whiskeys")
        .delete()
        .eq("id", whiskey.id);
      if (error) throw error;

      toast({ title: "Bottle removed from collection" });
      router.push("/collection");
      router.refresh();
    } catch {
      toast({
        title: "Error deleting bottle",
        variant: "destructive",
      });
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
      if (data.avg_price) {
        setMarketPrice(data.avg_price);
      }
    } catch {
      // Silently fail
    } finally {
      setLoadingPrice(false);
    }
  }

  if (isEditing) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Cancel Editing
          </button>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">
            Edit Bottle
          </h1>
        </div>
        <div className="glass-card p-6">
          <WhiskeyForm whiskey={whiskey} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Link
        href="/collection"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Collection
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        {/* Hero Image */}
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-whiskey-dark to-black">
          {whiskey.image_url ? (
            <Image
              src={whiskey.image_url}
              alt={whiskey.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Wine className="w-20 h-20 text-whiskey-gold/15" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider glass text-whiskey-gold mb-2 inline-block">
              {whiskey.type}
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
              {whiskey.name}
            </h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-400 hover:text-red-300 hover:border-red-400/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMarketPrice}
              disabled={loadingPrice}
              className="ml-auto"
            >
              {loadingPrice ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <DollarSign className="w-4 h-4 mr-2" />
              )}
              Market Price
            </Button>
          </div>

          {/* Market Price Banner */}
          {marketPrice && (
            <div className="glass-card p-4 border-whiskey-gold/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Est. Market Value
                  </p>
                  <p className="text-2xl font-bold text-whiskey-gold">
                    {formatCurrency(marketPrice)}
                  </p>
                </div>
                {whiskey.purchase_price && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      vs. Purchase Price
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        marketPrice > whiskey.purchase_price
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {marketPrice > whiskey.purchase_price ? "+" : ""}
                      {formatCurrency(marketPrice - whiskey.purchase_price)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {whiskey.purchase_price && (
              <div className="glass p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-whiskey-gold" />
                  <span className="text-xs text-muted-foreground">Price</span>
                </div>
                <p className="font-semibold">
                  {formatCurrency(whiskey.purchase_price)}
                </p>
              </div>
            )}
            {whiskey.store && (
              <div className="glass p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-whiskey-gold" />
                  <span className="text-xs text-muted-foreground">Store</span>
                </div>
                <p className="font-semibold text-sm">{whiskey.store}</p>
              </div>
            )}
            {whiskey.purchase_date && (
              <div className="glass p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-whiskey-gold" />
                  <span className="text-xs text-muted-foreground">
                    Purchased
                  </span>
                </div>
                <p className="font-semibold text-sm">
                  {formatDate(whiskey.purchase_date)}
                </p>
              </div>
            )}
            <div className="glass p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="w-4 h-4 text-whiskey-gold" />
                <span className="text-xs text-muted-foreground">Size</span>
              </div>
              <p className="font-semibold text-sm">
                {whiskey.bottle_size_ml}ml
              </p>
            </div>
          </div>

          {/* Rating */}
          {whiskey.rating && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Rating
              </h3>
              <StarRating rating={whiskey.rating} size="lg" readonly />
            </div>
          )}

          {/* Quantity */}
          <div>
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Remaining
              </h3>
              <span className={`text-sm font-semibold ${getQuantityColor(quantityPct)}`}>
                {whiskey.current_quantity_ml || whiskey.bottle_size_ml}ml /{" "}
                {whiskey.bottle_size_ml}ml ({quantityPct}%)
              </span>
            </div>
            <Progress value={quantityPct} className="h-2" />
          </div>

          {/* Tasting Notes */}
          {whiskey.tasting_notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Tasting Notes
              </h3>
              <p className="text-sm leading-relaxed glass p-4 rounded-xl italic">
                &ldquo;{whiskey.tasting_notes}&rdquo;
              </p>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Added {formatDate(whiskey.created_at)}
            {whiskey.updated_at !== whiskey.created_at &&
              ` · Updated ${formatDate(whiskey.updated_at)}`}
          </p>
        </div>
      </motion.div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {whiskey.name}?</DialogTitle>
            <DialogDescription>
              This will permanently remove this bottle from your collection.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
