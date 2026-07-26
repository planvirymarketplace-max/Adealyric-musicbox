const fkboiAsset = "/fkboi.jpg";
const cantnobodyAsset = "/cantnobody.webp";
const philly1 = "/philly-1.jpg";
const philly2 = "/philly-2.jpg";
const philly3 = "/philly-3.jpg";

export type ReleaseType = "Album" | "EP" | "Single" | "Mixtape";

export type Release = {
  slug: string;
  title: string;
  year: number;
  type: ReleaseType;
  cover: string;
  runtime: string;
  tracks: { n: number; title: string; length: string; feat?: string }[];
  color: string;
  credits: string;
  story: string;
  bgImage: string;
};

export const RELEASES: Release[] = [
  {
    slug: "fk-boi",
    title: "F**K Boi",
    year: 2024,
    type: "Single",
    cover: fkboiAsset,
    runtime: "3:42",
    color: "oklch(0.6 0.02 0)",
    credits: "Written by Adea Lyric. Produced in West Philly.",
    story: "A confrontation, a mirror, a warning. Unapologetic to the last bar.",
    bgImage: philly2,
    tracks: [{ n: 1, title: "F**K Boi", length: "3:42" }],
  },
  {
    slug: "the-lyric-ep",
    title: "The Lyric",
    year: 2023,
    type: "EP",
    cover: philly3,
    runtime: "22:14",
    color: "oklch(0.55 0.02 0)",
    credits: "Six tracks. Zero compromises.",
    story: "The refusal record. Made without a table she wasn't invited to.",
    bgImage: philly1,
    tracks: [
      { n: 1, title: "Prelude / West", length: "2:11" },
      { n: 2, title: "Signal", length: "3:48", feat: "K. Rue" },
      { n: 3, title: "Rachi", length: "4:02" },
      { n: 4, title: "No Chase", length: "3:29" },
      { n: 5, title: "Streetlight", length: "4:17" },
      { n: 6, title: "Lyric", length: "4:27" },
    ],
  },
  {
    slug: "cant-nobody",
    title: "Can't Nobody",
    year: 2022,
    type: "Single",
    cover: cantnobodyAsset,
    runtime: "3:58",
    color: "oklch(0.5 0.02 0)",
    credits: "Rachi Lyfe.",
    story: "A statement of arrival, tuned to a Philly frequency.",
    bgImage: philly3,
    tracks: [{ n: 1, title: "Can't Nobody", length: "3:58" }],
  },
  {
    slug: "west-philly",
    title: "West Philly",
    year: 2021,
    type: "Mixtape",
    cover: philly2,
    runtime: "38:20",
    color: "oklch(0.45 0.02 0)",
    credits: "Ten tracks. One block.",
    story: "The mixtape that turned a neighborhood into a language.",
    bgImage: philly2,
    tracks: [
      { n: 1, title: "52nd", length: "3:20" },
      { n: 2, title: "Row House", length: "4:05" },
      { n: 3, title: "Cornerstore", length: "3:44" },
      { n: 4, title: "Market Frankford", length: "4:12" },
      { n: 5, title: "Overbrook", length: "3:33" },
      { n: 6, title: "Cobbs Creek", length: "4:01" },
      { n: 7, title: "Belmont", length: "3:48" },
      { n: 8, title: "Fairmount", length: "3:56" },
      { n: 9, title: "Malcolm X", length: "3:41" },
      { n: 10, title: "Home", length: "4:00" },
    ],
  },
  {
    slug: "debut-2017",
    title: "First Light",
    year: 2017,
    type: "EP",
    cover: philly1,
    runtime: "18:02",
    color: "oklch(0.4 0.02 0)",
    credits: "The introduction.",
    story: "Where it started. A voice deciding to be heard.",
    bgImage: philly1,
    tracks: [
      { n: 1, title: "Introduction", length: "2:44" },
      { n: 2, title: "Grown", length: "3:52" },
      { n: 3, title: "Say My Name", length: "4:08" },
      { n: 4, title: "Philly Blues", length: "3:31" },
      { n: 5, title: "Light", length: "3:47" },
    ],
  },
];

export type Product = {
  slug: string;
  name: string;
  price: number;
  type: "Vinyl" | "CD" | "Apparel" | "Print";
  category: string;
  image: string;
  color: string;
  sizes?: string[];
  edition?: string;
  description: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "fkboi-vinyl",
    name: 'F**K Boi 12" Vinyl',
    price: 34,
    type: "Vinyl",
    category: "Music",
    image: fkboiAsset,
    color: "oklch(0.2 0 0)",
    edition: "Limited / 500",
    description: "Heavyweight 180g black vinyl. Screen-printed sleeve. Signed insert.",
  },
  {
    slug: "west-philly-cassette",
    name: "West Philly Cassette",
    price: 18,
    type: "CD",
    category: "Music",
    image: cantnobodyAsset,
    color: "oklch(0.25 0 0)",
    edition: "Numbered / 250",
    description: "Chrome tape. Fold-out J-card with lyrics.",
  },
  {
    slug: "lyric-hoodie-black",
    name: "Lyric Hoodie — Black",
    price: 88,
    type: "Apparel",
    category: "Wear",
    image: fkboiAsset,
    color: "oklch(0.1 0 0)",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Heavyweight 500gsm cotton. Embroidered chain-stitch lyric on the back.",
  },
  {
    slug: "lyric-tee-bone",
    name: "Lyric Tee — Bone",
    price: 42,
    type: "Apparel",
    category: "Wear",
    image: cantnobodyAsset,
    color: "oklch(0.9 0 0)",
    sizes: ["S", "M", "L", "XL"],
    description: "Boxy fit. 260gsm ring-spun cotton. Puff-print logo.",
  },
  {
    slug: "west-print",
    name: 'West Philly Print 18"',
    price: 65,
    type: "Print",
    category: "Object",
    image: philly2,
    color: "oklch(0.15 0 0)",
    edition: "Signed / 100",
    description: "Giclée on cotton rag. Signed and numbered by Adea.",
  },
  {
    slug: "row-print",
    name: 'Row House Print 24"',
    price: 95,
    type: "Print",
    category: "Object",
    image: philly1,
    color: "oklch(0.18 0 0)",
    edition: "Signed / 100",
    description: "Large-format giclée. Museum-grade paper. Numbered.",
  },
  {
    slug: "el-print",
    name: 'The El Print 18"',
    price: 65,
    type: "Print",
    category: "Object",
    image: philly3,
    color: "oklch(0.16 0 0)",
    edition: "Signed / 100",
    description: "Giclée on cotton rag. Signed and numbered.",
  },
  {
    slug: "lyric-cap",
    name: "Lyric Cap — Black",
    price: 38,
    type: "Apparel",
    category: "Wear",
    image: fkboiAsset,
    color: "oklch(0.08 0 0)",
    sizes: ["One Size"],
    description: "Unstructured 6-panel. Waxed cotton. Metal clasp back.",
  },
];

/* ═══════════════════════════════════════════════════
   SHOP CATALOG — Albums + Merch with full e-commerce data
   ═══════════════════════════════════════════════════ */

/* ─── Product_Attributes: Size System ─── */
export type SizeType =
  | "clothing"
  | "waist"
  | "shoe"
  | "hat"
  | "drinkware"
  | "one-size"
  | "none";

export const SIZE_OPTIONS: Record<SizeType, string[]> = {
  clothing: ["XS", "S", "M", "L", "XL", "XXL"],
  waist: ["28", "30", "32", "34", "36"],
  shoe: ["5", "6", "7", "8", "9", "10"],
  hat: ["S/M", "L/XL", "Adjustable"],
  drinkware: ["11oz", "15oz"],
  "one-size": ["One Size"],
  none: [],
};

/* ═══════════════════════════════════════════════════════════════
   FULL CATEGORY TAXONOMY
   Level 1 — Clothing (Men's / Women's / Unisex)
   Level 2 — Accessories (Headwear / Bags / Tech / Fashion / Footwear)
   Level 3 — Home & Lifestyle (Drinkware / Barware)
   ═══════════════════════════════════════════════════════════════ */

export type ShopCategory =
  /* ── Clothing > Men's > Tops ── */
  | "T-Shirts"
  | "Long Sleeve Shirts"
  | "Tank Tops"
  | "Crop Tops"
  /* ── Clothing > Men's > Activewear ── */
  | "Athletic Tops"
  | "Sports Sets"
  /* ── Clothing > Men's > Outerwear ── */
  | "Hoodies"
  | "Sweatshirts"
  | "Coats"
  | "Jackets"
  | "Sweaters"
  /* ── Clothing > Men's > Bottoms ── */
  | "Sweatpants"
  | "Shorts"
  | "Trousers"
  | "Joggers"
  | "Pants"
  /* ── Clothing > Women's > Tops ── */
  | "T-Shirts & Shirts"
  | "Tanks"
  /* ── Clothing > Women's > Outerwear ── (shared with Men's) */
  /* ── Clothing > Women's > Bottoms ── */
  | "Skirts"
  | "Mini Skirts"
  | "Midi Skirts"
  | "Maxi Skirts"
  /* ── Clothing > Women's > Dresses ── */
  | "Dresses"
  | "Sleeveless Dresses"
  | "Short Sleeve Dresses"
  | "Long Sleeve Dresses"
  | "One-Pieces"
  /* ── Clothing > Women's > Bodysuits & Jumpsuits ── */
  | "Bodysuits"
  | "Jumpsuits"
  /* ── Clothing > Women's > Activewear ── */
  | "Sports Bras"
  | "Yoga Pants"
  | "Yoga Shorts"
  | "Yoga Sets"
  /* ── Clothing > Women's > Swimwear ── */
  | "Bikinis"
  | "Tankinis"
  | "Swimwear"
  | "Plus Size Swimwear"
  | "Cover Ups"
  | "Swimwear Accessories"
  /* ── Clothing > Women's > Lingerie & Sleep ── */
  | "Underwear"
  | "Lingerie"
  | "Loungewear"
  | "Sleepwear"
  /* ── Accessories > Headwear ── */
  | "Baseball Caps"
  | "Bucket Hats"
  | "Beanies"
  | "Unisex Hats"
  | "Hats"
  /* ── Accessories > Bags & Luggage ── */
  | "Backpacks"
  | "Schoolbags"
  | "Travel Backpacks"
  | "Bucket Bags"
  | "Tote Bags"
  | "Crossbody Bags"
  | "Clutches"
  | "Fanny Packs"
  | "Wallets"
  | "Phone Bags"
  | "Cosmetic Bags"
  | "Luggage"
  | "Travel Bags"
  | "Lunch Bags"
  /* ── Accessories > Tech (3C) ── */
  | "Phone Cases"
  | "Tablet Cases"
  | "Laptop Cases"
  | "AirPods Cases"
  | "Watches"
  | "Watch Bands"
  | "Gaming Accessories"
  | "Photo Accessories"
  /* ── Accessories > Fashion ── */
  | "Sunglasses"
  | "Prescription Glasses"
  | "Eyewear Accessories"
  | "Necklaces"
  | "Badges"
  | "Keychains"
  | "Key Holders"
  | "Face Covers"
  | "Scarfs"
  | "Wraps"
  | "Stoles"
  | "Ties"
  | "Arm Coolers"
  | "Arm Warmers"
  /* ── Accessories > Footwear ── */
  | "Sports Shoes"
  | "Boots"
  | "Slippers"
  | "Socks"
  /* ── Home & Lifestyle > Drinkware ── */
  | "Cups"
  | "Mugs"
  | "Travel Tumblers"
  /* ── Home & Lifestyle > Barware ── */
  | "Bottle Openers"
  | "Coasters"
  /* ── Music (physical media & memorabilia) ── */
  | "Vinyl"
  | "Posters"
  | "Accessories";

/* Map each leaf category to its size type for contextual filters */
export const CATEGORY_SIZE_TYPE: Record<string, SizeType> = {
  /* Clothing > Tops */
  "T-Shirts": "clothing",
  "Long Sleeve Shirts": "clothing",
  "Tank Tops": "clothing",
  "Crop Tops": "clothing",
  "T-Shirts & Shirts": "clothing",
  Tanks: "clothing",
  "Athletic Tops": "clothing",
  "Sports Bras": "clothing",
  /* Clothing > Activewear */
  "Sports Sets": "clothing",
  "Yoga Pants": "clothing",
  "Yoga Shorts": "clothing",
  "Yoga Sets": "clothing",
  /* Clothing > Outerwear */
  Hoodies: "clothing",
  Sweatshirts: "clothing",
  Coats: "clothing",
  Jackets: "clothing",
  Sweaters: "clothing",
  /* Clothing > Bottoms */
  Sweatpants: "waist",
  Joggers: "waist",
  Pants: "waist",
  Shorts: "waist",
  Trousers: "waist",
  Skirts: "one-size",
  "Mini Skirts": "one-size",
  "Midi Skirts": "one-size",
  "Maxi Skirts": "one-size",
  /* Clothing > Dresses */
  Dresses: "clothing",
  "Sleeveless Dresses": "clothing",
  "Short Sleeve Dresses": "clothing",
  "Long Sleeve Dresses": "clothing",
  "One-Pieces": "one-size",
  /* Clothing > Bodysuits & Jumpsuits */
  Bodysuits: "clothing",
  Jumpsuits: "clothing",
  /* Clothing > Swimwear */
  Bikinis: "clothing",
  Tankinis: "clothing",
  Swimwear: "clothing",
  "Plus Size Swimwear": "clothing",
  "Cover Ups": "one-size",
  "Swimwear Accessories": "one-size",
  /* Clothing > Lingerie & Sleep */
  Underwear: "clothing",
  Lingerie: "clothing",
  Loungewear: "clothing",
  Sleepwear: "clothing",
  /* Accessories > Headwear */
  "Baseball Caps": "hat",
  "Bucket Hats": "hat",
  Beanies: "hat",
  "Unisex Hats": "hat",
  Hats: "hat",
  /* Accessories > Bags — all one-size */
  Backpacks: "one-size",
  Schoolbags: "one-size",
  "Travel Backpacks": "one-size",
  "Bucket Bags": "one-size",
  "Tote Bags": "one-size",
  "Crossbody Bags": "one-size",
  Clutches: "one-size",
  "Fanny Packs": "one-size",
  Wallets: "one-size",
  "Phone Bags": "one-size",
  "Cosmetic Bags": "one-size",
  Luggage: "one-size",
  "Travel Bags": "one-size",
  "Lunch Bags": "one-size",
  /* Accessories > Tech — all one-size */
  "Phone Cases": "one-size",
  "Tablet Cases": "one-size",
  "Laptop Cases": "one-size",
  "AirPods Cases": "one-size",
  Watches: "one-size",
  "Watch Bands": "one-size",
  "Gaming Accessories": "one-size",
  "Photo Accessories": "one-size",
  /* Accessories > Fashion — all one-size */
  Sunglasses: "one-size",
  "Prescription Glasses": "one-size",
  "Eyewear Accessories": "one-size",
  Necklaces: "one-size",
  Badges: "one-size",
  Keychains: "one-size",
  "Key Holders": "one-size",
  "Face Covers": "one-size",
  Scarfs: "one-size",
  Wraps: "one-size",
  Stoles: "one-size",
  Ties: "one-size",
  "Arm Coolers": "one-size",
  "Arm Warmers": "one-size",
  /* Accessories > Footwear */
  "Sports Shoes": "shoe",
  Boots: "shoe",
  Slippers: "shoe",
  Socks: "one-size",
  /* Home & Lifestyle > Drinkware */
  Cups: "drinkware",
  Mugs: "drinkware",
  "Travel Tumblers": "drinkware",
  /* Home & Lifestyle > Barware */
  "Bottle Openers": "one-size",
  Coasters: "one-size",
  /* Music */
  Vinyl: "none",
  Posters: "none",
  Accessories: "one-size",
};

/* ─── Category Taxonomy Tree (3 levels) ─── */
export type CategoryNode = {
  label: string;
  slug: string;
  categories?: ShopCategory[];
   children?: CategoryNode[];
};

export const CATEGORY_TREE: CategoryNode[] = [
  /* ═══════ LEVEL 1: CLOTHING ═══════ */
  {
    label: "Clothing",
    slug: "clothing",
    children: [
      /* ── Men's Clothing ── */
      {
        label: "Men's",
        slug: "mens",
        children: [
          {
            label: "Tops",
            slug: "mens-tops",
            categories: ["T-Shirts", "Long Sleeve Shirts", "Tank Tops", "Crop Tops"],
          },
          {
            label: "Activewear",
            slug: "mens-activewear",
            categories: ["Athletic Tops", "Sports Sets"],
          },
          {
            label: "Outerwear",
            slug: "mens-outerwear",
            categories: ["Hoodies", "Sweatshirts", "Coats", "Jackets"],
          },
          {
            label: "Bottoms",
            slug: "mens-bottoms",
            categories: ["Sweatpants", "Shorts", "Trousers"],
          },
        ],
      },
      /* ── Women's Clothing ── */
      {
        label: "Women's",
        slug: "womens",
        children: [
          {
            label: "Tops",
            slug: "womens-tops",
            categories: ["T-Shirts & Shirts", "Tanks", "Crop Tops", "Long Sleeve Shirts"],
          },
          {
            label: "Outerwear",
            slug: "womens-outerwear",
            categories: ["Hoodies", "Sweatshirts", "Coats", "Jackets"],
          },
          {
            label: "Bottoms",
            slug: "womens-bottoms",
            categories: ["Trousers", "Shorts", "Mini Skirts", "Midi Skirts", "Maxi Skirts"],
          },
          {
            label: "Dresses",
            slug: "womens-dresses",
            categories: ["Sleeveless Dresses", "Short Sleeve Dresses", "Long Sleeve Dresses", "One-Pieces"],
          },
          {
            label: "Bodysuits & Jumpsuits",
            slug: "womens-bodysuits",
            categories: ["Bodysuits", "Jumpsuits"],
          },
          {
            label: "Activewear",
            slug: "womens-activewear",
            categories: ["Sports Bras", "Athletic Tops", "Yoga Pants", "Yoga Shorts", "Yoga Sets", "Sports Sets"],
          },
          {
            label: "Swimwear",
            slug: "womens-swimwear",
            categories: ["Bikinis", "Tankinis", "Swimwear", "Plus Size Swimwear", "Cover Ups", "Swimwear Accessories"],
          },
          {
            label: "Lingerie & Sleep",
            slug: "womens-lingerie",
            categories: ["Underwear", "Lingerie", "Loungewear", "Sleepwear"],
          },
        ],
      },
      /* ── Unisex / Gender-Neutral ── */
      {
        label: "Unisex",
        slug: "unisex",
        categories: ["Hoodies", "Sweatshirts", "Jackets", "Athletic Tops", "Sports Sets"],
      },
    ],
  },
  /* ═══════ LEVEL 2: ACCESSORIES ═══════ */
  {
    label: "Accessories",
    slug: "accessories",
    children: [
      {
        label: "Headwear",
        slug: "headwear",
        categories: ["Baseball Caps", "Bucket Hats", "Beanies", "Unisex Hats"],
      },
      {
        label: "Bags & Luggage",
        slug: "bags-luggage",
        children: [
          {
            label: "Backpacks",
            slug: "backpacks",
            categories: ["Schoolbags", "Travel Backpacks", "Bucket Bags"],
          },
          {
            label: "Handbags",
            slug: "handbags",
            categories: ["Tote Bags", "Crossbody Bags", "Clutches"],
          },
          {
            label: "Small Bags",
            slug: "small-bags",
            categories: ["Fanny Packs", "Wallets", "Phone Bags", "Cosmetic Bags"],
          },
          {
            label: "Travel",
            slug: "travel",
            categories: ["Luggage", "Travel Bags", "Lunch Bags"],
          },
        ],
      },
      {
        label: "Tech Accessories",
        slug: "tech-accessories",
        categories: ["Phone Cases", "Tablet Cases", "Laptop Cases", "AirPods Cases", "Watches", "Watch Bands", "Gaming Accessories", "Photo Accessories"],
      },
      {
        label: "Fashion Accessories",
        slug: "fashion-accessories",
        children: [
          {
            label: "Eyewear",
            slug: "eyewear",
            categories: ["Sunglasses", "Prescription Glasses", "Eyewear Accessories"],
          },
          {
            label: "Jewelry",
            slug: "jewelry",
            categories: ["Necklaces", "Badges", "Keychains", "Key Holders"],
          },
          {
            label: "Face & Neck",
            slug: "face-neck",
            categories: ["Face Covers", "Scarfs", "Wraps", "Stoles", "Ties"],
          },
          {
            label: "Hand & Arm",
            slug: "hand-arm",
            categories: ["Arm Coolers", "Arm Warmers"],
          },
        ],
      },
      {
        label: "Footwear",
        slug: "footwear",
        categories: ["Sports Shoes", "Boots", "Slippers", "Socks"],
      },
    ],
  },
  /* ═══════ LEVEL 3: HOME & LIFESTYLE ═══════ */
  {
    label: "Home & Lifestyle",
    slug: "home-lifestyle",
    children: [
      {
        label: "Drinkware",
        slug: "drinkware",
        categories: ["Cups", "Mugs", "Travel Tumblers"],
      },
      {
        label: "Barware",
        slug: "barware",
        categories: ["Bottle Openers", "Coasters"],
      },
    ],
  },
  /* ═══════ MUSIC (physical media) ═══════ */
  {
    label: "Music",
    slug: "music",
    categories: ["Vinyl", "Posters"],
  },
];

/* Collect all leaf category names from the tree */
export function getLeafCategories(node: CategoryNode): ShopCategory[] {
  if (node.categories) return node.categories;
  if (node.children) return node.children.flatMap(getLeafCategories);
  return [];
}

export type ColorSwatch = {
  name: string;
  hex: string;
};

export type AvailabilityStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Pre-Order";

function getAvailability(stock: number): AvailabilityStatus {
  if (stock === 0) return "Out of Stock";
  if (stock <= 10) return "Low Stock";
  return "In Stock";
}

export type ShopProduct = {
  slug: string;
  name: string;
  price: number;
  category: ShopCategory;
  sizes: string[];
  colors: ColorSwatch[];
  image: string;
  description: string;
  stock: number;
  albumSlug: string;
  albumTitle: string;
};

export type EnrichedProduct = ShopProduct & {
  sizeType: SizeType;
  availability: AvailabilityStatus;
};

export function enrichProduct(p: ShopProduct): EnrichedProduct {
  return {
    ...p,
    sizeType: CATEGORY_SIZE_TYPE[p.category] ?? "none",
    availability: getAvailability(p.stock),
  };
}

export type ShopAlbum = {
  slug: string;
  title: string;
  releaseDate: string;
  duration: string;
  description: string;
  quote: string;
  singleTitle?: string;
  cover: string;
  merch: ShopProduct[];
};

/* ---- Color Swatches ---- */
const BLACK: ColorSwatch = { name: "Black", hex: "#111111" };
const WHITE: ColorSwatch = { name: "White", hex: "#F5F5F5" };
const GRAY: ColorSwatch = { name: "Gray", hex: "#6B6B6B" };
const NAVY: ColorSwatch = { name: "Navy", hex: "#1B2A4A" };
const CREAM: ColorSwatch = { name: "Cream", hex: "#E8DFD0" };
const BURGUNDY: ColorSwatch = { name: "Burgundy", hex: "#5C1A1B" };
const FOREST: ColorSwatch = { name: "Forest", hex: "#2D4A3E" };
const CHARCOAL: ColorSwatch = { name: "Charcoal", hex: "#36454F" };
const SAND: ColorSwatch = { name: "Sand", hex: "#C2B280" };
const OLIVE: ColorSwatch = { name: "Olive", hex: "#556B2F" };
const WINE: ColorSwatch = { name: "Wine", hex: "#722F37" };
const SLATE: ColorSwatch = { name: "Slate", hex: "#708090" };

export const SHOP_ALBUMS: ShopAlbum[] = [
  {
    slug: "cant-nobody-album",
    title: "Can't Nobody",
    releaseDate: "March 2022",
    duration: "42:18",
    description:
      "The debut album that introduced Adea Lyric to the world. Raw, unfiltered, and deeply rooted in West Philadelphia.",
    quote: "Every word is a weapon, every note is a prayer.",
    singleTitle: "Can't Nobody",
    cover: cantnobodyAsset,
    merch: [
      { slug: "cn-hoodie-blk", name: "Can't Nobody Hoodie", price: 88, category: "Hoodies", sizes: ["S", "M", "L", "XL", "XXL"], colors: [BLACK, GRAY, CREAM], image: "", description: "Heavyweight 400gsm fleece hoodie with embroidered album logo on chest.", stock: 24, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-tee-blk", name: "Can't Nobody Tee", price: 42, category: "T-Shirts", sizes: ["S", "M", "L", "XL", "XXL"], colors: [BLACK, WHITE, CREAM], image: "", description: "Premium 220gsm cotton tee with puff-print album artwork.", stock: 48, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-sweater-navy", name: "Can't Nobody Crewneck", price: 78, category: "Sweaters", sizes: ["S", "M", "L", "XL"], colors: [NAVY, BURGUNDY, CHARCOAL], image: "", description: "Heavy-knit crewneck sweater with woven label on hem.", stock: 16, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-sweatpant", name: "Can't Nobody Sweatpant", price: 68, category: "Sweatpants", sizes: ["S", "M", "L", "XL"], colors: [BLACK, CHARCOAL, NAVY], image: "", description: "Relaxed-fit French terry sweatpant with embroidered detail.", stock: 20, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-jogger", name: "Can't Nobody Jogger", price: 72, category: "Joggers", sizes: ["S", "M", "L", "XL"], colors: [BLACK, OLIVE], image: "", description: "Tapered jogger with zip pockets and ribbed cuffs.", stock: 12, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-socks", name: "Can't Nobody Socks", price: 16, category: "Socks", sizes: ["One Size"], colors: [BLACK, WHITE], image: "", description: "Ribbed cotton-blend socks with album logo.", stock: 60, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-vinyl", name: "Can't Nobody Vinyl", price: 34, category: "Vinyl", sizes: [], colors: [BLACK], image: "", description: "180g heavyweight vinyl with printed inner sleeve.", stock: 8, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-mug", name: "Can't Nobody Mug", price: 18, category: "Mugs", sizes: [], colors: [BLACK, WHITE], image: "", description: "Ceramic 11oz mug with wrap-around album artwork.", stock: 35, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-cup", name: "Can't Nobody Cup", price: 12, category: "Cups", sizes: [], colors: [BLACK, WHITE], image: "", description: "Double-wall insulated tumbler with lid.", stock: 40, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-hat", name: "Can't Nobody Dad Hat", price: 38, category: "Hats", sizes: ["One Size"], colors: [BLACK, CREAM, OLIVE], image: "", description: "Unstructured 6-panel dad hat with embroidered script.", stock: 0, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-poster", name: "Can't Nobody Poster", price: 25, category: "Posters", sizes: [], colors: [], image: "", description: '18" x 24" gig poster on premium stock.', stock: 30, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-bottle-opener", name: "Can't Nobody Bottle Opener", price: 12, category: "Accessories", sizes: [], colors: [BLACK], image: "", description: "Flat stainless steel bottle opener with laser engraving.", stock: 50, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
    ],
  },
  {
    slug: "after-lyric",
    title: "After Lyric",
    releaseDate: "January 2023",
    duration: "48:35",
    description:
      "The sophomore record. A deeper cut into the psyche — love, loss, and everything that comes after the bars fade.",
    quote: "After the lyric, the silence speaks louder.",
    singleTitle: "Fuck Boi",
    cover: philly2,
    merch: [
      { slug: "al-hoodie", name: "After Lyric Hoodie", price: 88, category: "Hoodies", sizes: ["S", "M", "L", "XL", "XXL"], colors: [BLACK, NAVY, FOREST], image: "", description: "Oversized heavyweight hoodie with back graphic.", stock: 18, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-tee", name: "After Lyric Tee", price: 42, category: "T-Shirts", sizes: ["S", "M", "L", "XL", "XXL"], colors: [WHITE, SAND, CHARCOAL], image: "", description: "Relaxed-fit tee with tonal album graphic.", stock: 55, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-sweater", name: "After Lyric Sweater", price: 78, category: "Sweaters", sizes: ["S", "M", "L", "XL"], colors: [CREAM, SLATE], image: "", description: "Cozy lambswool blend crewneck.", stock: 10, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-sweatpant", name: "After Lyric Sweatpant", price: 68, category: "Sweatpants", sizes: ["S", "M", "L", "XL"], colors: [CHARCOAL, NAVY], image: "", description: "French terry sweatpant with tonal embroidery.", stock: 14, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-jogger", name: "After Lyric Jogger", price: 72, category: "Joggers", sizes: ["S", "M", "L", "XL"], colors: [BLACK], image: "", description: "Tech-fabric jogger with reflective details.", stock: 8, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-pants", name: "After Lyric Cargo Pant", price: 85, category: "Pants", sizes: ["S", "M", "L", "XL"], colors: [BLACK, OLIVE], image: "", description: "Relaxed cargo pant with utility pockets.", stock: 11, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-socks", name: "After Lyric Socks", price: 16, category: "Socks", sizes: ["One Size"], colors: [BLACK, CHARCOAL], image: "", description: "Cushioned athletic socks with lyric detail.", stock: 45, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-vinyl", name: "After Lyric Vinyl", price: 34, category: "Vinyl", sizes: [], colors: [BLACK], image: "", description: "Colored vinyl with gatefold sleeve.", stock: 5, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-mug", name: "After Lyric Mug", price: 18, category: "Mugs", sizes: [], colors: [WHITE, CREAM], image: "", description: "Stoneware mug with debossed logo.", stock: 28, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-cup", name: "After Lyric Tumbler", price: 15, category: "Cups", sizes: [], colors: [BLACK, WHITE], image: "", description: "Insulated travel tumbler, 16oz.", stock: 32, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-hat", name: "After Lyric Dad Hat", price: 38, category: "Hats", sizes: ["One Size"], colors: [BLACK, CREAM], image: "", description: "Washed cotton dad hat.", stock: 20, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-poster", name: "After Lyric Poster", price: 25, category: "Posters", sizes: [], colors: [], image: "", description: "Art print on archival paper.", stock: 0, albumSlug: "after-lyric", albumTitle: "After Lyric" },
    ],
  },
  {
    slug: "man-in-my-life",
    title: "Man in My Life",
    releaseDate: "July 2023",
    duration: "45:52",
    description:
      "An exploration of relationships, loyalty, and the men who shaped the narrative. Honest and unapologetic.",
    quote: "You do not choose who changes you — they just do.",
    singleTitle: "Side N****a",
    cover: philly3,
    merch: [
      { slug: "ml-hoodie", name: "Man in My Life Hoodie", price: 88, category: "Hoodies", sizes: ["S", "M", "L", "XL", "XXL"], colors: [WINE, BLACK, GRAY], image: "", description: "Faded wash hoodie with oversized back print.", stock: 22, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-tee", name: "Man in My Life Tee", price: 42, category: "T-Shirts", sizes: ["S", "M", "L", "XL"], colors: [WHITE, CREAM, SLATE], image: "", description: "Vintage-wash tee with front graphic.", stock: 0, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-sweater", name: "Man in My Life Cardigan", price: 95, category: "Sweaters", sizes: ["S", "M", "L", "XL"], colors: [CREAM, CHARCOAL], image: "", description: "Open-front knit cardigan with button closure.", stock: 7, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-sweatpant", name: "Man in My Life Sweatpant", price: 68, category: "Sweatpants", sizes: ["S", "M", "L", "XL"], colors: [BLACK, GRAY, WINE], image: "", description: "Matching set sweatpant with tonal drawstring.", stock: 15, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-pants", name: "Man in My Life Pant", price: 82, category: "Pants", sizes: ["S", "M", "L", "XL"], colors: [BLACK, NAVY], image: "", description: "Wide-leg trouser in premium twill.", stock: 9, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-socks", name: "Man in My Life Socks", price: 16, category: "Socks", sizes: ["One Size"], colors: [WINE, BLACK, CREAM], image: "", description: "Cotton-blend dress socks.", stock: 38, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-vinyl", name: "Man in My Life Vinyl", price: 34, category: "Vinyl", sizes: [], colors: [BLACK], image: "", description: "Standard weight vinyl in printed sleeve.", stock: 12, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-mug", name: "Man in My Life Mug", price: 18, category: "Mugs", sizes: [], colors: [BLACK, CREAM], image: "", description: "Matte black ceramic mug.", stock: 22, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-cup", name: "Man in My Life Cup", price: 12, category: "Cups", sizes: [], colors: [BLACK, WHITE], image: "", description: "Ceramic cup with hand-drawn lettering.", stock: 0, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-hat", name: "Man in My Life Dad Hat", price: 38, category: "Hats", sizes: ["One Size"], colors: [WINE, BLACK, SAND], image: "", description: "Distressed cotton twill hat.", stock: 17, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-poster", name: "Man in My Life Poster", price: 25, category: "Posters", sizes: [], colors: [], image: "", description: '24x36 lithograph poster.', stock: 20, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
    ],
  },
  {
    slug: "story-of-my-journey",
    title: "Story of My Journey",
    releaseDate: "November 2023",
    duration: "51:07",
    description:
      "A sonic autobiography. From the corners of West Philly to stages worldwide — every chapter told in verse.",
    quote: "The journey does not end — it just finds new streets.",
    singleTitle: "Drink on the Beach",
    cover: philly1,
    merch: [
      { slug: "sj-hoodie", name: "Story of My Journey Hoodie", price: 88, category: "Hoodies", sizes: ["S", "M", "L", "XL", "XXL"], colors: [FOREST, BLACK, SAND], image: "", description: "Earth-toned hoodie with journey-inspired back art.", stock: 19, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
      { slug: "sj-tee", name: "Story of My Journey Tee", price: 42, category: "T-Shirts", sizes: ["S", "M", "L", "XL", "XXL"], colors: [WHITE, OLIVE, NAVY], image: "", description: "Oversized tee with map-print graphic.", stock: 40, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
      { slug: "sj-sweater", name: "Story of My Journey Pullover", price: 78, category: "Sweaters", sizes: ["S", "M", "L", "XL"], colors: [FOREST, CREAM], image: "", description: "Half-zip fleece pullover with embroidered patch.", stock: 13, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
      { slug: "sj-sweatpant", name: "Story of My Journey Sweatpant", price: 68, category: "Sweatpants", sizes: ["S", "M", "L", "XL"], colors: [OLIVE, CHARCOAL, BLACK], image: "", description: "Relaxed-fit sweatpant with embroidered knee.", stock: 16, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
      { slug: "sj-jogger", name: "Story of My Journey Jogger", price: 72, category: "Joggers", sizes: ["S", "M", "L", "XL"], colors: [FOREST, BLACK], image: "", description: "Lightweight jogger with map lining.", stock: 10, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
      { slug: "sj-socks", name: "Story of My Journey Socks", price: 16, category: "Socks", sizes: ["One Size"], colors: [FOREST, CREAM, BLACK], image: "", description: "Merino wool blend socks.", stock: 50, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
      { slug: "sj-vinyl", name: "Story of My Journey Vinyl", price: 34, category: "Vinyl", sizes: [], colors: [BLACK], image: "", description: "Double LP with booklet.", stock: 6, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
      { slug: "sj-mug", name: "Story of My Journey Mug", price: 18, category: "Mugs", sizes: [], colors: [CREAM, FOREST], image: "", description: "Speckled stoneware mug.", stock: 25, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
      { slug: "sj-cup", name: "Story of My Journey Cup", price: 15, category: "Cups", sizes: [], colors: [BLACK, WHITE], image: "", description: "Stainless steel camp cup.", stock: 0, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
      { slug: "sj-hat", name: "Story of My Journey Dad Hat", price: 38, category: "Hats", sizes: ["One Size"], colors: [OLIVE, SAND, BLACK], image: "", description: "Washed canvas bucket hat.", stock: 15, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
      { slug: "sj-poster", name: "Story of My Journey Poster", price: 25, category: "Posters", sizes: [], colors: [], image: "", description: "Illustrated journey map poster.", stock: 18, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
    ],
  },
  {
    slug: "tainted-love",
    title: "Tainted Love",
    releaseDate: "May 2024",
    duration: "39:44",
    description:
      "The aftermath of devotion. A darker, more vulnerable record that strips away the armor.",
    quote: "Love is the wound that keeps teaching you how to heal.",
    cover: fkboiAsset,
    merch: [
      { slug: "tl-hoodie", name: "Tainted Love Hoodie", price: 88, category: "Hoodies", sizes: ["S", "M", "L", "XL", "XXL"], colors: [BURGUNDY, BLACK, CHARCOAL], image: "", description: "Distressed hoodie with cracked-print heart graphic.", stock: 21, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-tee", name: "Tainted Love Tee", price: 42, category: "T-Shirts", sizes: ["S", "M", "L", "XL", "XXL"], colors: [WHITE, BURGUNDY, SLATE], image: "", description: "Bleach-wash tee with heart-break graphic.", stock: 37, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-sweater", name: "Tainted Love Sweater", price: 78, category: "Sweaters", sizes: ["S", "M", "L", "XL"], colors: [BURGUNDY, BLACK], image: "", description: "Turtleneck sweater in dark rose.", stock: 9, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-sweatpant", name: "Tainted Love Sweatpant", price: 68, category: "Sweatpants", sizes: ["S", "M", "L", "XL"], colors: [BLACK, CHARCOAL, BURGUNDY], image: "", description: "Matching set sweatpant with tonal details.", stock: 18, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-pants", name: "Tainted Love Pant", price: 82, category: "Pants", sizes: ["S", "M", "L", "XL"], colors: [BLACK, CHARCOAL], image: "", description: "Straight-leg pant with hidden pocket.", stock: 7, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-socks", name: "Tainted Love Socks", price: 16, category: "Socks", sizes: ["One Size"], colors: [BURGUNDY, BLACK], image: "", description: "Ribbed ankle socks with heart detail.", stock: 42, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-vinyl", name: "Tainted Love Vinyl", price: 34, category: "Vinyl", sizes: [], colors: [BURGUNDY], image: "", description: "Colored vinyl in red/burgundy.", stock: 4, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-mug", name: "Tainted Love Mug", price: 18, category: "Mugs", sizes: [], colors: [BLACK, WHITE], image: "", description: "Matte black mug with red accent.", stock: 20, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-cup", name: "Tainted Love Cup", price: 15, category: "Cups", sizes: [], colors: [BURGUNDY, BLACK], image: "", description: "Ceramic cup with gold foil detail.", stock: 30, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-hat", name: "Tainted Love Dad Hat", price: 38, category: "Hats", sizes: ["One Size"], colors: [BLACK, BURGUNDY], image: "", description: "Washed twill hat with embroidered rose.", stock: 0, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-poster", name: "Tainted Love Poster", price: 25, category: "Posters", sizes: [], colors: [], image: "", description: "Dark art print on heavyweight stock.", stock: 15, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-bottle-opener", name: "Tainted Love Keychain", price: 12, category: "Accessories", sizes: [], colors: [BLACK, BURGUNDY], image: "", description: "Bottle opener keychain with laser-cut heart.", stock: 0, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
    ],
  },
];

/* Flat list of all products — enriched with sizeType and availability */
export const ALL_PRODUCTS: EnrichedProduct[] = (() => {
  const raw = SHOP_ALBUMS.flatMap((a) =>
    a.merch.map((m) => ({ ...m, albumSlug: a.slug, albumTitle: a.title }))
  );
  return raw.map(enrichProduct);
})();

/* All unique categories */
export const ALL_CATEGORIES: ShopCategory[] = Object.keys(CATEGORY_SIZE_TYPE) as ShopCategory[];

/* Backward compat aliases */
export type AlbumMerchProduct = ShopProduct;
export const ALBUMS = SHOP_ALBUMS;

export const TOUR = [
  { date: "OCT 12", city: "Philadelphia, PA", venue: "The Fillmore", status: "On Sale" },
  { date: "OCT 19", city: "New York, NY", venue: "Bowery Ballroom", status: "On Sale" },
  { date: "OCT 26", city: "Washington, DC", venue: "9:30 Club", status: "Low" },
  { date: "NOV 02", city: "Boston, MA", venue: "Royale", status: "On Sale" },
  { date: "NOV 09", city: "Atlanta, GA", venue: "Terminal West", status: "On Sale" },
  { date: "NOV 16", city: "Chicago, IL", venue: "Thalia Hall", status: "Sold Out" },
  { date: "NOV 23", city: "Los Angeles, CA", venue: "The Novo", status: "On Sale" },
];
