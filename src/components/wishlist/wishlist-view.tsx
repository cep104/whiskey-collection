"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { WishlistItem } from "@/lib/types";
import { WishlistForm } from "@/components/forms/wishlist-form";
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
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  Heart,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const priorityColors = {
  High: "text-red-400 bg-red-400/10 border-red-400/20",
  Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Low: "text-green-400 bg-green-400/10 border-green-400/20",
};

interface WishlistViewProps {
  items: WishlistItem[];
}

export function WishlistView({ items }: WishlistViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<WishlistItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<WishlistItem | null>(null);
  const [acquireItem, setAcquireItem] = useState<WishlistItem | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleDelete() {
    if (!deleteItem) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", deleteItem.id);
      if (error) throw error;
      toast({ title: "Removed from wish list" });
      setDeleteItem(null);
      router.refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleAcquire() {
    if (!acquireItem) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Add to collection
      const { error: insertError } = await supabase.from("whiskeys").insert({
        user_id: user.id,
        name: acquireItem.whiskey_name,
        type: acquireItem.type,
        purchase_price: acquireItem.target_price,
        bottle_size_ml: 750,
        store: null,
        purchase_date: new Date().toISOString().split("T")[0],
        current_quantity_ml: 750,
        tasting_notes: null,
        rating: null,
        image_url: null,
      });
      if (insertError) throw insertError;

      // Remove from wishlist
      const { error: deleteError } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", acquireItem.id);
      if (deleteError) throw deleteError;

      toast({ title: `${acquireItem.whiskey_name} moved to collection!` });
      setAcquireItem(null);
      router.refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  // Group by priority
  const grouped = {
    High: items.filter((i) => i.priority === "High"),
    Medium: items.filter((i) => i.priority === "Medium"),
    Low: items.filter((i) => i.priority === "Low"),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">
            Wish List
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? "bottle" : "bottles"} on your
            radar
          </p>
        </div>
        <Button variant="amber" onClick={() => setShowForm(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Add to List</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 to-red-900/20 flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-pink-400/50" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-2">
            Nothing here yet
          </h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Add bottles you&apos;re looking for to track them and move them to
            your collection when you find them.
          </p>
          <Button variant="amber" onClick={() => setShowForm(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Your First Wish
          </Button>
        </div>
      ) : (
        Object.entries(grouped).map(
          ([priority, group]) =>
            group.length > 0 && (
              <div key={priority}>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      priority === "High"
                        ? "bg-red-400"
                        : priority === "Medium"
                        ? "bg-yellow-400"
                        : "bg-green-400"
                    )}
                  />
                  {priority} Priority
                  <span className="text-muted-foreground/50">
                    ({group.length})
                  </span>
                </h2>
                <div className="space-y-2">
                  <AnimatePresence>
                    {group.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card p-4 group hover:border-whiskey-gold/20 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-serif font-semibold truncate">
                                {item.whiskey_name}
                              </h3>
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                                  priorityColors[
                                    item.priority as keyof typeof priorityColors
                                  ]
                                )}
                              >
                                {item.priority}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              <span className="glass px-2 py-0.5 rounded">
                                {item.type}
                              </span>
                              {item.target_price && (
                                <span>
                                  Target: {formatCurrency(item.target_price)}
                                </span>
                              )}
                              <span>Added {formatDate(item.created_at)}</span>
                            </div>
                            {item.notes && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {item.notes}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setAcquireItem(item)}
                              title="Mark as acquired"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditItem(item);
                                setShowForm(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setDeleteItem(item)}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )
        )
      )}

      {/* Add/Edit Form Dialog */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditItem(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editItem ? "Edit Wish List Item" : "Add to Wish List"}
            </DialogTitle>
          </DialogHeader>
          <WishlistForm
            item={editItem || undefined}
            onClose={() => {
              setShowForm(false);
              setEditItem(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from wish list?</DialogTitle>
            <DialogDescription>
              Remove &ldquo;{deleteItem?.whiskey_name}&rdquo; from your wish
              list?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItem(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Acquire Dialog */}
      <Dialog
        open={!!acquireItem}
        onOpenChange={(open) => !open && setAcquireItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Collection</DialogTitle>
            <DialogDescription>
              Mark &ldquo;{acquireItem?.whiskey_name}&rdquo; as acquired and add
              it to your collection? You can edit the details afterwards.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcquireItem(null)}>
              Cancel
            </Button>
            <Button
              variant="amber"
              onClick={handleAcquire}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              Add to Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
