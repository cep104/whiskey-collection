import { createServerClient } from "@/lib/supabase/server";
import { CollectionView } from "@/components/collection/collection-view";
import { PageTransition } from "@/components/ui/page-transition";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function CollectionPage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let whiskeys: any[] = [];
  if (user) {
    const { data } = await supabase
      .from("whiskeys")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    whiskeys = data || [];
  }

  return (
    <PageTransition>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold">
              My Collection
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {whiskeys.length} {whiskeys.length === 1 ? "bottle" : "bottles"}
            </p>
          </div>
          <Link
            href="/add"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-whiskey-gold to-amber-600 text-white text-sm font-medium hover:from-amber-600 hover:to-whiskey-gold shadow-lg shadow-amber-900/30 transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            Add Bottle
          </Link>
        </div>

        <CollectionView whiskeys={whiskeys} />
      </div>
    </PageTransition>
  );
}
