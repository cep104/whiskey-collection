"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { whiskeyFormSchema, type WhiskeyFormData } from "@/lib/validations";
import type { Whiskey, WhiskeyType } from "@/lib/types";
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
import { StarRating } from "@/components/ui/star-rating";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

const WHISKEY_TYPES: WhiskeyType[] = [
  "Bourbon",
  "Scotch",
  "Rye",
  "Irish",
  "Japanese",
  "Single Malt",
  "Blended",
];

interface WhiskeyFormProps {
  whiskey?: Whiskey;
}

export function WhiskeyForm({ whiskey }: WhiskeyFormProps) {
  const [rating, setRating] = useState(whiskey?.rating || 0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    whiskey?.image_url || null
  );
  const [uploading, setUploading] = useState(false);
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
      store: whiskey?.store || "",
      purchase_price: whiskey?.purchase_price || undefined,
      purchase_date: whiskey?.purchase_date || "",
      current_quantity_ml: whiskey?.current_quantity_ml || undefined,
      bottle_size_ml: whiskey?.bottle_size_ml || 750,
      tasting_notes: whiskey?.tasting_notes || "",
      rating: whiskey?.rating || undefined,
    },
  });

  const selectedType = watch("type");

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
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadImage(userId: string): Promise<string | null> {
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

      const whiskeyData = {
        user_id: user.id,
        name: data.name,
        type: data.type,
        store: data.store || null,
        purchase_price: data.purchase_price || null,
        purchase_date: data.purchase_date || null,
        current_quantity_ml: data.current_quantity_ml || null,
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

        if (error) throw error;
        toast({ title: "Bottle updated", variant: "success" as "default" });
      } else {
        const { error } = await supabase.from("whiskeys").insert(whiskeyData);
        if (error) throw error;
        toast({ title: "Bottle added to collection", variant: "success" as "default" });
      }

      router.push("/collection");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Bottle Image</Label>
        <div className="flex items-start gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-32 h-40 rounded-xl glass border-2 border-dashed border-white/10 hover:border-whiskey-gold/30 transition-colors cursor-pointer flex items-center justify-center overflow-hidden group"
          >
            {imagePreview ? (
              <>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <div className="text-center space-y-2">
                <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Add photo
                </span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <div className="flex-1 space-y-1">
            <p className="text-sm text-muted-foreground">
              Upload a photo of your bottle. Max 5MB.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
        </div>
      </div>

      {/* Name & Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-red-400">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g. Buffalo Trace"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>
            Type <span className="text-red-400">*</span>
          </Label>
          <Select
            value={selectedType}
            onValueChange={(v) => setValue("type", v as WhiskeyType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WHISKEY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Store & Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="store">Store</Label>
          <Input
            id="store"
            placeholder="Where you bought it"
            {...register("store")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchase_price">Purchase Price ($)</Label>
          <Input
            id="purchase_price"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("purchase_price")}
          />
        </div>
      </div>

      {/* Date & Bottle Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchase_date">Purchase Date</Label>
          <Input
            id="purchase_date"
            type="date"
            {...register("purchase_date")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bottle_size_ml">Bottle Size (ml)</Label>
          <Input
            id="bottle_size_ml"
            type="number"
            placeholder="750"
            {...register("bottle_size_ml")}
          />
        </div>
      </div>

      {/* Current Quantity */}
      <div className="space-y-2">
        <Label htmlFor="current_quantity_ml">Current Quantity (ml)</Label>
        <Input
          id="current_quantity_ml"
          type="number"
          placeholder="How much is left"
          {...register("current_quantity_ml")}
        />
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <Label>Rating</Label>
        <StarRating
          rating={rating}
          onChange={(r) => {
            setRating(r);
            setValue("rating", r);
          }}
          size="lg"
        />
      </div>

      {/* Tasting Notes */}
      <div className="space-y-2">
        <Label htmlFor="tasting_notes">Tasting Notes</Label>
        <Textarea
          id="tasting_notes"
          placeholder="Describe the flavors, aroma, finish..."
          rows={4}
          {...register("tasting_notes")}
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          variant="amber"
          className="flex-1"
          disabled={isSubmitting || uploading}
        >
          {(isSubmitting || uploading) && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          {whiskey ? "Update Bottle" : "Add to Collection"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
