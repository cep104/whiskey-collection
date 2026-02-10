"use client";

import Link from "next/link";
import { Wine, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { sampleWhiskeys } from "@/lib/supabase/seed";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function EmptyState() {
  const { toast } = useToast();
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);

  async function seedData() {
    setSeeding(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Delete any existing data first to avoid duplicates
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

      const { error } = await supabase.from("whiskeys").insert(insertData);
      if (error) throw error;

      toast({ title: "Sample data added!" });

      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to seed data";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-whiskey-gold/20 to-amber-900/20 flex items-center justify-center mb-6">
        <Wine className="w-10 h-10 text-whiskey-gold/50" />
      </div>
      <h2 className="text-2xl font-serif font-bold mb-2">
        Your collection awaits
      </h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Start building your whiskey collection. Add your first bottle or load
        some sample data to explore.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="amber" asChild>
          <Link href="/add">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Your First Bottle
          </Link>
        </Button>
        <Button variant="outline" onClick={seedData} disabled={seeding}>
          {seeding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Load Sample Data
        </Button>
      </div>
    </div>
  );
}
