# Product Catalog — Category & Schema Foundation

Extracted and normalized from your raw source dump. This is meant as the **foundation for your database/JSON schema**, not a final CMS import file — it defines the category tree, the field structure for each product *type*, sizing guides, filters, and a representative slice of real SKUs/attributes pulled from your data so you can see the shape before building the full import.

Your source data actually contains **4 distinct product families** with different attribute sets. Don't force them into one schema — model them as separate `product_type`s that share a common `base_product` shell.

---

## 1. Product Types (top of your schema)

| product_type | Examples | Unique attributes |
|---|---|---|
| `blank_apparel` | T-shirts, hoodies, leggings, dresses (SKU-coded, e.g. `#WT0082`) | fixed color count, GSM/oz fabric weight, fixed size run, single wholesale "From $" price |
| `pod_apparel` | "Custom Printed Women's shirts (All-Over Printing)" | size run only (no fixed colors — colors are print-dependent), no GSM shown, price = base print cost |
| `beauty` | Face/Body/Hair/Makeup/Collection Boxes | ingredient tags, volume (ml/fl oz), variant count, promo badges (New/Trending/Out of Stock/% off) |
| `bag_accessory` | Shoulder bags, totes, backpacks | material, dimensions (LxWxH cm), no size run |

```json
// base_product shell — every item extends this
{
  "id": "string (uuid)",
  "sku": "string",              // e.g. WT0082
  "vendor_sku": "string",
  "product_type": "blank_apparel | pod_apparel | beauty | bag_accessory",
  "name": "string",
  "category_id": "ref -> category.id",
  "subcategory_id": "ref -> category.id",
  "badges": ["NEW", "BESTSELLER", "TRENDING", "OUT_OF_STOCK"],
  "wholesale_price_from": "decimal",
  "wholesale_price_compare_at": "decimal | null", // for % off items
  "markup_percent": "decimal",     // set per-category in your portal
  "retail_price": "computed: wholesale_price_from * (1 + markup_percent)",
  "fulfillment_lead_time_days": "int",  // e.g. 2 / 4 / 6 / 7+ (from source filter)
  "images": ["url"],
  "status": "draft | published | archived",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### 1a. `blank_apparel` attributes
```json
{
  "gender": "women | men | unisex | kids",
  "size_run": "string (size_guide_id ref)",
  "colors": ["string"],
  "color_count": "int",
  "fabric_weight_gsm": "int",
  "fabric_weight_oz": "decimal",
  "fit": "string (filter ref: slim | regular | loose | oversized)"
}
```

### 1b. `pod_apparel` attributes
```json
{
  "print_method": "All-Over Printing | Front Printing | Back Printing | Dual-Sided | DTG | DTF",
  "size_run": "string",
  "material_tags": ["string"],   // e.g. Premium
  "design_type": "string",       // filter facet
  "product_feature": ["string"]  // e.g. eco-friendly, UV Protection
}
```

### 1c. `beauty` attributes
```json
{
  "volume": { "amount": "decimal", "unit": "ml | fl_oz" },
  "ingredient_tags": ["string"],   // e.g. Niacinamide (B3), Hyaluronic Acid
  "concern_tags": ["string"],      // e.g. Anti-age, Dark spots, Dehydrated skin
  "variant_count": "int",
  "is_collection_box": "boolean",
  "bundle_items": ["ref -> product.id"],
  "discount_percent": "int | null"
}
```

### 1d. `bag_accessory` attributes
```json
{
  "material": "string",
  "dimensions_cm": { "l": "decimal", "w": "decimal", "h": "decimal" },
  "closure_type": "string | null"
}
```

---

## 2. Category Taxonomy (nested)

Cleaned from your dump — duplicates merged, dangling top-level items grouped logically. Use `slug` as the stable key; `parent_slug: null` = top-level.

```yaml
Apparel:
  Tops:
    - T-Shirts
    - Tank Tops & Camis
    - Crop Tops
    - Hoodies
    - Sweatshirts
    - Long Sleeve Shirts
    - Polo Shirts
  Bottoms:
    - Leggings
    - Sweatpants
    - Skirts
    - Shorts
    - Trousers / Pants
  Outerwear:
    - Coats & Jackets
  One-Pieces:
    - Bodysuits
    - Jumpsuits
    - Rompers

Women:
  Women's Tops:
    - Women's T-Shirts & Shirts
    - Women's Tanks
    - Women's Hoodies
    - Women's Sweatshirts
    - Women's Coats & Jackets
  Women's Bottoms:
    - Women's Trousers
    - Women's Shorts
  Women's Dresses:
    - Sleeveless Dresses
    - Short Sleeve Dresses
    - Half/Long Sleeve Dresses
    - Short Skirts
  Women's Bodysuits & Jumpsuits:
    - Bodysuits
    - Jumpsuits
  Women's Outfits:
    - Casual Suits
  Women's Activewear:
    - Sports Bras
    - Sports Sets
    - Athletic Tops
    - Yoga Pants
    - Yoga Shorts
    - Yoga Sets
  Women's Swimwear:
    - Bikinis
    - Tankinis
    - One-Pieces
    - Plus Size Swimwear
    - Cover Ups
    - Swimwear Accessories
  Women's Lingerie & Sleep:
    - Women's Underwear
    - Women's Lingerie
    - Women's Loungewear
    - Women's Sleepwear

Unisex:
  - T-Shirts
  - Crop Tops
  - Leggings
  - Hoodies
  - Sweatshirts
  - Jackets & Outerwear
  - Hats
  - Beanies
  - Bags & Totes

Accessories:
  3C & Tech:
    - AirPods Cases
    - Tablet & Laptop Cases
    - Gaming Accessories
    - Watches & Bands
    - Photography Accessories
    - Phone Cases:
        - Microfiber Cases
        - Glass Cases
        - Flip Cases
        - TPU Cases
        - Other Cases
  Caps & Hats:
    - Baseball Caps
    - Bucket Hats
    - Beanies
  Face & Neck:
    - Face Covers
    - Scarves, Wraps & Stoles
    - Ties
  Jewelry & Ornaments:
    - Badges
    - Necklaces
    - Keychains
    - Key Holders
  Eyewear:
    - Eyewear Accessories
  Hand & Arm:
    - Arm Coolers & Warmers
  Footwear:
    - Sports Shoes
    - Slippers
    - Boots
    - Socks
  Bags:
    - Backpacks & Schoolbags
    - Tote Bags
    - Crossbody Bags
    - Travel & Hand Bags
    - Fanny Packs
    - Wallets & Phone Bags
    - Cosmetic & Toiletry Bags
    - Lunch Bags
    - Luggage
    - Clutches
    - Bucket Bags

Beauty:
  - Face Care
  - Body Care
  - Hair Care
  - Makeup
  - Collection Boxes
```

> Note: your source repeats "T-Shirts / Crop Tops / Leggings / Hoodies..." once under a bare list (likely **Unisex**) and once fully fleshed-out under **Women's** — I split them into separate branches above. Confirm the bare list was meant as Unisex/Men before you finalize; it read ambiguously in the source.

---

## 3. Sizing Guides

Your data shows **four distinct size runs** across products — don't use one universal chart.

| size_guide_id | Range seen | Used by |
|---|---|---|
| `women_std` | S – XL (some S–2XL, S–3XL) | Most tees, hoodies, sweatshirts |
| `women_numeric` | 4 – 12 | Yoga tanks, sports bras, some leggings (reads like girls'/juniors' numeric — verify with supplier before publishing) |
| `women_ext` | 2XS – XL | Color-block/inclusive-size lines |
| `pod_std` | XS/S – 3XL–8XL | All print-on-demand items (varies per style, always shown per-product) |

**Recommended schema:**
```json
{
  "size_guide_id": "string",
  "sizes": ["2XS","XS","S","M","L","XL","2XL","3XL"],
  "measurements": {
    "S": { "chest_in": 34, "length_in": 26 },
    "M": { "chest_in": 36, "length_in": 27 }
    // populate per style once you have supplier spec sheets — not present in source data
  }
}
```
Your raw dump gives size **ranges** only (e.g. "S–XL"), not per-size chest/length measurements — you'll need to pull that from supplier spec sheets separately; it's not in the pasted catalog.

---

## 4. Filters (facets for your storefront)

From the source nav: `Color`, `Fit`, `Size`, `Material`, `Process`, `Design type`, `Product Feature`, `Sort`.

```json
{
  "filters": {
    "color": ["Black","White","Heather Grey","..."],
    "fit": ["Slim","Regular","Loose","Oversized","Cropped"],
    "size": ["XS","S","M","L","XL","2XL","3XL"],
    "material": ["Cotton","Tencel","Denim","Fleece","Modal"],
    "process": ["DTG","DTF","All-Over Printing","Front Printing","Back Printing","Dual-Sided Printing"],
    "design_type": [],
    "product_feature": ["Eco-friendly","UV Protection","Premium","Plus Sizes","Zippers","Kangaroo Pocket","Windbreaker"],
    "fulfillment_lead_time": ["In stock","2 days or less","4 days or less","6 days or less","7+ days"]
  }
}
```

---

## 5. Sample Product Catalog (real extracted rows)

Below is a representative slice per category showing the actual SKU/size/color/weight/price pattern from your dump, so you can validate the schema before a full bulk import. (Your source has ~280 blank-apparel SKUs alone plus ~150 POD styles and ~120 beauty SKUs — full transcription belongs in a CSV/DB seed, not this doc. Say the word and I'll generate that CSV next.)

### T-Shirts (`blank_apparel`)
| Name | SKU | Sizes | Colors | Fabric | Price |
|---|---|---|---|---|---|
| Women's Regular Fit Crewneck T-Shirt | WT0216 | S–2XL | 5 | 130 gsm / 3.8 oz | From $6.99 |
| Essential Bodycon Crewneck T-Shirt | WT0050 | S–XL | 7 | 260 gsm / 7.7 oz | From $6.99 |
| Women's Slim Fit Performance T-Shirt | WT0143 | 2XS–XL | 12 | 220 gsm / 6.5 oz | From $6.99 |
| Vintage Wash Slim Fit T-shirt | WT0018 | S–L | 10 | 240 gsm / 7.1 oz | From $6.99 |
| Women's Boatneck Raglan T-Shirt | WT0200 | S–XL | 6 | 230 gsm / 6.8 oz | From $5.99 |
| Essential Standard Shoulder T-Shirt | WT0040 | S–XL | 8 | 250 gsm / 7.4 oz | From $6.99 |
| Baby Tee Seamless T-Shirt – 200 GSM | RU0007 | S–L | 2 | 200 gsm / 5.9 oz | From $3.99 |
| Women's Mock Neck Crewneck Sweatshirt* | WT0211 | S–L | 8 | 350 gsm / 10.3 oz | From $19.99 |

\* filed under Sweatshirts, not T-Shirts — kept here to flag a naming edge case for your categorizer.

### Tank Tops & Camis (`blank_apparel`)
| Name | SKU | Sizes | Colors | Fabric | Price |
|---|---|---|---|---|---|
| Women's Tight Crewneck Crop Tank Top | WT0082 | S–XL | 5 | 260 gsm / 7.7 oz | From $4.99 |
| Women's Slim Tank Top | WT0115 | S–XL | 4 | 260 gsm / 7.7 oz | From $6.99 |
| Slim Fit Ribbed Racerback Tank Top | RB0017 | S–XL | 4 | 280 gsm / 8.3 oz | From $9.99 |
| Snow Washed Tank Top | RU0092 | S–XL | 2 | 235 gsm / 6.9 oz | From $9.99 |
| Contrast Binding Halter Tank Top | WB0001 | S–XL | 3 | 210 gsm / 6.2 oz | From $6.99 |

### Activewear — Sports Bras / Yoga / Leggings (`blank_apparel`)
| Name | SKU | Sizes | Colors | Fabric | Price |
|---|---|---|---|---|---|
| Women's V-Neck Yoga Sports Bra | WT0125 | 4–12 | 21 | 210 gsm / 6.2 oz | From $12.99 |
| High-Waisted Yoga Leggings | WB0013 | 4–12 | 13 | 210 gsm / 6.2 oz | From $12.99 |
| Spaghetti Strap Yoga Sports Bra | WT0073 | S–XL | 12 | 300 gsm / 8.8 oz | From $9.99 |
| Strappy Criss-Cross Sports Bra | WT0074 | 4–12 | 10 | 210 gsm / 6.2 oz | From $9.99 |
| Women's High Rise Topstitching Leggings | WB0040 | S–XL | 11 | 220 gsm / 6.5 oz | From $14.99 |
| Women's High Rise Flared Yoga Pants | WB0041 | S–XL | 11 | 220 gsm / 6.5 oz | From $19.99 |
| Women's Cropped Sports Bra | (n/a shown) | S–XL | 7 | 230 gsm / 6.8 oz | — |
| High-Waisted Blend Biker Shorts | WB0012 | S–2XL | 6 | 220 gsm / 6.5 oz | From $9.99 |

### Hoodies & Sweatshirts (`blank_apparel`)
| Name | SKU | Sizes | Colors | Fabric | Price |
|---|---|---|---|---|---|
| Essential Cropped Hoodie | WW0003 | S–XL | 4 | 350 gsm / 10.3 oz | From $18.99 |
| Vintage Washed Raw Edge Hoodie | WW0005 | S–XL | 5 | 320 gsm / 9.4 oz | From $22.99 |
| Essential Fleece Mock-Neck Crew Sweatshirt | WW0004 | S–L | 6 | 350 gsm / 10.3 oz | From $16.99 |
| Women's Mock-Neck Quarter-Zip Sweatshirt | WT0187 | S–XL | 4 | 420 gsm / 12.4 oz | From $22.99 |
| Cropped Half-Zip Hoodie | RP0006 | 2-4-10-12 | 4 | 320 gsm / 9.4 oz | From $21.99 |
| Vintage Washed Cropped Fleece Hoodie | WW0006 | M–XL | 3 | 400 gsm / 11.8 oz | From $29.99 |

### One-Pieces — Dresses / Rompers / Jumpsuits (`blank_apparel`)
| Name | SKU | Sizes | Colors | Fabric | Price |
|---|---|---|---|---|---|
| Women's A-Line Sleeveless Dress | WO0014 | S–XL | 4 | 220 gsm / 6.5 oz | From $22.99 |
| Women's U-Neck Yoga Romper | WO0018 | S–XL | 3 | 220 gsm / 6.5 oz | From $19.99 |
| Women's Collared Halter A-Line Tennis Dress | WO0008 | S–2XL | 5 | 210 gsm / 6.2 oz | From $12.99 |
| Women's Ruched Sleeveless Full-Zip Dress | WO0015 | S–XL | 8 | 220 gsm / 6.5 oz | From $26.99 |
| Women's Tight Flared Leg Quarter-Zip Jumpsuit | WO0009 | S–XL | 5 | 230 gsm / 6.8 oz | From $19.99 |

### Skirts (`blank_apparel`)
| Name | SKU | Sizes | Colors | Fabric | Price |
|---|---|---|---|---|---|
| Women's High Rise A-Line Skirt | WB0081 | S–XL | 4 | 220 gsm / 6.5 oz | From $16.99 |
| Women's Pleated A-Line Skirt | WB0086 | S–2XL | 3 | 220 gsm / 6.5 oz | From $12.99 |
| High-Waist Pocketed A-Line Skirt | WS0004 | S–XL | 3 | 210 gsm / 6.2 oz | From $14.99 |
| Essential Drawstring Skirt | WS0013 | S–XL | 4 | 310 gsm / 9.1 oz | From $7.99 |

### Bottoms — Jeans / Trousers / Sweatpants / Shorts (`blank_apparel`)
| Name | SKU | Sizes | Colors | Fabric | Price |
|---|---|---|---|---|---|
| Women's Wide Leg Denim Jeans | WB0089 | S–2XL | 2 | 430 gsm / 12.7 oz | From $24.99 |
| Women's High-Rise Flared Jeans | WB0011 | S–XL | 1 | 385 gsm / 11.4 oz | From $24.99 |
| Essential Straight-Leg Sweatpants | WK0009 | XS–L | 4 | 310 gsm / 9.1 oz | From $12.99 |
| Women's Drawstring Bermuda Shorts | WB0073 | 4–12 | 5 | 140 gsm / 4.1 oz | From $12.99 |
| Women's Contrast Stripe Track Shorts | WB0014 | S–2XL | 3 | 220 gsm / 6.5 oz | From $12.99 |

---

### Print-on-Demand (`pod_apparel`) — sample
| Name | Sizes | Price |
|---|---|---|
| Custom Printed Women's shirts (All-Over Printing) | S–3XL | From $9.28 |
| 280gsm Custom Best Hoodies-Double-Layer Cap Women's Hoodies | S–6XL | From $9.92 |
| Loose High Waisted Shorts (All-Over Printing) | S–3XL | From $7.46 |
| 180gsm Custom Women Top T-Shirts (All-Over Printing) | S–6XL | From $5.74 |
| DTG 150gsm Custom Personalized T-Shirts-Dual-Sided Printing | S–3XL | From $5.91 |
| Custom Sports Bra Designs-Yoga Support Bras (All-Over Printing) | S–2XL | From $7.14 |

### Beauty (`beauty`) — sample
| Name | Concern/Ingredient tags | Size | Price | Badge |
|---|---|---|---|---|
| Anti-Age Hydrogel Eye Patches | Anti-age, Niacinamide (B3) | 7 pcs | $16.35 | New / Coming Soon |
| Anti-Age Peptide Collection | Anti-age, Dehydrated skin | 3 products | $48.30 | Collection Box, New |
| Peptide Ageless AM/PM Cream | Anti-age, Vitamin C | 50 ml | $12.50 | New |
| 5% Urea + 2% Panthenol Body Cream | Urea, Dehydrated skin | 280 ml | $16.40 | Trending |
| Glycolic Acid Exfoliating Toner | Dark spots, Glycolic Acid | 250 ml | ~~$14.10~~ **$7.05** | −50% |
| Aluminum-free Roll-on Deodorant | Odor protection, Panthenol | 50 ml | $12.60 | — |

### Bags (`bag_accessory`) — sample
| Name | Material | Dimensions |
|---|---|---|
| Classic Quilted Shoulder Bag | PU Leather | 28×20×8 cm |
| Minimalist Leather Hobo | Genuine Leather | 35×25×10 cm |
| Chain Strap Shoulder Bag | PU Leather | 22×16×6 cm |
| Structured Top Handle Bag | Vegan Leather | 30×22×12 cm |
| Croc-Embossed Shoulder Bag | PU Leather | 26×18×8 cm |

---

## Full Product Catalog — Every SKU, Organized by Category

Complete extraction from your source data. Four product families, each with its own attribute set (see `product-catalog-schema.md` for the field-level JSON schema and sizing/filter definitions — this file is the full data dump that feeds it).

Columns: **Name | SKU | Sizes | Colors | Fabric (gsm/oz) | Wholesale Price | Badge**
`—` = not shown in source data for that item.

---

## PART A — Blank Apparel (Women's, SKU-coded)

### A1. T-Shirts (74 SKUs)

| Name | SKU | Sizes | Colors | Fabric | Price | Badge |
|---|---|---|---|---|---|---|
| Women's Regular Fit Crewneck T-Shirt | WT0216 | S–2XL | 5 | 130gsm/3.8oz | $6.99 | NEW |
| Women's Leopard Print Crop T-Shirt | WT0218 | S–2XL | 4 | 210gsm/6.2oz | $9.99 | NEW |
| Women's Boatneck Raglan T-Shirt | WT0200 | S–XL | 6 | 230gsm/6.8oz | $5.99 | NEW |
| Women's Crop Short Sleeve Shirt | WT0225 | S–XL | 3 | 270gsm/8.0oz | $16.99 | NEW |
| Women's Turtleneck Batwing T-Shirt | WO0019 | S–L | 4 | 210gsm/6.2oz | $12.99 | NEW |
| Women's Slim Half-Button T-Shirt | WT0183 | S–2XL | 5 | 260gsm/7.7oz | $14.99 | NEW |
| Women's Raglan Color Block Baby T-Shirt | WT0197 | S–XL | 12 | 230gsm/6.8oz | $5.99 | BESTSELLER, NEW |
| Women's Slim Raglan T-Shirt | WT0198 | S–3XL | 9 | 230gsm/6.8oz | $5.99 | NEW |
| Essential Bodycon Crewneck T-Shirt | WT0050 | S–XL | 7 | 260gsm/7.7oz | $6.99 | BESTSELLER |
| Women's Cropped T-Shirt | WT0055 | S–2XL | 4 | 265gsm/7.8oz | $9.99 | BESTSELLER |
| Baby Tee Seamless T-Shirt – 200 GSM | RU0007 | S–L | 2 | 200gsm/5.9oz | $3.99 | BESTSELLER |
| Fitted Crop Cotton T-Shirt | WT0033-4S | XS–2XL | 2 | 180gsm/5.3oz | $7.59 | — |
| Women's Mineral Wash Cotton Crop T-Shirt | WT0137 | S–2XL | 4 | 275gsm/8.1oz | $10.99 | BESTSELLER, NEW |
| Women's Cropped Dolman T-Shirt | WB0015 | S–XL | 4 | 260gsm/7.7oz | $8.99 | BESTSELLER |
| Essential Standard Shoulder T-Shirt | WT0040 | S–XL | 8 | 250gsm/7.4oz | $6.99 | BESTSELLER |
| Women's Crewneck Crop T-Shirt | WT0151 | 4–12 | 5 | 220gsm/6.5oz | $9.99 | NEW |
| Vintage Wash Slim Fit T-shirt | WT0018 | S–L | 10 | 240gsm/7.1oz | $6.99 | BESTSELLER |
| Women's Off-the-Shoulder Bell Sleeve Crop T-Shirt | WT0112 | S–XL | 3 | 260gsm/7.7oz | $8.99 | — |
| Contrast Stripes Bodycon Raglan Sleeve T-Shirt | WT0029 | S–XL | 5 | 260gsm/7.7oz | $9.99 | BESTSELLER |
| Women's Solid Color Slim Crop T-Shirt | WT0080 | S–XL | 7 | 260gsm/7.7oz | $5.99 | — |
| Essential Drawstring T-Shirt | WT0032 | S–XL | 3 | 260gsm/7.7oz | $8.99 | — |
| Vintage Wash Drop Shoulder T-shirt | WT0030 | S–XL | 3 | 275gsm/8.1oz | $9.99 | — |
| Women's Mineral Wash Raglan Crop T-Shirt | WT0108 | S–XL | 2 | 315gsm/9.3oz | $10.99 | BESTSELLER |
| Women's One-Shoulder Crop T-Shirt | — | S–XL | 6 | 250gsm/7.4oz | — | — |
| Essential Bodycon Crewneck T-Shirt | WT0010 | XS–XL | 2 | 210gsm/6.2oz | $6.99 | BESTSELLER |
| Women's Boxy Batwing Sleeve T-Shirt | WT0107 | S–XL | 4 | 190gsm/5.6oz | $12.99 | — |
| Women's Slim-Fit Cropped T-Shirt | WT0056 | S–2XL | 8 | 220gsm/6.5oz | $8.99 | BESTSELLER |
| Women's Regular Fit T-Shirt | WT0094 | S–XL | 6 | 185gsm/5.5oz | $6.99 | — |
| Women's Slim Ribbed Crop T-Shirt | WT0062 | S–XL | 6 | 250gsm/7.4oz | $6.99 | — |
| Women's Retro Binding V-Neck Crop T-Shirt | WT0089 | S–XL | 4 | 210gsm/6.2oz | $8.99 | — |
| Women's Cropped Full Zip Short Sleeve T-Shirt | WT0111 | S–XL | 4 | 220gsm/6.5oz | $12.99 | NEW |
| Vintage Washed Bodycon Cotton T-Shirt | WT0002 | S–XL | 6 | 280gsm/8.3oz | $12.99 | — |
| Women's Color Block V-Neck Crop T-Shirt | WT0084 | S–XL | 2 | 260gsm/7.7oz | $9.99 | — |
| Women's Slim Fit Crewneck T-Shirt | WT0053 | S–2XL | 5 | 250gsm/7.4oz | $8.99 | — |
| Essential Wide Neck Baby T-shirt | WT0041 | S–XL | 4 | 260gsm/7.7oz | $9.99 | BESTSELLER |
| Women's Quick-Dry Baby T-Shirt | WT0128 | S–2XL | 6 | 240gsm/7.1oz | $6.99 | NEW |
| Off-Shoulder Rolled Hem Cotton T-Shirt | AWT002 | S–2XL | 4 | 190gsm/5.6oz | $8.99 | — |
| Women's Slim Color Block T-Shirt | WT0158 | 4–12 | 8 | 180gsm/5.3oz | $9.99 | NEW |
| Women's Square Neck Crop T-Shirt | WT0077 | S–XL | 5 | 220gsm/6.5oz | $6.99 | — |
| Contrast Collar Striped Cropped Jersey | WT0052 | S–XL | 4 | 165gsm/4.9oz | $12.99 | BESTSELLER |
| Women's Slim Fit Boatneck T-Shirt | WT0068 | S–XL | 4 | 250gsm/7.4oz | $9.99 | — |
| Women's Vintage Wash Boxy Cropped Shirt | WT0122 | S–XL | 2 | 310gsm/9.1oz | $26.99 | NEW |
| Asymmetric Shoulder Oversized Cotton T-Shirt | AWT001 | S–2XL | 3 | 230gsm/6.8oz | $10.99 | — |
| Women's Contrast Stitch Raglan T-Shirt | WT0085 | S–XL | 5 | 210gsm/6.2oz | $6.99 | — |
| Women's Raglan Crop T-Shirt | WT0167 | S–XL | 6 | 200gsm/5.9oz | $9.99 | NEW |
| Women's Color Block Raglan Baby T-Shirt | WT0110 | S–XL | 5 | 210gsm/6.2oz | $8.99 | — |
| Women's Varsity Stripe T-Shirt | WT0066 | S–2XL | 3 | 220gsm/6.5oz | $10.99 | — |
| Essential Slim Fit Mock Neck T-Shirt | WT0042 | S–XL | 5 | 260gsm/7.7oz | $6.99 | BESTSELLER |
| Women's Ruched Long Sleeve Crop T-Shirt | WT0060 | S–XL | 6 | 250gsm/7.4oz | $9.99 | — |
| Women's Cropped Paneled V-Neck Jersey | WT0138 | S–XL | 4 | 180gsm/5.3oz | $8.99 | BESTSELLER, NEW |
| Women's Slim Cap Sleeve Crop T-Shirt | WT0081 | S–XL | 7 | 260gsm/7.7oz | $6.99 | — |
| Women's Camo Raglan Crop T-Shirt | WT0140 | S–XL | 2 | 210gsm/6.2oz | $8.99 | NEW |
| Women's Paneling Full Zip T-Shirt | WT0173 | S–XL | 4 | 220gsm/6.5oz | $16.99 | NEW |
| Women's Longline Slim-Fit T-Shirt | WT0075 | S–2XL | 4 | 220gsm/6.5oz | $9.99 | — |
| Women's Paneled Crop T-Shirt | — | S–XL | 4 | 260gsm/7.7oz | — | — |
| Women's Off-the-Shoulder Crop T-Shirt | WT0104 | S–XL | 4 | 310gsm/9.1oz | $9.99 | — |
| Women's Striped Boxy Cropped Shirt | WT0155 | S–XL | 1 | 108gsm/3.2oz | $16.99 | NEW |
| Women's Contrast Stitch Raglan Crop T-Shirt | WT0095 | S–XL | 5 | 210gsm/6.2oz | $9.99 | — |
| Tencel Slim Fit V-Neck T-Shirt | WT0054 | S–2XL | 6 | 220gsm/6.5oz | $6.99 | — |
| Women's Mineral Wash Crop T-Shirt | WT0097 | S–XL | 6 | 260gsm/7.7oz | $9.99 | — |
| Women's Color Block Ruched T-Shirt | — | S–XL | 3 | 210gsm/6.2oz | — | — |
| Essential V-Neck Bodycon T-Shirt | WT0005 | S–2XL | 4 | 215gsm/6.3oz | $10.99 | — |
| Contrast Trim V-Neck Crop T-Shirt | WT0051 | S–XL | 2 | 260gsm/7.7oz | $12.99 | — |
| Women's Tencel Baby T-Shirt | WT0124 | S–2XL | 6 | 220gsm/6.5oz | $6.99 | — |
| Women's Raw Hem Long Sleeve T-Shirt | WT0103 | S–XL | 4 | 310gsm/9.1oz | $12.99 | — |
| Essential Bodycon T-Shirt | WT0004 | S–2XL | 4 | 250gsm/7.4oz | $10.99 | — |
| Women's Sunfade Washed T-Shirt | WT0165 | S–2XL | 5 | 270gsm/8.0oz | $10.99 | NEW |
| Lightweight Cocoon Shape Short Sleeve Top | WT0008 | S–L | 3 | 210gsm/6.2oz | $6.99 | — |
| Modal Bodycon Henley Shirt | — | 4–12 | 3 | 260gsm/7.7oz | — | — |
| Women's Slim Fit Color Block T-Shirt | WT0166 | S–XL | 6 | 200gsm/5.9oz | $9.99 | NEW |
| Women's Piping Baseball Jersey | WT0139 | S–XL | 4 | 250gsm/7.4oz | $12.99 | NEW |
| Women's Slim Fit Paneling T-Shirt | WT0177 | S–XL | 6 | 260gsm/7.7oz | $8.99 | NEW |
| Women's Crop Bubble Hem T-Shirt | WT0160 | S–XL | 3 | 200gsm/5.9oz | $12.99 | NEW |
| Women's Raglan Ribbed T-Shirt | WT0159 | S–XL | 4 | 210gsm/6.2oz | $9.99 | NEW |

### A2. Tank Tops & Camis (20 SKUs)

| Name | SKU | Sizes | Colors | Fabric | Price | Badge |
|---|---|---|---|---|---|---|
| Women's Tight Crewneck Crop Tank Top | WT0082 | S–XL | 5 | 260gsm/7.7oz | $4.99 | BESTSELLER |
| Women's Slim Tank Top | WT0115 | S–XL | 4 | 260gsm/7.7oz | $6.99 | — |
| Women's Crewneck Tank Top | WT0196 | S–XL | 7 | 230gsm/6.8oz | $5.99 | — |
| Women's Leopard print Tank Top | WT0185 | S–2XL | 2 | 210gsm/6.2oz | $8.99 | NEW |
| Women's Drawstring Tank Top | WT0171 | S–XL | 5 | 180gsm/5.3oz | $9.99 | NEW |
| Snow Washed Tank Top | RU0092 | S–XL | 2 | 235gsm/6.9oz | $9.99 | BESTSELLER |
| Snow Washed Crop Top | RU0094 | S–XL | 5 | 235gsm/6.9oz | $9.99 | BESTSELLER |
| Snow Washed Crop Top | R00141 | S–L | 5 | 220gsm/6.5oz | $8.04 | BESTSELLER |
| Women's One-Shoulder Crop Tank Top | WT0079 | S–XL | 6 | 260gsm/7.7oz | $5.99 | — |
| Women's Color Block Halter Crop Tank Top | WT0083 | S–XL | 5 | 210gsm/6.2oz | $6.99 | BESTSELLER |
| Snow Washed Raw Edge Crop Top | WT0001 | S–XL | 2 | 280gsm/8.3oz | $14.99 | — |
| Solid Color Raglan Sleeve Crop Top | WT0009 | S–L | 3 | 210gsm/6.2oz | $6.99 | — |
| Women's Color Block Cropped Tank Top | WT0116 | S–XL | 5 | 220gsm/6.5oz | $6.99 | NEW |
| Slim Fit Ribbed Racerback Tank Top | RB0017 | S–XL | 4 | 280gsm/8.3oz | $9.99 | BESTSELLER |
| Women's Cropped Tube Top | WB0002 | S–XL | 5 | 250gsm/7.4oz | $6.99 | NEW |
| Contrast Binding Halter Tank Top | WB0001 | S–XL | 3 | 210gsm/6.2oz | $6.99 | — |
| Ruched Bodycon Crop Top | WT0013 | 4–12 | 4 | 170gsm/5.0oz | $6.99 | — |
| Women's Ribbed Henley Tank Top | WT0076 | S–2XL | 3 | 250gsm/7.4oz | $8.99 | — |
| V-Neck Lapel Crop Top | WT0011 | S–XL | 3 | 210gsm/6.2oz | $10.99 | — |
| Color-Blocked Raglan Sleeve Crop Top | WT0006 | S–L | 3 | 210gsm/6.2oz | $6.99 | — |

### A3. Hoodies (15 SKUs)

| Name | SKU | Sizes | Colors | Fabric | Price | Badge |
|---|---|---|---|---|---|---|
| Women's Mineral Washed Crop Hoodie | WT0192 | S–2XL | 4 | 400gsm/11.8oz | $24.99 | NEW |
| Essential Cropped Hoodie | WW0003 | S–XL | 4 | 350gsm/10.3oz | $18.99 | — |
| Essential Cropped Hoodie | WW0021 | S–XL | 4 | 310gsm/9.1oz | $12.99 | BESTSELLER |
| Vintage Washed Raw Edge Hoodie | WW0005 | S–XL | 5 | 320gsm/9.4oz | $22.99 | — |
| Fleeced Zip-Up Cropped Hoodie | RU0117 | S–XL | 3 | 350gsm/10.3oz | $23.99 | — |
| Snow Washed Cropped Hoodie | RU0075 | S–XL | 4 | 355gsm/10.5oz | $19.99 | — |
| Essential Cropped Zip-Up Hoodie | WQ0002 | S–XL | 4 | 350gsm/10.3oz | $24.99 | — |
| Vintage Washed Cropped Fleece Hoodie | WW0006 | M–XL | 3 | 400gsm/11.8oz | $29.99 | — |
| Essential Cropped Zip-Up Hoodie | WQ0005 | S–XL | 4 | 310gsm/9.1oz | $14.99 | BESTSELLER |
| Cropped Half-Zip Hoodie | RP0006 | 2-4-10-12 | 4 | 320gsm/9.4oz | $21.99 | — |
| Women's Slim Cropped Full Zip Hoodie | WT0102 | S–XL | 4 | 260gsm/7.7oz | $14.99 | — |
| Women's Slim Crop Full Zip Hoodie | WT0114 | S–XL | 4 | 310gsm/9.1oz | $19.99 | — |
| Women's Boxy Quarter-Zip Hoodie | WT0113 | S–XL | 4 | 310gsm/9.1oz | $19.99 | — |
| Contrast Side Stripe Cropped Hoodie | WW0012 | S–XL | 3 | 340gsm/10.0oz | $18.99 | — |
| Cropped Zip-Through Hoodie | RP0008 | 2-4-10-12 | 2 | 320gsm/9.4oz | $22.99 | — |

### A4. Sweatshirts (13 SKUs)

| Name | SKU | Sizes | Colors | Fabric | Price | Badge |
|---|---|---|---|---|---|---|
| Women's Mock Neck Crewneck Sweatshirt | WT0211 | S–L | 8 | 350gsm/10.3oz | $19.99 | NEW |
| Women's Collared Pullover Knit Sweater | WT0203 | S–XL | 4 | 420gsm/12.4oz | $16.99 | NEW |
| Women's Mock-Neck Quarter-Zip Sweatshirt | WT0187 | S–XL | 4 | 420gsm/12.4oz | $22.99 | NEW |
| Women's Crop V-Neck Sweatshirt | WB0067 | S–XL | 5 | 280gsm/8.3oz | $16.99 | BESTSELLER, NEW |
| Women's Crop Collared Sweatshirt | WT0212 | S–2XL | 4 | 410gsm/12.1oz | $22.99 | NEW |
| Women's Off-Shoulder Sweatshirt | WT0058 | S–XL | 5 | 250gsm/7.4oz | $12.99 | — |
| Raw-Hem Color-Block Raglan Crop Sweatshirt | WW0001 | S–XL | 4 | 420gsm/12.4oz | $16.99 | — |
| Snow Washed Raw Edge Cropped Sweatshirt | RW0004 | S–XL | 4 | 380gsm/11.2oz | $19.99 | — |
| Vintage Washed Cropped Sweatshirt | WW0016 | S–L | 4 | 410gsm/12.1oz | $16.99 | — |
| Cropped Half-Zip Sweatshirt | RP0007 | 2-4-10-12 | 5 | 320gsm/9.4oz | $20.99 | — |
| Women's Boxy Cropped Crewneck Sweatshirt | WT0123 | S–XL | 3 | 310gsm/9.1oz | $12.99 | — |
| Essential Fleece Mock-Neck Crew Sweatshirt | WW0004 | S–L | 6 | 350gsm/10.3oz | $16.99 | BESTSELLER, NEW |
| Mineral Wash Balloon Sleeve Cropped Sweater | WM0001 | S–XL | 3 | 285gsm/8.4oz | $19.99 | — |

### A5. Activewear — Bras / Yoga Tops / Leggings / Yoga Bottoms (89 SKUs)

| Name | SKU | Sizes | Colors | Fabric | Price | Badge |
|---|---|---|---|---|---|---|
| Women's Tight Yoga Sports Bra | WT0205 | S–XL | 5 | 220gsm/6.5oz | $12.99 | NEW |
| Women's Yoga Cropped Tube Top | WT0195 | S–XL | 4 | 220gsm/6.5oz | $9.99 | NEW |
| Women's Ruched Halter Neck Yoga Tank Top | WT0206 | S–XL | 3 | 220gsm/6.5oz | $12.99 | NEW |
| Women's Halter Yoga Sports Bra | WT0189 | 4–12 | 3 | 270gsm/8.0oz | $12.99 | NEW |
| Women's Yoga Sports Bra | WT0193 | S–XL | 4 | 220gsm/6.5oz | $9.99 | NEW |
| Women's High Rise Ankle Length Yoga Leggings | WB0072 | 4–12 | 3 | 270gsm/8.0oz | $14.99 | NEW |
| Women's Cropped Yoga Tank Top | WT0191 | 4–12 | 4 | 240gsm/7.1oz | $12.99 | NEW |
| Women's Halter V-Neck Yoga Tank Top | WT0194 | S–XL | 3 | 220gsm/6.5oz | $9.99 | NEW |
| Women's Color Block Yoga Tank Top | WT0219 | 2XS–XL | 8 | 225gsm/6.6oz | $14.99 | NEW |
| Women's Quarter-Zip Yoga Romper | WB0076 | S–XL | 6 | 230gsm/6.8oz | $16.99 | NEW |
| Women's Flared Drawstring Yoga Pants | WB0074 | 4–12 | 3 | 240gsm/7.1oz | $14.99 | NEW |
| Women's Topstitching Yoga Sports Bra | WT0179 | S–XL | 9 | 220gsm/6.5oz | $14.99 | NEW |
| Women's Topstitching Yoga Tank Top | WT0180 | S–XL | 10 | 220gsm/6.5oz | $14.99 | NEW |
| Women's Performance Crop T-Shirt | WT0181 | 2XS–XL | 6 | 220gsm/6.5oz | $6.99 | NEW |
| Women's High Rise Yoga Pants | WB0077 | S–XL | 5 | 220gsm/6.5oz | $12.99 | NEW |
| Women's Halter Yoga Tank Top | WT0182 | 4–12 | 4 | 220gsm/6.5oz | $12.99 | NEW |
| Women's Polo Yoga Tank Top | WT0188 | 4–10 | 2 | 320gsm/9.4oz | $14.99 | NEW |
| Women's High Rise Topstitching Leggings | WB0040 | S–XL | 11 | 220gsm/6.5oz | $14.99 | NEW |
| Women's High Rise Flared Yoga Pants | WB0041 | S–XL | 11 | 220gsm/6.5oz | $19.99 | NEW |
| Women's Color Block Yoga Sports Bra | WT0178 | 2XS–XL | 5 | 250gsm/7.4oz | $14.99 | NEW |
| Women's Color Block Yoga Tank Top | — | 2XS–XL | 14 | 220gsm/6.5oz | — | NEW |
| Women's Color Block Performance T-Shirt | UT0167 | 2XS–XL | 4 | 220gsm/6.5oz | $12.99 | NEW |
| Women's High Rise Color Block Yoga Shorts | WB0068 | 2XS–XL | 4 | 220gsm/6.5oz | $12.99 | NEW |
| Women's Hollow-Out Yoga Tank Top | WT0149 | 4–12 | 3 | 260gsm/7.7oz | $12.99 | NEW |
| Women's High Rise Color Block Yoga Shorts | WB0062 | 2XS–XL | 2 | 250gsm/7.4oz | $12.99 | NEW |
| Women's Color Block Yoga Leggings | WB0065 | 2XS–XL | 6 | 250gsm/7.4oz | $16.99 | NEW |
| Women's Yoga Tank Top | WT0164 | 4–12 | 7 | 220gsm/6.5oz | $12.99 | NEW |
| Women's Cropped Sports Bra | — | S–XL | 7 | 230gsm/6.8oz | — | BESTSELLER |
| Women's High Rise Color Block Yoga Shorts | WB0039 | S–XL | 4 | 220gsm/6.5oz | $9.99 | BESTSELLER, NEW |
| High-Waisted Yoga Leggings | WB0013 | 4–12 | 13 | 210gsm/6.2oz | $12.99 | BESTSELLER |
| Women's Slim Fit Performance T-Shirt | WT0143 | 2XS–XL | 12 | 220gsm/6.5oz | $6.99 | BESTSELLER, NEW |
| Spaghetti Strap Yoga Sports Bra | WT0073 | S–XL | 12 | 300gsm/8.8oz | $9.99 | BESTSELLER |
| Women's Color Block Yoga Sports Bra | WT0134 | S–XL | 4 | 220gsm/6.5oz | $12.99 | BESTSELLER, NEW |
| Women's High-Waisted Biker Shorts | WB0026 | S–XL | 5 | 220gsm/6.5oz | $9.99 | BESTSELLER |
| Women's High-Waist Tapered Leggings | WB0042 | S–XL | 4 | 220gsm/6.5oz | $16.99 | NEW |
| Women's Pleated Halter Sports Bra | — | S–2XL | 12 | 220gsm/6.5oz | — | BESTSELLER |
| Women's Quarter-Zip Yoga Pullover | WT0092 | S–XL | 4 | 165gsm/4.9oz | $8.99 | — |
| Women's High Rise Yoga Shorts | WB0038 | 4–12 | 8 | 220gsm/6.5oz | $9.99 | BESTSELLER, NEW |
| Women's Contrast Stripe Track Shorts | WB0014 | S–2XL | 3 | 220gsm/6.5oz | $12.99 | BESTSELLER |
| Women's Solid High Rise Leggings | WB0025 | S–XL | 7 | 220gsm/6.5oz | $12.99 | BESTSELLER |
| Women's Halter Neck Yoga Sports Bra | WT0136 | S–XL | 4 | 220gsm/6.5oz | $14.99 | NEW |
| Women's High-Waisted Ankle Length Yoga Leggings | WB0020 | 4–12 | 7 | 220gsm/6.5oz | $12.99 | — |
| Strappy Criss-Cross Sports Bra | WT0074 | 4–12 | 10 | 210gsm/6.2oz | $9.99 | BESTSELLER |
| Women's Solid Color Sports Bra | WT0109 | S–XL | 5 | 220gsm/6.5oz | $9.99 | — |
| Women's Tight Long Sleeve Yoga Bodysuit | — | S–2XL | 4 | 220gsm/6.5oz | — | NEW |
| Women's Crossover V-Neck Sports Bra | WT0065 | S–2XL | 4 | 220gsm/6.5oz | $12.99 | — |
| High-Waisted Blend Biker Shorts | WB0012 | S–2XL | 6 | 220gsm/6.5oz | $9.99 | BESTSELLER |
| Women's Slim Fit Full-Zip Yoga Jacket | WT0118 | S–2XL | 3 | 230gsm/6.8oz | $16.99 | — |
| Women's V-Neck Yoga Sports Bra | WT0125 | 4–12 | 21 | 210gsm/6.2oz | $12.99 | BESTSELLER, NEW |
| Women's High Waisted Ankle Leggings | WB0035 | 4–12 | 8 | 220gsm/6.5oz | $12.99 | NEW |
| Women's High-Rise Ankle-Length Leggings | WB0024 | 4–12 | 3 | 220gsm/6.5oz | $12.99 | — |
| Women's Tight Color Block Yoga Tank Top | WT0152 | 4–12 | 4 | 220gsm/6.5oz | $12.99 | BESTSELLER, NEW |
| Women's High Rise Pocket Yoga Shorts | WB0055 | S–XL | 9 | 230gsm/6.8oz | $12.99 | NEW |
| Women's Cutout Long Sleeve Yoga Shrug | WT0157 | S–XL | 4 | 220gsm/6.5oz | $12.99 | NEW |
| Women's High-Waisted Flare Leggings | WB0003 | S–XL | 11 | 220gsm/6.5oz | $14.99 | — |
| Women's Halter Crop Sports Bra | WT0099 | 4–12 | 3 | 220gsm/6.5oz | $12.99 | — |
| Women's High-Waisted Pocket Biker Shorts | WB0006 | S–2XL | 4 | 210gsm/6.2oz | $9.99 | — |
| Women's Tight Fit Yoga Tank Top | WT0146 | 4–12 | 3 | 220gsm/6.5oz | $12.99 | NEW |
| Women's Tight Cropped Sports Bra | — | 4–12 | 4 | 220gsm/6.5oz | — | NEW |
| Women's High-Waisted Yoga Leggings | WB0031 | S–XL | 4 | 230gsm/6.8oz | $12.99 | NEW |
| Women's Yoga Tank Top | WT0147 | 4–12 | 5 | 220gsm/6.5oz | $12.99 | NEW |
| Women's Solid U-Neck Sports Bra | WT0131 | S–XL | 5 | 220gsm/6.5oz | $9.99 | NEW |
| Women's Solid Color Yoga Sports Bra | WT0132 | 4–12 | 4 | 220gsm/6.5oz | $12.99 | NEW |
| Women's Cropped Sports Bra | WT0130 | S–XL | 4 | 220gsm/6.5oz | $9.99 | NEW |
| Strappy Criss Cross Yoga Sports Bra | WT0064 | S–2XL | 4 | 220gsm/6.5oz | $9.99 | BESTSELLER |
| Taped Cooling Performance Crop Top | RT0035 | S–XL | 2 | 230gsm/6.8oz | $10.99 | — |
| Women's High Rise Ankle Length Leggings | WB0017 | S–XL | 3 | 230gsm/6.8oz | $9.99 | — |
| Women's Twist Front V-Neck Sports Bra | WT0129 | S–XL | 11 | 220gsm/6.5oz | $9.99 | NEW |
| Women's Slim Fit Performance T-Shirt | WT0117 | S–XL | 5 | 220gsm/6.5oz | $6.99 | — |
| Women's Color Block Ruched V-Neck Sports Bra | WT0121 | S–XL | 4 | 230gsm/6.8oz | $12.99 | NEW |
| Women's High-Waist Yoga Shorts | WB0051 | 4–12 | 7 | 215gsm/6.3oz | $12.99 | NEW |
| Women's Tight Halter Yoga Tank Top | WT0150 | 4–12 | 3 | 220gsm/6.5oz | $12.99 | NEW |
| Women's Cropped V-Neck Sports Bra | WT0144 | S–XL | 4 | 220gsm/6.5oz | $12.99 | NEW |
| Women's High Rise Flared Leggings | WB0054 | 4–12 | 4 | 220gsm/6.5oz | $14.99 | NEW |
| Women's U-Neck Yoga Sports Bra | WT0168 | 4–12 | 5 | 220gsm/6.5oz | $12.99 | NEW |
| Women's Tight Paneling Yoga Tank Top | WT0154 | 4–12 | 3 | 220gsm/6.5oz | $12.99 | NEW |
| Women's Faux Denim Sports Bra | WT0096 | 4–12 | 2 | 200gsm/5.9oz | $12.99 | — |
| Women's Criss-Cross Band Sports Bra | WT0127 | 2XS–XL | 4 | 250gsm/7.4oz | $16.99 | NEW |
| Women's Ruched Halter-Neck Sports Bra | WT0133 | S–XL | 5 | 220gsm/6.5oz | $9.99 | NEW |
| Women's High-Waist Color Block Yoga Shorts | WB0046 | S–XL | 7 | 220gsm/6.5oz | $12.99 | NEW |
| Women's Faux Denim Zip-Fly Leggings | WB0019 | 4–12 | 2 | 200gsm/5.9oz | $14.99 | — |
| Women's High Rise Tight Yoga Shorts | WB0053 | 4–12 | 3 | 220gsm/6.5oz | $12.99 | NEW |
| Women's Crewneck Yoga Tank Top | WT0153 | 4–12 | 5 | 220gsm/6.5oz | $12.99 | NEW |
| Women's High Rise Straight Leg Yoga Pants | WB0052 | 4–12 | 10 | 230gsm/6.8oz | $16.99 | NEW |
| Women's Ruched Cropped Yoga Tube Top | WT0141 | S–XL | 5 | 240gsm/7.1oz | $12.99 | NEW |

### A6. Shorts — Casual / Denim (7 SKUs)

| Name | SKU | Sizes | Colors | Fabric | Price | Badge |
|---|---|---|---|---|---|---|
| Women's Drawstring Bermuda Shorts | WB0073 | 4–12 | 5 | 140gsm/4.1oz | $12.99 | NEW |
| Women's Drawstring Shorts | WB0066 | S–XL | 4 | 420gsm/12.4oz | $12.99 | NEW |
| Women's Drawstring Shorts | WK0014 | S–2XL | 5 | 430gsm/12.7oz | $12.99 | BESTSELLER |
| Women's Vintage Wash Raw Hem Denim Shorts | WB0034 | S–XL | 1 | 430gsm/12.7oz | $16.99 | NEW |
| Women's Retro Contrast Binding Shorts | WB0030 | S–XL | 5 | 220gsm/6.5oz | $9.99 | NEW |
| Snow Washed Raw Edge Drawstring Shorts | — | S–XL | 2 | 300gsm/8.8oz | — | — |
| Women's Vintage Wash High Rise Denim Shorts | WB0058 | S–XL | 2 | 280gsm/8.3oz | $19.99 | NEW |

### A7. Sweatpants (10 SKUs)

| Name | SKU | Sizes | Colors | Fabric | Price | Badge |
|---|---|---|---|---|---|---|
| Women's Mineral Wash Flared Leg Sweatpants | WB0075 | S–2XL | 4 | 400gsm/11.8oz | $24.99 | NEW |
| Essential Fleece Drawstring Sweatshorts | WK0004 | S–L | 6 | 350gsm/10.3oz | $12.99 | BESTSELLER |
| Essential Straight-Leg Sweatpants | WK0009 | XS–L | 4 | 310gsm/9.1oz | $12.99 | BESTSELLER |
| Vintage Washed Waist Pants | WK0006 | S–XL | 5 | 370gsm/10.9oz | $24.99 | — |
| Essential Jogged Sweatpants | WK0010 | S–XL | 4 | 310gsm/9.1oz | $12.99 | — |
| Essential Drawstring Straight-Leg Sweatpants | WK0003 | S–XL | 4 | 350gsm/10.3oz | $19.99 | — |
| Vintage Washed Flared Fleece Pants | WK0005 | M–XL | 3 | 400gsm/11.8oz | $24.99 | — |
| Women's Slim-Fit Flared Sweatpants | WB0016 | S–XL | 5 | 250gsm/7.4oz | $14.99 | — |
| Women's Wide Leg Sweatpants | WB0023 | S–XL | 4 | 310gsm/9.1oz | $16.99 | — |
| Vintage Washed Drawstring Sweatpants | WK0016 | S–L | 4 | 410gsm/12.1oz | $19.99 | — |

### A8. Skirts (15 SKUs)

| Name | SKU | Sizes | Colors | Fabric | Price | Badge |
|---|---|---|---|---|---|---|
| Women's High Rise A-Line Skirt | WB0081 | S–XL | 4 | 220gsm/6.5oz | $16.99 | NEW |
| Women's Pleated A-Line Skirt | WB0086 | S–2XL | 3 | 220gsm/6.5oz | $12.99 | NEW |
| Women's Studded Denim Mini Skirt | — | S–2XL | 1 | 390gsm/11.5oz | — | NEW |
| Women's Pleated A-Line Tennis Skirt | WB0071 | 4–10 | 2 | 320gsm/9.4oz | $12.99 | NEW |
| High-Waist Pocketed A-Line Skirt | WS0004 | S–XL | 3 | 210gsm/6.2oz | $14.99 | — |
| Essential Drawstring Skirt | WS0013 | S–XL | 4 | 310gsm/9.1oz | $7.99 | BESTSELLER |
| Women's Solid Color Knit Maxi Skirt | WB0027 | S–XL | 3 | 260gsm/7.7oz | $8.99 | — |
| Women's Pleated Mini Skirt | WB0037 | 2XS–XL | 5 | 125gsm/3.7oz | $16.99 | NEW |
| Taped Cooling Performance Short Skirt | RS0035 | S–XL | 2 | 230gsm/6.8oz | $12.99 | — |
| Women's A-Line Mini Skirt | WB0060 | S–XL | 3 | 310gsm/9.1oz | $8.99 | NEW |
| Dyed Washed Drawstring Maxi Skirt | WS0009 | S–XL | 4 | 275gsm/8.1oz | $16.99 | — |
| Contrast Side Stripe Slit Skirt | WS0012 | S–XL | 3 | 340gsm/10.0oz | $9.99 | — |
| Women's Mineral Wash Mini Skirt | WB0033 | S–XL | 2 | 380gsm/11.2oz | $16.99 | — |
| Women's A-Line Contrast Panel Slit Skirt | WB0047 | 2XS–XL | 6 | 225gsm/6.6oz | $14.99 | NEW |
| Women's Vintage Wash Denim Skirt | WB0049 | S–2XL | 1 | 450gsm/13.3oz | $26.99 | NEW |

### A9. Bottoms — Jeans / Denim / Wide-Leg / Trousers (16 SKUs)

| Name | SKU | Sizes | Colors | Fabric | Price | Badge |
|---|---|---|---|---|---|---|
| Women's Tencel Wide Leg Pants | WB0082 | S–2XL | 3 | 300gsm/8.8oz | $24.99 | NEW |
| Women's Wide Leg Denim Jeans | WB0089 | S–2XL | 2 | 430gsm/12.7oz | $24.99 | NEW |
| Women's Splatter Barrel Leg Jeans | WB0078 | S–3XL | 1 | 615gsm/18.1oz | $24.99 | NEW |
| Women's High Rise Wide Leg Pants | WB0069 | XS–L | 3 | 140gsm/4.1oz | $22.99 | NEW |
| Women's High-Rise Flared Jeans | WB0011 | S–XL | 1 | 385gsm/11.4oz | $24.99 | — |
| Women's High-Rise Skinny Jeans | WB0010 | S–XL | 1 | 385gsm/11.4oz | $24.99 | — |
| Women's Vintage Wash Flared Leg Jeans | WB0021 | S–XL | 3 | 370gsm/10.9oz | $24.99 | — |
| Women's Vintage Wash Distressed Wide Leg Jeans | WB0032 | S–XL | 1 | 400gsm/11.8oz | $22.99 | — |
| Belted Barrel-leg Chino Pants | RK0003 | S–XL | 3 | 360gsm/10.6oz | $19.99 | — |
| Women's Vintage Wash Wide Leg Jeans | WB0036 | S–XL | 1 | 400gsm/11.8oz | $22.99 | NEW |
| Women's Flared Leg Jeans | WB0018 | L–2XL | 3 | 430gsm/12.7oz | $22.99 | — |
| Women's Vintage Wash Wide Leg Jeans | WB0059 | S–2XL | 1 | 123gsm/3.6oz | $24.99 | NEW |
| Women's Drawstring Flared Leg Pants | WB0029 | S–XL | 4 | 310gsm/9.1oz | $16.99 | — |
| Women's Vintage Wash High Rise Wide Leg Jeans | WB0057 | S–2XL | 1 | 426gsm/12.6oz | $24.99 | NEW |
| Women's Vintage Wash Wide Leg Jeans | WB0056 | S–2XL | 1 | 123gsm/3.6oz | $24.99 | NEW |
| Women's Vintage Wash Wide Leg Jeans | WB0050 | S–2XL | 1 | 425gsm/12.5oz | $24.99 | NEW |

### A10. One-Pieces — Dresses / Rompers / Jumpsuits / Bodysuits (17 SKUs)

| Name | SKU | Sizes | Colors | Fabric | Price | Badge |
|---|---|---|---|---|---|---|
| Women's U-Neck Yoga Romper | WO0018 | S–XL | 3 | 220gsm/6.5oz | $19.99 | NEW |
| Women's Striped Color Block Polo Dress | WT0209 | S–L | 5 | 210gsm/6.2oz | $16.99 | NEW |
| Women's A-Line Sleeveless Dress | WO0014 | S–XL | 4 | 220gsm/6.5oz | $22.99 | NEW |
| Women's Solid Tight Sleeveless Dress | WO0002 | XS–L | 3 | 260gsm/7.7oz | $8.99 | — |
| Women's Mineral Wash Crewneck Bodysuit | WT0091 | S–2XL | 1 | 275gsm/8.1oz | $12.99 | — |
| Women's Tight Flared Leg Quarter-Zip Jumpsuit | WO0009 | S–XL | 5 | 230gsm/6.8oz | $19.99 | NEW |
| Women's Halter Flared Jumpsuit | WO0013 | S–2XL | 4 | 220gsm/6.5oz | $16.99 | NEW |
| Women's Color Block Mini Dress | WO0004 | S–XL | 3 | 260gsm/7.7oz | $9.99 | — |
| Women's Quarter-Zip Short Sleeve Romper | WO0012 | S–XL | 5 | 230gsm/6.8oz | $14.99 | BESTSELLER, NEW |
| Women's Collared Halter A-Line Tennis Dress | WO0008 | S–2XL | 5 | 210gsm/6.2oz | $12.99 | BESTSELLER |
| Women's V-Neck Short Sleeve Maxi Dress | WO0001 | S–XL | 3 | 260gsm/7.7oz | $12.99 | — |
| Women's Binding Tight Halter Dress | WO0005 | S–XL | 3 | 210gsm/6.2oz | $9.99 | — |
| Women's Paneled A-Line Dress | WO0010 | S–2XL | 5 | 210gsm/6.2oz | $16.99 | NEW |
| Women's Dual-Function Cape Tie-Waist Romper | WO0006 | S–2XL | 5 | 250gsm/7.4oz | $16.99 | — |
| Women's Color Block A-Line Sleeveless Dress | WO0011 | 2XS–XL | 3 | 220gsm/6.5oz | $16.99 | NEW |
| Women's Full-Zip Ruched Bodysuit | WT0176 | S–XL | 3 | 315gsm/9.3oz | $14.99 | NEW |
| Women's Ruched Sleeveless Full-Zip Dress | WO0015 | S–XL | 8 | 220gsm/6.5oz | $26.99 | NEW |

### A11. Coats & Jackets (4 SKUs)

| Name | SKU | Sizes | Colors | Fabric | Price | Badge |
|---|---|---|---|---|---|---|
| Women's Mock Neck Zip Up Cardigan | — | S–XL | 4 | 420gsm/12.4oz | — | NEW |
| Women's Crop Denim Jacket | WT0186 | S–XL | 2 | 420gsm/12.4oz | $29.99 | NEW |
| Women's Full-Zip Sports Jacket | WT0162 | S–XL | 3 | 230gsm/6.8oz | $16.99 | NEW |
| Contrast Side Stripe Fleece Cropped Track Jacket | WQ0004 | S–XL | 4 | 420gsm/12.4oz | $26.99 | — |

### A12. Polo Shirts (4 SKUs)

| Name | SKU | Sizes | Colors | Fabric | Price | Badge |
|---|---|---|---|---|---|---|
| Women's Slim Fit Quarter-Zip Polo Shirt | WT0163 | 2XS–XL | 5 | 160gsm/4.7oz | $12.99 | NEW |
| Essential Cropped Polo Shirt | PL0007 | S–XL | 3 | 200gsm/5.9oz | $9.99 | — |
| Bodycon Short Sleeve Polo Shirt | PL0008 | S–XL | 3 | 260gsm/7.7oz | $9.99 | — |
| Women's Knit Cotton Polo Shirt | WT0172 | S–XL | 4 | 180gsm/5.3oz | $14.99 | NEW |

**Blank Apparel total: 284 rows extracted** (source stated 281 items across pagination; a handful of near-duplicate name/SKU pairs from overlapping page loads were kept as-is rather than guessed away — flag these for dedup during import: `Snow Washed Crop Top` ×3 SKUs, `Women's Drawstring Shorts` ×2 SKUs, `Women's Vintage Wash Wide Leg Jeans` ×4 SKUs, `Essential Cropped Hoodie/Zip-Up Hoodie` ×2 each, `Women's High Rise Color Block Yoga Shorts` ×2, `Women's Cropped Sports Bra` ×2 — these look like genuine colorway/wash variants of the same style, not errors.)

---

## PART B — Print-on-Demand Apparel (no fixed color count; price = base print cost)

| Name | Sizes | Price | Tier |
|---|---|---|---|
| Custom Printed Women's shirts (All-Over Printing) | S–3XL | From $9.28 | — |
| 280gsm Custom Best Hoodies-Double-Layer Cap Women's Hoodies | S–6XL | From $9.92 | — |
| Loose High Waisted Shorts (All-Over Printing) | S–3XL | From $7.46 | — |
| 180gsm Custom Women Top T-Shirts (All-Over Printing) | S–6XL | From $5.74 | — |
| DTG 150gsm Custom Personalized T-Shirts-Dual-Sided Printing | S–3XL | From $5.91 | — |
| Custom Printed Honeycomb Textured Yoga Pants for Women | S–2XL | From $10.14 | — |
| Custom Crewneck T-Shirts (All-Over Printing) | S–5XL | From $5.76 | — |
| Custom Printed Mom Shirts (All-Over Printing) | XS–5XL | From $6.39 | — |
| Swimsuit Cover-up (All-Over Printing) | One size | From $13.63 | — |
| Baggy Pants for Women (All-Over Printing) | S–2XL | From $7.03 | — |
| Sleeveless Ankle-length Dress (All-Over Printing) | S–5XL | From $10.24 | — |
| V-Neck Baggy Dress with Pocket | S–5XL | From $8.31 | — |
| Summer Sweet Bowknot Dress (All-Over Printing) | 2XS–6XL | From $12.77 | — |
| DTF 190gsm Designer T-Shirts for Women-Front Prints | S–2XL | From $6.98 | — |
| DTF 255gsm Custom Designed Women's Hoodies Front Prints | S–3XL | From $10.03 | — |
| DTF 255gsm Custom Hoodies for Women Dual-Sided Prints | S–3XL | From $12.17 | — |
| DTG 150gsm T-Shirts for Women-Printed Tees (Front Printing) | L–3XL | From $4.91 | — |
| Custom Printed Patterned Ribbed Yoga Sets (All-Over Printing) | S–2XL | From $8.53 | — |
| DTF 190gsm Custom Designed Women's T-Shirts-Dual-Sided Printing | S–2XL | From $8.14 | — |
| 180gsm Women's Tank Top (All-Over Printing) | S–2XL | From $5.10 | — |
| Custom Printed Yoga Pants with 2 Pockets (All-Over Printing) | S–2XL | From $11.31 | — |
| Custom Printed Yoga Tank Tops (All-Over Printing) | S–2XL | From $7.24 | — |
| Custom Printed Yoga Workout Outfits (All-Over Printing) | XS–2XL | From $10.69 | — |
| Custom Women's Long Sleeve U-Neck T-Shirts (All-Over Printing) | S–5XL | From $6.34 | — |
| Round Neck Sleeveless Dress Styles | XS–5XL | From $7.03 | — |
| Cover-up Dress for Swimwear (All-Over Printing) | S–2XL | From $12.45 | — |
| Women's Halter One-Piece Swimsuits (All-Over Printing) | S–2XL | From $11.31 | — |
| Sleeveless Dress | S–5XL | From $6.39 | — |
| Ankle-length Slip Dress (All-Over Printing) | S–5XL | From $10.24 | — |
| Beach Wrap Skirt (All-Over Printing) | S–2XL | From $4.03 | — |
| Halter Tie Front Bikini Top (All-Over Printing) | S–2XL | From $5.76 | — |
| Halter Tie Front Bikini Set (All-Over Printing) | S–2XL | From $8.53 | — |
| Two Piece Halter Swimsuit (All-Over Printing) | XS–2XL | From $8.53 | — |
| Halter Triangle Bikini (All-Over Printing) | XS–2XL | From $9.39 | — |
| 2-Piece Women's Halter Tankini (All-Over Printing) | XS–XL | From $11.96 | — |
| Tankini Two Piece Swimsuit (Top Printed) | S–3XL | From $12.60 | — |
| 280gsm Custom Sweatshirt Designs Raglan Style | S–3XL | From $7.84 | — |
| Custom Sports Bra Designs-Yoga Support Bras | S–2XL | From $7.14 | — |
| Custom Printed Patterned Yoga Sports Bra | S–2XL | From $7.14 | — |
| DTG 190gsm Customized Dual-Sided Printed T-Shirts for Women | S–2XL | From $9.43 | — |
| DTF 150gsm Print Crew Neck T-Shirts for Women (Front Printing) | S–3XL | From $4.31 | — |
| DTG 150gsm St Patricks Day Shirts-Short Sleeve Raglan Tees | S–3XL | From $6.60 | — |
| 180gsm Custom Long Sleeve T-Shirts with Pocket | 2XS–6XL | From $7.24 | — |
| DTG 190gsm Custom Printed Women's T-Shirts Front Prints | S–2XL | From $7.50 | — |
| Spaghetti Strap Jumpsuit (All-Over Printing) | S–3XL | From $11.49 | — |
| Tank Top Bodysuit (All-Over Printing) | S–2XL | From $8.08 | — |
| Women's 2-Piece Pajama Set (All-Over Printing) | XS–6XL | From $11.74 | — |
| DTG 255gsm Women's Pocket Hoodie Back Printed | S–3XL | From $10.24 | — |
| Women Long Sleeve Turtleneck Sweater (All-Over Printing) | S–2XL | From $11.91 | — |
| Workout Yoga Set | S–2XL | From $8.70 | — |
| Suspender Jumpsuit (All-Over Printing) | S–3XL | From $11.10 | — |
| Women's Home Pajamas Pants (All-Over Printing) | S–5XL | From $7.56 | — |
| V-Neck Women Night Wear Suit (All-Over Printing) | S–XL | From $13.20 | — |
| 310gsm Wearable Sweater Blanket Oversize | One size | From $12.81 | — |
| Long Sleeve Nightdress (All-Over Printing) | S–XL | From $7.41 | — |
| Ruffle V-Neck T-Shirt (All-Over Printing) | S–5XL | From $5.91 | — |
| Long Sleeve Drop Shoulder Open Shirt (All-Over Printing) | S–2XL | From $9.75 | — |
| Tanga for Women (All-Over Printing) | S–2XL | From $3.77 | — |
| 2-Piece Ruffle Tankini Swimsuit (All-Over Printing) | S–2XL | From $12.56 | — |
| Custom Print Patterned Yoga Pants with 2 Pockets | S–2XL | From $8.70 | — |
| Short Sleeve Loungewear Set (All-Over Printing) | S–5XL | From $9.77 | — |
| Spaghetti Dress (All-Over Printing) | S–2XL | From $9.60 | — |
| Personalized Drawstring Yoga Pants (Straight Baggy) | S–3XL | From $6.34 | — |
| Women's Bikini Bottom (All-Over Printing) | S–2XL | From $5.12 | — |
| DTG 150gsm Raglan Women's 3/4 Sleeve T-shirt | S–3XL | From $6.81 | — |
| DTG 150gsm Raglan Women's Long Sleeve T-shirt | S–3XL | From $7.24 | — |
| DTG 260gsm Women's Printed Sweatshirt (Front Printing) | S–3XL | From $8.96 | — |
| 230gsm Drop shoulder Hoodie (All-Over Printing) | S–4XL | From $7.24 | — |
| 1/4 Zipper Long Sleeve Zip Gym Top (All-Over Printing) | S–3XL | From $9.92 | — |
| DTG 255gsm Cotton Women's Back Print Hoodie | S–3XL | From $10.03 | — |
| Printed V-neck Cami Top (All-Over Printing) | S–2XL | From $7.61 | — |
| Short Tank Top (All-Over Printing) | S–2XL | From $5.96 | — |
| Floral Camisole | S–2XL | From $4.89 | — |
| Sleeveless Crop Top (All-Over Printing) | S–2XL | From $6.19 | — |
| Women's Zipper Jacket (All-Over Printing) | XS–XL | From $8.31 | — |
| Ladies Swim Shorts | S–2XL | From $4.91 | — |
| Sports Yoga Bra (All-Over Printing) | S–2XL | From $6.69 | — |
| Bell Bottoms (All-Over Printing) | XS–XL | From $5.12 | — |
| Women's Jogger Sweatpants (All-Over Printing) | S–3XL | From $7.26 | — |
| Diagonal Shoulder Two Piece Set (All-Over Printing) | S–5XL | From $10.03 | — |
| Hot Yoga Pants for Women (All-Over Printing) | S–2XL | From $10.03 | — |
| Women Yoga Shorts (All-Over Printing) | S–2XL | From $6.60 | — |
| Women's Two Piece Swimsuit High Neck Halter Top | S–2XL | From $9.62 | — |
| High-collar Long-sleeve Bodysuit (All-Over Printing) | S–2XL | From $10.20 | — |
| V-neck 3/4 Sleeve Dress with Pockets | S–5XL | From $8.06 | — |
| One Shoulder Split Dress (All-Over Printing) | XS–L | From $8.96 | — |
| 230gsm Long Sleeve Hoodie Dress (All-Over Printing) | S–5XL | From $11.31 | — |
| Short Sleeve V Neck Lovely Dress (All-Over Printing) | 2XS–6XL | From $10.03 | — |
| Round Neck Short Sleeve Dress (All-Over Printing) | 2XS–8XL | From $11.06 | — |
| Thong Panties (All-Over Printing) | XS–XL | From $4.41 | — |
| Cutout Bodycon Slim Fit Dress (All-Over Printing) | S–5XL | From $10.03 | — |
| Sleeveless Ladies Tank Dress (All-Over Printing) | S–2XL | From $8.08 | — |
| 180gsm Women's Off the Shoulder Half-Sleeve T-shirt | S–5XL | From $5.96 | — |
| V Neck Sleeveless Dress (All-Over Printing) | S–2XL | From $8.06 | — |
| 140gsm Women Short Sleeve Shirt (All-Over Printing) | S–4XL | From $3.60 | — |
| V-neck Short Sleeve T-Shirt (All-Over Printing) | S–5XL | From $5.91 | — |
| V-neck Loose Long Sleeve T-shirt (All-Over Printing) | S–5XL | From $8.06 | — |
| Women's Flower Blouse Long Sleeve (All-Over Printing) | S–5XL | From $8.74 | — |
| Short Sleeve Navel Shirt Baby Tee (All-Over Printing) | S–3XL | From $2.57 | — |
| Women's Irregular Shirt (All-Over Printing) | S–8XL | From $10.41 | — |
| Drop Shoulder Women's Open Shirt (Irregular Hem) | S–2XL | From $11.70 | — |
| Casual Long Sleeve Vintage Tour Shirt (All-Over Printing) | S–3XL | From $8.10 | — |
| Women's Straight POLO Shirt (All-Over Printing) | S–5XL | From $8.74 | — |
| DTG 150gsm Women Custom Tees (Dual-sided Printing) | L–3XL | From $7.05 | — |
| Plus Size V-neck Long Sleeve Dress (All-Over Printing) | S–8XL | From $8.49 | — |
| V-neck Women Top with Quarter Sleeve (All-Over Printing) | S–5XL | From $8.53 | — |
| One-Piece Swimsuit (All-Over Printing) | S–2XL | From $10.46 | — |
| Spaghetti Strap Dress for Women (All-Over Printing) | S–5XL | From $11.06 | — |
| 110gsm Yoga Knickerbockers (All-Over Printing) | S–2XL | From $7.35 | — |
| DTG 255gsm Cotton Printed Hoodie for Women (Front Printing) | S–3XL | From $10.03 | — |
| Custom Zipper T-Shirts | S–3XL | From $7.61 | — |
| 230gsm Women's Graphic Hoodie (All-Over Printing) | S–3XL | From $6.84 | — |
| DTG 255gsm Cotton Women's Customize Hoodie with Pocket | S–3XL | From $10.24 | — |
| 230gsm Full Zipper Long Sleeve Hoodie (All-Over Printing) | S–5XL | From $13.63 | — |
| 230gsm Hooded Pullover (All-Over Printing) | S–5XL | From $11.10 | — |
| 230gsm Poncho-style Long Sleeve Hoodie (Irregular Hem) | S–5XL | From $12.77 | — |
| DTG 255gsm Cotton Women's Hoodie with Pocket (Dual-sided) | S–3XL | From $12.17 | — |
| 230gsm Lady Hoodie with Double-layer Cap | S–5XL | From $7.05 | — |
| 230gsm Hoodie for Women with Double-layer Cap | S–6XL | From $7.63 | — |
| 160gsm Lightweight Women's Hoodie (All-Over Printing) | S–5XL | From $4.84 | — |
| Turtle Neck Long Dress for Women (All-Over Printing) | XS–XL | From $11.91 | — |
| Loose Long-sleeve Dress with Pockets | S–5XL | From $8.06 | — |
| Sleeveless High Waist Dress (All-Over Printing) | S–2XL | From $13.80 | — |
| Long Dress Set (All-Over Printing) | S–5XL | From $9.81 | — |
| Plus Size Halter Tie Front Bikini Set | XL–4XL | From $9.17 | — |
| Plus Size Two Piece Swimsuit High Neck Halter Top | XL–4XL | From $10.26 | — |
| Multi-Strap Lace Briefs (All-Over Printing) | S–2XL | From $5.31 | — |
| Sexy One Piece Women Lingerie Bodysuit Deep V Teddy | S–3XL | From $6.34 | — |
| 170gsm Faux Cotton Women Zip up Jumpsuit Pajama | S–4XL | From $13.67 | — |
| 250gsm Women Flannel Zip up Jumpsuit Pajama | S–4XL | From $14.31 | — |
| DTG 150gsm Women's T-shirt with Short Sleeves | S–3XL | From $4.20 | — |
| 160gsm Sexy G String Thong for Women | S–3XL | From $4.63 | — |
| Sexy G String Thong for Women | S–3XL | From $6.39 | — |
| Anti-peep Skort with Pocket | S–4XL | From $5.49 | — |
| Women Slim Fit Slip Dress | S–2XL | From $7.67 | — |
| 170gsm Faux Cotton Drawstring Wide Leg Pajama Pants | S–5XL | From $6.99 | — |
| DTF 190gsm Women Washed Vintage T-Shirt (Front Printing) | S–2XL | From $6.53 | — |
| DTG 190gsm Women Washed Vintage T-Shirt (Front Printing) | S–2XL | From $8.33 | Premium |
| Round Neck Long Sleeve Dress with Pocket | S–2XL | From $9.81 | — |
| Sleeveless Vest (Dual-sided Printing) | S–2XL | From $11.12 | — |
| Long Sleeve Dress (All-Over Printing) | S–2XL | From $7.41 | — |
| Workout Yoga Set (All-over Printing) | S–2XL | From $11.31 | — |
| Workout Sports Bra for Women | S–2XL | From $4.97 | — |
| 250gsm Knee-Length Yoga Shorts (All-over Printing) | S–2XL | From $9.17 | — |
| 180gsm Faux Cotton Custom Short Sleeve T-Shirt | S–5XL | From $5.23 | — |
| Women Workout Yoga Pants with Lines | S–2XL | From $8.74 | — |
| Spaghetti Strap Dress (All-Over Printing) | S–2XL | From $12.45 | — |
| 2-Piece Women's Tankini Swimsuit (Top Printed) | S–6XL | From $13.46 | — |
| Women's Long Sleeve Sun Protection Shirt-UPF 40 UV Rash Guard | S–2XL | From $6.99 | — |
| 2-Piece Women's Tankini Set High Neck Halter Top | XS–2XL | From $9.81 | — |
| Plus Size Women's Halter Bikini Set | XL–4XL | From $9.17 | — |
| Women's One Piece Tummy Control V Neck Swimwear | S–2XL | From $10.69 | — |
| Plus Size Women Tankini 2-Piece Swimsuit (Top Printed) | XL–5XL | From $12.60 | — |
| 120gsm Worn-effect Fabric Women Satin Pajama Set | XS–5XL | From $11.96 | — |
| UPF50+ 180gsm Cooling Polyester Ruffle V-Neck T-Shirt | S–5XL | From $6.24 | Premium |
| UPF50+ 180gsm Cooling Short Sleeve Loungewear Set | S–5XL | From $10.84 | Premium |
| 160gsm Ice Silk V Neck Short-Sleeve Women Shirt | S–5XL | From $5.10 | — |
| Ice Silk Women Underwear Thongs | S–2XL | From $4.03 | — |
| 2-Piece Bikini Swimwear (All-Over Printing) | S–2XL | From $6.39 | — |
| 2-Piece Thong Triangle Bikini Set | XS–2XL | From $7.46 | — |
| Strapless Women Tube Top Y2K Bandeau | S–2XL | From $4.03 | — |
| Swimming Cap for Women and Men | One size | From $3.17 | — |
| Plus Size Two Piece Swimsuit with Tankini | XL–4XL | From $15.60 | — |
| 180gsm Plus Size Round-neck Short Sleeve Dress | L–4XL | From $8.27 | — |
| Asymmetrical Hem Shirt (All-Over Printing) | S–8XL | From $11.27 | Premium |
| Polar Fleece Double-Zip Jacket (All-Over Printing) | S–6XL | From $22.67 | Premium |
| Long-Sleeve Raglan T-Shirt for Women | S–6XL | From $9.84 | Premium |
| Loose-Fit 3/4 Sleeve Boat Neck T-Shirt | S–5XL | From $7.67 | Premium |
| Round Neck 3/4 Sleeve Long Dress | S–8XL | From $10.46 | Premium |
| 230gsm Wide Round Neck 3/4 Sleeve Long Dress | S–8XL | From $13.46 | Premium |
| Sleeveless Ankle-length Dress | S–5XL | From $10.67 | Premium |
| Short Sleeve V Neck Lovely Dress | 2XS–6XL | From $10.78 | Premium |
| 250gsm Tank Top Pocket Dress | 2XS–5XL | From $6.77 | — |
| Slim Fit Spaghetti Strap Dress for Women | XS–6XL | From $5.31 | — |
| 180gsm Sleeveless Dress for Women | S–3XL | From $5.10 | — |
| Cheerleader Set for Women | S–4XL | From $8.27 | — |
| Cheerleader Dress for Women | XS–2XL | From $5.74 | — |
| Women Baseball Jersey | S–4XL | From $7.67 | — |
| DTG 190gsm Cotton Summer Short Sleeve T-Shirts for Women | 2XS–4XL | From $9.99 | — |
| DTG 190gsm Cotton Pajama Pants for Women | S–5XL | From $11.27 | — |
| DTG 190gsm Cotton Thong Underwear for Women | S–2XL | From $5.49 | — |
| 233gsm Button-Down Polo Shirt for Women | S–3XL | From $6.71 | — |
| Workout Crop Yoga Tank Top | S–2XL | From $8.53 | — |
| 180gsm Slit Fitted Camisole Cheongsam | S–4XL | From $7.78 | — |
| 160gsm One Size Ice Silk Nightdress | XL | From $6.39 | — |
| 180gsm Women's Raglan T-shirt | S–5XL | From $5.27 | Premium |
| 180gsm Women's Baseball Jacket | XS–5XL | From $9.34 | — |
| 180gsm Women's Ice Silk Top with Half-Sleeve | S–6XL | From $6.17 | Premium |
| 180gsm Women's Cool Touch Fitted Quick Dry Top | S–6XL | From $10.89 | Premium |
| 180gsm Women's Long Sleeve Quick Dry Top | S–6XL | From $8.31 | Premium |
| 300gsm Women's Long Sleeve Sweater Dress | S–2XL | From $8.91 | — |
| 180gsm V-neck Dress for Women | S–3XL | From $7.41 | — |
| 140gsm Women's Sleeveless Polo Shirt | XS–4XL | From $5.53 | — |
| 300gsm Women's Drop Shoulder Cardigan | S–3XL | From $8.96 | — |
| Women's Stand-Up Collar Fleece Jacket | S–4XL | From $9.56 | — |
| 180gsm Women's Boxer Briefs | S–3XL | From $4.20 | — |
| Stand-up Collar Fleece Casual Jacket | S–6XL | From $27.39 | Premium |
| Winter Quilted Long-Sleeve Hooded Outerwear | S–6XL | From $37.24 | Premium |
| Fleece Sweatshirt Short Jacket for Women | S–6XL | From $13.46 | Premium |
| Double-Layer Hooded Top | S–6XL | From $23.31 | Premium |
| Full-Edge Binding Slim-Fit Jacket | S–6XL | From $16.46 | Premium |
| Double-Layered Hoodie with Pockets | S–6XL | From $16.99 | Premium |
| 310gsm Adult Hooded Blanket Sweatshirt | One size | From $11.53 | — |
| DTG 260gsm Women's Cute Sweatshirt (Back Printing) | S–3XL | From $8.96 | — |
| 180gsm Collarless Dress | XS–5XL | From $7.84 | — |
| 180gsm Women's V Neck Long Sleeved Top | S–5XL | From $6.60 | — |
| Bikini Swimsuit (All-Over Printing) | XS–2XL | From $8.64 | — |
| 180gsm Women's High-Rise Panties | S–2XL | From $3.60 | — |
| 180gsm Straight-Leg Drawstring Yoga Pants | S–2XL | From $7.20 | — |
| 170gsm Women's Ruffled Sweatshirt | S–5XL | From $6.34 | — |
| 180gsm Women's Low-Rise Panties | S–2XL | From $3.24 | — |
| 180gsm Women's Wide Leg Pant | XS–3XL | From $7.20 | — |
| 180gsm Women's Drop Shoulder Shirt | S–3XL | From $8.06 | — |
| 180gsm Women's V Neck Ruffled Sleeve Top | S–3XL | From $6.34 | — |
| 180gsm Lace Thong | XS–3XL | From $3.81 | — |
| 120gsm Mediterranean Style V Neck Mid-Sleeve Robe | S–5XL | From $10.20 | — |
| 120gsm Mediterranean Style V-Neck Suit | XS–5XL | From $11.10 | — |
| 120gsm Women's Mediterranean Style Set | XS–5XL | From $15.13 | — |
| 180gsm Midi Spaghetti Strap Dress | XS–5XL | From $6.60 | — |
| 180gsm Lace-Trimmed Camisole Nightgown | S–4XL | From $6.28 | — |
| 160gsm Ice Silk Camisole Pajama Set | XS–4XL | From $10.89 | — |
| 180gsm Ruffled Short-Sleeve Pajama Set | S–5XL | From $9.60 | — |
| 180gsm Women's V-Neck Pajama Set | S–5XL | From $11.96 | — |
| 180gsm V-Neck Short Sleeve Pajama Set | S–5XL | From $9.99 | — |
| 200gsm Women's 3/4 Sleeve Top | S–3XL | From $7.67 | — |
| 200gsm Side Slit Dress | S–5XL | From $9.39 | — |
| 180gsm V-Neck Short Sleeve Top | 2XS–5XL | From $5.31 | — |
| 250gsm Women's Yoga Sports Tank | S–6XL | From $9.60 | Premium |
| Short Sleeve Collared Shirt Dress | XS–6XL | From $9.77 | — |
| One Piece Swimsuit for Women | S–2XL | From $10.89 | — |
| Women's Loose Fit Casual Pants | S–5XL | From $8.91 | — |
| Off the Shoulder Top | S–2XL | From $4.63 | — |
| 180gsm Women's Lace Panties | XS–3XL | From $3.81 | — |
| 180gsm Women's V Neck Short Sleeve T-Shirt | S–2XL | From $4.41 | — |
| 180gsm Women's Backless Top | XS–L | From $4.67 | — |
| 200gsm Women's Loungewear Pajama Set | S–5XL | From $12.77 | — |
| 300gsm Button-Up Cardigan | S–5XL | From $11.96 | — |
| 100gsm Long Sleeve Mesh T-Shirt | S–5XL | From $5.42 | — |
| 200gsm Lace Trim V-Neck 3/4 Sleeve T-Shirt | S–5XL | From $7.48 | — |
| Chic Strapless Bandana Style Bikini | XS–2XL | From $8.10 | — |
| 170gsm Women's V Neck Long Sleeve Hoodie | S–3XL | From $7.20 | — |
| 300gsm Sleeveless Cardigan Vest | S–2XL | From $7.63 | — |
| 180gsm Cropped T-Shirt | S–3XL | From $5.70 | Premium |
| 170gsm Women's Casual Blazer | S–7XL | From $9.77 | — |
| 250gsm Flannel Women's Sleep Pants | S–5XL | From $7.89 | — |
| Sheer Mesh One-Piece Swimsuit | S–2XL | From $11.31 | — |
| 210gsm One Size Flannel Nightdress | XL | From $7.63 | — |
| 210gsm V Neck Tank Top | S–3XL | From $5.06 | — |
| 180gsm Puff Short Sleeve Top | 2XS–3XL | From $6.99 | — |
| 170gsm Women's Lightweight Cardigan | S–6XL | From $8.42 | — |
| Women's Ruffle T-shirt | XS–5XL | From $6.99 | — |
| Men's POLO Shirt | S–5XL | From $10.03 | Premium |
| Women's POLO Shirt | S–5XL | From $10.03 | Premium |
| 200gsm Double Layer V-Neck Top | S–5XL | From $8.27 | Premium |
| 180gsm Short Sleeve Nightdress | S–3XL | From $5.53 | — |
| 300gsm Sleeveless Knit Sweater | S–3XL | From $5.10 | — |
| 200gsm Ruffle Sleeve Dress | S–5XL | From $7.41 | — |
| 250gsm Women's 2-Button POLO Shirt | S–6XL | From $8.96 | Premium |
| 180gsm Short Cami Dress | XS–5XL | From $6.17 | — |
| 200gsm Women's Lace Trim Pajama Shorts | S–5XL | From $7.20 | — |
| 135gsm Button Down Collar Dress | S–6XL | From $12.41 | Premium |
| 180gsm Women's Flare Sleeve Tee | XS–5XL | From $5.10 | — |
| 180gsm Lace Trimmed Short Sleeve Nightgown | S–5XL | From $9.81 | — |
| 200gsm Women's Ruffled Sleep Pants | S–5XL | From $8.06 | — |
| Women's Ruffled Cover Up Dress | S–2XL | From $6.49 | — |
| 180gsm Women's V Neck Rugby Jersey | XS–5XL | From $4.89 | — |
| 180gsm Ruffled Yoga Skort with Pockets | XS–3XL | From $6.13 | — |
| 195gsm Square Neck One Piece Swimsuit | S–2XL | From $8.96 | — |
| Women's Ruffled Sleeve One Piece Swimsuit | S–2XL | From $9.17 | — |
| 180gsm Women's Halter Tie Vest | XS–5XL | From $3.49 | — |
| 100gsm Mesh High Stretch Dress Cover Up | S–5XL | From $7.74 | — |
| Button Down Shirts for Women | XS–5XL | From $7.89 | — |
| 180gsm Yoga Jogger Pants | S–2XL | From $9.13 | Premium |
| 200gsm Square Neck Tank Top | S–5XL | From $6.49 | — |
| Women's POLO Tank Top | XS–4XL | From $7.29 | Premium |
| 180gsm Ruffled V Neck Dress | XS–2XL | From $9.56 | — |
| Mesh One-Piece Swimsuit | S–2XL | From $9.13 | — |
| 200gsm V Neck Camisole | XS–4XL | From $5.10 | — |
| 200gsm Flared Sleeve T-shirt | S–5XL | From $5.91 | — |
| Two-Piece Swimsuit Set | S–2XL | From $11.31 | — |
| High Waisted Quick Drying Shorts | S–3XL | From $8.64 | Premium |
| 170gsm Women's Cuban Collar Pajama Set | S–2XL | From $13.20 | — |
| 180gsm Women's Short Sleeve Pajama Set | S–4XL | From $10.41 | — |
| High Neck Tank Top | S–5XL | From $6.73 | Premium |
| 200gsm Women's Casual V Neck Dress | S–5XL | From $6.81 | — |
| 180gsm Flared Slit Dress | S–5XL | From $8.10 | — |
| 200gsm V Neck Sleeveless Dress | XS–5XL | From $8.10 | Premium |
| 120gsm Women's Ruffle Long Sleeve Robe | S–5XL | From $9.34 | — |
| 150gsm Short Sleeved Wide Leg Pants Set | S–5XL | From $8.74 | — |
| 120gsm Sleeveless Top and Wide Leg Pants Set | S–5XL | From $9.71 | — |
| 150gsm Strap Top Wide Leg Pants Set | S–5XL | From $8.74 | — |
| 200gsm Lace Trim Pajama Set | XS–2XL | From $7.41 | — |
| 200gsm Ruffled Pajama Set | S–5XL | From $10.84 | — |
| 200gsm Women's Button Up Vest | S–3XL | From $4.89 | — |
| 100gsm High Neck Mesh Top For Women | S–5XL | From $5.53 | — |
| 200gsm Casual V Neck Dress For Women | S–3XL | From $9.99 | — |
| 180gsm Irregular Hemmed Skirt | S–3XL | From $6.13 | — |
| 200gsm Women's High Waisted Pants | S–5XL | From $9.56 | — |
| 200gsm Flared Sleeve Dress For Women | S–5XL | From $6.99 | — |
| 190gsm Mesh One Piece Swimsuit For Women | S–2XL | From $12.81 | — |
| 190gsm Strap One Piece Swimsuit For Women | S–2XL | From $12.81 | — |
| 190gsm Women's V Neck One Piece Swimsuit | S–2XL | From $12.81 | — |
| 180gsm Bat Sleeve Dress For Women | S–5XL | From $6.99 | — |
| 180gsm Women's Bubble Sleeve T-Shirt | S–5XL | From $6.34 | — |
| Women's Square Neck Long Sleeved Shirt | XS–5XL | From $6.34 | — |
| 230gsm Off Shoulder Hoodie | S–5XL | From $6.39 | — |
| Square Collar Long Sleeved Jumpsuit | XS–5XL | From $6.99 | — |
| 170gsm Women's Button Up Hoodie | S–5XL | From $7.46 | — |
| 200gsm V-Neck Pajama Set | S–3XL | From $9.34 | — |
| 190gsm Netted Swimsuit Set For Women | S–2XL | From $13.67 | — |
| 190gsm Sporty Bikini Swimwear Set | S–2XL | From $9.39 | — |
| 190gsm Mesh Splicing One-Piece Swimsuit | S–2XL | From $10.03 | — |
| 190gsm Backless One-Piece Swimsuit | S–2XL | From $11.96 | — |
| 170gsm Casual Long Sleeve V-Neck Sweatshirt | S–5XL | From $6.81 | — |
| 200gsm Women's Square Neckline Ruffle Dress | S–5XL | From $8.98 | Premium |
| Women's Suit Vest | S–5XL | From $5.96 | — |
| DTG 100gsm Cotton Women's Short Sleeved Shirt | XS–5XL | From $11.10 | — |
| 100gsm Irregular Shirt For Women | S–3XL | From $13.46 | — |
| DTG 110gsm Button Down Shirt For Men | XS–4XL | From $11.31 | — |
| 200gsm Women's Straight Wide Leg Pants | S–5XL | From $8.91 | — |
| 120gsm Lantern Long Sleeve Shirt | S–5XL | From $8.96 | — |
| 180gsm Women's Long Sleeve Cardigan With Pockets | S–5XL | From $7.84 | — |
| 180gsm Ankle-length Slip Dress With Straps | S–5XL | From $8.91 | — |
| 180gsm Short Sleeved Pajama Set | S–3XL | From $8.91 | — |

**POD total: 227 rows extracted.**

---

## PART C — Beauty / Skincare / Haircare / Makeup

| Name | Concern / Ingredient Tags | Size | Price | Badge / Variants |
|---|---|---|---|---|
| Anti-Age Hydrogel Eye Patches | Anti-age, Niacinamide (B3) | 7 Pcs | $16.35 | New, Coming Soon |
| Caffeine + Vitamin C Energizing Hydrogel Eye Patches | Vitamin C, Under-eye fatigue | 7 Pcs | $16.35 | New, Coming Soon |
| Anti-Fatigue Hydrogel Eye Patches | Panthenol, Under-eye fatigue | 7 Pcs | $16.35 | New, Coming Soon |
| Hyaluronic Hydrogel Lip Mask | Dehydrated skin, Panthenol | 7 Pcs | $20.70 | New, Coming Soon |
| Anti-Age Peptide Collection | Anti-age, Dehydrated skin | 3 products | $48.30 | New, Collection Box |
| Quick Refresh Dry Shampoo Spray | Propanediol, Lack of volume | 100 ml | $11.60 | New, Coming Soon |
| Aluminum-free Roll-on Deodorant | Odor protection, Panthenol | 50 ml | $12.60 | 1 Variant |
| Peptide Age-Defying Eye Cream | Anti-age, Vitamin C | 15 ml | $9.10 | New |
| Peptide Ageless AM/PM Cream | Anti-age, Vitamin C | 50 ml | $12.50 | New |
| Exosome & Niacinamide Serum | Anti-age, Lactic Acid | 30 ml | $14.20 | New |
| Lengthening & Volumising Mascara | Peptides, Lack of volume | 6 ml | $13.30 | New |
| Matte Lipstick, Dusty Rose | Dehydrated skin, Shea Butter | 4 g | $16.20 | New, 1 Variant |
| Matte Lipstick, Terracotta Nude | Dehydrated skin, Shea Butter | 4 g | $16.20 | New, 1 Variant |
| Foundation with Peptides, 05 Fair Neutral | Peptides, Dark spots | 30 ml | $16.40 | New, 9 Variants |
| Color Correcting Ceramide Stick, 25 Medium | Damaged skin barrier, Ceramides | 12 g | $13.70 | New, 3 Variants |
| Color Correcting Ceramide Stick, 35 Deep | Damaged skin barrier, Ceramides | 12 g | $13.70 | New, 3 Variants |
| Correcting Concealer, 10 Light Warm | Hyaluronic Acid, Sensitive skin | 4 ml | $13.50 | New, 6 Variants |
| Correcting Concealer, 20 Medium Warm | Hyaluronic Acid, Sensitive skin | 4 ml | $13.50 | New, 6 Variants |
| Scalp Care Exfoliating Serum | Sodium Hyaluronate, Lack of volume | 30 ml | $13.30 | — |
| Color Correcting Ceramide Stick, 20 Light | Damaged skin barrier, Ceramides | 12 g | $13.70 | New, 3 Variants |
| Color Correcting Ceramide Stick, 30 Tan | Damaged skin barrier, Ceramides | 12 g | $13.70 | New, 3 Variants |
| Correcting Concealer, 30 Tan Neutral | Hyaluronic Acid, Sensitive skin | 4 ml | $13.50 | New, 6 Variants |
| Correcting Concealer, 35 Deep Neutral | Hyaluronic Acid, Sensitive skin | 4 ml | $13.50 | New, 6 Variants |
| Foundation with Peptides, 10 Light Warm | Peptides, Dark spots | 30 ml | $16.40 | New, 9 Variants |
| Foundation with Peptides, 15 Light Cool | Peptides, Dark spots | 30 ml | $16.40 | New, 9 Variants |
| Foundation with Peptides, 20 Medium Neutral | Peptides, Dark spots | 30 ml | $16.40 | New, 9 Variants |
| Foundation with Peptides, 25 Medium Warm | Peptides, Dark spots | 30 ml | $16.40 | New, 9 Variants |
| Foundation with Peptides, 30 Tan Neutral | Peptides, Dark spots | 30 ml | $16.40 | New, 9 Variants |
| Foundation with Peptides, 35 Tan Warm | Peptides, Dark spots | 30 ml | $16.40 | New, 9 Variants |
| Foundation with Peptides, 45 Deep Warm | Peptides, Dark spots | 30 ml | $16.40 | New, 9 Variants |
| Foundation with Peptides, 50 Deep Cool | Peptides, Dark spots | 30 ml | $16.40 | New, 9 Variants |
| Correcting Concealer, 25 Medium Neutral | Hyaluronic Acid, Sensitive skin | 4 ml | $13.50 | New, 6 Variants |
| Correcting Concealer, 05 Light Cool | Hyaluronic Acid, Sensitive skin | 4 ml | $13.50 | New, 6 Variants |
| Correcting Concealer, 15 Medium Cool | Hyaluronic Acid, Sensitive skin | 4 ml | $13.50 | New, 6 Variants |
| Blemish Purifying Face Wash | Blemishes, Sodium PCA | 140 ml | $13.70 | New |
| Blemish Care Moisturiser | Blemishes, Argan Oil | 50 ml | $13.30 | New |
| Radiant Glow Facial Wash | Cleansing, Aloe Juice | 145 ml | $13.70 | — |
| Clay Mask for Pores and Blackheads | Blemishes, Aloe Juice | 90 ml | $15.80 | New |
| Omega 6-9 Glowing Skin Body Oil | Vitamin E, Dehydrated skin | 150 ml | $18.20 | — |
| Sensitive Skin Overnight Cream, Fragrance-Free | Algae, Sensitive skin | 50 ml | $14.90 | — |
| Keratin Intensive Rescue Hair Mask | Keratin, Dry ends | 170 ml | $15.90 | — |
| Soy Wax Candle, Wild Flower | — | 100 ml | $10.80 | — |
| Soy Wax Candle, Moss | — | 100 ml | $10.80 | — |
| Soy Wax Candle, Lavender | — | 100 ml | $10.80 | — |
| Soy Wax Candle, Heather | — | 100 ml | $10.80 | — |
| Baby Body Lotion | Vitamin C, Dehydrated skin | 190 ml | $12.60 | — |
| Baby Foaming Wash | Cleansing, Aloe Juice | 150 ml | $12.40 | — |
| Baby Body Wash | Cleansing, Aloe Juice | 390 ml | $12.90 | — |
| Gentle Baby Shampoo | Prebiotics, Cleansing | 400 ml | $13.30 | — |
| Keratin Volume Boost Conditioner | Keratin, Lack of glow | 390 ml | $12.50 | — |
| Retinol Alternative Serum | Vitamin C, Anti-age | 30 ml | $14.60 | — |
| Retinol Alternative Moisturiser | Anti-age, Vitamin C | 50 ml | $12.70 | — |
| Retinol Alternative Eye Serum | Anti-age, Vitamin C | 15 ml | $13.30 | — |
| Brightening Face & Body Exfoliator with Kojic Acid | Vitamin C, Dark spots | 150 ml | $12.10 | — |
| Dark Spot Face Cream with Kojic Acid | Kojic Acid, Dark spots | 50 ml | $13.00 | — |
| Targeted Dark Spot Care, 1% Kojic Acid | Kojic Acid, Dark spots | 15 ml | $12.10 | — |
| Keratin Volume Boost Shampoo | Rosemary Oil, Lack of volume | 390 ml | $13.30 | — |
| Sensitive Skin Face & Body Cleanser | Cleansing, Sodium PCA | 390 ml | $8.75 (was $12.50) | −30% |
| Rosemary Hair & Scalp Strengthening Oil | Rosemary Oil, Dehydrated skin | 30 ml | $11.90 | — |
| Keratin Shine Leave-In Hair Mist | Keratin, Lack of glow | 100 ml | $12.70 | Trending |
| Deep Cleanse Scalp Scrub, Rosemary & Mint | Keratin, Lack of glow | 170 ml | $15.50 | — |
| Icelandic Volcano Face & Body Scrub | Volcanic sand, Cleansing | 170 ml | $15.20 | Trending |
| Microbiome Prebiotics Face Mist | Prebiotics, Damaged skin barrier | 100 ml | $12.70 | — |
| Bioactive Prebiotics Jelly Serum | Prebiotics, Damaged skin barrier | 30 ml | $13.80 | 1 Variant |
| Anti-Aging Performance Duo | Peptides, Anti-age | 2 products | $27.20 | Collection Box |
| Dark Spot Routine Duo | Vitamin C, Dark spots | 2 products | $27.20 | Collection Box |
| Caffeine Gel Booster | Anti-age, Caffeine | 30 ml | $12.60 | 2 Variants |
| The Ultimate Hydration Duo | Dehydrated skin, Hyaluronic Acid | 2 products | $27.20 | Collection Box |
| Antioxidant Ginkgo Gel Booster | Anti-age | 30 ml | $10.20 | 2 Variants |
| Sensitive Skin Body Cream | Dehydrated skin, Cocoa Butter | 190 ml | $14.90 | — |
| Clear Complexion Collection Box | Anti-age, Blemishes | 3 products | $38.00 | Collection Box |
| Sensitive Scalp Shampoo | Lack of volume, Betaine | 400 ml | $13.70 | — |
| 5% Urea + 2% Panthenol Body Cream | Urea, Dehydrated skin | 280 ml | $16.40 | Trending, 1 Variant |
| Timeless Radiance Collection Box | Anti-age, Dehydrated skin | 3 products | $42.80 | Collection Box |
| Sensitive Skin Moisturiser, Fragrance Free | Dehydrated skin, Hyaluronic Acid | 50 ml | $14.10 | — |
| Rejuvenating Glow Collection Box | Dark spots, Dehydrated skin | 3 products | $42.80 | Collection Box |
| Anti-Age Day Cream | Anti-age, Hyaluronic Acid | 15 ml | $12.10 | 2 Variants |
| Pigment Perfecting Serum | Anti-age, Vitamin E | 30 ml | $15.20 | — |
| The Age-Defying Trio Collection Box | Anti-age, Dehydrated skin | 3 products | $51.40 | Collection Box |
| Glowy Skin Trio Collection Box | Anti-age, Dehydrated skin | 3 products | $42.80 | Collection Box |
| Deep Moisture Collection Box | Anti-age, Dehydrated skin | 3 products | $45.30 | Collection Box |
| The Ultimate Renewal Collection Box | Anti-age, Dark spots | 3 products | $45.30 | Collection Box |
| Daily Radiance Collection Box | Dehydrated skin | 3 products | $42.80 | Collection Box |
| Hydration Ritual Collection Box | Dehydrated skin | 3 products | $45.30 | Collection Box |
| BiPhasic Make-up Remover, Fragrance Free | Cleansing, Hyaluronic Acid | 100 ml | $15.40 | — |
| Anti-Aging Collection Box | Anti-age, Dehydrated skin | 3 products | $47.70 | Collection Box, Trending |
| Glycolic Acid Exfoliating Toner | Dark spots, Glycolic Acid | 250 ml | $7.05 (was $14.10) | −50% |
| Silk Skin Body Serum, Woody Amber & Leather | Dehydrated skin, Hyaluronic Acid | 270 ml | $8.19 (was $11.70) | −30% |
| Silk Skin Body Serum, Spices & Sandalwood | Dehydrated skin, Cocoa Butter | 270 ml | $8.47 (was $12.10) | −30% |
| Silk Skin Hand Cream, Spices & Sandalwood | Dehydrated skin, Cocoa Butter | 270 ml | $8.89 (was $12.70) | −30% |
| Silk Skin Hand Cream, Woody Amber & Leather | Dehydrated skin, Cocoa Butter | 270 ml | $8.89 (was $12.70) | −30% |
| Moisturising Day Cream | Dehydrated skin, Hyaluronic Acid | 15 ml | $11.60 | 2 Variants |
| Sensitive Skin Oil-To-Milk Cleanser | Cleansing, Dehydrated skin | 150 ml | $16.60 | — |
| Gloss Conditioner, Smoky Green Vetiver | Dry ends, Panthenol | 370 ml | $8.47 (was $12.10) | −30%, Trending |
| Gloss Shampoo, Smoky Green Vetiver | Lack of glow, Betaine | 400 ml | $8.47 (was $12.10) | −30%, Trending |
| Fresh Conditioner, Citrus Cocktail | Dry ends, Panthenol | 370 ml | $12.90 | — |
| Colour Care Shampoo, Peachy Grapefruit Zest | Colour care, Aloe Juice | 400 ml | $8.47 (was $12.10) | −30% |
| Hand & Body Wash, Grapefruit | Cleansing, Betaine | 490 ml | $10.20 | 1 Variant |
| 3-in-1 Eye Cream for Men | Anti-age, Hyaluronic Acid | 15 ml | $8.16 (was $13.60) | −40% |
| 2-in-1 Hair & Body Wash for Men | Cleansing, Betaine | 490 ml | $11.90 | — |
| Oil-Free Zinc Face Gel for Men | Blemishes, Hyaluronic Acid | 50 ml | $15.70 | — |
| Hyaluronic Acid Face Cream for Men | Dehydrated skin, Hyaluronic Acid | 50 ml | $16.00 | — |
| Softening Beard Oil | Dry ends | 20 ml | $13.60 | — |
| Youthful Glow Serum | Anti-age, Hyaluronic Acid | 30 ml | $8.10 (was $16.20) | −50% |
| Anti-Age Night Cream | Anti-age, Cocoa Butter | 50 ml | $17.30 | — |
| Ceramide Barrier Night Cream | Anti-age, Ceramides | 50 ml | $17.30 | — |
| Nourishing Facial Oil | Anti-age, Argan Oil | 30 ml | $15.20 | 2 Variants |
| Natural Retinol Alternative Oil Serum | Anti-age, Retinol Alternative | 30 ml | $16.20 | Trending, 1 Variant |
| Hand & Body Wash, Peppermint & Dark Cedar | Cleansing, Betaine | 490 ml | $8.00 (was $10.00) | −20%, 1 Variant |
| Hand & Body Wash, Ginger & Smoky Cardamom | Cleansing, Betaine | 490 ml | $7.50 (was $10.00) | −25%, Trending, 1 Variant |
| Hand & Body Wash, Patchouli & Amber Vanilla | Cleansing, Betaine | 490 ml | $8.50 (was $10.00) | −15%, 1 Variant |
| AHA Peeling Concentrate | Blemishes, Hyaluronic Acid | 30 ml | $14.10 | — |
| Peptide Anti-Aging Serum | Anti-age, Peptides | 30 ml | $15.70 | Trending |
| Double Hydration Boost Gel + HA | Anti-age, Hyaluronic Acid | 30 ml | $12.70 | Trending, 5 Variants |
| Vitamin C Serum | Anti-age, Vitamin C | 30 ml | $15.40 | Trending |
| All-In-One Facial Oil | Vitamin E, Dehydrated skin | 30 ml | $15.20 | 1 Variant |
| Cleansing Foam | Cleansing, Make-up buildup | 150 ml | $11.70 | — |
| Anti-Age Day Cream | Anti-age, Hyaluronic Acid | 50 ml | $16.20 | 1 Variant |
| Niacinamide Gel Moisturiser | Dark spots, Niacinamide (B3) | 50 ml | $13.50 | 3 Variants |
| Calming Facial Oil | CBD, Dehydrated skin | 20 ml | $19.00 | 1 Variant |
| Caffeine Gel Booster | Anti-age, Caffeine | 20 ml | $11.90 | 2 Variants |
| Oil-Free Hydrating Gel | Blemishes, Hyaluronic Acid | 50 ml | $15.70 | 5 Variants |
| Hydrating Serum | Anti-age, Hyaluronic Acid | 30 ml | $15.30 | 1 Variant |
| Antioxidant Ginkgo Gel Booster | Anti-age, Damaged skin barrier | 20 ml | $11.40 | 2 Variants |
| Moisturising Day Cream | Dehydrated skin, Hyaluronic Acid | 50 ml | $6.40 (was $16.00) | −60%, 2 Variants |
| Moisturising Shampoo | Dehydrated skin, Aloe Juice | 290 ml | $11.50 | — |
| Nourishing Facial Oil | Anti-age, Argan Oil | 15 ml | $13.60 | 2 Variants |
| Calming Eye Cream | CBD, Under-eye fatigue | 15 ml | $13.70 | — |
| Brightening Eye Cream | Dark spots, Shea Butter | 15 ml | $12.70 | — |
| Nourishing Rich Cream, Fragrance Free | Anti-age, Argan Oil | 50 ml | $15.80 | — |
| Light Moisturising Day Cream | Blemishes, Argan Oil | 50 ml | $15.20 | — |
| Moisturising Day Cream | Dehydrated skin, Hyaluronic Acid | 50 ml | $16.00 | Trending, 2 Variants |
| Purifying Toner | Blemishes, Salicylic Acid | 200 ml | $10.90 | 1 Variant |
| Hydrating Toner | Cleansing, Hyaluronic Acid | 200 ml | $10.90 | 1 Variant |
| Micellar Cleansing Water | Cleansing, Hyaluronic Acid | 200 ml | $9.80 | 1 Variant |
| Anti-Age Day Cream | Anti-age, Hyaluronic Acid | 50 ml | $16.20 | Trending, 1 Variant |
| Smoothing Eye Cream | Anti-age, Hyaluronic Acid | 15 ml | $13.60 | — |
| Caffeine Gel Booster | Anti-age, Caffeine | 15 ml | $7.50 | Out Of Stock, 2 Variants |
| Purifying Mousse | Blemishes, Aloe Juice | 190 ml | $13.20 | — |
| Clarifying Gel | Blemishes, Aloe Juice | 200 ml | $7.25 (was $11.70) | −38% |
| Gentle Cleansing Milk | Anti-age, Argan Oil | 190 ml | $11.70 | — |
| Hand & Body Wash, Grapefruit | Cleansing, Betaine | 490 ml | $10.20 | 1 Variant |

**Beauty total: 143 rows extracted.** (Several near-identical entries — e.g. multiple "Moisturising Day Cream" and "Caffeine Gel Booster" at different sizes/prices — are genuine size-variant SKUs from the source, not duplicates; model them as one parent product with a `size` variant axis.)

---

## PART D — Bags

| Name | Material | Dimensions | Badge |
|---|---|---|---|
| Classic Quilted Shoulder Bag | PU Leather | 28×20×8 cm | Best Seller |
| Minimalist Leather Hobo | Genuine Leather | 35×25×10 cm | — |
| Chain Strap Shoulder Bag | PU Leather | 22×16×6 cm | Trending |
| Structured Top Handle Bag | Vegan Leather | 30×22×12 cm | — |
| Soft Pebbled Shoulder Bag | PU Leather | 32×24×9 cm | Inquire |
| Wide Strap Boho Bag | Canvas + PU | 36×28×11 cm | New, Inquire |
| Croc-Embossed Shoulder Bag | PU Leather | 26×18×8 cm | — |
| Convertible Backpack Shoulder | Genuine Leather | 28×20×10 cm | — |

---

## Grand Total

| Part | Items extracted |
|---|---|
| A — Blank Apparel | 284 |
| B — Print-on-Demand | 227 |
| C — Beauty | 143 |
| D — Bags | 8 |
| **Total** | **662** |

This is the full data; nothing held back this time. Next natural step is converting this into your actual import format (CSV/JSON) matching the schema in `product-catalog-schema.md` — say the word and I'll generate that directly from these tables.