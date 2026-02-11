import { createServerClient } from "@/lib/supabase/server";
import { StatsView } from "@/components/collection/stats-view";
import { PageTransition } from "@/components/ui/page-transition";
import type { Whiskey } from "@/lib/types";

export default async function StatsPage() {
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
      .order("created_at", { ascending: false });

    whiskeys = (data || []) as Whiskey[];
  }

  return (
    <PageTransition>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-serif font-bold">
            Statistics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your collection at a glance
          </p>
        </div>
        <StatsView whiskeys={whiskeys} />
      </div>
    </PageTransition>
  );
}
