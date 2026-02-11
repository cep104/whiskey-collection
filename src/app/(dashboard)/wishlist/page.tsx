import { createServerClient } from "@/lib/supabase/server";
import { WishlistView } from "@/components/wishlist/wishlist-view";
import { PageTransition } from "@/components/ui/page-transition";

export default async function WishlistPage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let items: any[] = [];
  if (user) {
    const { data } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user.id)
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false });

    items = data || [];
  }

  return (
    <PageTransition>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <WishlistView items={items} />
      </div>
    </PageTransition>
  );
}
