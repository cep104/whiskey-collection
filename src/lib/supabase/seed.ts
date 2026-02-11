import type { WhiskeyType, WishlistPriority } from "@/lib/types";

export const sampleWhiskeys: {
  name: string;
  type: WhiskeyType;
  distillery: string;
  country: string;
  region: string;
  age_statement: number | null;
  abv: number | null;
  store: string;
  purchase_price: number;
  purchase_date: string;
  number_of_bottles: number;
  bottles_opened: number;
  current_bottle_fill_percentage: number;
  current_quantity_ml: number;
  bottle_size_ml: number;
  tasting_notes: string;
  rating: number;
}[] = [
  {
    name: "Buffalo Trace Kentucky Straight",
    type: "Bourbon",
    distillery: "Buffalo Trace Distillery",
    country: "USA",
    region: "Kentucky",
    age_statement: null,
    abv: 45,
    store: "Total Wine",
    purchase_price: 29.99,
    purchase_date: "2024-12-15",
    number_of_bottles: 2,
    bottles_opened: 1,
    current_bottle_fill_percentage: 80,
    current_quantity_ml: 600,
    bottle_size_ml: 750,
    tasting_notes:
      "Rich vanilla and caramel with hints of toffee and dark fruit. Smooth finish with a touch of spice.",
    rating: 4,

  },
  {
    name: "Lagavulin 16 Year",
    type: "Scotch",
    distillery: "Lagavulin Distillery",
    country: "Scotland",
    region: "Islay",
    age_statement: 16,
    abv: 43,
    store: "BevMo",
    purchase_price: 89.99,
    purchase_date: "2024-11-20",
    number_of_bottles: 1,
    bottles_opened: 1,
    current_bottle_fill_percentage: 67,
    current_quantity_ml: 500,
    bottle_size_ml: 750,
    tasting_notes:
      "Intensely smoky and peaty with iodine and seaweed. Rich dried fruit and sherry sweetness underneath.",
    rating: 5,

  },
  {
    name: "Hibiki Harmony",
    type: "Japanese",
    distillery: "Suntory",
    country: "Japan",
    region: "Osaka",
    age_statement: null,
    abv: 43,
    store: "K&L Wines",
    purchase_price: 69.99,
    purchase_date: "2025-01-05",
    number_of_bottles: 1,
    bottles_opened: 1,
    current_bottle_fill_percentage: 100,
    current_quantity_ml: 700,
    bottle_size_ml: 700,
    tasting_notes:
      "Delicate honey and candied orange peel. Rose, lychee, and subtle Mizunara oak spice. Silky texture.",
    rating: 5,

  },
  {
    name: "Redbreast 12 Year",
    type: "Irish",
    distillery: "Midleton Distillery",
    country: "Ireland",
    region: "County Cork",
    age_statement: 12,
    abv: 40,
    store: "Costco",
    purchase_price: 54.99,
    purchase_date: "2025-01-15",
    number_of_bottles: 1,
    bottles_opened: 0,
    current_bottle_fill_percentage: 100,
    current_quantity_ml: 750,
    bottle_size_ml: 750,
    tasting_notes:
      "Pot still character with sherry notes. Creamy mouthfeel, toasted oak, dried fruits, and nutmeg.",
    rating: 4,

  },
  {
    name: "WhistlePig 10 Year",
    type: "Rye",
    distillery: "WhistlePig Farm",
    country: "USA",
    region: "Vermont",
    age_statement: 10,
    abv: 50,
    store: "Total Wine",
    purchase_price: 79.99,
    purchase_date: "2024-10-08",
    number_of_bottles: 1,
    bottles_opened: 1,
    current_bottle_fill_percentage: 40,
    current_quantity_ml: 300,
    bottle_size_ml: 750,
    tasting_notes:
      "Bold rye spice with butterscotch and caramel. Allspice, clove, and mint. Long warm finish.",
    rating: 4,

  },
  {
    name: "Macallan 18 Year Sherry Oak",
    type: "Single Malt",
    distillery: "The Macallan Distillery",
    country: "Scotland",
    region: "Speyside",
    age_statement: 18,
    abv: 43,
    store: "Wine.com",
    purchase_price: 349.99,
    purchase_date: "2024-09-01",
    number_of_bottles: 1,
    bottles_opened: 1,
    current_bottle_fill_percentage: 93,
    current_quantity_ml: 700,
    bottle_size_ml: 750,
    tasting_notes:
      "Rich dried fruits, ginger, and wood smoke. Complex sherry influence with chocolate and orange zest.",
    rating: 5,

  },
  {
    name: "Johnnie Walker Blue Label",
    type: "Blended",
    distillery: "Diageo",
    country: "Scotland",
    region: "Lowlands",
    age_statement: null,
    abv: 40,
    store: "Duty Free",
    purchase_price: 179.99,
    purchase_date: "2024-08-20",
    number_of_bottles: 1,
    bottles_opened: 1,
    current_bottle_fill_percentage: 53,
    current_quantity_ml: 400,
    bottle_size_ml: 750,
    tasting_notes:
      "Incredibly smooth with layers of smoky malt, honey, and rose petal. Lingering finish of dark chocolate.",
    rating: 4,

  },
  {
    name: "Maker's Mark Cask Strength",
    type: "Bourbon",
    distillery: "Maker's Mark Distillery",
    country: "USA",
    region: "Kentucky",
    age_statement: null,
    abv: 55.75,
    store: "Binny's",
    purchase_price: 39.99,
    purchase_date: "2025-02-01",
    number_of_bottles: 1,
    bottles_opened: 0,
    current_bottle_fill_percentage: 100,
    current_quantity_ml: 750,
    bottle_size_ml: 750,
    tasting_notes:
      "Full-bodied caramel and vanilla with baking spices. Red winter wheat sweetness. Bold but not harsh.",
    rating: 4,

  },
  {
    name: "Eagle Rare 10 Year",
    type: "Bourbon",
    distillery: "Buffalo Trace Distillery",
    country: "USA",
    region: "Kentucky",
    age_statement: 10,
    abv: 45,
    store: "Total Wine",
    purchase_price: 34.99,
    purchase_date: "2024-11-01",
    number_of_bottles: 1,
    bottles_opened: 1,
    current_bottle_fill_percentage: 55,
    current_quantity_ml: 413,
    bottle_size_ml: 750,
    tasting_notes:
      "Bold, dry, and delicate with notes of toffee, hints of orange peel, and toasted oak. Long smooth finish.",
    rating: 4,

  },
  {
    name: "Blanton's Single Barrel",
    type: "Bourbon",
    distillery: "Buffalo Trace Distillery",
    country: "USA",
    region: "Kentucky",
    age_statement: null,
    abv: 46.5,
    store: "Local Liquor Store",
    purchase_price: 64.99,
    purchase_date: "2024-12-28",
    number_of_bottles: 1,
    bottles_opened: 0,
    current_bottle_fill_percentage: 100,
    current_quantity_ml: 750,
    bottle_size_ml: 750,
    tasting_notes:
      "Citrus, vanilla, and caramel with a smooth long finish. Collectible horse-and-jockey stopper.",
    rating: 5,

  },
  {
    name: "Lagavulin 8 Year",
    type: "Scotch",
    distillery: "Lagavulin Distillery",
    country: "Scotland",
    region: "Islay",
    age_statement: 8,
    abv: 48,
    store: "BevMo",
    purchase_price: 64.99,
    purchase_date: "2025-01-20",
    number_of_bottles: 1,
    bottles_opened: 1,
    current_bottle_fill_percentage: 85,
    current_quantity_ml: 638,
    bottle_size_ml: 750,
    tasting_notes:
      "Youthful peat intensity with maritime smoke, lemon, and sweet malt. Surprisingly approachable.",
    rating: 4,

  },
  {
    name: "Maker's Mark",
    type: "Bourbon",
    distillery: "Maker's Mark Distillery",
    country: "USA",
    region: "Kentucky",
    age_statement: null,
    abv: 45,
    store: "Costco",
    purchase_price: 24.99,
    purchase_date: "2024-07-15",
    number_of_bottles: 1,
    bottles_opened: 1,
    current_bottle_fill_percentage: 20,
    current_quantity_ml: 150,
    bottle_size_ml: 750,
    tasting_notes:
      "Soft wheat-forward bourbon with caramel, vanilla, and fruity notes. A reliable classic.",
    rating: 3,

  },
  {
    name: "Nikka From The Barrel",
    type: "Japanese",
    distillery: "Suntory",
    country: "Japan",
    region: "Osaka",
    age_statement: null,
    abv: 51.4,
    store: "K&L Wines",
    purchase_price: 59.99,
    purchase_date: "2024-10-25",
    number_of_bottles: 1,
    bottles_opened: 1,
    current_bottle_fill_percentage: 70,
    current_quantity_ml: 350,
    bottle_size_ml: 500,
    tasting_notes:
      "Rich and full-bodied with malty sweetness, dried fruit, and warming spice. Incredibly smooth for its proof.",
    rating: 5,

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
