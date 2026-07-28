'use client';

import type { CatalogProduct, ProductFamily } from '@/lib/commerce-store';

// ============ FAMILY LABELS ============

export const FAMILY_LABELS: Record<ProductFamily, string> = {
  BlankApparel: 'Stock Apparel',
  PrintOnDemand: 'Artist-Designed Apparel',
  Beauty: 'Beauty & Wellness',
  Bags: 'Bags & Accessories',
  Music: 'Music & Audio',
  FinishedMerch: 'Branded Merch',
};

// ============ MOCK PRODUCT CATALOG ============
// Product families are admin-only concepts — fans see "Apparel", "Beauty", "Bags"
// BlankApparel = stock/unprinted apparel for inventory reference (admin creates finished products from these)
// PrintOnDemand = artist-designed apparel with custom prints (these are the finished products fans see)
// Fans NEVER see "Blank" or "Print-on-Demand" labels — they just see Apparel items

const id = (prefix: string, n: number) => `${prefix}-${n}`;

export const mockCatalogProducts: CatalogProduct[] = [
  // ====== BLANK APPAREL ======
  { id: id('bp', 1), name: 'Unisex Heavy Cotton Tee', slug: 'unisex-heavy-cotton-tee', description: 'Classic fit heavyweight cotton tee. Side-seamed construction for durability. Double-needle stitching on neck and sleeves.', productFamily: 'BlankApparel', category: 'T-Shirts', sku: 'WT0216', fabric: '130gsm/3.8oz', availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'], availableColors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#000000' }, { name: 'Navy', hex: '#1B2A4A' }, { name: 'Red', hex: '#CC0000' }], wholesalePriceCents: 450, retailPriceCents: 2499, badges: ['BESTSELLER'], images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop'], sizeGuide: { S: { chest: '36"', length: '28"' }, M: { chest: '40"', length: '29"' }, L: { chest: '44"', length: '30"' }, XL: { chest: '48"', length: '31"' }, '2XL': { chest: '52"', length: '32"' }, '3XL': { chest: '56"', length: '33"' } }, isPublished: true, inventoryCount: 150, sortOrder: 1 },
  { id: id('bp', 2), name: 'Women\'s Crop Tee', slug: 'womens-crop-tee', description: 'Fashion-forward crop tee with relaxed fit. Soft cotton blend perfect for summer styling.', productFamily: 'BlankApparel', category: 'T-Shirts', subcategory: 'Crop', sku: 'WT0220', fabric: '145gsm/4.2oz', availableSizes: ['XS', 'S', 'M', 'L', 'XL'], availableColors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Blush', hex: '#DEB8B8' }, { name: 'Black', hex: '#000000' }], wholesalePriceCents: 480, retailPriceCents: 2299, badges: ['NEW'], images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop'], sizeGuide: { XS: { chest: '32"', length: '22"' }, S: { chest: '34"', length: '23"' }, M: { chest: '36"', length: '24"' }, L: { chest: '38"', length: '25"' }, XL: { chest: '40"', length: '26"' } }, isPublished: true, inventoryCount: 80, sortOrder: 2 },
  { id: id('bp', 3), name: 'Unisex Tank Top', slug: 'unisex-tank-top', description: 'Lightweight ribbed tank top. Ideal for active lifestyles or layered summer looks.', productFamily: 'BlankApparel', category: 'Tank Tops', sku: 'WT0310', fabric: '140gsm/4.0oz', availableSizes: ['S', 'M', 'L', 'XL', '2XL'], availableColors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#000000' }, { name: 'Grey', hex: '#808080' }], wholesalePriceCents: 350, retailPriceCents: 1999, badges: [], images: ['https://images.unsplash.com/photo-1571945153237-4929e7831a5e?w=400&h=500&fit=crop'], sizeGuide: { S: { chest: '34"', length: '26"' }, M: { chest: '38"', length: '27"' }, L: { chest: '42"', length: '28"' }, XL: { chest: '46"', length: '29"' }, '2XL': { chest: '50"', length: '30"' } }, isPublished: true, inventoryCount: 60, sortOrder: 3 },
  { id: id('bp', 4), name: 'Heavyweight Hoodie', slug: 'heavyweight-hoodie', description: 'Premium heavyweight hoodie with kangaroo pocket. Double-lined hood with drawstring. Ribbed cuffs and waistband.', productFamily: 'BlankApparel', category: 'Hoodies', sku: 'WH500', fabric: '320gsm/9.4oz', availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'], availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'Navy', hex: '#1B2A4A' }, { name: 'Grey', hex: '#808080' }, { name: 'White', hex: '#FFFFFF' }], wholesalePriceCents: 1200, retailPriceCents: 5999, badges: ['BESTSELLER'], images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop'], sizeGuide: { S: { chest: '40"', length: '27"' }, M: { chest: '44"', length: '28"' }, L: { chest: '48"', length: '29"' }, XL: { chest: '52"', length: '30"' }, '2XL': { chest: '56"', length: '31"' }, '3XL': { chest: '60"', length: '32"' } }, isPublished: true, inventoryCount: 45, sortOrder: 4 },
  { id: id('bp', 5), name: 'Unisex Sweatshirt', slug: 'unisex-sweatshirt', description: 'Classic crew neck sweatshirt. Soft fleece interior for warmth. Ribbed collar, cuffs, and hem.', productFamily: 'BlankApparel', category: 'Sweatshirts', sku: 'WS550', fabric: '280gsm/8.2oz', availableSizes: ['S', 'M', 'L', 'XL', '2XL'], availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'Navy', hex: '#1B2A4A' }, { name: 'Burgundy', hex: '#800020' }], wholesalePriceCents: 900, retailPriceCents: 4499, badges: [], images: ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400&h=500&fit=crop'], sizeGuide: { S: { chest: '40"', length: '26"' }, M: { chest: '44"', length: '27"' }, L: { chest: '48"', length: '28"' }, XL: { chest: '52"', length: '29"' }, '2XL': { chest: '56"', length: '30"' } }, isPublished: true, inventoryCount: 30, sortOrder: 5 },
  { id: id('bp', 6), name: 'Sports Bra Activewear', slug: 'sports-bra-activewear', description: 'Medium-support sports bra with moisture-wicking fabric. Perfect for yoga, running, or gym training.', productFamily: 'BlankApparel', category: 'Activewear', subcategory: 'Sports Bra', sku: 'WA100', fabric: '180gsm/5.3oz', availableSizes: ['XS', 'S', 'M', 'L', 'XL'], availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'Nude', hex: '#E8D4B8' }, { name: 'Pink', hex: '#FF69B4' }], wholesalePriceCents: 500, retailPriceCents: 2999, badges: ['NEW'], images: ['https://images.unsplash.com/photo-1571019613454-1cb2b9942b5e?w=400&h=500&fit=crop'], sizeGuide: { XS: { bust: '30-32"', length: '14"' }, S: { bust: '32-34"', length: '15"' }, M: { bust: '34-36"', length: '16"' }, L: { bust: '36-38"', length: '17"' }, XL: { bust: '38-40"', length: '18"' } }, isPublished: true, inventoryCount: 70, sortOrder: 6 },
  { id: id('bp', 7), name: 'Athletic Shorts', slug: 'athletic-shorts', description: 'Lightweight athletic shorts with built-in liner. Quick-dry fabric for peak performance.', productFamily: 'BlankApparel', category: 'Shorts', sku: 'WS200', fabric: '160gsm/4.7oz', availableSizes: ['S', 'M', 'L', 'XL', '2XL'], availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'Navy', hex: '#1B2A4A' }, { name: 'Grey', hex: '#808080' }], wholesalePriceCents: 400, retailPriceCents: 2499, badges: [], images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop'], sizeGuide: { S: { waist: '28"', inseam: '7"' }, M: { waist: '32"', inseam: '7.5"' }, L: { waist: '36"', inseam: '8"' }, XL: { waist: '40"', inseam: '8.5"' }, '2XL': { waist: '44"', inseam: '9"' } }, isPublished: true, inventoryCount: 55, sortOrder: 7 },
  { id: id('bp', 8), name: 'Jogger Sweatpants', slug: 'jogger-sweatpants', description: 'Modern jogger sweatpants with tapered leg and elastic cuffs. Fleece-lined interior.', productFamily: 'BlankApparel', category: 'Sweatpants', sku: 'WP600', fabric: '300gsm/8.8oz', availableSizes: ['S', 'M', 'L', 'XL', '2XL'], availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'Grey', hex: '#808080' }, { name: 'Navy', hex: '#1B2A4A' }], wholesalePriceCents: 850, retailPriceCents: 4499, badges: [], images: ['https://images.unsplash.com/photo-1552902865-b8c34162f5e4?w=400&h=500&fit=crop'], sizeGuide: { S: { waist: '28"', inseam: '29"' }, M: { waist: '32"', inseam: '30"' }, L: { waist: '36"', inseam: '31"' }, XL: { waist: '40"', inseam: '32"' }, '2XL': { waist: '44"', inseam: '33"' } }, isPublished: true, inventoryCount: 25, sortOrder: 8 },
  { id: id('bp', 9), name: 'Mini Skirt', slug: 'mini-skirt', description: 'A-line mini skirt with high waistband. Soft cotton stretch blend for comfortable wear.', productFamily: 'BlankApparel', category: 'Skirts', sku: 'WK100', fabric: '150gsm/4.4oz', availableSizes: ['XS', 'S', 'M', 'L', 'XL'], availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Denim', hex: '#6B8DB5' }], wholesalePriceCents: 420, retailPriceCents: 2999, badges: [], images: [], sizeGuide: { XS: { waist: '24"', length: '16"' }, S: { waist: '26"', length: '17"' }, M: { waist: '28"', length: '18"' }, L: { waist: '30"', length: '19"' }, XL: { waist: '32"', length: '20"' } }, isPublished: true, inventoryCount: 40, sortOrder: 9 },
  { id: id('bp', 10), name: 'Polo Shirt', slug: 'polo-shirt', description: 'Classic polo shirt with ribbed collar and two-button placket. Piqué knit fabric.', productFamily: 'BlankApparel', category: 'PoloShirts', sku: 'WP010', fabric: '200gsm/5.9oz', availableSizes: ['S', 'M', 'L', 'XL', '2XL'], availableColors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Navy', hex: '#1B2A4A' }, { name: 'Black', hex: '#000000' }], wholesalePriceCents: 650, retailPriceCents: 3499, badges: [], images: [], sizeGuide: { S: { chest: '36"', length: '27"' }, M: { chest: '40"', length: '28"' }, L: { chest: '44"', length: '29"' }, XL: { chest: '48"', length: '30"' }, '2XL': { chest: '52"', length: '31"' } }, isPublished: true, inventoryCount: 50, sortOrder: 10 },
  { id: id('bp', 11), name: 'Puffer Jacket', slug: 'puffer-jacket', description: 'Quilted puffer jacket with water-resistant shell. Insulated filling for cold weather.', productFamily: 'BlankApparel', category: 'CoatsJackets', sku: 'WJ800', fabric: 'Shell: 75gsm/2.2oz', availableSizes: ['S', 'M', 'L', 'XL', '2XL'], availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'Navy', hex: '#1B2A4A' }, { name: 'Olive', hex: '#556B2F' }], wholesalePriceCents: 2000, retailPriceCents: 8999, badges: ['NEW'], images: [], sizeGuide: { S: { chest: '38"', length: '25"' }, M: { chest: '42"', length: '26"' }, L: { chest: '46"', length: '27"' }, XL: { chest: '50"', length: '28"' }, '2XL': { chest: '54"', length: '29"' } }, isPublished: false, inventoryCount: 15, sortOrder: 11 },

  // ====== PRINT ON DEMAND ======
  { id: id('pod', 1), name: 'Graphic Tee — Midnight Echoes', slug: 'graphic-tee-midnight-echoes', description: 'Limited edition graphic tee featuring the Midnight Echoes album art. Premium cotton construction.', productFamily: 'PrintOnDemand', category: 'POD_Tops', sku: 'RU0007', fabric: '180gsm/5.3oz', availableSizes: ['S', 'M', 'L', 'XL', '2XL'], availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }], wholesalePriceCents: 800, retailPriceCents: 3499, badges: ['BESTSELLER', 'LIMITED'], images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop'], sizeGuide: { S: { chest: '36"', length: '28"' }, M: { chest: '40"', length: '29"' }, L: { chest: '44"', length: '30"' }, XL: { chest: '48"', length: '31"' }, '2XL': { chest: '52"', length: '32"' } }, isPublished: true, inventoryCount: 200, sortOrder: 1 },
  { id: id('pod', 2), name: 'Neon Dreams Hoodie', slug: 'neon-dreams-hoodie', description: 'All-over print hoodie featuring neon dream aesthetic. Soft fleece lining.', productFamily: 'PrintOnDemand', category: 'POD_Hoodies', sku: 'RU0100', fabric: '280gsm/8.2oz', availableSizes: ['S', 'M', 'L', 'XL', '2XL'], availableColors: [{ name: 'Black', hex: '#000000' }], wholesalePriceCents: 1500, retailPriceCents: 6999, badges: ['BESTSELLER'], images: ['https://images.unsplash.com/photo-1618354691373-d851c5c31112?w=400&h=500&fit=crop'], sizeGuide: { S: { chest: '40"', length: '27"' }, M: { chest: '44"', length: '28"' }, L: { chest: '48"', length: '29"' }, XL: { chest: '52"', length: '30"' }, '2XL': { chest: '56"', length: '31"' } }, isPublished: true, inventoryCount: 75, sortOrder: 2 },
  { id: id('pod', 3), name: 'Adea Lyric Dress — Concert Edition', slug: 'adea-lyric-dress-concert', description: 'Flowing concert dress with Adea Lyric branding. Elegant yet comfortable for live events.', productFamily: 'PrintOnDemand', category: 'POD_Dresses', sku: 'RU0200', fabric: '160gsm/4.7oz', availableSizes: ['XS', 'S', 'M', 'L', 'XL'], availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'Purple', hex: '#800080' }], wholesalePriceCents: 1100, retailPriceCents: 5499, badges: ['NEW'], images: [], sizeGuide: { XS: { bust: '32"', length: '38"' }, S: { bust: '34"', length: '39"' }, M: { bust: '36"', length: '40"' }, L: { bust: '38"', length: '41"' }, XL: { bust: '40"', length: '42"' } }, isPublished: true, inventoryCount: 30, sortOrder: 3 },
  { id: id('pod', 4), name: 'Artist Matching Set', slug: 'artist-matching-set', description: 'Two-piece matching set with album artwork. Crop top + jogger pants.', productFamily: 'PrintOnDemand', category: 'POD_Sets', sku: 'RU0300', fabric: '200gsm/5.9oz', availableSizes: ['S', 'M', 'L', 'XL'], availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }], wholesalePriceCents: 1400, retailPriceCents: 7999, badges: ['TRENDING'], images: [], sizeGuide: { S: { top: 'chest 34"', pants: 'waist 26"' }, M: { top: 'chest 38"', pants: 'waist 30"' }, L: { top: 'chest 42"', pants: 'waist 34"' }, XL: { top: 'chest 46"', pants: 'waist 38"' } }, isPublished: true, inventoryCount: 20, sortOrder: 4 },
  { id: id('pod', 5), name: 'Yoga Leggings — Frequency Print', slug: 'yoga-leggings-frequency', description: 'High-waisted yoga leggings with frequency wave pattern. Squat-proof fabric.', productFamily: 'PrintOnDemand', category: 'POD_Yoga', sku: 'RU0400', fabric: '220gsm/6.5oz', availableSizes: ['XS', 'S', 'M', 'L', 'XL'], availableColors: [{ name: 'Black', hex: '#000000' }], wholesalePriceCents: 900, retailPriceCents: 4499, badges: [], images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=500&fit=crop'], sizeGuide: { XS: { waist: '24"', inseam: '26"' }, S: { waist: '26"', inseam: '27"' }, M: { waist: '28"', inseam: '28"' }, L: { waist: '30"', inseam: '29"' }, XL: { waist: '32"', inseam: '30"' } }, isPublished: true, inventoryCount: 45, sortOrder: 5 },
  { id: id('pod', 6), name: 'Swimwear — Sunset Print', slug: 'swimwear-sunset-print', description: 'One-piece swimwear with sunset gradient print. Chlorine-resistant fabric.', productFamily: 'PrintOnDemand', category: 'POD_Swimwear', sku: 'RU0500', fabric: '180gsm/5.3oz', availableSizes: ['XS', 'S', 'M', 'L', 'XL'], availableColors: [{ name: 'Multi', hex: '#FF6B35' }], wholesalePriceCents: 700, retailPriceCents: 3999, badges: ['NEW'], images: [], sizeGuide: { XS: { bust: '30"', waist: '24"' }, S: { bust: '32"', waist: '26"' }, M: { bust: '34"', waist: '28"' }, L: { bust: '36"', waist: '30"' }, XL: { bust: '38"', waist: '32"' } }, isPublished: true, inventoryCount: 35, sortOrder: 6 },
  { id: id('pod', 7), name: 'Pajama Set — Vinyl Dreams', slug: 'pajama-set-vinyl-dreams', description: 'Comfortable pajama set with vinyl record print. Soft cotton blend.', productFamily: 'PrintOnDemand', category: 'POD_Pajamas', sku: 'RU0600', fabric: '150gsm/4.4oz', availableSizes: ['S', 'M', 'L', 'XL', '2XL'], availableColors: [{ name: 'Navy', hex: '#1B2A4A' }, { name: 'Grey', hex: '#808080' }], wholesalePriceCents: 750, retailPriceCents: 3999, badges: [], images: [], sizeGuide: { S: { chest: '36"', length: '26"' }, M: { chest: '40"', length: '27"' }, L: { chest: '44"', length: '28"' }, XL: { chest: '48"', length: '29"' }, '2XL': { chest: '52"', length: '30"' } }, isPublished: true, inventoryCount: 60, sortOrder: 7 },

  // ====== BEAUTY ======
  { id: id('bt', 1), name: 'Anti-Age Serum — Niacinamide B3', slug: 'anti-age-serum-niacinamide', description: 'Powerful anti-aging serum with 10% Niacinamide (B3). Reduces fine lines and improves skin texture.', productFamily: 'Beauty', category: 'Skincare', sku: 'BS001', concernTags: ['Anti-age', 'Niacinamide (B3)', 'Fine lines'], availableSizes: ['30ml', '50ml'], availableColors: [{ name: 'Clear', hex: '#F5F5F5' }], wholesalePriceCents: 1200, retailPriceCents: 4999, badges: ['BESTSELLER'], images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop'], sizeGuide: {}, isPublished: true, inventoryCount: 100, sortOrder: 1 },
  { id: id('bt', 2), name: 'Hydrating Moisturizer', slug: 'hydrating-moisturizer', description: 'Deep hydration moisturizer with hyaluronic acid and ceramides. For all skin types.', productFamily: 'Beauty', category: 'Skincare', sku: 'BS002', concernTags: ['Hydration', 'Hyaluronic Acid', 'Dry skin'], availableSizes: ['50ml', '100ml'], availableColors: [{ name: 'White', hex: '#FFFFFF' }], wholesalePriceCents: 800, retailPriceCents: 3499, badges: [], images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=500&fit=crop'], sizeGuide: {}, isPublished: true, inventoryCount: 120, sortOrder: 2 },
  { id: id('bt', 3), name: 'Vitamin C Brightening Cream', slug: 'vitamin-c-brightening-cream', description: 'Brightening cream with stabilized Vitamin C. Evens skin tone and reduces dark spots.', productFamily: 'Beauty', category: 'Skincare', sku: 'BS003', concernTags: ['Brightening', 'Vitamin C', 'Dark spots'], availableSizes: ['30ml', '50ml'], availableColors: [{ name: 'Orange', hex: '#FFA500' }], wholesalePriceCents: 1000, retailPriceCents: 4499, badges: ['NEW'], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 80, sortOrder: 3 },
  { id: id('bt', 4), name: 'Repair Hair Oil', slug: 'repair-hair-oil', description: 'Lightweight hair oil with argan and jojoba. Repairs damage and adds shine without greasiness.', productFamily: 'Beauty', category: 'Haircare', sku: 'BH001', concernTags: ['Repair', 'Argan Oil', 'Frizz'], availableSizes: ['50ml', '100ml'], availableColors: [{ name: 'Gold', hex: '#DAA520' }], wholesalePriceCents: 600, retailPriceCents: 2999, badges: [], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 90, sortOrder: 4 },
  { id: id('bt', 5), name: 'Matte Lip Collection', slug: 'matte-lip-collection', description: 'Set of 3 matte lipsticks in artist-curated shades. Long-lasting formula.', productFamily: 'Beauty', category: 'Makeup', sku: 'BM001', concernTags: [], availableSizes: ['Set'], availableColors: [{ name: 'Crimson', hex: '#DC143C' }, { name: 'Nude', hex: '#D2B48C' }, { name: 'Mauve', hex: '#E0B0FF' }], wholesalePriceCents: 500, retailPriceCents: 2499, badges: ['TRENDING'], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 70, sortOrder: 5 },
  { id: id('bt', 6), name: 'Eye Cream — Retinol Complex', slug: 'eye-cream-retinol', description: 'Targeted eye cream with gentle retinol complex. Reduces puffiness and crow\'s feet.', productFamily: 'Beauty', category: 'EyeCare', sku: 'BE001', concernTags: ['Anti-age', 'Retinol', 'Puffiness'], availableSizes: ['15ml', '30ml'], availableColors: [{ name: 'Cream', hex: '#FFFDD0' }], wholesalePriceCents: 900, retailPriceCents: 3999, badges: [], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 60, sortOrder: 6 },
  { id: id('bt', 7), name: 'Body Butter — Shea & Cocoa', slug: 'body-butter-shea-cocoa', description: 'Rich body butter with shea and cocoa butter. Deep nourishment for dry skin.', productFamily: 'Beauty', category: 'BodyCare', sku: 'BB001', concernTags: ['Nourishing', 'Shea Butter', 'Dry skin'], availableSizes: ['200ml', '400ml'], availableColors: [{ name: 'Natural', hex: '#F5DEB3' }], wholesalePriceCents: 500, retailPriceCents: 2499, badges: [], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 110, sortOrder: 7 },
  { id: id('bt', 8), name: 'Men\'s Grooming Kit', slug: 'mens-grooming-kit', description: 'Complete grooming kit with beard oil, face wash, and moisturizer. Cedar & sandalwood scent.', productFamily: 'Beauty', category: 'MensGrooming', sku: 'BG001', concernTags: ['Beard care', 'Face care', 'Cedarwood'], availableSizes: ['Kit'], availableColors: [{ name: 'Brown', hex: '#8B4513' }], wholesalePriceCents: 1500, retailPriceCents: 5999, badges: ['NEW'], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 40, sortOrder: 8 },
  { id: id('bt', 9), name: 'Adea Signature Candle', slug: 'adea-signature-candle', description: 'Hand-poured soy candle with Adea\'s signature scent — amber, vanilla, and cedar. 40-hour burn time.', productFamily: 'Beauty', category: 'Candle', sku: 'BC001', concernTags: ['Relaxation', 'Amber', 'Vanilla'], availableSizes: ['8oz', '16oz'], availableColors: [{ name: 'Amber', hex: '#FFBF00' }], wholesalePriceCents: 400, retailPriceCents: 2999, badges: ['BESTSELLER'], images: ['https://images.unsplash.com/photo-1602607747506-9e9e8ee2f29b?w=400&h=500&fit=crop'], sizeGuide: {}, isPublished: true, inventoryCount: 85, sortOrder: 9 },

  // ====== BAGS ======
  { id: id('bg', 1), name: 'PU Leather Crossbody Bag', slug: 'pu-leather-crossbody-bag', description: 'Minimalist crossbody bag in premium PU leather. Adjustable strap, inner pocket, magnetic closure.', productFamily: 'Bags', category: 'Bags', sku: 'XB001', material: 'PU Leather', dimensions: '22×15×6 cm', availableSizes: ['Standard'], availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'Tan', hex: '#D2B48C' }, { name: 'Burgundy', hex: '#800020' }], wholesalePriceCents: 800, retailPriceCents: 4999, badges: ['BESTSELLER'], images: ['https://images.unsplash.com/photo-1548036328-c9fa0d6f17f1?w=400&h=500&fit=crop'], sizeGuide: {}, isPublished: true, inventoryCount: 55, sortOrder: 1 },
  { id: id('bg', 2), name: 'Canvas Tote — Artist Edition', slug: 'canvas-tote-artist-edition', description: 'Heavy-duty canvas tote with Adea Lyric print. Large interior, reinforced handles.', productFamily: 'Bags', category: 'Bags', sku: 'XB002', material: 'Canvas', dimensions: '38×30×10 cm', availableSizes: ['Standard'], availableColors: [{ name: 'Natural', hex: '#F5DEB3' }, { name: 'Black', hex: '#000000' }], wholesalePriceCents: 400, retailPriceCents: 2499, badges: ['LIMITED'], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 65, sortOrder: 2 },
  { id: id('bg', 3), name: 'Mini Backpack', slug: 'mini-backpack', description: 'Compact mini backpack with multiple compartments. Water-resistant nylon exterior.', productFamily: 'Bags', category: 'Bags', sku: 'XB003', material: 'Nylon', dimensions: '28×20×8 cm', availableSizes: ['Standard'], availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'Olive', hex: '#556B2F' }, { name: 'Pink', hex: '#FF69B4' }], wholesalePriceCents: 600, retailPriceCents: 3499, badges: ['TRENDING'], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 45, sortOrder: 3 },
  { id: id('bg', 4), name: 'Weekender Duffle', slug: 'weekender-duffle', description: 'Spacious weekender duffle bag for short trips. Detachable shoulder strap, shoe compartment.', productFamily: 'Bags', category: 'Bags', sku: 'XB004', material: 'PU Leather + Canvas', dimensions: '50×28×25 cm', availableSizes: ['Standard'], availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'Tan', hex: '#D2B48C' }], wholesalePriceCents: 1500, retailPriceCents: 7999, badges: ['NEW'], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 20, sortOrder: 4 },
  { id: id('bg', 5), name: 'Phone Pouch Belt Bag', slug: 'phone-pouch-belt-bag', description: 'Compact belt bag with phone pouch and card slots. Adjustable belt strap.', productFamily: 'Bags', category: 'Bags', sku: 'XB005', material: 'PU Leather', dimensions: '18×12×4 cm', availableSizes: ['Standard'], availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }], wholesalePriceCents: 300, retailPriceCents: 1999, badges: [], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 90, sortOrder: 5 },

  // ====== MUSIC (Vinyl, CD, Digital) ======
  { id: id('mu', 1), name: 'Midnight Echoes — Vinyl LP', slug: 'midnight-echoes-vinyl-lp', description: 'Limited pressing of Midnight Echoes on 180g vinyl. Includes lyric insert and download code. Gatefold sleeve with embossed cover art.', productFamily: 'Music', category: 'Vinyl', sku: 'MU-V001', availableSizes: ['LP'], availableColors: [{ name: 'Black', hex: '#000000' }], wholesalePriceCents: 800, retailPriceCents: 2999, badges: ['BESTSELLER', 'LIMITED'], images: ['https://images.unsplash.com/photo-1514525253161-7a46c5ac9b18?w=400&h=500&fit=crop'], sizeGuide: {}, isPublished: true, inventoryCount: 200, sortOrder: 1 },
  { id: id('mu', 2), name: 'Urban Frequencies — Cassette', slug: 'urban-frequencies-cassette', description: 'Hand-numbered cassette tape of Urban Frequencies. Cream shell with on-body print. Includes digital download.', productFamily: 'Music', category: 'Cassette', sku: 'MU-C001', availableSizes: ['Standard'], availableColors: [{ name: 'Cream', hex: '#FFFDD0' }], wholesalePriceCents: 200, retailPriceCents: 1499, badges: ['LIMITED'], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 50, sortOrder: 2 },
  { id: id('mu', 3), name: 'Neon Dreams — CD Album', slug: 'neon-dreams-cd-album', description: 'Full CD album of Neon Dreams with 8-panel digipak. Includes bonus track and lyric booklet.', productFamily: 'Music', category: 'CD', sku: 'MU-D001', availableSizes: ['Standard'], availableColors: [{ name: 'Silver', hex: '#C0C0C0' }], wholesalePriceCents: 300, retailPriceCents: 1299, badges: [], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 300, sortOrder: 3 },
  { id: id('mu', 4), name: 'Midnight Echoes — Digital Bundle', slug: 'midnight-echoes-digital-bundle', description: 'Full album download + stems + bonus demos. Includes hi-res FLAC and standard MP3.', productFamily: 'Music', category: 'Digital', sku: 'MU-B001', availableSizes: ['Digital'], availableColors: [{ name: 'Digital', hex: '#4169E1' }], wholesalePriceCents: 0, retailPriceCents: 999, badges: ['NEW'], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 999, sortOrder: 4 },
  { id: id('mu', 5), name: 'Live at The Fillmore — Vinyl EP', slug: 'live-fillmore-vinyl-ep', description: 'Limited 7-inch EP with 4 live tracks recorded at The Fillmore. Picture disc with concert photography.', productFamily: 'Music', category: 'Vinyl', sku: 'MU-V002', availableSizes: ['7-inch'], availableColors: [{ name: 'Picture Disc', hex: '#FF6B35' }], wholesalePriceCents: 400, retailPriceCents: 1999, badges: ['TRENDING', 'LIMITED'], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 100, sortOrder: 5 },

  // ====== FINISHED MERCH (Admin-produced, branded products) ======
  { id: id('fm', 1), name: 'Adea Lyric Logo Tee — Black', slug: 'adea-lyric-logo-tee', description: 'Premium cotton tee with the Adea Lyric logo. Screen-printed in gold foil on black heavyweight cotton.', productFamily: 'FinishedMerch', category: 'Tees', sku: 'FM-T001', fabric: '180gsm/5.3oz', availableSizes: ['S', 'M', 'L', 'XL', '2XL'], availableColors: [{ name: 'Black', hex: '#000000' }], wholesalePriceCents: 600, retailPriceCents: 3499, badges: ['BESTSELLER'], images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop'], sizeGuide: { S: { chest: '36"', length: '28"' }, M: { chest: '40"', length: '29"' }, L: { chest: '44"', length: '30"' }, XL: { chest: '48"', length: '31"' }, '2XL': { chest: '52"', length: '32"' } }, isPublished: true, inventoryCount: 120, sortOrder: 1 },
  { id: id('fm', 2), name: 'Midnight Echoes Tour Hoodie', slug: 'midnight-echoes-tour-hoodie', description: 'Official tour hoodie with Midnight Echoes artwork on back. Front pocket, lined hood. Limited run.', productFamily: 'FinishedMerch', category: 'Hoodies', sku: 'FM-H001', fabric: '320gsm/9.4oz', availableSizes: ['S', 'M', 'L', 'XL', '2XL'], availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'Charcoal', hex: '#36454F' }], wholesalePriceCents: 1200, retailPriceCents: 6999, badges: ['LIMITED'], images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop'], sizeGuide: { S: { chest: '40"', length: '27"' }, M: { chest: '44"', length: '28"' }, L: { chest: '48"', length: '29"' }, XL: { chest: '52"', length: '30"' }, '2XL': { chest: '56"', length: '31"' } }, isPublished: true, inventoryCount: 75, sortOrder: 2 },
  { id: id('fm', 3), name: 'Frequency Waves Poster — Limited Print', slug: 'frequency-waves-poster', description: 'Limited-edition 18×24 screen-printed poster. Frequency wave pattern on archival cotton paper. Signed and numbered.', productFamily: 'FinishedMerch', category: 'Posters', sku: 'FM-P001', dimensions: '18×24 in', availableSizes: ['18×24'], availableColors: [{ name: 'Black/Gold', hex: '#000000' }], wholesalePriceCents: 500, retailPriceCents: 2499, badges: ['LIMITED'], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 50, sortOrder: 3 },
  { id: id('fm', 4), name: 'Adea Enamel Pin Set', slug: 'adea-enamel-pin-set', description: 'Set of 3 enamel pins: Adea logo, frequency wave, and vinyl record. Gold-plated with rubber clutches.', productFamily: 'FinishedMerch', category: 'Accessories', sku: 'FM-A001', availableSizes: ['Set'], availableColors: [{ name: 'Gold', hex: '#DAA520' }], wholesalePriceCents: 300, retailPriceCents: 1499, badges: ['NEW'], images: [], sizeGuide: {}, isPublished: true, inventoryCount: 100, sortOrder: 4 },
];

// Category groupings for sidebar navigation
export const CATEGORY_MAP: Record<ProductFamily, { label: string; categories: { name: string; subcategories?: string[] }[] }> = {
  BlankApparel: {
    label: 'Stock Apparel',
    categories: [
      { name: 'T-Shirts', subcategories: ['Crop'] },
      { name: 'Tank Tops' },
      { name: 'Hoodies' },
      { name: 'Sweatshirts' },
      { name: 'Activewear', subcategories: ['Sports Bra'] },
      { name: 'Shorts' },
      { name: 'Sweatpants' },
      { name: 'Skirts' },
      { name: 'Bottoms' },
      { name: 'OnePieces' },
      { name: 'CoatsJackets' },
      { name: 'PoloShirts' },
    ],
  },
  PrintOnDemand: {
    label: 'Artist-Designed Apparel',
    categories: [
      { name: 'POD_Tops' },
      { name: 'POD_Hoodies' },
      { name: 'POD_Dresses' },
      { name: 'POD_Sets' },
      { name: 'POD_Yoga' },
      { name: 'POD_Swimwear' },
      { name: 'POD_Pajamas' },
    ],
  },
  Beauty: {
    label: 'Beauty',
    categories: [
      { name: 'Skincare' },
      { name: 'Haircare' },
      { name: 'Makeup' },
      { name: 'EyeCare' },
      { name: 'BodyCare' },
      { name: 'MensGrooming' },
      { name: 'Candle' },
    ],
  },
  Bags: {
    label: 'Bags',
    categories: [
      { name: 'Bags' },
    ],
  },
  Music: {
    label: 'Music',
    categories: [
      { name: 'Vinyl' },
      { name: 'Cassette' },
      { name: 'CD' },
      { name: 'Digital' },
    ],
  },
  FinishedMerch: {
    label: 'Branded Merch',
    categories: [
      { name: 'Tees' },
      { name: 'Hoodies' },
      { name: 'Posters' },
      { name: 'Accessories' },
    ],
  },
};

// ============ FAN-FACING CATEGORY MAP ============
// Fans see merch by type, NOT by production method (BlankApparel / PrintOnDemand are admin-only concepts)

export type FanCategory = 'Music' | 'Apparel' | 'Beauty' | 'Bags';

export const FAN_CATEGORY_MAP: Record<FanCategory, string[]> = {
  Music: ['Vinyl', 'Cassette', 'CD', 'Digital'],
  Apparel: ['Tees', 'Hoodies', 'Posters', 'Accessories'],
  Beauty: ['Skincare', 'Haircare', 'Makeup', 'EyeCare', 'BodyCare', 'MensGrooming', 'Candle'],
  Bags: ['Bags'],
};

// Get the published products for the fan shop — EXCLUDE BlankApparel and PrintOnDemand (admin-only concepts)
// Fans only see finished, branded products — never blank stock or POD intermediary items
export function getPublishedProducts(): CatalogProduct[] {
  return mockCatalogProducts.filter((p) => p.isPublished && p.productFamily !== 'BlankApparel' && p.productFamily !== 'PrintOnDemand');
}

// Get all products for admin
export function getAllProducts(): CatalogProduct[] {
  return mockCatalogProducts;
}

// Find a product by ID
export function getProductById(id: string): CatalogProduct | undefined {
  return mockCatalogProducts.find((p) => p.id === id);
}

// Size options for filtering
export const ALL_SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '30ml', '50ml', '100ml', '200ml', '400ml', '8oz', '16oz', 'Standard', 'Set', 'Kit'];
