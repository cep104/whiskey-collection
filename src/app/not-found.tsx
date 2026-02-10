import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wine } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-whiskey-gold/10 mb-2">
          <Wine className="w-8 h-8 text-whiskey-gold/50" />
        </div>
        <h1 className="text-4xl font-serif font-bold">404</h1>
        <p className="text-muted-foreground">
          This page doesn&apos;t exist. Maybe the bottle&apos;s been finished?
        </p>
        <Button variant="amber" asChild>
          <Link href="/collection">Back to Collection</Link>
        </Button>
      </div>
    </div>
  );
}
