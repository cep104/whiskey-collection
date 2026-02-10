import { WhiskeyForm } from "@/components/forms/whiskey-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddBottlePage() {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/collection"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Collection
        </Link>
        <h1 className="text-2xl md:text-3xl font-serif font-bold">
          Add a Bottle
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add a new whiskey to your collection
        </p>
      </div>

      <div className="glass-card p-6">
        <WhiskeyForm />
      </div>
    </div>
  );
}
