export type WhiskeyType =
  | "Bourbon"
  | "Scotch"
  | "Rye"
  | "Irish"
  | "Japanese"
  | "Single Malt"
  | "Blended";

export type WishlistPriority = "High" | "Medium" | "Low";

export interface Whiskey {
  id: string;
  user_id: string;
  name: string;
  type: WhiskeyType;
  distillery: string | null;
  country: string | null;
  region: string | null;
  age_statement: number | null;
  store: string | null;
  purchase_price: number | null;
  purchase_date: string | null;
  number_of_bottles: number;
  bottles_opened: number;
  current_bottle_fill_percentage: number;
  current_quantity_ml: number | null;
  bottle_size_ml: number;
  abv: number | null;
  tasting_notes: string | null;
  rating: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  whiskey_name: string;
  type: WhiskeyType;
  priority: WishlistPriority;
  target_price: number | null;
  notes: string | null;
  created_at: string;
}

export interface PricingData {
  name: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  currency: string;
  source: string;
  cached_at: string;
}

export interface ImageSearchResult {
  url: string;
  thumbnail: string;
  source: string;
  alt: string;
}

export interface CollectionStats {
  total_bottles: number;
  total_value: number;
  type_breakdown: { type: WhiskeyType; count: number; value: number }[];
  most_expensive: Whiskey[];
  recently_added: Whiskey[];
  avg_rating: number;
}

export const WHISKEY_COUNTRIES = [
  "USA",
  "Scotland",
  "Ireland",
  "Japan",
  "Canada",
  "India",
  "Taiwan",
  "Australia",
  "England",
  "Wales",
  "Other",
] as const;

export type WhiskeyCountry = (typeof WHISKEY_COUNTRIES)[number];

export interface Database {
  public: {
    Tables: {
      whiskeys: {
        Row: Whiskey;
        Insert: Omit<Whiskey, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Whiskey, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      wishlist: {
        Row: WishlistItem;
        Insert: Omit<WishlistItem, "id" | "created_at">;
        Update: Partial<Omit<WishlistItem, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
