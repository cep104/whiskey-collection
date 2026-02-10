import type { WhiskeyType, WishlistPriority } from "@/lib/types";

export const sampleWhiskeys: {
  name: string;
  type: WhiskeyType;
  store: string;
  purchase_price: number;
  purchase_date: string;
  current_quantity_ml: number;
  bottle_size_ml: number;
  tasting_notes: string;
  rating: number;
}[] = [
  {
    name: "Buffalo Trace Kentucky Straight",
    type: "Bourbon",
    store: "Total Wine",
    purchase_price: 29.99,
    purchase_date: "2024-12-15",
    current_quantity_ml: 600,
    bottle_size_ml: 750,
    tasting_notes:
      "Rich vanilla and caramel with hints of toffee and dark fruit. Smooth finish with a touch of spice.",
    rating: 4,
  },
  {
    name: "Lagavulin 16 Year",
    type: "Scotch",
    store: "BevMo",
    purchase_price: 89.99,
    purchase_date: "2024-11-20",
    current_quantity_ml: 500,
    bottle_size_ml: 750,
    tasting_notes:
      "Intensely smoky and peaty with iodine and seaweed. Rich dried fruit and sherry sweetness underneath.",
    rating: 5,
  },
  {
    name: "Hibiki Harmony",
    type: "Japanese",
    store: "K&L Wines",
    purchase_price: 69.99,
    purchase_date: "2025-01-05",
    current_quantity_ml: 700,
    bottle_size_ml: 700,
    tasting_notes:
      "Delicate honey and candied orange peel. Rose, lychee, and subtle Mizunara oak spice. Silky texture.",
    rating: 5,
  },
  {
    name: "Redbreast 12 Year",
    type: "Irish",
    store: "Costco",
    purchase_price: 54.99,
    purchase_date: "2025-01-15",
    current_quantity_ml: 750,
    bottle_size_ml: 750,
    tasting_notes:
      "Pot still character with sherry notes. Creamy mouthfeel, toasted oak, dried fruits, and nutmeg.",
    rating: 4,
  },
  {
    name: "WhistlePig 10 Year",
    type: "Rye",
    store: "Total Wine",
    purchase_price: 79.99,
    purchase_date: "2024-10-08",
    current_quantity_ml: 300,
    bottle_size_ml: 750,
    tasting_notes:
      "Bold rye spice with butterscotch and caramel. Allspice, clove, and mint. Long warm finish.",
    rating: 4,
  },
  {
    name: "Macallan 18 Year Sherry Oak",
    type: "Single Malt",
    store: "Wine.com",
    purchase_price: 349.99,
    purchase_date: "2024-09-01",
    current_quantity_ml: 700,
    bottle_size_ml: 750,
    tasting_notes:
      "Rich dried fruits, ginger, and wood smoke. Complex sherry influence with chocolate and orange zest.",
    rating: 5,
  },
  {
    name: "Johnnie Walker Blue Label",
    type: "Blended",
    store: "Duty Free",
    purchase_price: 179.99,
    purchase_date: "2024-08-20",
    current_quantity_ml: 400,
    bottle_size_ml: 750,
    tasting_notes:
      "Incredibly smooth with layers of smoky malt, honey, and rose petal. Lingering finish of dark chocolate.",
    rating: 4,
  },
  {
    name: "Maker's Mark Cask Strength",
    type: "Bourbon",
    store: "Binny's",
    purchase_price: 39.99,
    purchase_date: "2025-02-01",
    current_quantity_ml: 750,
    bottle_size_ml: 750,
    tasting_notes:
      "Full-bodied caramel and vanilla with baking spices. Red winter wheat sweetness. Bold but not harsh.",
    rating: 4,
  },
];

export const sampleWishlist: {
  whiskey_name: string;
  type: WhiskeyType;
  priority: WishlistPriority;
  target_price: number;
  notes: string;
}[] = [
  {
    whiskey_name: "Pappy Van Winkle 15 Year",
    type: "Bourbon",
    priority: "High",
    target_price: 120.0,
    notes:
      "Legendary bourbon. Nearly impossible to find at retail. Check local stores regularly.",
  },
  {
    whiskey_name: "Yamazaki 18 Year",
    type: "Japanese",
    priority: "High",
    target_price: 350.0,
    notes: "Award-winning Japanese single malt. Worth the price for the experience.",
  },
  {
    whiskey_name: "Blanton's Single Barrel",
    type: "Bourbon",
    priority: "Medium",
    target_price: 65.0,
    notes: "Popular single barrel bourbon. Collectible horse-and-jockey stoppers.",
  },
  {
    whiskey_name: "Ardbeg Uigeadail",
    type: "Scotch",
    priority: "Medium",
    target_price: 80.0,
    notes: "Heavily peated Islay scotch with sherry influence. Great for smoky whisky fans.",
  },
  {
    whiskey_name: "Green Spot",
    type: "Irish",
    priority: "Low",
    target_price: 55.0,
    notes: "Classic Irish pot still whiskey. Great value for quality.",
  },
];
