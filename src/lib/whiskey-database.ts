import type { WhiskeyType } from "./types";

export interface WhiskeyEntry {
  name: string;
  distillery: string;
  type: WhiskeyType;
  country: string;
  region: string;
  age_statement: number | null;
  abv: number | null;
  bottle_size_ml: number;
  description: string;
}

/**
 * Local database of 60+ popular whiskeys for instant autocomplete.
 * Used as primary source; external APIs supplement if configured.
 */
export const WHISKEY_DATABASE: WhiskeyEntry[] = [
  // === BOURBON ===
  { name: "Buffalo Trace Kentucky Straight Bourbon", distillery: "Buffalo Trace Distillery", type: "Bourbon", country: "USA", region: "Kentucky", age_statement: null, abv: 45, bottle_size_ml: 750, description: "Rich vanilla and caramel with hints of toffee and dark fruit." },
  { name: "Maker's Mark", distillery: "Maker's Mark Distillery", type: "Bourbon", country: "USA", region: "Kentucky", age_statement: null, abv: 45, bottle_size_ml: 750, description: "Soft wheat-forward bourbon with caramel, vanilla, and fruity notes." },
  { name: "Maker's Mark Cask Strength", distillery: "Maker's Mark Distillery", type: "Bourbon", country: "USA", region: "Kentucky", age_statement: null, abv: 55.75, bottle_size_ml: 750, description: "Full-bodied with baking spices, red winter wheat sweetness." },
  { name: "Woodford Reserve", distillery: "Woodford Reserve Distillery", type: "Bourbon", country: "USA", region: "Kentucky", age_statement: null, abv: 45.2, bottle_size_ml: 750, description: "Rich, complex with dried fruit, vanilla, and toasted oak." },
  { name: "Wild Turkey 101", distillery: "Wild Turkey Distillery", type: "Bourbon", country: "USA", region: "Kentucky", age_statement: null, abv: 50.5, bottle_size_ml: 750, description: "Bold and spicy with notes of vanilla, caramel, and oak." },
  { name: "Elijah Craig Small Batch", distillery: "Heaven Hill Distillery", type: "Bourbon", country: "USA", region: "Kentucky", age_statement: null, abv: 47, bottle_size_ml: 750, description: "Warm vanilla, toasted oak, and caramel. Smooth finish." },
  { name: "Four Roses Single Barrel", distillery: "Four Roses Distillery", type: "Bourbon", country: "USA", region: "Kentucky", age_statement: null, abv: 50, bottle_size_ml: 750, description: "Ripe plum, cocoa, and maple syrup. Mellow and complex." },
  { name: "Knob Creek 9 Year", distillery: "Jim Beam Distillery", type: "Bourbon", country: "USA", region: "Kentucky", age_statement: 9, abv: 50, bottle_size_ml: 750, description: "Rich, full-bodied with sweet maple, toasted nut, and oak." },
  { name: "Eagle Rare 10 Year", distillery: "Buffalo Trace Distillery", type: "Bourbon", country: "USA", region: "Kentucky", age_statement: 10, abv: 45, bottle_size_ml: 750, description: "Bold, dry, and delicate with notes of toffee, hints of orange peel." },
  { name: "Blanton's Single Barrel", distillery: "Buffalo Trace Distillery", type: "Bourbon", country: "USA", region: "Kentucky", age_statement: null, abv: 46.5, bottle_size_ml: 750, description: "Citrus, vanilla, and caramel with a smooth, long finish." },
  { name: "Pappy Van Winkle 15 Year", distillery: "Buffalo Trace Distillery", type: "Bourbon", country: "USA", region: "Kentucky", age_statement: 15, abv: 53.5, bottle_size_ml: 750, description: "Rich caramel, toffee, dark fruit, and cherry. Legendary bourbon." },
  { name: "Booker's Bourbon", distillery: "Jim Beam Distillery", type: "Bourbon", country: "USA", region: "Kentucky", age_statement: null, abv: 62.95, bottle_size_ml: 750, description: "Uncut, unfiltered. Vanilla, toasted nuts, smoky char." },
  { name: "Bulleit Bourbon", distillery: "Bulleit Distilling Co.", type: "Bourbon", country: "USA", region: "Kentucky", age_statement: null, abv: 45, bottle_size_ml: 750, description: "Spicy rye character with maple, oak, and nutmeg." },
  { name: "Jim Beam Black Label", distillery: "Jim Beam Distillery", type: "Bourbon", country: "USA", region: "Kentucky", age_statement: null, abv: 43, bottle_size_ml: 750, description: "Smooth caramel and warm oak with a medium finish." },
  { name: "1792 Small Batch", distillery: "Barton 1792 Distillery", type: "Bourbon", country: "USA", region: "Kentucky", age_statement: null, abv: 46.85, bottle_size_ml: 750, description: "Spicy, with vanilla and caramel. Complex and well-balanced." },

  // === SCOTCH ===
  { name: "Lagavulin 16 Year", distillery: "Lagavulin Distillery", type: "Scotch", country: "Scotland", region: "Islay", age_statement: 16, abv: 43, bottle_size_ml: 750, description: "Intensely smoky and peaty with iodine, seaweed, and sherry sweetness." },
  { name: "Laphroaig 10 Year", distillery: "Laphroaig Distillery", type: "Scotch", country: "Scotland", region: "Islay", age_statement: 10, abv: 43, bottle_size_ml: 750, description: "Bold peat smoke, seaweed, and a surprising sweetness." },
  { name: "Ardbeg 10 Year", distillery: "Ardbeg Distillery", type: "Scotch", country: "Scotland", region: "Islay", age_statement: 10, abv: 46, bottle_size_ml: 750, description: "Smoky, citrus, and chocolate. Complex Islay single malt." },
  { name: "Ardbeg Uigeadail", distillery: "Ardbeg Distillery", type: "Scotch", country: "Scotland", region: "Islay", age_statement: null, abv: 54.2, bottle_size_ml: 750, description: "Deep, smoky richness with dark chocolate and espresso." },
  { name: "Talisker 10 Year", distillery: "Talisker Distillery", type: "Scotch", country: "Scotland", region: "Isle of Skye", age_statement: 10, abv: 45.8, bottle_size_ml: 750, description: "Peppery, smoky, with malt sweetness and sea salt." },
  { name: "Oban 14 Year", distillery: "Oban Distillery", type: "Scotch", country: "Scotland", region: "Highlands", age_statement: 14, abv: 43, bottle_size_ml: 750, description: "Rich, balanced. Orange peel, sea salt, and smoky honey." },
  { name: "Glenfiddich 12 Year", distillery: "Glenfiddich Distillery", type: "Scotch", country: "Scotland", region: "Speyside", age_statement: 12, abv: 40, bottle_size_ml: 750, description: "Fresh pear, subtle oak, and butterscotch. Light and approachable." },
  { name: "Glenlivet 12 Year", distillery: "The Glenlivet Distillery", type: "Scotch", country: "Scotland", region: "Speyside", age_statement: 12, abv: 40, bottle_size_ml: 750, description: "Tropical fruit, vanilla, and a touch of hazelnut." },
  { name: "Highland Park 12 Year", distillery: "Highland Park Distillery", type: "Scotch", country: "Scotland", region: "Islands", age_statement: 12, abv: 43, bottle_size_ml: 750, description: "Heather honey, gentle smoke, and sweet dried fruit." },
  { name: "Monkey Shoulder", distillery: "William Grant & Sons", type: "Scotch", country: "Scotland", region: "Speyside", age_statement: null, abv: 43, bottle_size_ml: 750, description: "Malty sweetness, berry fruitiness, and vanilla." },
  { name: "Balvenie 12 Year DoubleWood", distillery: "The Balvenie Distillery", type: "Scotch", country: "Scotland", region: "Speyside", age_statement: 12, abv: 43, bottle_size_ml: 750, description: "Honey, vanilla, sherry. Smooth and nutty." },

  // === SINGLE MALT ===
  { name: "Macallan 12 Year Sherry Oak", distillery: "The Macallan Distillery", type: "Single Malt", country: "Scotland", region: "Speyside", age_statement: 12, abv: 43, bottle_size_ml: 750, description: "Rich sherry influence, dried fruits, chocolate, and ginger." },
  { name: "Macallan 18 Year Sherry Oak", distillery: "The Macallan Distillery", type: "Single Malt", country: "Scotland", region: "Speyside", age_statement: 18, abv: 43, bottle_size_ml: 750, description: "Rich dried fruits, ginger, wood smoke, chocolate, and orange zest." },
  { name: "Dalmore 12 Year", distillery: "Dalmore Distillery", type: "Single Malt", country: "Scotland", region: "Highlands", age_statement: 12, abv: 40, bottle_size_ml: 750, description: "Orange marmalade, chocolate, and spice. Rich and luxurious." },
  { name: "Aberlour 12 Year", distillery: "Aberlour Distillery", type: "Single Malt", country: "Scotland", region: "Speyside", age_statement: 12, abv: 43, bottle_size_ml: 750, description: "Rich, rounded. Sherry, honey, ginger, and dark chocolate." },
  { name: "Glenmorangie Original 10 Year", distillery: "Glenmorangie Distillery", type: "Single Malt", country: "Scotland", region: "Highlands", age_statement: 10, abv: 40, bottle_size_ml: 750, description: "Citrus, vanilla, and peach. Delicate and elegant." },

  // === RYE ===
  { name: "WhistlePig 10 Year", distillery: "WhistlePig Farm", type: "Rye", country: "USA", region: "Vermont", age_statement: 10, abv: 50, bottle_size_ml: 750, description: "Bold rye spice with butterscotch, caramel, allspice, and mint." },
  { name: "Bulleit Rye", distillery: "Bulleit Distilling Co.", type: "Rye", country: "USA", region: "Kentucky", age_statement: null, abv: 45, bottle_size_ml: 750, description: "Spicy, with notes of vanilla and honey. Great for cocktails." },
  { name: "Rittenhouse Rye", distillery: "Heaven Hill Distillery", type: "Rye", country: "USA", region: "Kentucky", age_statement: null, abv: 50, bottle_size_ml: 750, description: "Spicy, with caramel and dark fruit. Bold and intense." },
  { name: "Sazerac Rye", distillery: "Buffalo Trace Distillery", type: "Rye", country: "USA", region: "Kentucky", age_statement: null, abv: 45, bottle_size_ml: 750, description: "Gentle spice with soft caramel and candy sweetness." },
  { name: "High West Double Rye", distillery: "High West Distillery", type: "Rye", country: "USA", region: "Utah", age_statement: null, abv: 46, bottle_size_ml: 750, description: "Mint, clove, cinnamon, with honey and vanilla." },
  { name: "Templeton Rye 4 Year", distillery: "Templeton Rye Distillery", type: "Rye", country: "USA", region: "Iowa", age_statement: 4, abv: 40, bottle_size_ml: 750, description: "Smooth with zesty spice, caramel, and toffee." },

  // === IRISH ===
  { name: "Redbreast 12 Year", distillery: "Midleton Distillery", type: "Irish", country: "Ireland", region: "County Cork", age_statement: 12, abv: 40, bottle_size_ml: 750, description: "Pot still character with sherry, toasted oak, and dried fruits." },
  { name: "Jameson Irish Whiskey", distillery: "Midleton Distillery", type: "Irish", country: "Ireland", region: "County Cork", age_statement: null, abv: 40, bottle_size_ml: 750, description: "Smooth, light, with notes of vanilla, toasted wood, and spice." },
  { name: "Tullamore D.E.W.", distillery: "Tullamore Distillery", type: "Irish", country: "Ireland", region: "County Offaly", age_statement: null, abv: 40, bottle_size_ml: 750, description: "Gentle grain, malt, and pot still blend. Smooth and approachable." },
  { name: "Green Spot", distillery: "Midleton Distillery", type: "Irish", country: "Ireland", region: "County Cork", age_statement: null, abv: 40, bottle_size_ml: 750, description: "Full spicy body with toasted barley, green apple, and cloves." },
  { name: "Powers Gold Label", distillery: "Midleton Distillery", type: "Irish", country: "Ireland", region: "County Cork", age_statement: null, abv: 43.2, bottle_size_ml: 750, description: "Honey and vanilla with a light touch of pot still spice." },
  { name: "Bushmills Original", distillery: "Old Bushmills Distillery", type: "Irish", country: "Ireland", region: "County Antrim", age_statement: null, abv: 40, bottle_size_ml: 750, description: "Light, smooth, and sweet with honey and vanilla." },
  { name: "Teeling Small Batch", distillery: "Teeling Whiskey Distillery", type: "Irish", country: "Ireland", region: "Dublin", age_statement: null, abv: 46, bottle_size_ml: 750, description: "Rum cask finish. Spicy, sweet vanilla, and tropical fruit." },

  // === JAPANESE ===
  { name: "Hibiki Harmony", distillery: "Suntory", type: "Japanese", country: "Japan", region: "Osaka", age_statement: null, abv: 43, bottle_size_ml: 700, description: "Delicate honey, candied orange peel, rose, and Mizunara oak spice." },
  { name: "Yamazaki 12 Year", distillery: "Suntory", type: "Japanese", country: "Japan", region: "Osaka", age_statement: 12, abv: 43, bottle_size_ml: 700, description: "Peach, pineapple, coconut, and Mizunara wood. Elegant and complex." },
  { name: "Yamazaki 18 Year", distillery: "Suntory", type: "Japanese", country: "Japan", region: "Osaka", age_statement: 18, abv: 43, bottle_size_ml: 700, description: "Sherry cask, dark chocolate, and blackberry. Deep and layered." },
  { name: "Hakushu 12 Year", distillery: "Suntory", type: "Japanese", country: "Japan", region: "Yamanashi", age_statement: 12, abv: 43, bottle_size_ml: 700, description: "Green, herbal, with pear, mint, and gentle smoke." },
  { name: "Nikka Coffey Grain", distillery: "Nikka Whisky", type: "Japanese", country: "Japan", region: "Miyagi", age_statement: null, abv: 45, bottle_size_ml: 700, description: "Sweet corn, vanilla, tropical fruit. Light and easy-drinking." },
  { name: "Nikka From The Barrel", distillery: "Nikka Whisky", type: "Japanese", country: "Japan", region: "Miyagi", age_statement: null, abv: 51.4, bottle_size_ml: 500, description: "Rich blend with vanilla, spice, citrus, and toffee. Punchy." },
  { name: "Suntory Toki", distillery: "Suntory", type: "Japanese", country: "Japan", region: "Osaka", age_statement: null, abv: 43, bottle_size_ml: 700, description: "Green apple, honey, grapefruit. Fresh and silky." },

  // === BLENDED ===
  { name: "Johnnie Walker Black Label", distillery: "Diageo", type: "Blended", country: "Scotland", region: "Lowlands", age_statement: 12, abv: 40, bottle_size_ml: 750, description: "Smoky, rich. Dried fruit, vanilla, and dark chocolate." },
  { name: "Johnnie Walker Blue Label", distillery: "Diageo", type: "Blended", country: "Scotland", region: "Lowlands", age_statement: null, abv: 40, bottle_size_ml: 750, description: "Incredibly smooth with smoky malt, honey, and rose petal." },
  { name: "Dewars 12 Year", distillery: "Dewar's", type: "Blended", country: "Scotland", region: "Highlands", age_statement: 12, abv: 40, bottle_size_ml: 750, description: "Honey, fruit, and floral. Smooth, balanced, and mellow." },
  { name: "Chivas Regal 12 Year", distillery: "Chivas Brothers", type: "Blended", country: "Scotland", region: "Speyside", age_statement: 12, abv: 40, bottle_size_ml: 750, description: "Honey, vanilla, and ripe apple. Smooth and generous." },
  { name: "Famous Grouse", distillery: "The Edrington Group", type: "Blended", country: "Scotland", region: "Highlands", age_statement: null, abv: 40, bottle_size_ml: 750, description: "Sherry sweetness with citrus and oak. Scotland's favorite blend." },

  // === CANADIAN / OTHER ===
  { name: "Crown Royal", distillery: "Crown Royal Distillery", type: "Blended", country: "Canada", region: "Manitoba", age_statement: null, abv: 40, bottle_size_ml: 750, description: "Smooth with vanilla, fruit, and light oak. Classic Canadian." },
  { name: "Lot No. 40 Canadian Rye", distillery: "Hiram Walker & Sons", type: "Rye", country: "Canada", region: "Ontario", age_statement: null, abv: 43, bottle_size_ml: 750, description: "Bold rye spice, toffee, and vanilla. Rich pot-still character." },
  { name: "Kavalan Classic Single Malt", distillery: "Kavalan Distillery", type: "Single Malt", country: "Taiwan", region: "Yilan", age_statement: null, abv: 40, bottle_size_ml: 700, description: "Mango, vanilla, coconut, and floral. Award-winning Taiwanese." },
  { name: "Amrut Fusion", distillery: "Amrut Distilleries", type: "Single Malt", country: "India", region: "Bangalore", age_statement: null, abv: 50, bottle_size_ml: 700, description: "Barley, chocolate, cinnamon, and smoke. Bold Indian single malt." },
];

/** Fuzzy search: match query against name, distillery, type */
export function searchWhiskeyDatabase(query: string): WhiskeyEntry[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  const terms = q.split(/\s+/);

  // Score each entry
  const scored = WHISKEY_DATABASE.map((entry) => {
    const nameL = entry.name.toLowerCase();
    const distilleryL = entry.distillery.toLowerCase();
    const typeL = entry.type.toLowerCase();
    let score = 0;

    // Exact name start
    if (nameL.startsWith(q)) score += 100;
    // Name contains full query
    else if (nameL.includes(q)) score += 60;

    // Each term matches
    for (const term of terms) {
      if (nameL.includes(term)) score += 20;
      if (distilleryL.includes(term)) score += 10;
      if (typeL.includes(term)) score += 5;
    }

    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((s) => s.entry);
}
