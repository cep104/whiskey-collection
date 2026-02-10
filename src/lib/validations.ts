import { z } from "zod";

export const whiskeyFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  type: z.enum([
    "Bourbon",
    "Scotch",
    "Rye",
    "Irish",
    "Japanese",
    "Single Malt",
    "Blended",
  ]),
  distillery: z.string().max(200).optional().or(z.literal("")),
  country: z.string().max(100).optional().or(z.literal("")),
  region: z.string().max(200).optional().or(z.literal("")),
  age_statement: z.coerce.number().min(0).max(100).optional().nullable(),
  store: z.string().max(200).optional().or(z.literal("")),
  purchase_price: z.coerce.number().min(0).optional().or(z.literal(0)),
  purchase_date: z.string().optional().or(z.literal("")),
  number_of_bottles: z.coerce.number().min(1).max(999).default(1),
  bottles_opened: z.coerce.number().min(0).max(999).default(0),
  current_bottle_fill_percentage: z.coerce.number().min(0).max(100).default(100),
  current_quantity_ml: z.coerce.number().min(0).optional(),
  bottle_size_ml: z.coerce.number().min(50).max(5000).default(750),
  abv: z.coerce.number().min(0).max(100).optional().nullable(),
  tasting_notes: z.string().max(2000).optional().or(z.literal("")),
  rating: z.coerce.number().min(1).max(5).optional(),
});

export const wishlistFormSchema = z.object({
  whiskey_name: z.string().min(1, "Name is required").max(200),
  type: z.enum([
    "Bourbon",
    "Scotch",
    "Rye",
    "Irish",
    "Japanese",
    "Single Malt",
    "Blended",
  ]),
  priority: z.enum(["High", "Medium", "Low"]),
  target_price: z.coerce.number().min(0).optional().or(z.literal(0)),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export type WhiskeyFormData = z.infer<typeof whiskeyFormSchema>;
export type WishlistFormData = z.infer<typeof wishlistFormSchema>;
