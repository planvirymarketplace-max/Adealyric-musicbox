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
  | "none"
  | "women_std"
  | "women_numeric"
  | "women_ext"
  | "pod_std";

export const SIZE_OPTIONS: Record<SizeType, string[]> = {
  clothing: ["XS", "S", "M", "L", "XL", "XXL"],
  waist: ["28", "30", "32", "34", "36"],
  shoe: ["5", "6", "7", "8", "9", "10"],
  hat: ["S/M", "L/XL", "Adjustable"],
  drinkware: ["11oz", "15oz"],
  "one-size": ["One Size"],
  none: [],
  women_std: ["S", "M", "L", "XL", "2XL", "3XL"],
  women_numeric: ["4", "6", "8", "10", "12"],
  women_ext: ["2XS", "XS", "S", "M", "L", "XL"],
  pod_std: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL"],
};

/* ═══════════════════════════════════════════════════════════════
   FULL CATEGORY TAXONOMY
   Level 1 — Clothing (Men's / Women's / Unisex)
   Level 2 — Accessories (Headwear / Bags / Tech / Fashion / Footwear)
   Level 3 — Home & Lifestyle (Drinkware / Barware)
   ═══════════════════════════════════════════════════════════════ */

export type ShopCategory =
  /* Apparel > Tops */
  | "T-Shirts" | "Tank Tops & Camis" | "Crop Tops" | "Hoodies" | "Sweatshirts" | "Long Sleeve Shirts" | "Polo Shirts"
  /* Apparel > Bottoms */
  | "Leggings" | "Sweatpants" | "Skirts" | "Shorts" | "Trousers & Pants"
  /* Apparel > Outerwear */
  | "Coats & Jackets"
  /* Apparel > One-Pieces */
  | "Bodysuits" | "Jumpsuits" | "Rompers"
  /* Women's Tops */
  | "Women's T-Shirts & Shirts" | "Women's Tanks" | "Women's Hoodies" | "Women's Sweatshirts" | "Women's Coats & Jackets"
  /* Women's Bottoms */
  | "Women's Trousers" | "Women's Shorts"
  /* Women's Dresses */
  | "Sleeveless Dresses" | "Short Sleeve Dresses" | "Half & Long Sleeve Dresses" | "Short Skirts"
  /* Women's Bodysuits & Jumpsuits */
  | "Bodysuits" | "Jumpsuits"
  /* Women's Outfits */
  | "Casual Suits"
  /* Women's Activewear */
  | "Sports Bras" | "Sports Sets" | "Athletic Tops" | "Yoga Pants" | "Yoga Shorts" | "Yoga Sets"
  /* Women's Swimwear */
  | "Bikinis" | "Tankinis" | "One-Piece Swimwear" | "Plus Size Swimwear" | "Cover Ups" | "Swimwear Accessories"
  /* Women's Lingerie & Sleep */
  | "Women's Underwear" | "Women's Lingerie" | "Women's Loungewear" | "Women's Sleepwear"
  /* Unisex */
  | "Unisex T-Shirts" | "Unisex Crop Tops" | "Unisex Leggings" | "Unisex Hoodies" | "Unisex Sweatshirts" | "Unisex Jackets & Outerwear"
  | "Hats" | "Beanies" | "Bags & Totes"
  /* Accessories > 3C & Tech */
  | "AirPods Cases" | "Tablet & Laptop Cases" | "Gaming Accessories" | "Watches & Bands" | "Photography Accessories"
  /* Accessories > Phone Cases (subcategories) */
  | "Microfiber Cases" | "Glass Cases" | "Flip Cases" | "TPU Cases" | "Other Cases"
  /* Accessories > Caps & Hats */
  | "Baseball Caps" | "Bucket Hats" | "Beanies"
  /* Accessories > Face & Neck */
  | "Face Covers" | "Scarves, Wraps & Stoles" | "Ties"
  /* Accessories > Jewelry & Ornaments */
  | "Badges" | "Necklaces" | "Keychains" | "Key Holders"
  /* Accessories > Eyewear */
  | "Eyewear Accessories"
  /* Accessories > Hand & Arm */
  | "Arm Coolers & Warmers"
  /* Accessories > Footwear */
  | "Sports Shoes" | "Slippers" | "Boots" | "Socks"
  /* Accessories > Bags */
  | "Backpacks & Schoolbags" | "Tote Bags" | "Crossbody Bags" | "Travel & Hand Bags" | "Fanny Packs" | "Wallets & Phone Bags" | "Cosmetic & Toiletry Bags" | "Lunch Bags" | "Luggage" | "Clutches" | "Bucket Bags"
  /* Beauty */
  | "Face Care" | "Body Care" | "Hair Care" | "Makeup" | "Collection Boxes"
  /* Music (keep for album merch) */
  | "Vinyl" | "Posters"
  /* Drinkware (keep for album merch) */
  | "Mugs" | "Cups";

/* Map each leaf category to its size type for contextual filters */
export const CATEGORY_SIZE_TYPE: Record<string, SizeType> = {
  /* Apparel > Tops */
  "T-Shirts": "clothing", "Tank Tops & Camis": "clothing", "Crop Tops": "clothing", Hoodies: "clothing", Sweatshirts: "clothing", "Long Sleeve Shirts": "clothing", "Polo Shirts": "clothing",
  /* Apparel > Bottoms */
  Leggings: "clothing", Sweatpants: "waist", Skirts: "one-size", Shorts: "waist", "Trousers & Pants": "waist",
  /* Apparel > Outerwear */
  "Coats & Jackets": "clothing",
  /* Apparel > One-Pieces */
  Bodysuits: "clothing", Jumpsuits: "clothing", Rompers: "clothing",
  /* Women's Tops */
  "Women's T-Shirts & Shirts": "clothing", "Women's Tanks": "clothing", "Women's Hoodies": "clothing", "Women's Sweatshirts": "clothing", "Women's Coats & Jackets": "clothing",
  /* Women's Bottoms */
  "Women's Trousers": "waist", "Women's Shorts": "waist",
  /* Women's Dresses */
  "Sleeveless Dresses": "clothing", "Short Sleeve Dresses": "clothing", "Half & Long Sleeve Dresses": "clothing", "Short Skirts": "one-size",
  /* Women's Bodysuits & Jumpsuits */
  "Casual Suits": "clothing",
  /* Women's Activewear */
  "Sports Bras": "women_numeric", "Sports Sets": "clothing", "Athletic Tops": "clothing", "Yoga Pants": "women_numeric", "Yoga Shorts": "women_numeric", "Yoga Sets": "clothing",
  /* Women's Swimwear */
  Bikinis: "clothing", Tankinis: "clothing", "One-Piece Swimwear": "clothing", "Plus Size Swimwear": "clothing", "Cover Ups": "one-size", "Swimwear Accessories": "one-size",
  /* Women's Lingerie & Sleep */
  "Women's Underwear": "clothing", "Women's Lingerie": "clothing", "Women's Loungewear": "clothing", "Women's Sleepwear": "clothing",
  /* Unisex Apparel */
  "Unisex T-Shirts": "clothing", "Unisex Crop Tops": "clothing", "Unisex Leggings": "clothing", "Unisex Hoodies": "clothing", "Unisex Sweatshirts": "clothing", "Unisex Jackets & Outerwear": "clothing",
  /* Unisex Headwear */
  Hats: "hat", Beanies: "hat", "Bags & Totes": "one-size",
  /* Accessories > 3C & Tech */
  "AirPods Cases": "one-size", "Tablet & Laptop Cases": "one-size", "Gaming Accessories": "one-size", "Watches & Bands": "one-size", "Photography Accessories": "one-size",
  /* Accessories > Phone Cases (subcategories) */
  "Microfiber Cases": "one-size", "Glass Cases": "one-size", "Flip Cases": "one-size", "TPU Cases": "one-size", "Other Cases": "one-size",
  /* Accessories > Caps & Hats */
  "Baseball Caps": "hat", "Bucket Hats": "hat", Beanies: "hat",
  /* Accessories > Face & Neck */
  "Face Covers": "one-size", "Scarves, Wraps & Stoles": "one-size", Ties: "one-size",
  /* Accessories > Jewelry & Ornaments */
  Badges: "one-size", Necklaces: "one-size", Keychains: "one-size", "Key Holders": "one-size",
  /* Accessories > Eyewear */
  "Eyewear Accessories": "one-size",
  /* Accessories > Hand & Arm */
  "Arm Coolers & Warmers": "one-size",
  /* Accessories > Footwear */
  "Sports Shoes": "shoe", "Slippers": "shoe", "Boots": "shoe", "Socks": "one-size",
  /* Accessories > Bags */
  "Backpacks & Schoolbags": "one-size", "Tote Bags": "one-size", "Crossbody Bags": "one-size", "Travel & Hand Bags": "one-size", "Fanny Packs": "one-size", "Wallets & Phone Bags": "one-size", "Cosmetic & Toiletry Bags": "one-size", "Lunch Bags": "one-size", "Luggage": "one-size", "Clutches": "one-size", "Bucket Bags": "one-size",
  /* Beauty */
  "Face Care": "one-size", "Body Care": "one-size", "Hair Care": "one-size", Makeup: "one-size", "Collection Boxes": "one-size",
  /* Music */
  Vinyl: "none", Posters: "none",
  /* Drinkware (album merch) */
  Mugs: "drinkware", Cups: "drinkware",
};

/* ─── Category Taxonomy Tree ─── */
export type CategoryNode = {
  label: string;
  slug: string;
  categories?: ShopCategory[];
   children?: CategoryNode[];
};

export const CATEGORY_TREE: CategoryNode[] = [
  {
    label: "Apparel",
    slug: "apparel",
    children: [
      { label: "Tops", slug: "apparel-tops", categories: ["T-Shirts", "Tank Tops & Camis", "Crop Tops", "Hoodies", "Sweatshirts", "Long Sleeve Shirts", "Polo Shirts"] },
      { label: "Bottoms", slug: "apparel-bottoms", categories: ["Leggings", "Sweatpants", "Skirts", "Shorts", "Trousers & Pants"] },
      { label: "Outerwear", slug: "apparel-outerwear", categories: ["Coats & Jackets"] },
      { label: "One-Pieces", slug: "apparel-one-pieces", categories: ["Bodysuits", "Jumpsuits", "Rompers"] },
    ],
  },
  {
    label: "Women",
    slug: "women",
    children: [
      { label: "Women's Tops", slug: "women-tops", categories: ["Women's T-Shirts & Shirts", "Women's Tanks", "Women's Hoodies", "Women's Sweatshirts", "Women's Coats & Jackets"] },
      { label: "Women's Bottoms", slug: "women-bottoms", categories: ["Women's Trousers", "Women's Shorts"] },
      { label: "Women's Dresses", slug: "women-dresses", categories: ["Sleeveless Dresses", "Short Sleeve Dresses", "Half & Long Sleeve Dresses", "Short Skirts"] },
      { label: "Bodysuits & Jumpsuits", slug: "women-bodysuits", categories: ["Bodysuits", "Jumpsuits"] },
      { label: "Women's Outfits", slug: "women-outfits", categories: ["Casual Suits"] },
      { label: "Activewear", slug: "women-activewear", categories: ["Sports Bras", "Sports Sets", "Athletic Tops", "Yoga Pants", "Yoga Shorts", "Yoga Sets"] },
      { label: "Swimwear", slug: "women-swimwear", categories: ["Bikinis", "Tankinis", "One-Piece Swimwear", "Plus Size Swimwear", "Cover Ups", "Swimwear Accessories"] },
      { label: "Lingerie & Sleep", slug: "women-lingerie", categories: ["Women's Underwear", "Women's Lingerie", "Women's Loungewear", "Women's Sleepwear"] },
    ],
  },
  {
    label: "Unisex",
    slug: "unisex",
    children: [
      { label: "Apparel", slug: "unisex-apparel", categories: ["Unisex T-Shirts", "Unisex Crop Tops", "Unisex Leggings", "Unisex Hoodies", "Unisex Sweatshirts", "Unisex Jackets & Outerwear"] },
      { label: "Headwear", slug: "unisex-headwear", categories: ["Hats", "Beanies"] },
      { label: "Bags", slug: "unisex-bags", categories: ["Bags & Totes"] },
    ],
  },
  {
    label: "Accessories",
    slug: "accessories",
    children: [
      {
        label: "3C & Tech",
        slug: "accessories-tech",
        categories: ["AirPods Cases", "Tablet & Laptop Cases", "Gaming Accessories", "Watches & Bands", "Photography Accessories"],
        children: [
          { label: "Phone Cases", slug: "accessories-phone-cases", categories: ["Microfiber Cases", "Glass Cases", "Flip Cases", "TPU Cases", "Other Cases"] },
        ],
      },
      { label: "Caps & Hats", slug: "accessories-caps", categories: ["Baseball Caps", "Bucket Hats", "Beanies"] },
      { label: "Face & Neck", slug: "accessories-face", categories: ["Face Covers", "Scarves, Wraps & Stoles", "Ties"] },
      { label: "Jewelry & Ornaments", slug: "accessories-jewelry", categories: ["Badges", "Necklaces", "Keychains", "Key Holders"] },
      { label: "Eyewear", slug: "accessories-eyewear", categories: ["Eyewear Accessories"] },
      { label: "Hand & Arm", slug: "accessories-hand", categories: ["Arm Coolers & Warmers"] },
      { label: "Footwear", slug: "accessories-footwear", categories: ["Sports Shoes", "Slippers", "Boots", "Socks"] },
      { label: "Bags", slug: "accessories-bags", categories: ["Backpacks & Schoolbags", "Tote Bags", "Crossbody Bags", "Travel & Hand Bags", "Fanny Packs", "Wallets & Phone Bags", "Cosmetic & Toiletry Bags", "Lunch Bags", "Luggage", "Clutches", "Bucket Bags"] },
    ],
  },
  {
    label: "Beauty",
    slug: "beauty",
    categories: ["Face Care", "Body Care", "Hair Care", "Makeup", "Collection Boxes"],
  },
];

/* ─── Storefront Filters (facets) ─── */
export const FILTERS = {
  color: ["Black", "White", "Heather Grey", "Navy", "Cream", "Burgundy", "Forest", "Charcoal", "Sand", "Olive", "Wine", "Slate"],
  fit: ["Slim", "Regular", "Loose", "Oversized", "Cropped"],
  size: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  material: ["Cotton", "Tencel", "Denim", "Fleece", "Modal"],
  process: ["DTG", "DTF", "All-Over Printing", "Front Printing", "Back Printing", "Dual-Sided Printing"],
  design_type: [] as string[],
  product_feature: ["Eco-friendly", "UV Protection", "Premium", "Plus Sizes", "Zippers", "Kangaroo Pocket", "Windbreaker"],
  fulfillment_lead_time: ["In stock", "2 days or less", "4 days or less", "6 days or less", "7+ days"],
} as const;

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
    cover: cantnobodyAsset,
    merch: [
      { slug: "cn-hoodie-blk", name: "Can't Nobody Hoodie", price: 88, category: "Hoodies", sizes: ["S", "M", "L", "XL", "XXL"], colors: [BLACK, GRAY, CREAM], image: "", description: "Heavyweight fleece hoodie with embroidered album logo on chest.", stock: 24, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-tee-blk", name: "Can't Nobody Tee", price: 42, category: "T-Shirts", sizes: ["S", "M", "L", "XL", "XXL"], colors: [BLACK, WHITE, CREAM], image: "", description: "Premium cotton tee with puff-print album artwork.", stock: 48, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-sweater-navy", name: "Can't Nobody Crewneck", price: 78, category: "Sweatshirts", sizes: ["S", "M", "L", "XL"], colors: [NAVY, BURGUNDY, CHARCOAL], image: "", description: "Heavy-knit crewneck sweater with woven label on hem.", stock: 16, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-sweatpant", name: "Can't Nobody Sweatpant", price: 68, category: "Sweatpants", sizes: ["S", "M", "L", "XL"], colors: [BLACK, CHARCOAL, NAVY], image: "", description: "Relaxed-fit French terry sweatpant with embroidered detail.", stock: 20, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-jogger", name: "Can't Nobody Jogger", price: 72, category: "Sweatpants", sizes: ["S", "M", "L", "XL"], colors: [BLACK, OLIVE], image: "", description: "Tapered jogger with zip pockets and ribbed cuffs.", stock: 12, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-socks", name: "Can't Nobody Socks", price: 16, category: "Socks", sizes: ["One Size"], colors: [BLACK, WHITE], image: "", description: "Ribbed cotton-blend socks with album logo.", stock: 60, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-vinyl", name: "Can't Nobody Vinyl", price: 34, category: "Vinyl", sizes: [], colors: [BLACK], image: "", description: "Heavyweight vinyl with printed inner sleeve.", stock: 8, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-usb", name: "Can't Nobody USB", price: 28, category: "USB", sizes: [], colors: [BLACK], image: "", description: "USB drive loaded with the full album, bonus tracks, and digital artwork.", stock: 15, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-mug", name: "Can't Nobody Mug", price: 18, category: "Mugs", sizes: [], colors: [BLACK, WHITE], image: "", description: "Ceramic mug with wrap-around album artwork.", stock: 35, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-cup", name: "Can't Nobody Cup", price: 12, category: "Cups", sizes: [], colors: [BLACK, WHITE], image: "", description: "Double-wall insulated tumbler with lid.", stock: 40, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-hat", name: "Can't Nobody Dad Hat", price: 38, category: "Hats", sizes: ["One Size"], colors: [BLACK, CREAM, OLIVE], image: "", description: "Unstructured 6-panel dad hat with embroidered script.", stock: 0, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-poster", name: "Can't Nobody Poster", price: 25, category: "Posters", sizes: [], colors: [], image: "", description: "Gig poster on premium stock.", stock: 30, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
      { slug: "cn-bottle-opener", name: "Can't Nobody Bottle Opener", price: 12, category: "Keychains", sizes: [], colors: [BLACK], image: "", description: "Flat stainless steel bottle opener with laser engraving.", stock: 50, albumSlug: "cant-nobody-album", albumTitle: "Can't Nobody" },
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
      { slug: "al-sweater", name: "After Lyric Sweater", price: 78, category: "Sweatshirts", sizes: ["S", "M", "L", "XL"], colors: [CREAM, SLATE], image: "", description: "Cozy lambswool blend crewneck.", stock: 10, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-sweatpant", name: "After Lyric Sweatpant", price: 68, category: "Sweatpants", sizes: ["S", "M", "L", "XL"], colors: [CHARCOAL, NAVY], image: "", description: "French terry sweatpant with tonal embroidery.", stock: 14, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-jogger", name: "After Lyric Jogger", price: 72, category: "Sweatpants", sizes: ["S", "M", "L", "XL"], colors: [BLACK], image: "", description: "Tech-fabric jogger with reflective details.", stock: 8, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-pants", name: "After Lyric Cargo Pant", price: 85, category: "Trousers & Pants", sizes: ["S", "M", "L", "XL"], colors: [BLACK, OLIVE], image: "", description: "Relaxed cargo pant with utility pockets.", stock: 11, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-socks", name: "After Lyric Socks", price: 16, category: "Socks", sizes: ["One Size"], colors: [BLACK, CHARCOAL], image: "", description: "Cushioned athletic socks with lyric detail.", stock: 45, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-vinyl", name: "After Lyric Vinyl", price: 34, category: "Vinyl", sizes: [], colors: [BLACK], image: "", description: "Colored vinyl with gatefold sleeve.", stock: 5, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-usb", name: "After Lyric USB", price: 28, category: "USB", sizes: [], colors: [BLACK], image: "", description: "USB drive with the full EP, exclusive photos, and lyric PDF.", stock: 10, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-mug", name: "After Lyric Mug", price: 18, category: "Mugs", sizes: [], colors: [WHITE, CREAM], image: "", description: "Stoneware mug with debossed logo.", stock: 28, albumSlug: "after-lyric", albumTitle: "After Lyric" },
      { slug: "al-cup", name: "After Lyric Tumbler", price: 15, category: "Cups", sizes: [], colors: [BLACK, WHITE], image: "", description: "Insulated travel tumbler.", stock: 32, albumSlug: "after-lyric", albumTitle: "After Lyric" },
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
      { slug: "ml-sweater", name: "Man in My Life Cardigan", price: 95, category: "Sweatshirts", sizes: ["S", "M", "L", "XL"], colors: [CREAM, CHARCOAL], image: "", description: "Open-front knit cardigan with button closure.", stock: 7, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-sweatpant", name: "Man in My Life Sweatpant", price: 68, category: "Sweatpants", sizes: ["S", "M", "L", "XL"], colors: [BLACK, GRAY, WINE], image: "", description: "Matching set sweatpant with tonal drawstring.", stock: 15, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-pants", name: "Man in My Life Pant", price: 82, category: "Trousers & Pants", sizes: ["S", "M", "L", "XL"], colors: [BLACK, NAVY], image: "", description: "Wide-leg trouser in premium twill.", stock: 9, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-socks", name: "Man in My Life Socks", price: 16, category: "Socks", sizes: ["One Size"], colors: [WINE, BLACK, CREAM], image: "", description: "Cotton-blend dress socks.", stock: 38, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-vinyl", name: "Man in My Life Vinyl", price: 34, category: "Vinyl", sizes: [], colors: [BLACK], image: "", description: "Standard weight vinyl in printed sleeve.", stock: 12, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-usb", name: "Man in My Life USB", price: 28, category: "USB", sizes: [], colors: [BLACK], image: "", description: "USB drive with album, instrumentals, and behind-the-scenes content.", stock: 10, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-mug", name: "Man in My Life Mug", price: 18, category: "Mugs", sizes: [], colors: [BLACK, CREAM], image: "", description: "Matte black ceramic mug.", stock: 22, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-cup", name: "Man in My Life Cup", price: 12, category: "Cups", sizes: [], colors: [BLACK, WHITE], image: "", description: "Ceramic cup with hand-drawn lettering.", stock: 0, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-hat", name: "Man in My Life Dad Hat", price: 38, category: "Hats", sizes: ["One Size"], colors: [WINE, BLACK, SAND], image: "", description: "Distressed cotton twill hat.", stock: 17, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
      { slug: "ml-poster", name: "Man in My Life Poster", price: 25, category: "Posters", sizes: [], colors: [], image: "", description: "Lithograph poster.", stock: 20, albumSlug: "man-in-my-life", albumTitle: "Man in My Life" },
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
      { slug: "sj-sweater", name: "Story of My Journey Pullover", price: 78, category: "Sweatshirts", sizes: ["S", "M", "L", "XL"], colors: [FOREST, CREAM], image: "", description: "Half-zip fleece pullover with embroidered patch.", stock: 13, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
      { slug: "sj-sweatpant", name: "Story of My Journey Sweatpant", price: 68, category: "Sweatpants", sizes: ["S", "M", "L", "XL"], colors: [OLIVE, CHARCOAL, BLACK], image: "", description: "Relaxed-fit sweatpant with embroidered knee.", stock: 16, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
      { slug: "sj-jogger", name: "Story of My Journey Jogger", price: 72, category: "Sweatpants", sizes: ["S", "M", "L", "XL"], colors: [FOREST, BLACK], image: "", description: "Lightweight jogger with map lining.", stock: 10, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
      { slug: "sj-socks", name: "Story of My Journey Socks", price: 16, category: "Socks", sizes: ["One Size"], colors: [FOREST, CREAM, BLACK], image: "", description: "Merino wool blend socks.", stock: 50, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
      { slug: "sj-vinyl", name: "Story of My Journey Vinyl", price: 34, category: "Vinyl", sizes: [], colors: [BLACK], image: "", description: "Double LP with booklet.", stock: 6, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
      { slug: "sj-usb", name: "Story of My Journey USB", price: 28, category: "USB", sizes: [], colors: [BLACK], image: "", description: "USB drive with double album, making-of documentary, and liner notes.", stock: 8, albumSlug: "story-of-my-journey", albumTitle: "Story of My Journey" },
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
      { slug: "tl-sweater", name: "Tainted Love Sweater", price: 78, category: "Sweatshirts", sizes: ["S", "M", "L", "XL"], colors: [BURGUNDY, BLACK], image: "", description: "Turtleneck sweater in dark rose.", stock: 9, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-sweatpant", name: "Tainted Love Sweatpant", price: 68, category: "Sweatpants", sizes: ["S", "M", "L", "XL"], colors: [BLACK, CHARCOAL, BURGUNDY], image: "", description: "Matching set sweatpant with tonal details.", stock: 18, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-pants", name: "Tainted Love Pant", price: 82, category: "Trousers & Pants", sizes: ["S", "M", "L", "XL"], colors: [BLACK, CHARCOAL], image: "", description: "Straight-leg pant with hidden pocket.", stock: 7, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-socks", name: "Tainted Love Socks", price: 16, category: "Socks", sizes: ["One Size"], colors: [BURGUNDY, BLACK], image: "", description: "Ribbed ankle socks with heart detail.", stock: 42, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-vinyl", name: "Tainted Love Vinyl", price: 34, category: "Vinyl", sizes: [], colors: [BURGUNDY], image: "", description: "Colored vinyl in red/burgundy.", stock: 4, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-usb", name: "Tainted Love USB", price: 28, category: "USB", sizes: [], colors: [BLACK], image: "", description: "USB drive with the album, remixes, and photo gallery.", stock: 6, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-mug", name: "Tainted Love Mug", price: 18, category: "Mugs", sizes: [], colors: [BLACK, WHITE], image: "", description: "Matte black mug with red accent.", stock: 20, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-cup", name: "Tainted Love Cup", price: 15, category: "Cups", sizes: [], colors: [BURGUNDY, BLACK], image: "", description: "Ceramic cup with gold foil detail.", stock: 30, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-hat", name: "Tainted Love Dad Hat", price: 38, category: "Hats", sizes: ["One Size"], colors: [BLACK, BURGUNDY], image: "", description: "Washed twill hat with embroidered rose.", stock: 0, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-poster", name: "Tainted Love Poster", price: 25, category: "Posters", sizes: [], colors: [], image: "", description: "Dark art print on heavyweight stock.", stock: 15, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
      { slug: "tl-bottle-opener", name: "Tainted Love Keychain", price: 12, category: "Keychains", sizes: [], colors: [BLACK, BURGUNDY], image: "", description: "Bottle opener keychain with laser-cut heart.", stock: 0, albumSlug: "tainted-love", albumTitle: "Tainted Love" },
    ],
  },
];

/* ═══════════════════════════════════════════════════
   FULL CATALOG PRODUCTS — non-album merchandise
   Representative items spanning every leaf category.
   ═══════════════════════════════════════════════════ */
const _BLK: ColorSwatch = { name: "Black", hex: "#111" };
const _WHT: ColorSwatch = { name: "White", hex: "#F5F5F5" };
const _GRY: ColorSwatch = { name: "Gray", hex: "#6B6B6B" };
const _NVY: ColorSwatch = { name: "Navy", hex: "#1B2A4A" };
const _CRM: ColorSwatch = { name: "Cream", hex: "#E8DFD0" };

export const CATALOG_PRODUCTS: ShopProduct[] = [
  // Apparel > Tops - T-Shirts
  { slug: "wt0216", name: "Women's Regular Fit Crewneck T-Shirt", price: 6.99, category: "T-Shirts", sizes: ["S","M","L","XL","2XL"], colors: [_BLK, _WHT, _GRY], image: "", description: "Classic crewneck in soft cotton.", stock: 50, albumSlug: "", albumTitle: "Shop All" },
  { slug: "wt0050", name: "Essential Bodycon Crewneck T-Shirt", price: 6.99, category: "T-Shirts", sizes: ["S","M","L","XL"], colors: [_BLK, _WHT, _CRM], image: "", description: "Fitted bodycon silhouette.", stock: 45, albumSlug: "", albumTitle: "Shop All" },
  // Apparel > Tops - Tank Tops
  { slug: "wt0082", name: "Women's Tight Crewneck Crop Tank", price: 4.99, category: "Tank Tops & Camis", sizes: ["S","M","L","XL"], colors: [_BLK, _WHT], image: "", description: "Fitted crop tank in soft cotton.", stock: 60, albumSlug: "", albumTitle: "Shop All" },
  // Apparel > Tops - Hoodies
  { slug: "ww0003", name: "Essential Cropped Hoodie", price: 18.99, category: "Hoodies", sizes: ["S","M","L","XL"], colors: [_BLK, _GRY, _CRM], image: "", description: "Relaxed cropped hoodie in fleece.", stock: 25, albumSlug: "", albumTitle: "Shop All" },
  // Apparel > Tops - Sweatshirts
  { slug: "ww0004", name: "Essential Fleece Mock-Neck Crew", price: 16.99, category: "Sweatshirts", sizes: ["S","M","L"], colors: [_BLK, _GRY, _NVY], image: "", description: "Heavyweight fleece crewneck.", stock: 20, albumSlug: "", albumTitle: "Shop All" },
  // Apparel > Bottoms - Leggings
  { slug: "wb0013", name: "High-Waisted Yoga Leggings", price: 12.99, category: "Leggings", sizes: ["S","M","L","XL"], colors: [_BLK, _GRY], image: "", description: "High-waisted performance leggings.", stock: 35, albumSlug: "", albumTitle: "Shop All" },
  // Apparel > Bottoms - Sweatpants
  { slug: "wk0009", name: "Essential Straight-Leg Sweatpants", price: 12.99, category: "Sweatpants", sizes: ["XS","S","M","L"], colors: [_BLK, _GRY], image: "", description: "Classic straight-leg sweatpant.", stock: 30, albumSlug: "", albumTitle: "Shop All" },
  // Apparel > Bottoms - Skirts
  { slug: "wb0081", name: "Women's High Rise A-Line Skirt", price: 16.99, category: "Skirts", sizes: ["S","M","L","XL"], colors: [_BLK, _WHT], image: "", description: "Flattering A-line silhouette.", stock: 22, albumSlug: "", albumTitle: "Shop All" },
  // Apparel > Bottoms - Shorts
  { slug: "wb0014", name: "Women's Contrast Stripe Track Shorts", price: 12.99, category: "Shorts", sizes: ["S","M","L","XL"], colors: [_BLK, _NVY], image: "", description: "Athletic track shorts with stripe detail.", stock: 28, albumSlug: "", albumTitle: "Shop All" },
  // Apparel > Bottoms - Trousers
  { slug: "wb0089", name: "Women's Wide Leg Denim Jeans", price: 24.99, category: "Trousers & Pants", sizes: ["S","M","L","XL"], colors: [_BLK], image: "", description: "Wide-leg denim with high rise.", stock: 15, albumSlug: "", albumTitle: "Shop All" },
  // Apparel > Outerwear
  { slug: "wt0187", name: "Women's Mock-Neck Quarter-Zip", price: 22.99, category: "Coats & Jackets", sizes: ["S","M","L","XL"], colors: [_BLK, _NVY], image: "", description: "Quarter-zip outerwear layer.", stock: 12, albumSlug: "", albumTitle: "Shop All" },
  // Apparel > One-Pieces
  { slug: "wo0014", name: "Women's A-Line Sleeveless Dress", price: 22.99, category: "Bodysuits", sizes: ["S","M","L","XL"], colors: [_BLK, _WHT], image: "", description: "Clean A-line sleeveless design.", stock: 18, albumSlug: "", albumTitle: "Shop All" },
  { slug: "wo0018", name: "Women's U-Neck Yoga Romper", price: 19.99, category: "Rompers", sizes: ["S","M","L","XL"], colors: [_BLK, _GRY], image: "", description: "One-piece yoga romper.", stock: 14, albumSlug: "", albumTitle: "Shop All" },
  // Women's Tops
  { slug: "wt0218", name: "Women's Leopard Print Crop T-Shirt", price: 9.99, category: "Women's T-Shirts & Shirts", sizes: ["S","M","L","XL"], colors: [_BLK, _CRM], image: "", description: "Bold leopard print crop tee.", stock: 20, albumSlug: "", albumTitle: "Shop All" },
  { slug: "wt0200", name: "Women's Boatneck Raglan T-Shirt", price: 5.99, category: "Women's T-Shirts & Shirts", sizes: ["S","M","L","XL"], colors: [_BLK, _WHT], image: "", description: "Boatneck raglan sleeve tee.", stock: 40, albumSlug: "", albumTitle: "Shop All" },
  // Women's Tanks
  { slug: "wt0196", name: "Women's Crewneck Tank Top", price: 5.99, category: "Women's Tanks", sizes: ["S","M","L","XL"], colors: [_BLK, _WHT, _GRY], image: "", description: "Essential crewneck tank.", stock: 55, albumSlug: "", albumTitle: "Shop All" },
  // Women's Hoodies
  { slug: "wt0192", name: "Women's Mineral Washed Crop Hoodie", price: 24.99, category: "Women's Hoodies", sizes: ["S","M","L","XL"], colors: [_BLK, _GRY], image: "", description: "Mineral washed cropped hoodie.", stock: 10, albumSlug: "", albumTitle: "Shop All" },
  // Women's Sweatshirts
  { slug: "wt0212", name: "Women's Crop Collared Sweatshirt", price: 22.99, category: "Women's Sweatshirts", sizes: ["S","M","L","XL"], colors: [_BLK, _CRM], image: "", description: "Collared crop sweatshirt.", stock: 16, albumSlug: "", albumTitle: "Shop All" },
  // Women's Coats
  { slug: "wt0187b", name: "Women's Quarter-Zip Outerwear", price: 22.99, category: "Women's Coats & Jackets", sizes: ["S","M","L","XL"], colors: [_BLK, _NVY], image: "", description: "Lightweight quarter-zip layer.", stock: 8, albumSlug: "", albumTitle: "Shop All" },
  // Women's Trousers
  { slug: "wb0011", name: "Women's High-Rise Flared Jeans", price: 24.99, category: "Women's Trousers", sizes: ["S","M","L","XL"], colors: [_BLK], image: "", description: "High-rise flared denim.", stock: 12, albumSlug: "", albumTitle: "Shop All" },
  // Women's Shorts
  { slug: "wb0073", name: "Women's Drawstring Bermuda Shorts", price: 12.99, category: "Women's Shorts", sizes: ["S","M","L","XL"], colors: [_BLK, _WHT], image: "", description: "Relaxed drawstring bermuda.", stock: 20, albumSlug: "", albumTitle: "Shop All" },
  // Women's Dresses
  { slug: "wo0008", name: "Women's Collared Halter A-Line Tennis Dress", price: 12.99, category: "Sleeveless Dresses", sizes: ["S","M","L","XL"], colors: [_WHT, _BLK], image: "", description: "Halter A-line tennis dress.", stock: 18, albumSlug: "", albumTitle: "Shop All" },
  { slug: "wo0015", name: "Women's Ruched Sleeveless Full-Zip Dress", price: 26.99, category: "Sleeveless Dresses", sizes: ["S","M","L","XL"], colors: [_BLK, _GRY], image: "", description: "Full-zip ruched sleeveless dress.", stock: 10, albumSlug: "", albumTitle: "Shop All" },
  { slug: "ws0004", name: "High-Waist Pocketed A-Line Skirt", price: 14.99, category: "Short Skirts", sizes: ["S","M","L","XL"], colors: [_BLK, _NVY], image: "", description: "Mini skirt with pockets.", stock: 22, albumSlug: "", albumTitle: "Shop All" },
  // Women's Activewear
  { slug: "wt0125", name: "Women's V-Neck Yoga Sports Bra", price: 12.99, category: "Sports Bras", sizes: ["S","M","L","XL"], colors: [_BLK, _WHT, _GRY], image: "", description: "V-neck yoga sports bra.", stock: 30, albumSlug: "", albumTitle: "Shop All" },
  { slug: "wb0040", name: "Women's High Rise Topstitching Leggings", price: 14.99, category: "Yoga Pants", sizes: ["S","M","L","XL"], colors: [_BLK, _GRY], image: "", description: "Topstitching detail yoga leggings.", stock: 25, albumSlug: "", albumTitle: "Shop All" },
  { slug: "wb0038", name: "Women's High Rise Yoga Shorts", price: 9.99, category: "Yoga Shorts", sizes: ["S","M","L","XL"], colors: [_BLK, _NVY], image: "", description: "High-rise yoga shorts.", stock: 28, albumSlug: "", albumTitle: "Shop All" },
  { slug: "wt0074", name: "Strappy Criss-Cross Sports Bra", price: 9.99, category: "Sports Bras", sizes: ["S","M","L","XL"], colors: [_BLK, _WHT], image: "", description: "Strappy criss-cross design.", stock: 22, albumSlug: "", albumTitle: "Shop All" },
  { slug: "wb0076", name: "Women's Quarter-Zip Yoga Romper", price: 16.99, category: "Sports Sets", sizes: ["S","M","L","XL"], colors: [_BLK, _GRY], image: "", description: "Quarter-zip yoga romper set.", stock: 10, albumSlug: "", albumTitle: "Shop All" },
  { slug: "wt0181", name: "Women's Performance Crop T-Shirt", price: 6.99, category: "Athletic Tops", sizes: ["XS","S","M","L","XL"], colors: [_BLK, _WHT], image: "", description: "Performance crop athletic top.", stock: 35, albumSlug: "", albumTitle: "Shop All" },
  // Women's Swimwear
  { slug: "sw-bikini-1", name: "Classic Triangle Bikini Set", price: 19.99, category: "Bikinis", sizes: ["S","M","L"], colors: [_BLK, _WHT], image: "", description: "Triangle bikini two-piece set.", stock: 15, albumSlug: "", albumTitle: "Shop All" },
  { slug: "sw-tankini-1", name: "Ruched Tankini Set", price: 24.99, category: "Tankinis", sizes: ["S","M","L","XL"], colors: [_BLK, _NVY], image: "", description: "Ruched tankini swim set.", stock: 12, albumSlug: "", albumTitle: "Shop All" },
  { slug: "sw-coverup-1", name: "Mesh Fringed Cover Up", price: 16.99, category: "Cover Ups", sizes: ["S/M","L/XL"], colors: [_WHT, _BLK], image: "", description: "Mesh cover up with fringe.", stock: 18, albumSlug: "", albumTitle: "Shop All" },
  // Women's Lingerie & Sleep
  { slug: "ln-underwear-1", name: "Women's Cotton Brief 3-Pack", price: 12.99, category: "Women's Underwear", sizes: ["S","M","L","XL"], colors: [_BLK, _WHT, _GRY], image: "", description: "Cotton brief underwear 3-pack.", stock: 40, albumSlug: "", albumTitle: "Shop All" },
  { slug: "ln-loungewear-1", name: "Women's Ribbed Knit Loungewear Set", price: 29.99, category: "Women's Loungewear", sizes: ["S","M","L","XL"], colors: [_BLK, _CRM, _GRY], image: "", description: "Ribbed knit matching loungewear set.", stock: 14, albumSlug: "", albumTitle: "Shop All" },
  // Unisex
  { slug: "ux-tee-1", name: "Unisex Heavyweight Tee", price: 14.99, category: "Unisex T-Shirts", sizes: ["S","M","L","XL","2XL"], colors: [_BLK, _WHT, _GRY], image: "", description: "Heavyweight unisex tee.", stock: 50, albumSlug: "", albumTitle: "Shop All" },
  { slug: "ux-crop-1", name: "Unisex Boxie Crop Top", price: 12.99, category: "Unisex Crop Tops", sizes: ["S","M","L","XL"], colors: [_BLK, _WHT], image: "", description: "Boxy unisex crop top.", stock: 30, albumSlug: "", albumTitle: "Shop All" },
  { slug: "ux-hoodie-1", name: "Unisex Oversized Hoodie", price: 34.99, category: "Unisex Hoodies", sizes: ["S","M","L","XL","2XL"], colors: [_BLK, _GRY, _NVY], image: "", description: "Oversized unisex hoodie.", stock: 20, albumSlug: "", albumTitle: "Shop All" },
  { slug: "ux-sweat-1", name: "Unisex Crewneck Sweatshirt", price: 28.99, category: "Unisex Sweatshirts", sizes: ["S","M","L","XL"], colors: [_BLK, _GRY], image: "", description: "Classic unisex crewneck.", stock: 25, albumSlug: "", albumTitle: "Shop All" },
  { slug: "ux-jacket-1", name: "Unisex Windbreaker Jacket", price: 39.99, category: "Unisex Jackets & Outerwear", sizes: ["S","M","L","XL"], colors: [_BLK, _NVY], image: "", description: "Lightweight windbreaker.", stock: 15, albumSlug: "", albumTitle: "Shop All" },
  { slug: "ux-hat-1", name: "Unisex Classic Baseball Cap", price: 18.99, category: "Hats", sizes: ["One Size"], colors: [_BLK, _WHT, _CRM], image: "", description: "Adjustable baseball cap.", stock: 35, albumSlug: "", albumTitle: "Shop All" },
  { slug: "ux-beanie-1", name: "Unisex Ribbed Knit Beanie", price: 14.99, category: "Beanies", sizes: ["One Size"], colors: [_BLK, _GRY, _CRM], image: "", description: "Ribbed knit beanie.", stock: 40, albumSlug: "", albumTitle: "Shop All" },
  { slug: "ux-tote-1", name: "Unisex Canvas Tote Bag", price: 16.99, category: "Bags & Totes", sizes: [], colors: [_BLK, _WHT, _CRM], image: "", description: "Heavyweight canvas tote.", stock: 45, albumSlug: "", albumTitle: "Shop All" },
  // Accessories > 3C & Tech
  { slug: "tc-airpods-1", name: "Silicone AirPods Case", price: 8.99, category: "AirPods Cases", sizes: [], colors: [_BLK, _WHT, _CRM], image: "", description: "Protective silicone AirPods case.", stock: 60, albumSlug: "", albumTitle: "Shop All" },
  { slug: "tc-laptop-1", name: "Padded Laptop Sleeve", price: 19.99, category: "Tablet & Laptop Cases", sizes: [], colors: [_BLK, _GRY], image: "", description: "Padded laptop sleeve case.", stock: 20, albumSlug: "", albumTitle: "Shop All" },
  { slug: "tc-phone-1", name: "Clear Phone Case", price: 6.99, category: "TPU Cases", sizes: [], colors: [_BLK, _WHT], image: "", description: "Clear protective phone case.", stock: 80, albumSlug: "", albumTitle: "Shop All" },
  { slug: "tc-gaming-1", name: "Gaming Controller Grip", price: 12.99, category: "Gaming Accessories", sizes: [], colors: [_BLK, _GRY], image: "", description: "Controller grip accessory.", stock: 18, albumSlug: "", albumTitle: "Shop All" },
  { slug: "tc-watch-1", name: "Minimalist Watch Band", price: 9.99, category: "Watches & Bands", sizes: [], colors: [_BLK, _CRM, _NVY], image: "", description: "Minimalist watch band.", stock: 25, albumSlug: "", albumTitle: "Shop All" },
  // Accessories > Caps & Hats
  { slug: "ac-baseball-1", name: "Washed Cotton Baseball Cap", price: 14.99, category: "Baseball Caps", sizes: ["One Size"], colors: [_BLK, _CRM, _NVY], image: "", description: "Washed cotton baseball cap.", stock: 30, albumSlug: "", albumTitle: "Shop All" },
  { slug: "ac-bucket-1", name: "Reversible Bucket Hat", price: 16.99, category: "Bucket Hats", sizes: ["S/M","L/XL"], colors: [_BLK, _WHT, _GRY], image: "", description: "Reversible bucket hat.", stock: 22, albumSlug: "", albumTitle: "Shop All" },
  // Accessories > Face & Neck
  { slug: "fn-scarf-1", name: "Oversized Cashmere-Blend Scarf", price: 24.99, category: "Scarves, Wraps & Stoles", sizes: [], colors: [_BLK, _CRM, _GRY], image: "", description: "Oversized cashmere-blend scarf.", stock: 15, albumSlug: "", albumTitle: "Shop All" },
  { slug: "fn-face-1", name: "Patterned Face Cover 3-Pack", price: 8.99, category: "Face Covers", sizes: [], colors: [_BLK, _WHT], image: "", description: "Patterned reusable face covers.", stock: 50, albumSlug: "", albumTitle: "Shop All" },
  // Accessories > Jewelry
  { slug: "jw-badge-1", name: "Enamel Pin Badge", price: 6.99, category: "Badges", sizes: [], colors: [_BLK, _WHT], image: "", description: "Enamel pin badge.", stock: 40, albumSlug: "", albumTitle: "Shop All" },
  { slug: "jw-necklace-1", name: "Minimal Chain Necklace", price: 18.99, category: "Necklaces", sizes: [], colors: [_BLK, _GRY, _CRM], image: "", description: "Minimal chain necklace.", stock: 20, albumSlug: "", albumTitle: "Shop All" },
  { slug: "jw-keychain-1", name: "Metal Keychain", price: 7.99, category: "Keychains", sizes: [], colors: [_BLK, _GRY, _CRM], image: "", description: "Durable metal keychain.", stock: 55, albumSlug: "", albumTitle: "Shop All" },
  // Accessories > Footwear
  { slug: "fw-sport-1", name: "Lightweight Athletic Sneaker", price: 34.99, category: "Sports Shoes", sizes: ["5","6","7","8","9","10"], colors: [_BLK, _WHT, _GRY], image: "", description: "Lightweight athletic sneaker.", stock: 18, albumSlug: "", albumTitle: "Shop All" },
  { slug: "fw-boot-1", name: "Platform Chelsea Boot", price: 49.99, category: "Boots", sizes: ["5","6","7","8","9","10"], colors: [_BLK], image: "", description: "Platform Chelsea boot.", stock: 8, albumSlug: "", albumTitle: "Shop All" },
  { slug: "fw-slipper-1", name: "Faux Fur Slide Slipper", price: 14.99, category: "Slippers", sizes: ["5","6","7","8","9"], colors: [_BLK, _CRM], image: "", description: "Faux fur slide slipper.", stock: 25, albumSlug: "", albumTitle: "Shop All" },
  { slug: "fw-sock-1", name: "Performance Athletic Socks 3-Pack", price: 9.99, category: "Socks", sizes: ["One Size"], colors: [_BLK, _WHT], image: "", description: "Cushioned athletic socks.", stock: 60, albumSlug: "", albumTitle: "Shop All" },
  // Accessories > Bags
  { slug: "bg-backpack-1", name: "Classic Quilted Backpack", price: 29.99, category: "Backpacks & Schoolbags", sizes: [], colors: [_BLK, _GRY], image: "", description: "Quilted backpack with padded straps.", stock: 15, albumSlug: "", albumTitle: "Shop All" },
  { slug: "bg-tote-1", name: "Structured Leather Tote", price: 39.99, category: "Tote Bags", sizes: [], colors: [_BLK, _CRM, _NVY], image: "", description: "Structured leather tote bag.", stock: 12, albumSlug: "", albumTitle: "Shop All" },
  { slug: "bg-crossbody-1", name: "Chain Strap Crossbody Bag", price: 24.99, category: "Crossbody Bags", sizes: [], colors: [_BLK, _CRM], image: "", description: "Chain strap crossbody bag.", stock: 18, albumSlug: "", albumTitle: "Shop All" },
  { slug: "bg-fanny-1", name: "Nylon Fanny Pack", price: 14.99, category: "Fanny Packs", sizes: [], colors: [_BLK, _GRY], image: "", description: "Lightweight nylon fanny pack.", stock: 30, albumSlug: "", albumTitle: "Shop All" },
  { slug: "bg-wallet-1", name: "Slim Bifold Wallet", price: 16.99, category: "Wallets & Phone Bags", sizes: [], colors: [_BLK, _CRM], image: "", description: "Slim bifold leather wallet.", stock: 22, albumSlug: "", albumTitle: "Shop All" },
  { slug: "bg-cosmetic-1", name: "Zip Cosmetic Pouch", price: 9.99, category: "Cosmetic & Toiletry Bags", sizes: [], colors: [_BLK, _CRM, _WHT], image: "", description: "Zip-close cosmetic pouch.", stock: 35, albumSlug: "", albumTitle: "Shop All" },
  { slug: "bg-luggage-1", name: "Hardshell Carry-On Suitcase", price: 69.99, category: "Luggage", sizes: [], colors: [_BLK, _GRY], image: "", description: "Hardshell carry-on suitcase.", stock: 6, albumSlug: "", albumTitle: "Shop All" },
  { slug: "bg-clutch-1", name: "Minimalist Clutch", price: 19.99, category: "Clutches", sizes: [], colors: [_BLK, _CRM, _NVY], image: "", description: "Minimalist evening clutch.", stock: 14, albumSlug: "", albumTitle: "Shop All" },
  { slug: "bg-bucket-1", name: "Structured Bucket Bag", price: 28.99, category: "Bucket Bags", sizes: [], colors: [_BLK, _CRM], image: "", description: "Structured bucket bag.", stock: 10, albumSlug: "", albumTitle: "Shop All" },
  // Beauty
  { slug: "by-face-1", name: "Peptide Ageless AM/PM Cream", price: 12.50, category: "Face Care", sizes: [], colors: [], image: "", description: "Anti-age peptide cream.", stock: 25, albumSlug: "", albumTitle: "Shop All" },
  { slug: "by-face-2", name: "Anti-Age Hydrogel Eye Patches", price: 16.35, category: "Face Care", sizes: [], colors: [], image: "", description: "Niacinamide hydrogel eye patches.", stock: 20, albumSlug: "", albumTitle: "Shop All" },
  { slug: "by-body-1", name: "5% Urea + 2% Panthenol Body Cream", price: 16.40, category: "Body Care", sizes: [], colors: [], image: "", description: "Hydrating body cream.", stock: 18, albumSlug: "", albumTitle: "Shop All" },
  { slug: "by-hair-1", name: "Argan Oil Hair Treatment", price: 14.99, category: "Hair Care", sizes: [], colors: [], image: "", description: "Nourishing argan oil treatment.", stock: 22, albumSlug: "", albumTitle: "Shop All" },
  { slug: "by-makeup-1", name: "Matte Lipstick Collection", price: 11.99, category: "Makeup", sizes: [], colors: [], image: "", description: "Long-wear matte lipsticks.", stock: 30, albumSlug: "", albumTitle: "Shop All" },
  { slug: "by-box-1", name: "Anti-Age Peptide Collection Box", price: 48.30, category: "Collection Boxes", sizes: [], colors: [], image: "", description: "3-product anti-age collection.", stock: 8, albumSlug: "", albumTitle: "Shop All" },
];

/* Flat list of all products — enriched with sizeType and availability */
export const ALL_PRODUCTS: EnrichedProduct[] = (() => {
  const albumProducts = SHOP_ALBUMS.flatMap((a) =>
    a.merch.map((m) => ({ ...m, albumSlug: a.slug, albumTitle: a.title }))
  );
  return [...albumProducts, ...CATALOG_PRODUCTS].map(enrichProduct);
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
