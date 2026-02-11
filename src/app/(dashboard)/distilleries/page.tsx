import { createServerClient } from "@/lib/supabase/server";
import { DistilleriesView } from "@/components/collection/distilleries-view";
import { PageTransition } from "@/components/ui/page-transition";
import type { Whiskey } from "@/lib/types";

export default async function DistilleriesPage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let whiskeys: Whiskey[] = [];
  if (user) {
    const { data } = await supabase
      .from("whiskeys")
      .select("*")
      .eq("user_id", user.id)
      .order("distillery", { ascending: true });
    whiskeys = (data || []) as Whiskey[];
  }

  return (
    <PageTransition>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-serif font-bold">
            <span className="text-gradient">Distilleries</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore your collection by distillery
          </p>
        </div>
        <DistilleriesView whiskeys={whiskeys} />
      </div>
    </PageTransition>
  );
}
