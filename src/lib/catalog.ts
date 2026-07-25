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

/* ---- SHOP ALBUMS ---- */

export type AlbumMerchProduct = {
  slug: string;
  name: string;
  price: number;
  category: "Clothes" | "Product" | "Cups" | "Mugs" | "Hats" | "Bottle Openers";
  sizes: string[];
  image: string;
  available: boolean;
};

export type Album = {
  slug: string;
  title: string;
  releaseDate: string;
  duration: string;
  description: string;
  quote: string;
  singleTitle?: string;
  cover: string;
  merch: AlbumMerchProduct[];
};

export const ALBUMS: Album[] = [
  {
    slug: "cant-nobody-album",
    title: "Can't Nobody",
    releaseDate: "March 2022",
    duration: "42:18",
    description: "The debut album that introduced Adea Lyric to the world. Raw, unfiltered, and deeply rooted in West Philadelphia.",
    quote: "\"Every word is a weapon, every note is a prayer.\"",
    singleTitle: "Can't Nobody",
    cover: cantnobodyAsset,
    merch: [
      { slug: "cn-hoodie", name: "Can't Nobody Hoodie", price: 88, category: "Clothes", sizes: ["S", "M", "L", "XL"], image: "", available: true },
      { slug: "cn-tee", name: "Can't Nobody Tee", price: 42, category: "Clothes", sizes: ["S", "M", "L", "XL"], image: "", available: true },
      { slug: "cn-vinyl", name: "Can't Nobody Vinyl", price: 34, category: "Product", sizes: [], image: "", available: true },
      { slug: "cn-mug", name: "Can't Nobody Mug", price: 18, category: "Mugs", sizes: [], image: "", available: true },
      { slug: "cn-poster", name: "Can't Nobody Poster", price: 25, category: "Product", sizes: [], image: "", available: true },
      { slug: "cn-hat", name: "Can't Nobody Dad Hat", price: 38, category: "Hats", sizes: ["One Size"], image: "", available: false },
      { slug: "cn-cup", name: "Can't Nobody Cup", price: 15, category: "Cups", sizes: [], image: "", available: true },
      { slug: "cn-tote", name: "Can't Nobody Tote", price: 22, category: "Product", sizes: [], image: "", available: true },
      { slug: "cn-bottle-opener", name: "Can't Nobody Bottle Opener", price: 12, category: "Bottle Openers", sizes: [], image: "", available: true },
    ],
  },
  {
    slug: "after-lyric",
    title: "After Lyric",
    releaseDate: "January 2023",
    duration: "48:35",
    description: "The sophomore record. A deeper cut into the psyche — love, loss, and everything that comes after the bars fade.",
    quote: "\"After the lyric, the silence speaks louder.\"",
    singleTitle: "Fuck Boi",
    cover: philly2,
    merch: [
      { slug: "al-hoodie", name: "After Lyric Hoodie", price: 88, category: "Clothes", sizes: ["S", "M", "L", "XL"], image: "", available: true },
      { slug: "al-tee", name: "After Lyric Tee", price: 42, category: "Clothes", sizes: ["S", "M", "L", "XL"], image: "", available: true },
      { slug: "al-vinyl", name: "After Lyric Vinyl", price: 34, category: "Product", sizes: [], image: "", available: true },
      { slug: "al-mug", name: "After Lyric Mug", price: 18, category: "Mugs", sizes: [], image: "", available: true },
      { slug: "al-poster", name: "After Lyric Poster", price: 25, category: "Product", sizes: [], image: "", available: false },
      { slug: "al-hat", name: "After Lyric Dad Hat", price: 38, category: "Hats", sizes: ["One Size"], image: "", available: true },
      { slug: "al-cup", name: "After Lyric Cup", price: 15, category: "Cups", sizes: [], image: "", available: true },
      { slug: "al-tote", name: "After Lyric Tote", price: 22, category: "Product", sizes: [], image: "", available: true },
      { slug: "al-bottle-opener", name: "After Lyric Bottle Opener", price: 12, category: "Bottle Openers", sizes: [], image: "", available: true },
    ],
  },
  {
    slug: "man-in-my-life",
    title: "Man in My Life",
    releaseDate: "July 2023",
    duration: "45:52",
    description: "An exploration of relationships, loyalty, and the men who shaped the narrative. Honest and unapologetic.",
    quote: "\"You don't choose who changes you — they just do.\"",
    singleTitle: "Side N****a",
    cover: philly3,
    merch: [
      { slug: "ml-hoodie", name: "Man in My Life Hoodie", price: 88, category: "Clothes", sizes: ["S", "M", "L", "XL"], image: "", available: true },
      { slug: "ml-tee", name: "Man in My Life Tee", price: 42, category: "Clothes", sizes: ["S", "M", "L", "XL"], image: "", available: false },
      { slug: "ml-vinyl", name: "Man in My Life Vinyl", price: 34, category: "Product", sizes: [], image: "", available: true },
      { slug: "ml-mug", name: "Man in My Life Mug", price: 18, category: "Mugs", sizes: [], image: "", available: true },
      { slug: "ml-poster", name: "Man in My Life Poster", price: 25, category: "Product", sizes: [], image: "", available: true },
      { slug: "ml-hat", name: "Man in My Life Dad Hat", price: 38, category: "Hats", sizes: ["One Size"], image: "", available: true },
      { slug: "ml-cup", name: "Man in My Life Cup", price: 15, category: "Cups", sizes: [], image: "", available: true },
      { slug: "ml-tote", name: "Man in My Life Tote", price: 22, category: "Product", sizes: [], image: "", available: false },
    ],
  },
  {
    slug: "story-of-my-journey",
    title: "Story of My Journey",
    releaseDate: "November 2023",
    duration: "51:07",
    description: "A sonic autobiography. From the corners of West Philly to stages worldwide — every chapter told in verse.",
    quote: "\"The journey doesn't end — it just finds new streets.\"",
    singleTitle: "Drink on the Beach",
    cover: philly1,
    merch: [
      { slug: "sj-hoodie", name: "Story of My Journey Hoodie", price: 88, category: "Clothes", sizes: ["S", "M", "L", "XL"], image: "", available: true },
      { slug: "sj-tee", name: "Story of My Journey Tee", price: 42, category: "Clothes", sizes: ["S", "M", "L", "XL"], image: "", available: true },
      { slug: "sj-vinyl", name: "Story of My Journey Vinyl", price: 34, category: "Product", sizes: [], image: "", available: true },
      { slug: "sj-mug", name: "Story of My Journey Mug", price: 18, category: "Mugs", sizes: [], image: "", available: true },
      { slug: "sj-poster", name: "Story of My Journey Poster", price: 25, category: "Product", sizes: [], image: "", available: true },
      { slug: "sj-hat", name: "Story of My Journey Dad Hat", price: 38, category: "Hats", sizes: ["One Size"], image: "", available: true },
      { slug: "sj-cup", name: "Story of My Journey Cup", price: 15, category: "Cups", sizes: [], image: "", available: false },
      { slug: "sj-tote", name: "Story of My Journey Tote", price: 22, category: "Product", sizes: [], image: "", available: true },
    ],
  },
  {
    slug: "tainted-love",
    title: "Tainted Love",
    releaseDate: "May 2024",
    duration: "39:44",
    description: "The aftermath of devotion. A darker, more vulnerable record that strips away the armor.",
    quote: "\"Love is the wound that keeps teaching you how to heal.\"",
    cover: fkboiAsset,
    merch: [
      { slug: "tl-hoodie", name: "Tainted Love Hoodie", price: 88, category: "Clothes", sizes: ["S", "M", "L", "XL"], image: "", available: true },
      { slug: "tl-tee", name: "Tainted Love Tee", price: 42, category: "Clothes", sizes: ["S", "M", "L", "XL"], image: "", available: true },
      { slug: "tl-vinyl", name: "Tainted Love Vinyl", price: 34, category: "Product", sizes: [], image: "", available: true },
      { slug: "tl-mug", name: "Tainted Love Mug", price: 18, category: "Mugs", sizes: [], image: "", available: true },
      { slug: "tl-poster", name: "Tainted Love Poster", price: 25, category: "Product", sizes: [], image: "", available: true },
      { slug: "tl-hat", name: "Tainted Love Dad Hat", price: 38, category: "Hats", sizes: ["One Size"], image: "", available: false },
      { slug: "tl-cup", name: "Tainted Love Cup", price: 15, category: "Cups", sizes: [], image: "", available: true },
      { slug: "tl-tote", name: "Tainted Love Tote", price: 22, category: "Product", sizes: [], image: "", available: true },
      { slug: "tl-bottle-opener", name: "Tainted Love Bottle Opener", price: 12, category: "Bottle Openers", sizes: [], image: "", available: false },
    ],
  },
];

export const TOUR = [
  { date: "OCT 12", city: "Philadelphia, PA", venue: "The Fillmore", status: "On Sale" },
  { date: "OCT 19", city: "New York, NY", venue: "Bowery Ballroom", status: "On Sale" },
  { date: "OCT 26", city: "Washington, DC", venue: "9:30 Club", status: "Low" },
  { date: "NOV 02", city: "Boston, MA", venue: "Royale", status: "On Sale" },
  { date: "NOV 09", city: "Atlanta, GA", venue: "Terminal West", status: "On Sale" },
  { date: "NOV 16", city: "Chicago, IL", venue: "Thalia Hall", status: "Sold Out" },
  { date: "NOV 23", city: "Los Angeles, CA", venue: "The Novo", status: "On Sale" },
];
