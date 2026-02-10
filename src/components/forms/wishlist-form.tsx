"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { wishlistFormSchema, type WishlistFormData } from "@/lib/validations";
import type { WishlistItem, WhiskeyType, WishlistPriority } from "@/lib/types";
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
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const WHISKEY_TYPES: WhiskeyType[] = [
  "Bourbon",
  "Scotch",
  "Rye",
  "Irish",
  "Japanese",
  "Single Malt",
  "Blended",
];

const PRIORITIES: WishlistPriority[] = ["High", "Medium", "Low"];

interface WishlistFormProps {
  item?: WishlistItem;
  onClose?: () => void;
}

export function WishlistForm({ item, onClose }: WishlistFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WishlistFormData>({
    resolver: zodResolver(wishlistFormSchema),
    defaultValues: {
      whiskey_name: item?.whiskey_name || "",
      type: item?.type || "Bourbon",
      priority: item?.priority || "Medium",
      target_price: item?.target_price || undefined,
      notes: item?.notes || "",
    },
  });

  const selectedType = watch("type");
  const selectedPriority = watch("priority");

  async function onSubmit(data: WishlistFormData) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const wishlistData = {
        user_id: user.id,
        whiskey_name: data.whiskey_name,
        type: data.type,
        priority: data.priority,
        target_price: data.target_price || null,
        notes: data.notes || null,
      };

      if (item) {
        const { error } = await supabase
          .from("wishlist")
          .update(wishlistData)
          .eq("id", item.id);
        if (error) throw error;
        toast({ title: "Wish list item updated" });
      } else {
        const { error } = await supabase.from("wishlist").insert(wishlistData);
        if (error) throw error;
        toast({ title: "Added to wish list" });
      }

      onClose?.();
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="whiskey_name">
          Whiskey Name <span className="text-red-400">*</span>
        </Label>
        <Input
          id="whiskey_name"
          placeholder="e.g. Pappy Van Winkle 15"
          {...register("whiskey_name")}
        />
        {errors.whiskey_name && (
          <p className="text-xs text-red-400">{errors.whiskey_name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
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
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            value={selectedPriority}
            onValueChange={(v) => setValue("priority", v as WishlistPriority)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_price">Target Price ($)</Label>
        <Input
          id="target_price"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register("target_price")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Where to find it, alternatives, etc."
          rows={3}
          {...register("notes")}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          variant="amber"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {item ? "Update" : "Add to Wish List"}
        </Button>
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
