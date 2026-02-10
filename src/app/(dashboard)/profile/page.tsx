"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { sampleWhiskeys, sampleWishlist } from "@/lib/supabase/seed";
import {
  User,
  LogOut,
  Loader2,
  Database,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [clearing, setClearing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function seedSampleData() {
    setSeeding(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Delete existing data first to avoid duplicates
      await supabase.from("whiskeys").delete().eq("user_id", user.id);

      const insertData = sampleWhiskeys.map((w) => ({
        user_id: user.id,
        name: w.name,
        type: w.type,
        distillery: w.distillery,
        country: w.country,
        region: w.region,
        age_statement: w.age_statement,
        abv: w.abv,
        store: w.store,
        purchase_price: w.purchase_price,
        purchase_date: w.purchase_date,
        number_of_bottles: w.number_of_bottles,
        bottles_opened: w.bottles_opened,
        current_bottle_fill_percentage: w.current_bottle_fill_percentage,
        current_quantity_ml: w.current_quantity_ml,
        bottle_size_ml: w.bottle_size_ml,
        tasting_notes: w.tasting_notes,
        rating: w.rating,
        image_url: null,
      }));

      const { error: wError } = await supabase
        .from("whiskeys")
        .insert(insertData);
      if (wError) throw wError;

      const wishlistWithUser = sampleWishlist.map((w) => ({
        ...w,
        user_id: user.id,
      }));

      const { error: wlError } = await supabase
        .from("wishlist")
        .insert(wishlistWithUser);
      if (wlError) throw wlError;

      toast({ title: "Sample data loaded successfully!" });
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to seed data";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSeeding(false);
    }
  }

  async function clearAllData() {
    setClearing(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("whiskeys").delete().eq("user_id", user.id);
      await supabase.from("wishlist").delete().eq("user_id", user.id);

      toast({ title: "All data cleared" });
      setShowClearDialog(false);
      router.refresh();
    } catch {
      toast({ title: "Error clearing data", variant: "destructive" });
    } finally {
      setClearing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-whiskey-gold" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Info */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-whiskey-gold to-amber-700 flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-serif font-semibold text-lg">Account</h2>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>

          <Separator className="bg-white/[0.06]" />

          <div className="space-y-2">
            <Label htmlFor="email-display">Email</Label>
            <Input id="email-display" value={email} disabled />
          </div>

          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Data Management */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-serif font-semibold text-lg">Data Management</h2>
          <p className="text-sm text-muted-foreground">
            Load sample data to explore the app or clear all your data.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={seedSampleData}
              disabled={seeding}
            >
              {seeding ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Database className="w-4 h-4 mr-2" />
              )}
              Load Sample Data
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(true)}
              className="text-red-400 hover:text-red-300 hover:border-red-400/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>

        {/* App Info */}
        <div className="glass-card p-6 space-y-2">
          <h2 className="font-serif font-semibold text-lg">About</h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Cask & Carry v0.1.0</p>
            <p>A premium whiskey collection manager.</p>
            <p className="text-xs mt-3">
              Install as an app: Open in Safari on iOS, tap Share, then
              &quot;Add to Home Screen&quot;.
            </p>
          </div>
        </div>
      </div>

      {/* Clear Data Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear all data?</DialogTitle>
            <DialogDescription>
              This will permanently delete all your bottles and wish list items.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={clearAllData}
              disabled={clearing}
            >
              {clearing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
