import { createServerClient } from "@/lib/supabase/server";
import { DistilleryDetail } from "@/components/collection/distillery-detail";
import { notFound } from "next/navigation";
import type { Whiskey } from "@/lib/types";

function fromSlug(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, " ");
}

export default async function DistilleryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const decodedName = fromSlug(params.slug);

  // Fetch all user's whiskeys and filter by distillery name (case-insensitive)
  const { data } = await supabase
    .from("whiskeys")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  const allWhiskeys = (data || []) as Whiskey[];

  const whiskeys = allWhiskeys.filter(
    (w) =>
      (w.distillery || "unknown distillery").toLowerCase() ===
      decodedName.toLowerCase()
  );

  if (whiskeys.length === 0) {
    notFound();
  }

  const distilleryName = whiskeys[0].distillery || "Unknown Distillery";

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <DistilleryDetail distilleryName={distilleryName} whiskeys={whiskeys} />
    </div>
  );
}
