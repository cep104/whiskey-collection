import type { Whiskey } from "./types";

export interface AnimeRecommendation {
  title: string;
  genre: string[];
  reasoning: string;
  matchScore: number;
  streaming: string[];
  malScore: number;
}

interface AnimeEntry {
  title: string;
  genre: string[];
  reasoning: string;
  streaming: string[];
  malScore: number;
}

interface CategoryDef {
  label: string;
  matchFn: (w: Whiskey) => number;
  animes: AnimeEntry[];
}

// ── Category definitions with expanded anime lists ─────────────────

const CATEGORIES: CategoryDef[] = [
  // ─── Smooth & Approachable ───────────────────────────────────────
  {
    label: "smooth_approachable",
    matchFn: (w) => {
      let s = 0;
      const abv = w.abv ?? 40;
      const price = w.purchase_price ?? 30;
      if (abv <= 46) s += 30;
      if (price <= 50) s += 20;
      if (w.type === "Bourbon" || w.type === "Blended") s += 15;
      if ((w.rating ?? 0) >= 4) s += 10;
      if (!w.age_statement || w.age_statement <= 8) s += 10;
      return s;
    },
    animes: [
      {
        title: "One Piece",
        genre: ["Adventure", "Shounen"],
        reasoning:
          "Like a crowd-pleasing bourbon, this epic adventure is accessible, fun, and beloved worldwide. Starts smooth and builds in complexity over time.",
        streaming: ["Crunchyroll", "Netflix"],
        malScore: 8.7,
      },
      {
        title: "Spy x Family",
        genre: ["Comedy", "Action"],
        reasoning:
          "Smooth, charming, and universally enjoyable — like a well-made wheated bourbon. Easy to get into with surprising depth.",
        streaming: ["Crunchyroll", "Hulu"],
        malScore: 8.6,
      },
      {
        title: "My Hero Academia",
        genre: ["Action", "Shounen"],
        reasoning:
          "Approachable and crowd-pleasing with smooth character development. Great for both beginners and enthusiasts alike.",
        streaming: ["Crunchyroll", "Hulu"],
        malScore: 8.0,
      },
      {
        title: "Naruto",
        genre: ["Action", "Shounen"],
        reasoning:
          "Classic gateway anime like Buffalo Trace is a gateway bourbon — approachable, well-crafted, and universally enjoyed.",
        streaming: ["Crunchyroll", "Netflix"],
        malScore: 8.3,
      },
      {
        title: "Kaguya-sama: Love is War",
        genre: ["Comedy", "Romance"],
        reasoning:
          "Sharp wit with sweet moments — like a balanced bourbon with both spice and caramel notes.",
        streaming: ["Crunchyroll"],
        malScore: 8.7,
      },
    ],
  },

  // ─── Complex & Intense ───────────────────────────────────────────
  {
    label: "complex_intense",
    matchFn: (w) => {
      let s = 0;
      const abv = w.abv ?? 40;
      const price = w.purchase_price ?? 30;
      if (abv >= 50) s += 35;
      else if (abv >= 46) s += 20;
      if (price >= 80) s += 15;
      if (w.age_statement && w.age_statement >= 10) s += 15;
      if (w.type === "Scotch" || w.type === "Single Malt") s += 10;
      return s;
    },
    animes: [
      {
        title: "Steins;Gate",
        genre: ["Sci-Fi", "Thriller"],
        reasoning:
          "Like a barrel-proof single barrel, this demands your full attention. Complex, layered, and intensely rewarding.",
        streaming: ["Crunchyroll", "Hulu"],
        malScore: 9.1,
      },
      {
        title: "Death Note",
        genre: ["Psychological", "Thriller"],
        reasoning:
          "High-proof intensity that demands your attention. Every episode hits hard with complex mind games.",
        streaming: ["Netflix", "Crunchyroll"],
        malScore: 8.6,
      },
      {
        title: "Code Geass",
        genre: ["Mecha", "Drama"],
        reasoning:
          "Barrel-proof complexity with layers of political intrigue. Not for casual watching — rewards commitment.",
        streaming: ["Crunchyroll", "Netflix"],
        malScore: 8.7,
      },
      {
        title: "Monster",
        genre: ["Psychological", "Thriller"],
        reasoning:
          "Deep, dark, and complex — like a cask-strength pour. Not for casual sipping, but unforgettable for those who commit.",
        streaming: ["Netflix"],
        malScore: 8.7,
      },
      {
        title: "Fate/Zero",
        genre: ["Action", "Fantasy"],
        reasoning:
          "Dense, complex narrative that rewards careful attention — like sipping a high-proof bourbon slowly and savoring every note.",
        streaming: ["Crunchyroll", "Netflix"],
        malScore: 8.3,
      },
    ],
  },

  // ─── Classic & Traditional ───────────────────────────────────────
  {
    label: "classic_traditional",
    matchFn: (w) => {
      let s = 0;
      const price = w.purchase_price ?? 30;
      if (w.age_statement && w.age_statement >= 10) s += 25;
      if (price >= 50 && price <= 150) s += 20;
      if (w.type === "Bourbon" || w.type === "Scotch") s += 15;
      if ((w.rating ?? 0) >= 4) s += 15;
      return s;
    },
    animes: [
      {
        title: "Cowboy Bebop",
        genre: ["Action", "Sci-Fi"],
        reasoning:
          "A timeless classic. Sophisticated, well-crafted, and gets better every time you revisit it. The bourbon of anime.",
        streaming: ["Crunchyroll", "Netflix"],
        malScore: 8.8,
      },
      {
        title: "Samurai Champloo",
        genre: ["Action", "Historical"],
        reasoning:
          "Traditional craftsmanship with a modern twist — like an aged bourbon with a unique finish. Smooth but substantial.",
        streaming: ["Crunchyroll"],
        malScore: 8.5,
      },
      {
        title: "Trigun",
        genre: ["Action", "Sci-Fi"],
        reasoning:
          "Classic craftsmanship with depth — like a well-aged bourbon that reveals more with each sip.",
        streaming: ["Crunchyroll"],
        malScore: 8.2,
      },
      {
        title: "Ghost in the Shell: SAC",
        genre: ["Sci-Fi", "Cyberpunk"],
        reasoning:
          "Sophisticated, thought-provoking, and enduring — a true classic that stands the test of time.",
        streaming: ["Crunchyroll"],
        malScore: 8.4,
      },
      {
        title: "Rurouni Kenshin",
        genre: ["Action", "Historical"],
        reasoning:
          "Traditional excellence with modern appeal, aged to perfection. A classic blend of action and heart.",
        streaming: ["Crunchyroll"],
        malScore: 8.3,
      },
    ],
  },

  // ─── Budget / Value ──────────────────────────────────────────────
  {
    label: "budget_value",
    matchFn: (w) => {
      let s = 0;
      const price = w.purchase_price ?? 30;
      if (price > 0 && price <= 35) s += 35;
      else if (price <= 50) s += 15;
      if ((w.rating ?? 0) >= 4) s += 25;
      if (w.type === "Bourbon" || w.type === "Rye") s += 10;
      return s;
    },
    animes: [
      {
        title: "Hunter x Hunter",
        genre: ["Adventure", "Shounen"],
        reasoning:
          "Incredible quality that exceeds expectations. Better value than bottles twice the price — a hidden gem for those in the know.",
        streaming: ["Crunchyroll", "Netflix"],
        malScore: 9.1,
      },
      {
        title: "Demon Slayer",
        genre: ["Action", "Shounen"],
        reasoning:
          "Incredible quality for the price. Accessible, beautiful, and packs a punch without breaking the bank.",
        streaming: ["Crunchyroll", "Netflix"],
        malScore: 8.5,
      },
      {
        title: "Jujutsu Kaisen",
        genre: ["Action", "Shounen"],
        reasoning:
          "Modern excellence at an accessible price point. Quality per dollar is unmatched — punches way above its weight.",
        streaming: ["Crunchyroll"],
        malScore: 8.7,
      },
      {
        title: "Mob Psycho 100",
        genre: ["Action", "Comedy"],
        reasoning:
          "Phenomenal quality without the premium price tag. Punches above its weight class with style and substance.",
        streaming: ["Crunchyroll"],
        malScore: 8.6,
      },
      {
        title: "Haikyuu!!",
        genre: ["Sports", "Shounen"],
        reasoning:
          "Pure enjoyment without pretension. Like a solid daily sipper — consistently satisfying and never disappoints.",
        streaming: ["Crunchyroll", "Netflix"],
        malScore: 8.5,
      },
    ],
  },

  // ─── Wheated & Sweet ─────────────────────────────────────────────
  {
    label: "wheated_sweet",
    matchFn: (w) => {
      let s = 0;
      const abv = w.abv ?? 40;
      const name = (w.name + " " + (w.distillery ?? "")).toLowerCase();
      if (
        name.includes("maker") ||
        name.includes("weller") ||
        name.includes("pappy") ||
        name.includes("wheated")
      )
        s += 35;
      if (abv <= 46) s += 15;
      if (w.type === "Bourbon") s += 10;
      if (
        w.tasting_notes
          ?.toLowerCase()
          .match(/sweet|caramel|vanilla|honey|butterscotch/)
      )
        s += 20;
      return s;
    },
    animes: [
      {
        title: "Violet Evergarden",
        genre: ["Drama", "Slice of Life"],
        reasoning:
          "Wheated bourbons are sweet and smooth — just like this beautifully crafted, emotionally rich story.",
        streaming: ["Netflix"],
        malScore: 8.6,
      },
      {
        title: "Your Name",
        genre: ["Romance", "Fantasy"],
        reasoning:
          "Sweet, smooth, and emotionally impactful. Like a perfectly balanced wheated bourbon — accessible but deeply moving.",
        streaming: ["Crunchyroll"],
        malScore: 8.9,
      },
      {
        title: "Fruits Basket",
        genre: ["Romance", "Drama"],
        reasoning:
          "Sweet and heartwarming like a wheated bourbon. Emotional depth with smooth, accessible storytelling.",
        streaming: ["Crunchyroll"],
        malScore: 8.6,
      },
      {
        title: "Your Lie in April",
        genre: ["Music", "Romance"],
        reasoning:
          "Sweet with emotional depth. Smooth storytelling that moves the heart — like the best wheated pours.",
        streaming: ["Crunchyroll", "Netflix"],
        malScore: 8.7,
      },
      {
        title: "A Place Further Than the Universe",
        genre: ["Adventure", "Slice of Life"],
        reasoning:
          "Heartwarming journey with sweet character moments and smooth pacing. Pure warmth in every episode.",
        streaming: ["Crunchyroll"],
        malScore: 8.6,
      },
    ],
  },

  // ─── High-Rye & Spicy ───────────────────────────────────────────
  {
    label: "high_rye_spicy",
    matchFn: (w) => {
      let s = 0;
      const name = (w.name + " " + (w.distillery ?? "")).toLowerCase();
      if (w.type === "Rye") s += 40;
      if (
        name.includes("four roses") ||
        name.includes("bulleit") ||
        name.includes("wild turkey") ||
        name.includes("rittenhouse")
      )
        s += 25;
      if (w.abv && w.abv >= 45) s += 10;
      if (
        w.tasting_notes?.toLowerCase().match(/spic|pepper|cinnamon|rye|bold/)
      )
        s += 20;
      return s;
    },
    animes: [
      {
        title: "Attack on Titan",
        genre: ["Action", "Dark Fantasy"],
        reasoning:
          "High-rye bourbons have a spicy kick — just like this intense, aggressive, and uncompromising series.",
        streaming: ["Crunchyroll", "Hulu"],
        malScore: 9.0,
      },
      {
        title: "Vinland Saga",
        genre: ["Action", "Historical"],
        reasoning:
          "Spicy, intense, and complex. Like a high-rye mash bill — bold flavors that evolve dramatically.",
        streaming: ["Netflix", "Crunchyroll"],
        malScore: 8.7,
      },
      {
        title: "Dororo",
        genre: ["Action", "Historical"],
        reasoning:
          "Sharp, intense, and gripping — like the rye spice that cuts through and demands attention.",
        streaming: ["Amazon", "Crunchyroll"],
        malScore: 8.2,
      },
      {
        title: "Black Lagoon",
        genre: ["Action", "Crime"],
        reasoning:
          "Unapologetically intense and spicy throughout. No smoothing agents here — just pure, bold action.",
        streaming: ["Crunchyroll", "Hulu"],
        malScore: 8.1,
      },
    ],
  },

  // ─── Premium & Allocated ─────────────────────────────────────────
  {
    label: "premium_allocated",
    matchFn: (w) => {
      let s = 0;
      const price = w.purchase_price ?? 0;
      if (price >= 200) s += 35;
      else if (price >= 100) s += 15;
      if (w.age_statement && w.age_statement >= 15) s += 20;
      if ((w.rating ?? 0) >= 5) s += 15;
      const name = (w.name + " " + (w.distillery ?? "")).toLowerCase();
      if (
        name.includes("pappy") ||
        name.includes("george t. stagg") ||
        name.includes("william larue") ||
        name.includes("btac")
      )
        s += 30;
      return s;
    },
    animes: [
      {
        title: "Fullmetal Alchemist: Brotherhood",
        genre: ["Action", "Fantasy"],
        reasoning:
          "The Pappy Van Winkle of anime — universally acclaimed, hard to find time to rewatch, and worth every bit of the hype.",
        streaming: ["Crunchyroll", "Netflix"],
        malScore: 9.2,
      },
      {
        title: "Legend of the Galactic Heroes",
        genre: ["Sci-Fi", "Drama"],
        reasoning:
          "Epic, sophisticated, and for true connoisseurs. Like a rare allocated pour — demands patience and rewards dedication.",
        streaming: ["Crunchyroll"],
        malScore: 9.0,
      },
      {
        title: "Ping Pong the Animation",
        genre: ["Sports", "Drama"],
        reasoning:
          "Understated excellence that\u2019s hard to find but absolutely worth it. A connoisseur\u2019s pick.",
        streaming: ["Crunchyroll"],
        malScore: 8.6,
      },
    ],
  },

  // ─── Single Barrel & Unique ──────────────────────────────────────
  {
    label: "single_barrel_unique",
    matchFn: (w) => {
      let s = 0;
      const name = (w.name + " " + (w.distillery ?? "")).toLowerCase();
      if (
        name.includes("single barrel") ||
        name.includes("barrel select") ||
        name.includes("barrel pick") ||
        name.includes("store pick")
      )
        s += 35;
      if (w.purchase_price && w.purchase_price >= 60) s += 10;
      if (w.abv && w.abv >= 50) s += 15;
      if (w.type === "Bourbon" || w.type === "Rye") s += 10;
      return s;
    },
    animes: [
      {
        title: "Odd Taxi",
        genre: ["Mystery", "Thriller"],
        reasoning:
          "Like a single barrel pick — unique, unexpected, and shows what happens when you take creative risks.",
        streaming: ["Crunchyroll"],
        malScore: 8.8,
      },
      {
        title: "Tatami Galaxy",
        genre: ["Comedy", "Psychological"],
        reasoning:
          "Experimental storytelling that rewards the adventurous — like a funky barrel pick that\u2019s unlike anything else.",
        streaming: ["Crunchyroll"],
        malScore: 8.6,
      },
      {
        title: "FLCL",
        genre: ["Sci-Fi", "Comedy"],
        reasoning:
          "Wild, unique, and completely different from anything else. A single barrel that defies all conventions.",
        streaming: ["Crunchyroll", "Hulu"],
        malScore: 8.0,
      },
      {
        title: "Sonny Boy",
        genre: ["Mystery", "Supernatural"],
        reasoning:
          "Polarizing and artistic. Like a barrel-proof single barrel — some find it brilliant, others don\u2019t get it.",
        streaming: ["Crunchyroll"],
        malScore: 7.5,
      },
    ],
  },

  // ─── Japanese & Refined ──────────────────────────────────────────
  {
    label: "japanese_refined",
    matchFn: (w) => {
      let s = 0;
      if (w.type === "Japanese") s += 45;
      if (w.country === "Japan") s += 40;
      const name = (w.name + " " + (w.distillery ?? "")).toLowerCase();
      if (
        name.includes("yamazaki") ||
        name.includes("hibiki") ||
        name.includes("nikka") ||
        name.includes("hakushu") ||
        name.includes("suntory")
      )
        s += 25;
      return s;
    },
    animes: [
      {
        title: "Mushishi",
        genre: ["Fantasy", "Slice of Life"],
        reasoning:
          "Japanese whisky is all about balance and subtlety — just like this meditative, beautifully atmospheric series.",
        streaming: ["Crunchyroll"],
        malScore: 8.7,
      },
      {
        title: "March Comes in Like a Lion",
        genre: ["Drama", "Slice of Life"],
        reasoning:
          "Refined, introspective, and deeply Japanese in sensibility. Like Yamazaki — every element is deliberate.",
        streaming: ["Crunchyroll", "Netflix"],
        malScore: 8.8,
      },
      {
        title: "Samurai Champloo",
        genre: ["Action", "Historical"],
        reasoning:
          "East meets West perfectly, like bourbon appreciation in Japan. Hip-hop beats with samurai soul.",
        streaming: ["Crunchyroll"],
        malScore: 8.5,
      },
      {
        title: "Barakamon",
        genre: ["Slice of Life", "Comedy"],
        reasoning:
          "Quiet excellence with subtle depth. Like a fine Japanese whisky — unassuming, warm, and deeply satisfying.",
        streaming: ["Crunchyroll"],
        malScore: 8.3,
      },
    ],
  },

  // ─── Peated & Smoky ──────────────────────────────────────────────
  {
    label: "peated_smoky",
    matchFn: (w) => {
      let s = 0;
      if (w.type === "Scotch" || w.type === "Single Malt") s += 15;
      const name = (w.name + " " + (w.distillery ?? "")).toLowerCase();
      if (
        name.includes("islay") ||
        name.includes("laphroaig") ||
        name.includes("ardbeg") ||
        name.includes("lagavulin") ||
        name.includes("caol ila") ||
        name.includes("peat")
      )
        s += 40;
      if (
        w.tasting_notes?.toLowerCase().match(/peat|smoke|campfire|iodine|ash/)
      )
        s += 25;
      if (w.region?.toLowerCase() === "islay") s += 30;
      return s;
    },
    animes: [
      {
        title: "Berserk (1997)",
        genre: ["Action", "Dark Fantasy"],
        reasoning:
          "Dark, intense, and not for the faint of heart — just like an Islay scotch. The smoke and struggle leave a lasting impression.",
        streaming: ["Crunchyroll"],
        malScore: 8.7,
      },
      {
        title: "Made in Abyss",
        genre: ["Adventure", "Fantasy"],
        reasoning:
          "Beautiful on the surface with dark, smoky depths beneath. Like peated scotch — the deeper you go, the more intense it gets.",
        streaming: ["Amazon", "Netflix"],
        malScore: 8.7,
      },
      {
        title: "Psycho-Pass",
        genre: ["Sci-Fi", "Thriller"],
        reasoning:
          "Dark, complex, and thought-provoking. The noir atmosphere mirrors the smoky depths of a good peat bomb.",
        streaming: ["Crunchyroll", "Hulu"],
        malScore: 8.4,
      },
      {
        title: "Paranoia Agent",
        genre: ["Psychological", "Mystery"],
        reasoning:
          "Unsettling and complex like a challenging Islay dram. Not for everyone, but those who get it really get it.",
        streaming: ["Crunchyroll"],
        malScore: 7.7,
      },
    ],
  },

  // ─── Irish & Easy ────────────────────────────────────────────────
  {
    label: "irish_easy",
    matchFn: (w) => {
      let s = 0;
      if (w.type === "Irish") s += 45;
      if (w.country === "Ireland") s += 40;
      const name = (w.name + " " + (w.distillery ?? "")).toLowerCase();
      if (
        name.includes("jameson") ||
        name.includes("redbreast") ||
        name.includes("green spot") ||
        name.includes("powers") ||
        name.includes("bushmills")
      )
        s += 25;
      return s;
    },
    animes: [
      {
        title: "Frieren: Beyond Journey's End",
        genre: ["Fantasy", "Adventure"],
        reasoning:
          "Irish whiskey is warm, inviting, and deceptively deep — just like this show that wraps profound themes in gentle storytelling.",
        streaming: ["Crunchyroll"],
        malScore: 9.1,
      },
      {
        title: "Ranking of Kings",
        genre: ["Fantasy", "Adventure"],
        reasoning:
          "Charming and easy to love with a warm heart. Like a triple-distilled Irish pour — smooth entry, surprising complexity.",
        streaming: ["Crunchyroll"],
        malScore: 8.6,
      },
      {
        title: "Horimiya",
        genre: ["Romance", "Slice of Life"],
        reasoning:
          "Smooth, sweet, and satisfying. Like a good Irish whiskey — no pretension, just genuine warmth and charm.",
        streaming: ["Crunchyroll"],
        malScore: 8.2,
      },
    ],
  },

  // ─── Cozy & Dessert (Cream / Liqueurs) ───────────────────────────
  {
    label: "cozy_dessert",
    matchFn: (w) => {
      let s = 0;
      const name = (w.name + " " + (w.distillery ?? "")).toLowerCase();
      if (
        name.includes("cream") ||
        name.includes("honey") ||
        name.includes("liqueur") ||
        name.includes("egg nog") ||
        name.includes("fireball") ||
        name.includes("skrewball")
      )
        s += 45;
      if (w.type === "Blended") s += 10;
      if (w.abv && w.abv <= 35) s += 20;
      if (
        w.tasting_notes
          ?.toLowerCase()
          .match(/cream|chocolate|coffee|dessert|sweet/)
      )
        s += 15;
      return s;
    },
    animes: [
      {
        title: "Laid-Back Camp",
        genre: ["Slice of Life", "Comedy"],
        reasoning:
          "Cozy, smooth, and sweet. Perfect for relaxed evenings — like a bourbon cream on the rocks.",
        streaming: ["Crunchyroll"],
        malScore: 8.3,
      },
      {
        title: "Nichijou",
        genre: ["Comedy", "Slice of Life"],
        reasoning:
          "Sweet, silly, and endlessly entertaining. Pure comfort viewing that goes down easy.",
        streaming: ["Crunchyroll"],
        malScore: 8.5,
      },
      {
        title: "K-On!",
        genre: ["Music", "Slice of Life"],
        reasoning:
          "Smooth, sweet, and feel-good from start to finish. The anime equivalent of a cozy nightcap.",
        streaming: ["Crunchyroll"],
        malScore: 7.9,
      },
    ],
  },

  // ─── Adventure Seekers (High-proof exploration) ──────────────────
  {
    label: "adventure_seeker",
    matchFn: (w) => {
      let s = 0;
      const price = w.purchase_price ?? 0;
      if (w.abv && w.abv >= 50) s += 15;
      if (price >= 60) s += 10;
      // Diverse collection indicator: unusual type combos
      if (w.type === "Japanese" || w.type === "Irish") s += 10;
      if (w.country && !["USA", "Scotland"].includes(w.country)) s += 15;
      if (w.age_statement && w.age_statement >= 12) s += 10;
      // Diverse tasting notes
      if (
        w.tasting_notes
          ?.toLowerCase()
          .match(
            /tropical|exotic|unique|unusual|experimental|finish|cask|barrel/
          )
      )
        s += 20;
      return s;
    },
    animes: [
      {
        title: "One Piece",
        genre: ["Adventure", "Shounen"],
        reasoning:
          "Epic journey that never ends, like collecting allocated bourbons — always something new to discover on the horizon.",
        streaming: ["Crunchyroll", "Netflix"],
        malScore: 8.7,
      },
      {
        title: "Made in Abyss",
        genre: ["Adventure", "Fantasy"],
        reasoning:
          "Deceptively sweet start with intense depth. Not what you expect — like an adventurous barrel finish.",
        streaming: ["Amazon", "Netflix"],
        malScore: 8.7,
      },
      {
        title: "The Promised Neverland",
        genre: ["Mystery", "Thriller"],
        reasoning:
          "Twists and turns that keep you on edge. Every sip reveals something new — like an adventurous single barrel.",
        streaming: ["Crunchyroll", "Netflix"],
        malScore: 8.6,
      },
    ],
  },

  // ─── Comedy / Social Drinkers ────────────────────────────────────
  {
    label: "comedy_social",
    matchFn: (w) => {
      let s = 0;
      const price = w.purchase_price ?? 30;
      if (price <= 40) s += 15;
      if (w.type === "Bourbon" || w.type === "Blended") s += 10;
      if (w.number_of_bottles >= 2) s += 15;
      if (w.abv && w.abv <= 45) s += 15;
      if (
        w.tasting_notes?.toLowerCase().match(/smooth|easy|light|friendly|fun/)
      )
        s += 15;
      // Social drinker pattern: multiple bottles, not too expensive
      if (w.number_of_bottles >= 3) s += 10;
      return s;
    },
    animes: [
      {
        title: "Konosuba",
        genre: ["Comedy", "Fantasy"],
        reasoning:
          "Fun, unpretentious, and hilarious — like drinking bourbon with friends on a Friday night. No snobbery, just good times.",
        streaming: ["Crunchyroll"],
        malScore: 8.1,
      },
      {
        title: "Grand Blue",
        genre: ["Comedy", "Slice of Life"],
        reasoning:
          "Literally about drinking (and diving). The perfect match for bourbon enthusiasts who love a good time.",
        streaming: ["Amazon", "Crunchyroll"],
        malScore: 8.4,
      },
      {
        title: "Gintama",
        genre: ["Comedy", "Action"],
        reasoning:
          "Long-running fun that never takes itself too seriously. Like that go-to bourbon you always keep on the shelf.",
        streaming: ["Crunchyroll"],
        malScore: 8.9,
      },
    ],
  },

  // ─── Dark & Noir ─────────────────────────────────────────────────
  {
    label: "dark_noir",
    matchFn: (w) => {
      let s = 0;
      if (w.type === "Scotch" || w.type === "Single Malt") s += 15;
      if (w.abv && w.abv >= 46) s += 10;
      if (w.age_statement && w.age_statement >= 12) s += 10;
      if (
        w.tasting_notes
          ?.toLowerCase()
          .match(
            /dark|oak|leather|tobacco|smoke|char|espresso|bitter|tannic|dry/
          )
      )
        s += 30;
      const name = (w.name + " " + (w.distillery ?? "")).toLowerCase();
      if (
        name.includes("black") ||
        name.includes("dark") ||
        name.includes("night") ||
        name.includes("shadow")
      )
        s += 15;
      return s;
    },
    animes: [
      {
        title: "Psycho-Pass",
        genre: ["Sci-Fi", "Thriller"],
        reasoning:
          "Dark, complex, and thought-provoking — like a deep, oaky dram that lingers on the palate.",
        streaming: ["Crunchyroll", "Hulu"],
        malScore: 8.4,
      },
      {
        title: "Erased",
        genre: ["Mystery", "Thriller"],
        reasoning:
          "Gripping mystery with emotional depth. Dark notes with a surprisingly warm finish.",
        streaming: ["Crunchyroll", "Netflix"],
        malScore: 8.3,
      },
      {
        title: "Terror in Resonance",
        genre: ["Thriller", "Drama"],
        reasoning:
          "Atmospheric and brooding. Like a late-night pour of something dark and contemplative.",
        streaming: ["Crunchyroll"],
        malScore: 7.9,
      },
    ],
  },

  // ─── Romance & Refined Palates ───────────────────────────────────
  {
    label: "romance_refined",
    matchFn: (w) => {
      let s = 0;
      if (w.type === "Bourbon" || w.type === "Irish") s += 10;
      if (w.abv && w.abv <= 46) s += 10;
      if (
        w.tasting_notes
          ?.toLowerCase()
          .match(
            /floral|fruit|berry|cherry|apple|rose|elegant|delicate|soft|gentle/
          )
      )
        s += 30;
      if (w.purchase_price && w.purchase_price >= 50) s += 10;
      if ((w.rating ?? 0) >= 4) s += 10;
      return s;
    },
    animes: [
      {
        title: "Toradora!",
        genre: ["Romance", "Comedy"],
        reasoning:
          "Sweet with surprising depth and complexity. Like a well-balanced pour with floral notes.",
        streaming: ["Crunchyroll"],
        malScore: 8.2,
      },
      {
        title: "Horimiya",
        genre: ["Romance", "Slice of Life"],
        reasoning:
          "Smooth, sweet, and satisfying romance. No pretension — just genuine warmth and charm.",
        streaming: ["Crunchyroll"],
        malScore: 8.2,
      },
      {
        title: "Your Name",
        genre: ["Romance", "Fantasy"],
        reasoning:
          "Beautiful, emotional, and universally appealing — like a perfectly poured glass of something special.",
        streaming: ["Crunchyroll"],
        malScore: 8.9,
      },
    ],
  },

  // ─── Sports & Competition ────────────────────────────────────────
  {
    label: "sports_competition",
    matchFn: (w) => {
      let s = 0;
      // Competitive/collector signals: high rating, multiple bottles, seeks the best
      if ((w.rating ?? 0) >= 4) s += 15;
      if (w.number_of_bottles >= 2) s += 10;
      if (w.type === "Bourbon" || w.type === "Rye") s += 10;
      // Straightforward no-nonsense bottles
      if (w.purchase_price && w.purchase_price <= 60) s += 10;
      if (w.abv && w.abv >= 43 && w.abv <= 50) s += 10;
      return s;
    },
    animes: [
      {
        title: "Haikyuu!!",
        genre: ["Sports", "Shounen"],
        reasoning:
          "Pure excellence in execution. No pretense, just quality — like a straightforward, well-crafted bourbon.",
        streaming: ["Crunchyroll", "Netflix"],
        malScore: 8.5,
      },
      {
        title: "Hajime no Ippo",
        genre: ["Sports", "Action"],
        reasoning:
          "Underdog story with heart and determination. Like discovering an underrated bottle that punches above its weight.",
        streaming: ["Crunchyroll"],
        malScore: 8.7,
      },
      {
        title: "Ping Pong the Animation",
        genre: ["Sports", "Drama"],
        reasoning:
          "Artistic excellence in an unexpected package. Like finding a gem in the bottom shelf — pure craftsmanship.",
        streaming: ["Crunchyroll"],
        malScore: 8.6,
      },
    ],
  },
];

// ── Popular pairings for the landing page ──────────────────────────

export const POPULAR_PAIRINGS = [
  {
    bourbon: "Buffalo Trace",
    anime: "One Piece",
    reasoning:
      "Both are approachable classics that get better the more you explore",
  },
  {
    bourbon: "Maker's Mark",
    anime: "Spy x Family",
    reasoning: "Smooth, charming, and universally enjoyable",
  },
  {
    bourbon: "Booker's",
    anime: "Attack on Titan",
    reasoning: "High-proof intensity matches the aggressive storytelling",
  },
  {
    bourbon: "Pappy Van Winkle",
    anime: "FMA: Brotherhood",
    reasoning: "Rare, acclaimed, and absolutely worth the hype",
  },
  {
    bourbon: "Yamazaki 12",
    anime: "Mushishi",
    reasoning: "Japanese refinement — balanced, subtle, meditative",
  },
  {
    bourbon: "Laphroaig 10",
    anime: "Berserk",
    reasoning: "Dark, smoky, intense — not for the faint of heart",
  },
  {
    bourbon: "Wild Turkey 101",
    anime: "Konosuba",
    reasoning: "Fun, honest, and perfect for sharing with friends",
  },
  {
    bourbon: "Evan Williams",
    anime: "Demon Slayer",
    reasoning: "Incredible quality that punches way above its price",
  },
];

// ── Core matching function ─────────────────────────────────────────

export function getAnimeRecommendations(
  whiskey: Whiskey
): AnimeRecommendation[] {
  const scored = CATEGORIES.map((cat) => ({
    score: cat.matchFn(whiskey),
    animes: cat.animes,
    label: cat.label,
  }));

  scored.sort((a, b) => b.score - a.score);

  // Take top categories, pick diverse results
  const seen = new Set<string>();
  const results: AnimeRecommendation[] = [];

  for (const cat of scored.slice(0, 5)) {
    if (cat.score <= 0) continue;
    // Pick up to 2 from each category for diversity
    let pickedFromCat = 0;
    for (const anime of cat.animes) {
      if (seen.has(anime.title)) continue;
      if (pickedFromCat >= 2) break;
      seen.add(anime.title);
      pickedFromCat++;
      const matchScore = Math.min(
        98,
        Math.max(65, Math.round(cat.score * 1.1))
      );
      results.push({
        title: anime.title,
        genre: anime.genre,
        reasoning: anime.reasoning,
        matchScore,
        streaming: anime.streaming,
        malScore: anime.malScore,
      });
    }
  }

  return results.slice(0, 6);
}

// ── Multi-bottle profile analysis ──────────────────────────────────

export function getCollectionAnimeProfile(
  whiskeys: Whiskey[]
): { topCategory: string; recommendations: AnimeRecommendation[] } {
  const categoryScores = new Map<string, number>();

  for (const w of whiskeys) {
    for (const cat of CATEGORIES) {
      const score = cat.matchFn(w);
      categoryScores.set(
        cat.label,
        (categoryScores.get(cat.label) ?? 0) + score
      );
    }
  }

  const entries = Array.from(categoryScores.entries());
  let topCategory = "";
  let topScore = 0;
  for (const entry of entries) {
    if (entry[1] > topScore) {
      topScore = entry[1];
      topCategory = entry[0];
    }
  }

  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const seen = new Set<string>();
  const recommendations: AnimeRecommendation[] = [];

  for (const pair of sorted.slice(0, 5)) {
    const label = pair[0];
    const cat = CATEGORIES.find((c) => c.label === label);
    if (!cat) continue;
    let pickedFromCat = 0;
    for (const anime of cat.animes) {
      if (seen.has(anime.title)) continue;
      if (pickedFromCat >= 2) break;
      seen.add(anime.title);
      pickedFromCat++;
      const score = categoryScores.get(label) ?? 0;
      const normalizedScore = Math.min(
        98,
        Math.max(65, Math.round((score / whiskeys.length) * 1.1))
      );
      recommendations.push({
        title: anime.title,
        genre: anime.genre,
        reasoning: anime.reasoning,
        matchScore: normalizedScore,
        streaming: anime.streaming,
        malScore: anime.malScore,
      });
    }
  }

  return {
    topCategory: topCategory.replace(/_/g, " "),
    recommendations: recommendations.slice(0, 8),
  };
}
