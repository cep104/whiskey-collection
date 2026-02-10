"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { whiskeyFormSchema, type WhiskeyFormData } from "@/lib/validations";
import type { Whiskey, WhiskeyType } from "@/lib/types";
import { WHISKEY_COUNTRIES } from "@/lib/types";
import type { WhiskeyEntry } from "@/lib/whiskey-database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/ui/star-rating";
import { BottleTracker } from "@/components/collection/bottle-tracker";
import { ImagePicker } from "@/components/forms/image-picker";
import { WhiskeySearch } from "@/components/forms/whiskey-search";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

const WHISKEY_TYPES: WhiskeyType[] = [
  "Bourbon", "Scotch", "Rye", "Irish", "Japanese", "Single Malt", "Blended",
];

interface WhiskeyFormProps {
  whiskey?: Whiskey;
}

export function WhiskeyForm({ whiskey }: WhiskeyFormProps) {
  const [rating, setRating] = useState(whiskey?.rating || 0);
  const [autoFilledName, setAutoFilledName] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    whiskey?.image_url || null
  );
  const [selectedApiImage, setSelectedApiImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fillPct, setFillPct] = useState(
    whiskey?.current_bottle_fill_percentage ?? 100
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WhiskeyFormData>({
    resolver: zodResolver(whiskeyFormSchema),
    defaultValues: {
      name: whiskey?.name || "",
      type: whiskey?.type || "Bourbon",
      distillery: whiskey?.distillery || "",
      country: whiskey?.country || "",
      region: whiskey?.region || "",
      age_statement: whiskey?.age_statement ?? undefined,
      store: whiskey?.store || "",
      purchase_price: whiskey?.purchase_price || undefined,
      purchase_date: whiskey?.purchase_date || "",
      number_of_bottles: whiskey?.number_of_bottles || 1,
      bottles_opened: whiskey?.bottles_opened || 0,
      current_bottle_fill_percentage:
        whiskey?.current_bottle_fill_percentage ?? 100,
      current_quantity_ml: whiskey?.current_quantity_ml || undefined,
      bottle_size_ml: whiskey?.bottle_size_ml || 750,
      abv: whiskey?.abv ?? undefined,
      tasting_notes: whiskey?.tasting_notes || "",
      rating: whiskey?.rating || undefined,
    },
  });

  const selectedType = watch("type");
  const selectedCountry = watch("country");
  const whiskeyName = watch("name");
  const bottleSizeMl = watch("bottle_size_ml") || 750;

  function handleAutoFill(entry: WhiskeyEntry) {
    setValue("name", entry.name);
    setValue("type", entry.type);
    setValue("distillery", entry.distillery);
    setValue("country", entry.country);
    setValue("region", entry.region);
    if (entry.age_statement) setValue("age_statement", entry.age_statement);
    if (entry.abv) setValue("abv", entry.abv);
    if (entry.bottle_size_ml) setValue("bottle_size_ml", entry.bottle_size_ml);
    if (entry.description) setValue("tasting_notes", entry.description);
    setAutoFilledName(entry.name);
  }

  function handleClearAutoFill() {
    setAutoFilledName(null);
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Please select an image under 5MB.",
        variant: "destructive",
      });
      return;
    }
    setImageFile(file);
    setSelectedApiImage(null);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    setSelectedApiImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleApiImageSelect(url: string) {
    setSelectedApiImage(url);
    setImagePreview(url);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadImage(userId: string): Promise<string | null> {
    if (selectedApiImage) return selectedApiImage;
    if (!imageFile) return whiskey?.image_url || null;

    const supabase = createClient();
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("whiskey-images")
      .upload(fileName, imageFile);
    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("whiskey-images").getPublicUrl(fileName);
    return publicUrl;
  }

  async function onSubmit(data: WhiskeyFormData) {
    setUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Not authenticated",
          description: "Please sign in again.",
          variant: "destructive",
        });
        return;
      }

      const imageUrl = await uploadImage(user.id);
      const currentMl = Math.round((fillPct / 100) * data.bottle_size_ml);

      const whiskeyData = {
        user_id: user.id,
        name: data.name,
        type: data.type,
        distillery: data.distillery || null,
        country: data.country || null,
        region: data.region || null,
        age_statement: data.age_statement || null,
        store: data.store || null,
        purchase_price: data.purchase_price || null,
        purchase_date: data.purchase_date || null,
        number_of_bottles: data.number_of_bottles || 1,
        bottles_opened: data.bottles_opened || 0,
        current_bottle_fill_percentage: fillPct,
        current_quantity_ml: currentMl,
        bottle_size_ml: data.bottle_size_ml,
        abv: data.abv || null,
        tasting_notes: data.tasting_notes || null,
        rating: rating || null,
        image_url: imageUrl,
      };

      // Base data without new columns (fallback if migration hasn't been run)
      const baseData = {
        user_id: user.id,
        name: data.name,
        type: data.type,
        store: data.store || null,
        purchase_price: data.purchase_price || null,
        purchase_date: data.purchase_date || null,
        current_quantity_ml: currentMl,
        bottle_size_ml: data.bottle_size_ml,
        tasting_notes: data.tasting_notes || null,
        rating: rating || null,
        image_url: imageUrl,
      };

      if (whiskey) {
        const { error } = await supabase
          .from("whiskeys")
          .update(whiskeyData)
          .eq("id", whiskey.id);
        if (error) {
          // Fallback without new columns
          const { error: fallbackErr } = await supabase
            .from("whiskeys")
            .update(baseData)
            .eq("id", whiskey.id);
          if (fallbackErr) throw fallbackErr;
        }
        toast({ title: "Bottle updated" });
      } else {
        const { error } = await supabase.from("whiskeys").insert(whiskeyData);
        if (error) {
          // Fallback without new columns
          const { error: fallbackErr } = await supabase
            .from("whiskeys")
            .insert(baseData);
          if (fallbackErr) throw fallbackErr;
        }
        toast({ title: "Bottle added to collection" });
      }

      router.push("/collection");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Whiskey Search / Auto-fill */}
      {!whiskey && (
        <div className="space-y-2">
          <Label>Search Whiskey Database</Label>
          <WhiskeySearch
            onSelect={handleAutoFill}
            onClear={handleClearAutoFill}
            selectedName={autoFilledName}
          />
          <p className="text-[11px] text-muted-foreground">
            Search to auto-fill details, or enter everything manually below.
          </p>
        </div>
      )}

      {/* Section 1: Basic Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Basic Info
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-400">*</span>
            </Label>
            <Input id="name" placeholder="e.g. Buffalo Trace" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Type <span className="text-red-400">*</span></Label>
            <Select
              value={selectedType}
              onValueChange={(v) => setValue("type", v as WhiskeyType)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {WHISKEY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="distillery">Distillery</Label>
          <Input id="distillery" placeholder="e.g. Buffalo Trace Distillery" {...register("distillery")} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age_statement">Age Statement (years)</Label>
            <Input id="age_statement" type="number" placeholder="e.g. 12" {...register("age_statement")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="abv">ABV (%)</Label>
            <Input id="abv" type="number" step="0.1" placeholder="e.g. 45.0" {...register("abv")} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select
              value={selectedCountry || "none"}
              onValueChange={(v) => setValue("country", v === "none" ? "" : v)}
            >
              <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {WHISKEY_COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Input id="region" placeholder="e.g. Kentucky, Speyside" {...register("region")} />
          </div>
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Section 2: Purchase Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Purchase Info
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="store">Store</Label>
            <Input id="store" placeholder="Where you bought it" {...register("store")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchase_price">Purchase Price ($)</Label>
            <Input id="purchase_price" type="number" step="0.01" placeholder="0.00" {...register("purchase_price")} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <Input id="purchase_date" type="date" {...register("purchase_date")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="number_of_bottles">Bottles Owned</Label>
            <Input id="number_of_bottles" type="number" min={1} {...register("number_of_bottles")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bottle_size_ml">Bottle Size (ml)</Label>
            <Input id="bottle_size_ml" type="number" placeholder="750" {...register("bottle_size_ml")} />
          </div>
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Section 3: Bottle Tracking */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Current Bottle Level
        </h3>
        <BottleTracker
          currentFillPercentage={fillPct}
          bottleSizeML={bottleSizeMl}
          currentML={Math.round((fillPct / 100) * bottleSizeMl)}
          onFillChange={(pct) => {
            setFillPct(pct);
            setValue("current_bottle_fill_percentage", pct);
            setValue("current_quantity_ml", Math.round((pct / 100) * bottleSizeMl));
          }}
          numberOfBottles={watch("number_of_bottles") || 1}
          bottlesOpened={watch("bottles_opened") || 0}
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Section 4: Tasting & Photo */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Tasting & Photo
        </h3>

        <div className="space-y-2">
          <Label>Rating</Label>
          <StarRating
            rating={rating}
            onChange={(r) => { setRating(r); setValue("rating", r); }}
            size="lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tasting_notes">Tasting Notes</Label>
          <Textarea
            id="tasting_notes"
            placeholder="Describe the flavors, aroma, finish..."
            rows={4}
            {...register("tasting_notes")}
          />
        </div>

        <div className="space-y-3">
          <Label>Bottle Image</Label>
          <ImagePicker
            whiskeyName={whiskeyName}
            whiskeyType={selectedType}
            selectedUrl={selectedApiImage}
            onSelect={handleApiImageSelect}
            onClear={removeImage}
          />

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-xs text-muted-foreground">or upload your own</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <div className="flex items-start gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-32 rounded-xl glass border-2 border-dashed border-white/10 hover:border-whiskey-gold/30 transition-colors cursor-pointer flex items-center justify-center overflow-hidden group"
            >
              {imagePreview && !selectedApiImage ? (
                <>
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="text-center space-y-1">
                  <ImageIcon className="w-6 h-6 mx-auto text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Upload</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="amber" className="flex-1" disabled={isSubmitting || uploading}>
          {(isSubmitting || uploading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {whiskey ? "Update Bottle" : "Add to Collection"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
