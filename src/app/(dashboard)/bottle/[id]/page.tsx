import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BottleDetail } from "@/components/collection/bottle-detail";

interface BottlePageProps {
  params: { id: string };
}

export default async function BottlePage({ params }: BottlePageProps) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return notFound();

  const { data: whiskey } = await supabase
    .from("whiskeys")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!whiskey) return notFound();

  return <BottleDetail whiskey={whiskey} />;
}
