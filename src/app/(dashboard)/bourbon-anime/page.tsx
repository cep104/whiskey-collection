import { createServerClient } from "@/lib/supabase/server";
import { PageTransition } from "@/components/ui/page-transition";
import { BourbonAnimeView } from "@/components/collection/bourbon-anime-view";
import type { Whiskey } from "@/lib/types";

export default async function BourbonAnimePage() {
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
      .order("rating", { ascending: false });
    whiskeys = (data || []) as Whiskey[];
  }

  return (
    <PageTransition>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <BourbonAnimeView whiskeys={whiskeys} />
      </div>
    </PageTransition>
  );
}
