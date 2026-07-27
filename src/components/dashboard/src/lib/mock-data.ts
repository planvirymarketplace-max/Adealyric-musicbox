import type { Artist, Release, Track, Booking, BookingInquiry, CrmContact, Order, OrderItem, Fan, TicketEvent, TicketTier, TicketOrder, CmsBanner, CmsGallery, CmsImage, CmsVideo, ShopProduct, TourDate, UserLoyalty, LoyaltyTransaction, CatalogSong, CollabCall, PortalRequest, AvailabilityHold, PortalUser, SpendEntry, RightsRecord, DspAdapter, DeliveryRecord, RoyaltyStatement, RoyaltySplit, SyncLicenseRequest, ValidationCheck } from '@/types/database';

// Helper to generate IDs
const id = (prefix: string, n: number) => `${prefix}-${n}`;
const uuid = () => crypto.randomUUID?.() ?? `mock-${Date.now()}-${Math.random()}`;

// ============ ARTISTS ============
export const mockArtists: Artist[] = [
  { id: id('art', 1), name: 'Adea Lyric', slug: 'adea-lyric', bio: 'Electronic music artist from West Philadelphia', image_media_id: null, is_own_artist: true, active: true, created_at: '2025-01-15' },
  { id: id('art', 2), name: 'Nova Sound Collective', slug: 'nova-sound', bio: 'Berlin-based electronic/house duo', image_media_id: null, is_own_artist: false, active: true, created_at: '2025-03-01' },
];

// ============ RELEASES ============
export const mockReleases: Release[] = [
  { id: id('rel', 1), artist_id: id('art', 1), title: 'Midnight Echoes', type: 'album', release_date: '2026-02-14', cover_media_id: null, status: 'live', catalog_number: 'AL-001', upc: null, price_cents: 999, is_free: false, genre: 'Electronic', explicit: false, created_at: '2025-12-01', updated_at: '2026-01-15' },
  { id: id('rel', 2), artist_id: id('art', 1), title: 'Urban Frequencies', type: 'album', release_date: '2026-03-20', cover_media_id: null, status: 'live', catalog_number: 'AL-002', upc: null, price_cents: 1299, is_free: false, genre: 'Hip-Hop', explicit: true, created_at: '2025-12-15', updated_at: '2026-01-20' },
  { id: id('rel', 3), artist_id: id('art', 1), title: 'Neon Dreams', type: 'single', release_date: '2026-01-10', cover_media_id: null, status: 'live', catalog_number: 'AL-003', upc: null, price_cents: 0, is_free: true, genre: 'Electronic', explicit: false, created_at: '2025-11-20', updated_at: '2025-12-01' },
  { id: id('rel', 4), artist_id: id('art', 1), title: 'Solar Waves', type: 'ep', release_date: '2026-04-05', cover_media_id: null, status: 'submitted', catalog_number: 'AL-004', upc: null, price_cents: 599, is_free: false, genre: 'Ambient', explicit: false, created_at: '2026-01-01', updated_at: '2026-02-01' },
  { id: id('rel', 5), artist_id: id('art', 2), title: 'Berlin After Dark', type: 'album', release_date: '2026-05-15', cover_media_id: null, status: 'live', catalog_number: 'NS-001', upc: null, price_cents: 1499, is_free: false, genre: 'House', explicit: false, created_at: '2025-12-20', updated_at: '2026-03-01' },
];

// ============ TRACKS ============
export const mockTracks: Track[] = [
  { id: id('trk', 1), release_id: id('rel', 1), title: 'Echoes of Tomorrow', position: 1, duration_seconds: 234, isrc: null, isrc_explicit: false, audio_media_id: null, audio_storage_path: null, preview_seconds: 30, is_preview_enabled: true, is_free: false, download_allowed: true, price_cents: 99, status: 'live', created_at: '2025-12-01' },
  { id: id('trk', 2), release_id: id('rel', 1), title: 'Midnight Pulse', position: 2, duration_seconds: 198, isrc: null, isrc_explicit: false, audio_media_id: null, audio_storage_path: null, preview_seconds: 30, is_preview_enabled: true, is_free: false, download_allowed: false, price_cents: 99, status: 'live', created_at: '2025-12-01' },
  { id: id('trk', 3), release_id: id('rel', 1), title: 'Digital Rain', position: 3, duration_seconds: 267, isrc: null, isrc_explicit: false, audio_media_id: null, audio_storage_path: null, preview_seconds: 30, is_preview_enabled: true, is_free: true, download_allowed: true, price_cents: 0, status: 'live', created_at: '2025-12-01' },
  { id: id('trk', 4), release_id: id('rel', 2), title: 'City Lights', position: 1, duration_seconds: 245, isrc: null, isrc_explicit: true, audio_media_id: null, audio_storage_path: null, preview_seconds: 30, is_preview_enabled: true, is_free: false, download_allowed: false, price_cents: 99, status: 'live', created_at: '2025-12-15' },
  { id: id('trk', 5), release_id: id('rel', 2), title: 'Street Vibes', position: 2, duration_seconds: 210, isrc: null, isrc_explicit: true, audio_media_id: null, audio_storage_path: null, preview_seconds: 30, is_preview_enabled: false, is_free: false, download_allowed: false, price_cents: 99, status: 'live', created_at: '2025-12-15' },
  { id: id('trk', 6), release_id: id('rel', 3), title: 'Neon Dreams', position: 1, duration_seconds: 186, isrc: null, isrc_explicit: false, audio_media_id: null, audio_storage_path: null, preview_seconds: 30, is_preview_enabled: true, is_free: true, download_allowed: true, price_cents: 0, status: 'live', created_at: '2025-11-20' },
  { id: id('trk', 7), release_id: id('rel', 4), title: 'Solar Flare', position: 1, duration_seconds: 320, isrc: null, isrc_explicit: false, audio_media_id: null, audio_storage_path: null, preview_seconds: 30, is_preview_enabled: true, is_free: false, download_allowed: false, price_cents: 0, status: 'submitted', created_at: '2026-01-01' },
  { id: id('trk', 8), release_id: id('rel', 4), title: 'Calm Currents', position: 2, duration_seconds: 280, isrc: null, isrc_explicit: false, audio_media_id: null, audio_storage_path: null, preview_seconds: 30, is_preview_enabled: true, is_free: false, download_allowed: false, price_cents: 0, status: 'submitted', created_at: '2026-01-01' },
];

// ============ BOOKINGS ============
export const mockBookings: Booking[] = [
  { id: id('bk', 1), artist_id: id('art', 1), inquiry_id: id('inq', 1), event_name: 'Summer Festival 2026', venue_name: 'Merriweather Post Pavilion', crm_contact_id: id('crm', 1), event_date: '2026-08-15', event_type: 'concert', status: 'confirmed', fee_cents: 500000, deposit_cents: 150000, deposit_due_date: '2026-07-01', balance_due_date: '2026-08-01', set_length_minutes: 90, load_in_time: '14:00', set_time: '20:00', address: '10475 Little Patuxent Pkwy, Columbia, MD', rider_notes: 'Standard PA + lighting package', contract_media_id: null, internal_notes: 'High priority client', created_at: '2026-04-01', updated_at: '2026-05-01' },
  { id: id('bk', 2), artist_id: id('art', 1), inquiry_id: id('inq', 2), event_name: 'DJ Night at Transit', venue_name: 'Transit Nightclub', crm_contact_id: id('crm', 2), event_date: '2026-09-20', event_type: 'dj_set', status: 'deposit_paid', fee_cents: 300000, deposit_cents: 100000, deposit_due_date: '2026-08-01', balance_due_date: '2026-09-01', set_length_minutes: 120, load_in_time: '18:00', set_time: '22:00', address: '1234 Market St, Philadelphia, PA', rider_notes: 'Bring own DJ controller', contract_media_id: null, internal_notes: null, created_at: '2026-05-01', updated_at: '2026-06-01' },
  { id: id('bk', 3), artist_id: id('art', 1), inquiry_id: null, event_name: 'NYE Gala', venue_name: 'The Fillmore', crm_contact_id: id('crm', 3), event_date: '2026-12-31', event_type: 'concert', status: 'inquiry', fee_cents: 750000, deposit_cents: null, deposit_due_date: null, balance_due_date: null, set_length_minutes: 60, load_in_time: null, set_time: null, address: '29 W Allen St, Philadelphia, PA', rider_notes: null, contract_media_id: null, internal_notes: 'Needs custom stage design', created_at: '2026-06-01', updated_at: '2026-06-01' },
];

// ============ BOOKING INQUIRIES ============
export const mockBookingInquiries: BookingInquiry[] = [
  { id: id('inq', 1), artist_id: id('art', 1), contact_name: 'Sarah Johnson', contact_email: 'sarah@summerfest.com', contact_phone: '555-123-4567', event_name: 'Summer Festival 2026', event_date_requested: '2026-08-15', event_type: 'concert', city: 'Columbia', state: 'MD', country: 'US', budget_range: '$5k-$10k', message: 'Looking for an electronic act for our summer outdoor festival series.', source: 'website', status: 'won', booking_id: id('bk', 1), assigned_to: null, created_at: '2026-03-01', updated_at: '2026-04-01' },
  { id: id('inq', 2), artist_id: id('art', 1), contact_name: 'Mike Torres', contact_email: 'mike@transitclub.com', contact_phone: '555-987-6543', event_name: 'DJ Night at Transit', event_date_requested: '2026-09-20', event_type: 'dj_set', city: 'Philadelphia', state: 'PA', country: 'US', budget_range: '$3k-$5k', message: 'Monthly DJ series at Transit nightclub.', source: 'referral', status: 'won', booking_id: id('bk', 2), assigned_to: null, created_at: '2026-04-01', updated_at: '2026-05-01' },
  { id: id('inq', 3), artist_id: id('art', 1), contact_name: 'Amy Chen', contact_email: 'amy@fillmore.com', contact_phone: null, event_name: 'NYE Gala', event_date_requested: '2026-12-31', event_type: 'concert', city: 'Philadelphia', state: 'PA', country: 'US', budget_range: '$7k+', message: 'Interested in booking for New Year\'s Eve gala event.', source: 'instagram', status: 'new', booking_id: null, assigned_to: null, created_at: '2026-06-01', updated_at: '2026-06-01' },
  { id: id('inq', 4), artist_id: id('art', 2), contact_name: 'Leo Marx', contact_email: 'leo@berlinbeats.de', contact_phone: null, event_name: null, event_date_requested: null, event_type: null, city: 'Berlin', state: null, country: 'DE', budget_range: null, message: 'General inquiry about booking Nova Sound Collective.', source: 'website', status: 'contacted', booking_id: null, assigned_to: null, created_at: '2026-05-15', updated_at: '2026-05-20' },
];

// ============ CRM CONTACTS ============
export const mockCrmContacts: CrmContact[] = [
  { id: id('crm', 1), name: 'Sarah Johnson', contact_type: 'venue', company: 'Summer Festival Inc', email: 'sarah@summerfest.com', phone: '555-123-4567', city: 'Columbia', state: 'MD', country: 'US', stage: 'active', role_title: 'Festival Director', rate_notes: '$5k-$10k per show', value_estimate_cents: 500000, tags: ['festival', 'outdoor', 'recurring'], owner: 'admin', notes: 'Excellent venue partner', source: 'website', created_at: '2026-03-01', updated_at: '2026-04-01' },
  { id: id('crm', 2), name: 'Mike Torres', contact_type: 'venue', company: 'Transit Nightclub', email: 'mike@transitclub.com', phone: '555-987-6543', city: 'Philadelphia', state: 'PA', country: 'US', stage: 'active', role_title: 'Club Manager', rate_notes: '$3k-$5k per DJ set', value_estimate_cents: 300000, tags: ['nightclub', 'dj', 'monthly'], owner: 'admin', notes: null, source: 'referral', created_at: '2026-04-01', updated_at: '2026-05-01' },
  { id: id('crm', 3), name: 'Amy Chen', contact_type: 'venue', company: 'The Fillmore Philadelphia', email: 'amy@fillmore.com', phone: null, city: 'Philadelphia', state: 'PA', country: 'US', stage: 'qualified', role_title: 'Event Coordinator', rate_notes: null, value_estimate_cents: 750000, tags: ['venue', 'concert', 'nye'], owner: null, notes: null, source: 'instagram', created_at: '2026-06-01', updated_at: '2026-06-01' },
  { id: id('crm', 4), name: 'David Williams', contact_type: 'agent', company: 'SoundWave Agency', email: 'david@soundwave.com', phone: null, city: 'New York', state: 'NY', country: 'US', stage: 'qualified', role_title: 'Booking Agent', rate_notes: '10% commission', value_estimate_cents: 200000, tags: ['agent', 'booking', 'east-coast'], owner: null, notes: 'Interested in representing our artists', source: 'conference', created_at: '2026-05-01', updated_at: '2026-05-15' },
];

// ============ ORDERS ============
export const mockOrders: Order[] = [
  { id: id('ord', 1), fan_id: id('fan', 1), amount_total_cents: 999, currency: 'USD', status: 'paid', stripe_payment_intent_id: null, created_at: '2026-01-20' },
  { id: id('ord', 2), fan_id: id('fan', 2), amount_total_cents: 1299, currency: 'USD', status: 'paid', stripe_payment_intent_id: null, created_at: '2026-02-25' },
  { id: id('ord', 3), fan_id: id('fan', 3), amount_total_cents: 599, currency: 'USD', status: 'pending', stripe_payment_intent_id: null, created_at: '2026-04-10' },
  { id: id('ord', 4), fan_id: id('fan', 4), amount_total_cents: 1499, currency: 'USD', status: 'paid', stripe_payment_intent_id: null, created_at: '2026-05-20' },
];

// ============ FANS ============
export const mockFans: Fan[] = [
  { id: id('fan', 1), email: 'alex@example.com', name: 'Alex Rivera', subscribed: true, tags: ['superfan', 'newsletter'], created_at: '2025-06-01', updated_at: '2026-01-01' },
  { id: id('fan', 2), email: 'jess@example.com', name: 'Jess Kim', subscribed: true, tags: ['subscriber'], created_at: '2025-08-01', updated_at: '2026-02-01' },
  { id: id('fan', 3), email: 'marco@example.com', name: 'Marco Silva', subscribed: false, tags: ['one-time-buyer'], created_at: '2025-10-01', updated_at: '2025-10-01' },
  { id: id('fan', 4), email: 'priya@example.com', name: 'Priya Sharma', subscribed: true, tags: ['merch-buyer', 'newsletter'], created_at: '2025-11-01', updated_at: '2026-05-01' },
  { id: id('fan', 5), email: 'jordan@example.com', name: 'Jordan Lee', subscribed: true, tags: ['concert-goer'], created_at: '2025-12-01', updated_at: '2026-03-01' },
];

// ============ TICKET EVENTS ============
export const mockTicketEvents: TicketEvent[] = [
  { id: id('evt', 1), artist_id: id('art', 1), booking_id: id('bk', 1), title: 'Summer Festival 2026', description: 'Outdoor electronic music festival featuring Adea Lyric and special guests. Three stages, food trucks, and VIP areas.', venue_name: 'Merriweather Post Pavilion', address: '10475 Little Patuxent Pkwy', city: 'Columbia', state: 'MD', country: 'US', event_date: '2026-08-15', door_time: '14:00', show_time: '20:00', age_restriction: 'All ages', cover_image_url: null, published: true, capacity: 5000, created_at: '2026-04-01', updated_at: '2026-05-01' },
  { id: id('evt', 2), artist_id: id('art', 1), booking_id: id('bk', 2), title: 'DJ Night at Transit', description: 'Monthly DJ series at Philadelphia\'s premier nightclub.', venue_name: 'Transit Nightclub', address: '1234 Market St', city: 'Philadelphia', state: 'PA', country: 'US', event_date: '2026-09-20', door_time: '18:00', show_time: '22:00', age_restriction: '21+', cover_image_url: null, published: true, capacity: 300, created_at: '2026-05-01', updated_at: '2026-06-01' },
  { id: id('evt', 3), artist_id: id('art', 1), booking_id: null, title: 'Adea Lyric Acoustic Set', description: 'Intimate acoustic performance at The Fillmore\'s side room.', venue_name: 'The Fillmore Side Room', address: '29 W Allen St', city: 'Philadelphia', state: 'PA', country: 'US', event_date: '2026-10-10', door_time: '19:00', show_time: '20:00', age_restriction: null, cover_image_url: null, published: true, capacity: 150, created_at: '2026-06-01', updated_at: '2026-06-01' },
];

// ============ TICKET TIERS ============
export const mockTicketTiers: TicketTier[] = [
  { id: id('tier', 1), event_id: id('evt', 1), name: 'General Admission', description: 'Standard entry, lawn seating', price_cents: 4500, quantity: 3000, sold_count: 1500, sale_starts_at: '2026-04-01', sale_ends_at: '2026-08-14', sort_order: 1, created_at: '2026-04-01' },
  { id: id('tier', 2), event_id: id('evt', 1), name: 'VIP', description: 'VIP area with reserved seating and complimentary drinks', price_cents: 12000, quantity: 500, sold_count: 200, sale_starts_at: '2026-04-01', sale_ends_at: '2026-08-14', sort_order: 2, created_at: '2026-04-01' },
  { id: id('tier', 3), event_id: id('evt', 2), name: 'General', description: 'Standard entry', price_cents: 2500, quantity: 200, sold_count: 120, sale_starts_at: null, sale_ends_at: null, sort_order: 1, created_at: '2026-05-01' },
  { id: id('tier', 4), event_id: id('evt', 3), name: 'Standard', description: 'General admission', price_cents: 3500, quantity: 100, sold_count: 30, sale_starts_at: null, sale_ends_at: null, sort_order: 1, created_at: '2026-06-01' },
];

// ============ CMS BANNERS ============
export const mockBanners: CmsBanner[] = [
  { id: id('ban', 1), title: 'Summer Festival 2026', subtitle: 'Adea Lyric live at Merriweather', image_url: 'https://images.unsplash.com/photo-1470229722913-5c805f926cb0?w=1200&h=600&fit=crop', cta_text: 'Get Tickets', cta_link: '/portal/events', linked_event_id: id('evt', 1), position: 'hero', published: true, sort_order: 1, starts_at: null, ends_at: null, created_at: '2026-04-01', updated_at: '2026-05-01' },
  { id: id('ban', 2), title: 'New Album: Midnight Echoes', subtitle: 'Stream now or purchase the full release', image_url: 'https://images.unsplash.com/photo-1511670744-009a8077d4a2?w=600&h=200&fit=crop', cta_text: 'Listen Now', cta_link: '/portal/music', linked_event_id: null, position: 'promo', published: true, sort_order: 1, starts_at: null, ends_at: null, created_at: '2026-01-01', updated_at: '2026-02-01' },
  { id: id('ban', 3), title: 'Merch Drop', subtitle: 'Limited edition merch available now', image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1e2b?w=600&h=200&fit=crop', cta_text: 'Shop Now', cta_link: '/portal/shop', linked_event_id: null, position: 'promo', published: true, sort_order: 2, starts_at: null, ends_at: null, created_at: '2026-03-01', updated_at: '2026-03-01' },
];

// ============ CMS GALLERIES + IMAGES/VIDEOS ============
export const mockGalleries: CmsGallery[] = [
  { id: id('gal', 1), title: 'Live Performance Shots', slug: 'live-shots', description: 'Photos from recent live performances', kind: 'image', cover_image_url: 'https://images.unsplash.com/photo-1493225457124-a71ebcf63717?w=400&h=300&fit=crop', published: true, sort_order: 1, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: id('gal', 2), title: 'Behind the Scenes', slug: 'behind-scenes', description: 'Studio and behind the scenes photos', kind: 'image', cover_image_url: 'https://images.unsplash.com/photo-1511379978527-b5845879157c?w=400&h=300&fit=crop', published: true, sort_order: 2, created_at: '2026-02-01', updated_at: '2026-02-01' },
  { id: id('gal', 3), title: 'Music Videos', slug: 'music-videos', description: 'Official music videos and visualizers', kind: 'video', cover_image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop', published: true, sort_order: 1, created_at: '2026-01-01', updated_at: '2026-01-01' },
];

export const mockImages: CmsImage[] = [
  { id: id('img', 1), gallery_id: id('gal', 1), title: 'Summer Festival Stage', caption: 'Main stage at Summer Festival', image_url: 'https://images.unsplash.com/photo-1470229722913-5c805f926cb0?w=800&h=600&fit=crop', sort_order: 1, created_at: '2026-01-01' },
  { id: id('img', 2), gallery_id: id('gal', 1), title: 'Crowd Moment', caption: null, image_url: 'https://images.unsplash.com/photo-1493225457124-a71ebcf63717?w=800&h=600&fit=crop', sort_order: 2, created_at: '2026-01-01' },
  { id: id('img', 3), gallery_id: id('gal', 1), title: 'DJ Setup', caption: 'Behind the decks', image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop', sort_order: 3, created_at: '2026-01-01' },
  { id: id('img', 4), gallery_id: id('gal', 2), title: 'Studio Session', caption: 'Recording Midnight Echoes', image_url: 'https://images.unsplash.com/photo-1511379978527-b5845879157c?w=800&h=600&fit=crop', sort_order: 1, created_at: '2026-02-01' },
  { id: id('img', 5), gallery_id: id('gal', 2), title: 'Mixing Desk', caption: null, image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1e2b?w=800&h=600&fit=crop', sort_order: 2, created_at: '2026-02-01' },
];

export const mockVideos: CmsVideo[] = [
  { id: id('vid', 1), gallery_id: id('gal', 3), title: 'Echoes of Tomorrow — Official Video', description: 'The official music video for Echoes of Tomorrow', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://images.unsplash.com/photo-1470229722913-5c805f926cb0?w=400&h=300&fit=crop', duration_seconds: 234, sort_order: 1, created_at: '2026-01-01' },
  { id: id('vid', 2), gallery_id: id('gal', 3), title: 'Midnight Pulse — Visualizer', description: 'Animated visualizer for Midnight Pulse', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://images.unsplash.com/photo-1493225457124-a71ebcf63717?w=400&h=300&fit=crop', duration_seconds: 198, sort_order: 2, created_at: '2026-02-01' },
];

// ============ SHOP PRODUCTS ============
export const mockShopProducts: ShopProduct[] = [
  { id: id('prod', 1), title: 'Midnight Echoes Tee', description: 'Limited edition tour t-shirt with album artwork', category: 'Apparel', price: 35, currency: 'USD', image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ad?w=400&h=400&fit=crop', inventory_count: 50, is_active: true, sort_order: 1, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: id('prod', 2), title: 'Adea Lyric Vinyl', description: 'Midnight Echoes on limited edition vinyl', category: 'Music', price: 29, currency: 'USD', image_url: 'https://images.unsplash.com/photo-1511379978527-b5845879157c?w=400&h=400&fit=crop', inventory_count: 100, is_active: true, sort_order: 2, created_at: '2026-01-01', updated_at: '2026-02-01' },
  { id: id('prod', 3), title: 'Neon Dreams Poster', description: 'Glow-in-the-dark concert poster', category: 'Art', price: 15, currency: 'USD', image_url: 'https://images.unsplash.com/photo-1511670744-009a8077d4a2?w=400&h=400&fit=crop', inventory_count: 3, is_active: true, sort_order: 3, created_at: '2026-02-01', updated_at: '2026-02-01' },
  { id: id('prod', 4), title: 'Urban Frequencies Hoodie', description: 'Premium hoodie with album art', category: 'Apparel', price: 65, currency: 'USD', image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', inventory_count: 0, is_active: true, sort_order: 4, created_at: '2026-03-01', updated_at: '2026-03-01' },
];

// ============ TOUR DATES ============
export const mockTourDates: TourDate[] = [
  { id: id('tour', 1), title: 'Summer Festival', venue: 'Merriweather Post Pavilion', city: 'Columbia', state: 'MD', country: 'US', date: '2026-08-15', door_time: '14:00', show_time: '20:00', ticket_url: '/portal/events/' + id('evt', 1), ticket_event_id: id('evt', 1), is_sold_out: false, is_public: true, notes: null, sort_order: 1, created_at: '2026-04-01', updated_at: '2026-05-01' },
  { id: id('tour', 2), title: 'DJ Night at Transit', venue: 'Transit Nightclub', city: 'Philadelphia', state: 'PA', country: 'US', date: '2026-09-20', door_time: '18:00', show_time: '22:00', ticket_url: '/portal/events/' + id('evt', 2), ticket_event_id: id('evt', 2), is_sold_out: false, is_public: true, notes: null, sort_order: 2, created_at: '2026-05-01', updated_at: '2026-06-01' },
  { id: id('tour', 3), title: 'Acoustic Set', venue: 'The Fillmore Side Room', city: 'Philadelphia', state: 'PA', country: 'US', date: '2026-10-10', door_time: '19:00', show_time: '20:00', ticket_url: '/portal/events/' + id('evt', 3), ticket_event_id: id('evt', 3), is_sold_out: false, is_public: true, notes: null, sort_order: 3, created_at: '2026-06-01', updated_at: '2026-06-01' },
];

// ============ CATALOG SONGS (Pro Portal) ============
export const mockCatalogSongs: CatalogSong[] = [
  { id: id('cs', 1), tenant_id: 'tenant-1', title: 'Echoes of Tomorrow', slug: 'echoes-of-tomorrow', alternate_titles: ['Echoes Remix', 'Tomorrow Echoes'], description: 'Uplifting electronic track with soaring melodies', lyrics: 'In the echoes of tomorrow...', explicit: false, language: 'English', genre: 'Electronic', mood_tags: ['Uplifting', 'Energetic', 'Epic'], energy: 7, valence: 8, bpm: 128, key: 'Am', time_signature: '4/4', duration_seconds: 234, composer: ['Adea Lyric', 'Max Chen'], producer: ['Adea Lyric'], mix_engineer: 'Studio One', master_owner: 'Adea Lyric', publishing_owner: 'Adea Publishing', recording_year: 2025, release_year: 2026, album: 'Midnight Echoes', version_label: 'Original', isrc: null, iswc: null, upc: null, pro: 'ASCAP', splits: [{ name: 'Adea Lyric', share: 60 }, { name: 'Max Chen', share: 40 }], stems_available: true, master_url: null, preview_url: null, watermarked_url: null, cover_art_url: null, distribution_flag: 'public_streaming', distribution_status: 'published', sync_status: 'available', for_sale: false, asking_price: null, asking_price_negotiable: false, visible_to_roles: ['label', 'booking', 'writer'], is_active: true, published_at: '2026-01-15', version: 1, created_at: '2025-12-01', updated_at: '2026-01-15', deleted_at: null },
  { id: id('cs', 2), tenant_id: 'tenant-1', title: 'Midnight Pulse', slug: 'midnight-pulse', alternate_titles: [], description: 'Dark driving techno track', lyrics: null, explicit: false, language: 'English', genre: 'Techno', mood_tags: ['Dark', 'Aggressive', 'Tense'], energy: 9, valence: 3, bpm: 140, key: 'Cm', time_signature: '4/4', duration_seconds: 198, composer: ['Adea Lyric'], producer: ['Adea Lyric'], mix_engineer: null, master_owner: 'Adea Lyric', publishing_owner: 'Adea Publishing', recording_year: 2025, release_year: 2026, album: 'Midnight Echoes', version_label: 'Original', isrc: null, iswc: null, upc: null, pro: 'ASCAP', splits: [{ name: 'Adea Lyric', share: 100 }], stems_available: false, master_url: null, preview_url: null, watermarked_url: null, cover_art_url: null, distribution_flag: 'public_streaming', distribution_status: 'published', sync_status: 'on_hold', for_sale: false, asking_price: null, asking_price_negotiable: false, visible_to_roles: ['label'], is_active: true, published_at: '2026-01-15', version: 1, created_at: '2025-12-01', updated_at: '2026-02-01', deleted_at: null },
  { id: id('cs', 3), tenant_id: 'tenant-1', title: 'Solar Flare', slug: 'solar-flare', alternate_titles: [], description: 'Bright ambient electronic track suitable for film/trailer', lyrics: null, explicit: false, language: null, genre: 'Ambient', mood_tags: ['Dreamy', 'Uplifting', 'Epic'], energy: 5, valence: 7, bpm: 90, key: 'D', time_signature: '4/4', duration_seconds: 320, composer: ['Adea Lyric', 'Studio One'], producer: ['Adea Lyric'], mix_engineer: null, master_owner: 'Adea Lyric', publishing_owner: 'Adea Publishing', recording_year: 2025, release_year: 2026, album: 'Solar Waves', version_label: 'Original', isrc: null, iswc: null, upc: null, pro: 'ASCAP', splits: [{ name: 'Adea Lyric', share: 70 }, { name: 'Studio One', share: 30 }], stems_available: true, master_url: null, preview_url: null, watermarked_url: null, cover_art_url: null, distribution_flag: 'catalog_only', distribution_status: 'not_submitted', sync_status: 'available', for_sale: true, asking_price: 5000, asking_price_negotiable: true, visible_to_roles: ['label', 'writer'], is_active: true, published_at: null, version: 1, created_at: '2026-01-01', updated_at: '2026-01-01', deleted_at: null },
  { id: id('cs', 4), tenant_id: 'tenant-1', title: 'City Lights', slug: 'city-lights', alternate_titles: ['City Lights Remix'], description: 'Hip-hop track with urban vibes', lyrics: 'Walking through the city lights...', explicit: true, language: 'English', genre: 'Hip-Hop', mood_tags: ['Energetic', 'Aggressive'], energy: 8, valence: 5, bpm: 95, key: 'Fm', time_signature: '4/4', duration_seconds: 245, composer: ['Adea Lyric', 'DJ Maze'], producer: ['Adea Lyric', 'DJ Maze'], mix_engineer: null, master_owner: 'Adea Lyric', publishing_owner: 'Adea Publishing', recording_year: 2025, release_year: 2026, album: 'Urban Frequencies', version_label: 'Original', isrc: null, iswc: null, upc: null, pro: 'ASCAP', splits: [{ name: 'Adea Lyric', share: 50 }, { name: 'DJ Maze', share: 50 }], stems_available: true, master_url: null, preview_url: null, watermarked_url: null, cover_art_url: null, distribution_flag: 'public_streaming', distribution_status: 'published', sync_status: 'licensed', for_sale: false, asking_price: null, asking_price_negotiable: false, visible_to_roles: ['label', 'booking'], is_active: true, published_at: '2026-01-15', version: 1, created_at: '2025-12-15', updated_at: '2026-02-01', deleted_at: null },
  { id: id('cs', 5), tenant_id: 'tenant-1', title: 'Berlin After Dark', slug: 'berlin-after-dark', alternate_titles: [], description: 'Deep house track perfect for advertising', lyrics: null, explicit: false, language: null, genre: 'House', mood_tags: ['Chill', 'Dreamy', 'Uplifting'], energy: 6, valence: 7, bpm: 118, key: 'Gm', time_signature: '4/4', duration_seconds: 360, composer: ['Nova Sound Collective'], producer: ['Nova Sound Collective'], mix_engineer: 'Berlin Studio', master_owner: 'Nova Sound Collective', publishing_owner: 'Nova Publishing', recording_year: 2025, release_year: 2026, album: 'Berlin After Dark', version_label: 'Original', isrc: null, iswc: null, upc: null, pro: 'GEMA', splits: [{ name: 'Nova Sound Collective', share: 100 }], stems_available: true, master_url: null, preview_url: null, watermarked_url: null, cover_art_url: null, distribution_flag: 'public_streaming', distribution_status: 'published', sync_status: 'available', for_sale: true, asking_price: 8000, asking_price_negotiable: true, visible_to_roles: ['label', 'writer', 'booking'], is_active: true, published_at: '2026-03-01', version: 1, created_at: '2025-12-20', updated_at: '2026-03-01', deleted_at: null },
];

// ============ COLLAB CALLS ============
export const mockCollabCalls: CollabCall[] = [
  { id: id('cc', 1), tenant_id: 'tenant-1', title: 'Need a Verse for Solar Flare', description: 'We have a strong instrumental but need a vocal verse to complete the track. Think dreamy, ambient vocal style.', what_needed: 'Vocal verse (16 bars)', deadline: '2026-08-15', status: 'open', created_at: '2026-06-01', updated_at: '2026-06-01', deleted_at: null },
  { id: id('cc', 2), tenant_id: 'tenant-1', title: 'Beat for Upcoming EP', description: 'Looking for a hip-hop/R&B beat with a modern feel. 808s, melodic synth, clean drums.', what_needed: 'Full beat (2-3 min)', deadline: '2026-07-30', status: 'open', created_at: '2026-05-15', updated_at: '2026-05-15', deleted_at: null },
  { id: id('cc', 3), tenant_id: 'tenant-1', title: 'Co-write for Ad Campaign', description: 'We need a short, punchy track for a tech brand ad campaign. Upbeat, futuristic, 30-60 seconds.', what_needed: 'Co-write + production', deadline: null, status: 'open', created_at: '2026-05-01', updated_at: '2026-05-01', deleted_at: null },
];

// ============ PORTAL REQUESTS ============
export const mockPortalRequests: PortalRequest[] = [
  { id: id('pr', 1), tenant_id: 'tenant-1', user_id: 'label-1', song_id: id('cs', 1), type: 'sync', status: 'pending', assigned_to: null, payload: { usageType: 'film', territory: 'Worldwide', term: '12 months', media: 'All media', notes: 'Looking for an electronic track for our sci-fi film trailer', deadline: '2026-08-01' }, blocked_reason: null, version: 1, created_at: '2026-06-01', updated_at: '2026-06-01', deleted_at: null },
  { id: id('pr', 2), tenant_id: 'tenant-1', user_id: 'booking-1', song_id: null, type: 'booking', status: 'submitted', assigned_to: null, payload: { eventName: 'Club Night NYC', estimatedValue: 300000, date: '2026-09-15' }, blocked_reason: null, version: 1, created_at: '2026-05-15', updated_at: '2026-05-20', deleted_at: null },
  { id: id('pr', 3), tenant_id: 'tenant-1', user_id: 'writer-1', song_id: id('cs', 3), type: 'purchase', status: 'under_review', assigned_to: null, payload: { songTitle: 'Solar Flare', offerAmount: 4500 }, blocked_reason: null, version: 1, created_at: '2026-05-01', updated_at: '2026-05-10', deleted_at: null },
  { id: id('pr', 4), tenant_id: 'tenant-1', user_id: 'writer-1', song_id: null, type: 'collab', status: 'submitted', assigned_to: null, payload: { title: 'Vocal verse submission', description: '16-bar vocal demo for Solar Flare collab call' }, blocked_reason: null, version: 1, created_at: '2026-06-10', updated_at: '2026-06-10', deleted_at: null },
];

// ============ AVAILABILITY HOLDS ============
export const mockAvailabilityHolds: AvailabilityHold[] = [
  { id: id('ah', 1), tenant_id: 'tenant-1', date: '2026-08-15', status: 'booked', label: 'Summer Festival', request_id: id('pr', 2), created_at: '2026-04-01', updated_at: '2026-05-01' },
  { id: id('ah', 2), tenant_id: 'tenant-1', date: '2026-09-20', status: 'booked', label: 'DJ Night at Transit', request_id: null, created_at: '2026-05-01', updated_at: '2026-06-01' },
  { id: id('ah', 3), tenant_id: 'tenant-1', date: '2026-10-10', status: 'hold', label: 'Acoustic Set', request_id: null, created_at: '2026-06-01', updated_at: '2026-06-01' },
  { id: id('ah', 4), tenant_id: 'tenant-1', date: '2026-12-31', status: 'open', label: null, request_id: null, created_at: '2026-06-01', updated_at: '2026-06-01' },
];

// ============ SPEND ENTRIES ============
export const mockSpendEntries: SpendEntry[] = [
  { id: id('sp', 1), tenant_id: 'tenant-1', category: 'sync_license', direction: 'revenue', amount: 25000, currency: 'USD', related_request_id: id('pr', 1), related_song_id: id('cs', 1), notes: 'Film sync license payment', occurred_on: '2026-06-15', created_at: '2026-06-15', updated_at: '2026-06-15', deleted_at: null },
  { id: id('sp', 2), tenant_id: 'tenant-1', category: 'booking_fee', direction: 'revenue', amount: 5000, currency: 'USD', related_request_id: id('pr', 2), related_song_id: null, notes: 'Booking deposit received', occurred_on: '2026-06-10', created_at: '2026-06-10', updated_at: '2026-06-10', deleted_at: null },
  { id: id('sp', 3), tenant_id: 'tenant-1', category: 'recording', direction: 'expense', amount: 3000, currency: 'USD', related_request_id: null, related_song_id: id('cs', 5), notes: 'Studio recording costs', occurred_on: '2026-05-01', created_at: '2026-05-01', updated_at: '2026-05-01', deleted_at: null },
];

// ============ USER LOYALTY ============
export const mockUserLoyalty: UserLoyalty = {
  id: id('loy', 1), user_id: 'fan-1', fan_email: 'fan@test.com', total_points: 1250, tier: 'silver', lifetime_spend: 125, currency: 'USD', joined_at: '2025-06-01', updated_at: '2026-06-01',
};

export const mockLoyaltyTransactions: LoyaltyTransaction[] = [
  { id: id('lt', 1), user_id: 'fan-1', fan_email: 'fan@test.com', points: 500, direction: 'earned', reason: 'Album purchase', related_order_id: id('ord', 1), created_at: '2026-01-20' },
  { id: id('lt', 2), user_id: 'fan-1', fan_email: 'fan@test.com', points: 750, direction: 'earned', reason: 'Concert ticket purchase', related_order_id: null, created_at: '2026-04-01' },
  { id: id('lt', 3), user_id: 'fan-1', fan_email: 'fan@test.com', points: 200, direction: 'spent', reason: 'Merch discount', related_order_id: null, created_at: '2026-03-01' },
];

// ============ EMAIL CAMPAIGNS ============
export const mockEmailCampaigns: EmailCampaign[] = [
  { id: id('ec', 1), subject: 'New Album Release: Midnight Echoes', body: 'Hey fans! Our new album is out now. Stream it or grab the vinyl.', status: 'sent', scheduled_for: null, sent_at: '2026-02-14', recipient_count: 450, open_count: 180, created_at: '2026-02-01' },
  { id: id('ec', 2), subject: 'Summer Festival Tickets Available!', body: 'Get your tickets for our biggest show of the year.', status: 'sent', scheduled_for: null, sent_at: '2026-04-15', recipient_count: 500, open_count: 220, created_at: '2026-04-01' },
  { id: id('ec', 3), subject: 'Merch Drop: Limited Edition', body: 'New merch just dropped. Limited stock available.', status: 'scheduled', scheduled_for: '2026-07-01', sent_at: null, recipient_count: null, open_count: null, created_at: '2026-06-15' },
];

// ============ RIGHTS RECORDS ============
export const mockRightsRecords: RightsRecord[] = [
  { id: id('rr', 1), catalog_song_id: id('cs', 1), rights_type: 'master', owner: 'Adea Lyric', territory: 'Worldwide', expiration: null, ownership_pct: 100, license_ref: null, notes: 'Full master ownership', created_at: '2025-12-01', updated_at: '2026-01-15' },
  { id: id('rr', 2), catalog_song_id: id('cs', 1), rights_type: 'publishing', owner: 'Adea Publishing', territory: 'Worldwide', expiration: null, ownership_pct: 100, license_ref: 'ASCAP', notes: 'Self-published via ASCAP', created_at: '2025-12-01', updated_at: '2026-01-15' },
  { id: id('rr', 3), catalog_song_id: id('cs', 1), rights_type: 'sync', owner: 'Adea Lyric', territory: 'Worldwide', expiration: null, ownership_pct: 100, license_ref: null, notes: 'One-stop clearance — both master and publishing controlled by same owner', created_at: '2025-12-01', updated_at: '2026-01-15' },
  { id: id('rr', 4), catalog_song_id: id('cs', 1), rights_type: 'mechanical', owner: 'Adea Publishing', territory: 'US', expiration: null, ownership_pct: 100, license_ref: 'MLC', notes: 'Registered with The MLC', created_at: '2025-12-01', updated_at: '2026-01-15' },
  { id: id('rr', 5), catalog_song_id: id('cs', 1), rights_type: 'neighboring', owner: 'Adea Lyric', territory: 'UK/EU', expiration: null, ownership_pct: 50, license_ref: 'PPL', notes: 'SoundExchange also collects for US digital', created_at: '2025-12-01', updated_at: '2026-01-15' },
  { id: id('rr', 6), catalog_song_id: id('cs', 3), rights_type: 'master', owner: 'Adea Lyric', territory: 'Worldwide', expiration: null, ownership_pct: 70, license_ref: null, notes: '70% master share per split sheet', created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: id('rr', 7), catalog_song_id: id('cs', 3), rights_type: 'publishing', owner: 'Adea Publishing', territory: 'Worldwide', expiration: null, ownership_pct: 70, license_ref: 'ASCAP', notes: '70% publishing share', created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: id('rr', 8), catalog_song_id: id('cs', 3), rights_type: 'sync', owner: 'Adea Lyric', territory: 'Worldwide', expiration: null, ownership_pct: 70, license_ref: null, notes: 'One-stop for 70% share; Studio One controls remaining 30% — requires co-clearance', created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: id('rr', 9), catalog_song_id: id('cs', 4), rights_type: 'master', owner: 'Adea Lyric', territory: 'Worldwide', expiration: null, ownership_pct: 50, license_ref: null, notes: '50/50 split with DJ Maze', created_at: '2025-12-15', updated_at: '2026-02-01' },
  { id: id('rr', 10), catalog_song_id: id('cs', 4), rights_type: 'publishing', owner: 'Adea Publishing / DJ Maze Publishing', territory: 'Worldwide', expiration: null, ownership_pct: 50, license_ref: 'ASCAP/BMI', notes: 'Split publishing — not one-stop', created_at: '2025-12-15', updated_at: '2026-02-01' },
  { id: id('rr', 11), catalog_song_id: id('cs', 5), rights_type: 'master', owner: 'Nova Sound Collective', territory: 'Worldwide', expiration: null, ownership_pct: 100, license_ref: null, notes: 'Full master ownership by Nova Sound Collective', created_at: '2025-12-20', updated_at: '2026-03-01' },
  { id: id('rr', 12), catalog_song_id: id('cs', 5), rights_type: 'publishing', owner: 'Nova Publishing', territory: 'Worldwide', expiration: null, ownership_pct: 100, license_ref: 'GEMA', notes: 'Self-published via GEMA (Germany)', created_at: '2025-12-20', updated_at: '2026-03-01' },
  { id: id('rr', 13), catalog_song_id: id('cs', 5), rights_type: 'sync', owner: 'Nova Sound Collective', territory: 'Worldwide', expiration: '2027-12-31', ownership_pct: 100, license_ref: null, notes: 'One-stop clearance — both master and publishing owned by same entity', created_at: '2025-12-20', updated_at: '2026-03-01' },
];

// ============ DSP ADAPTERS ============
export const mockDspAdapters: DspAdapter[] = [
  { id: id('dsp', 1), name: 'Spotify', slug: 'spotify', delivery_format: 'DDEX ERN', auth_type: 'aggregator_required', status: 'active', last_delivery_at: '2026-06-15', total_releases_delivered: 4, created_at: '2025-01-01' },
  { id: id('dsp', 2), name: 'Apple Music / iTunes', slug: 'apple-music', delivery_format: 'DDEX ERN / Apple Partner Feed', auth_type: 'aggregator_required', status: 'active', last_delivery_at: '2026-06-10', total_releases_delivered: 4, created_at: '2025-01-01' },
  { id: id('dsp', 3), name: 'Amazon Music', slug: 'amazon-music', delivery_format: 'DDEX ERN', auth_type: 'aggregator_required', status: 'active', last_delivery_at: '2026-06-01', total_releases_delivered: 3, created_at: '2025-01-01' },
  { id: id('dsp', 4), name: 'TikTok', slug: 'tiktok', delivery_format: 'DDEX ERN / TikTok Commercial Library', auth_type: 'partner_approval', status: 'active', last_delivery_at: '2026-05-15', total_releases_delivered: 4, created_at: '2025-03-01' },
  { id: id('dsp', 5), name: 'YouTube / Content ID', slug: 'youtube', delivery_format: 'DDEX ERN / CMS Feed', auth_type: 'cms_approval_required', status: 'pending_approval', last_delivery_at: null, total_releases_delivered: 0, created_at: '2025-03-01' },
  { id: id('dsp', 6), name: 'Deezer', slug: 'deezer', delivery_format: 'DDEX ERN', auth_type: 'aggregator_required', status: 'active', last_delivery_at: '2026-05-01', total_releases_delivered: 3, created_at: '2025-01-01' },
  { id: id('dsp', 7), name: 'Pandora', slug: 'pandora', delivery_format: 'AMP feed', auth_type: 'aggregator_required', status: 'inactive', last_delivery_at: null, total_releases_delivered: 0, created_at: '2025-01-01' },
  { id: id('dsp', 8), name: 'TIDAL', slug: 'tidal', delivery_format: 'DDEX ERN', auth_type: 'aggregator_required', status: 'active', last_delivery_at: '2026-04-15', total_releases_delivered: 3, created_at: '2025-01-01' },
  { id: id('dsp', 9), name: 'Meta (Instagram/Facebook)', slug: 'meta', delivery_format: 'Rights Manager', auth_type: 'approval_required', status: 'pending_approval', last_delivery_at: null, total_releases_delivered: 0, created_at: '2025-03-01' },
  { id: id('dsp', 10), name: 'Boomplay', slug: 'boomplay', delivery_format: 'DDEX ERN', auth_type: 'direct_label_submission', status: 'active', last_delivery_at: '2026-03-01', total_releases_delivered: 2, created_at: '2025-06-01' },
  { id: id('dsp', 11), name: 'Bandcamp', slug: 'bandcamp', delivery_format: 'Direct upload', auth_type: 'direct_upload', status: 'active', last_delivery_at: '2026-06-01', total_releases_delivered: 4, created_at: '2025-01-01' },
  { id: id('dsp', 12), name: 'Audiomack', slug: 'audiomack', delivery_format: 'Direct upload', auth_type: 'direct_upload', status: 'active', last_delivery_at: '2026-05-01', total_releases_delivered: 4, created_at: '2025-06-01' },
  { id: id('dsp', 13), name: 'Soundtrack Your Brand', slug: 'soundtrack', delivery_format: 'API delivery', auth_type: 'label_partner_portal', status: 'active', last_delivery_at: '2026-04-01', total_releases_delivered: 2, created_at: '2025-09-01' },
];

// ============ DELIVERY RECORDS ============
export const mockDeliveryRecords: DeliveryRecord[] = [
  { id: id('dr', 1), release_id: id('rel', 1), dsp_adapter_id: id('dsp', 1), status: 'accepted', submitted_at: '2026-01-20', confirmed_at: '2026-01-22', error_message: null, created_at: '2026-01-20' },
  { id: id('dr', 2), release_id: id('rel', 1), dsp_adapter_id: id('dsp', 2), status: 'accepted', submitted_at: '2026-01-20', confirmed_at: '2026-01-23', error_message: null, created_at: '2026-01-20' },
  { id: id('dr', 3), release_id: id('rel', 1), dsp_adapter_id: id('dsp', 3), status: 'accepted', submitted_at: '2026-01-20', confirmed_at: '2026-01-24', error_message: null, created_at: '2026-01-20' },
  { id: id('dr', 4), release_id: id('rel', 2), dsp_adapter_id: id('dsp', 1), status: 'accepted', submitted_at: '2026-02-01', confirmed_at: '2026-02-03', error_message: null, created_at: '2026-02-01' },
  { id: id('dr', 5), release_id: id('rel', 2), dsp_adapter_id: id('dsp', 2), status: 'rejected', submitted_at: '2026-02-01', confirmed_at: null, error_message: 'Explicit content flag missing on track 2', created_at: '2026-02-01' },
  { id: id('dr', 6), release_id: id('rel', 4), dsp_adapter_id: id('dsp', 1), status: 'pending', submitted_at: null, confirmed_at: null, error_message: null, created_at: '2026-06-15' },
  { id: id('dr', 7), release_id: id('rel', 4), dsp_adapter_id: id('dsp', 2), status: 'pending', submitted_at: null, confirmed_at: null, error_message: null, created_at: '2026-06-15' },
  { id: id('dr', 8), release_id: id('rel', 5), dsp_adapter_id: id('dsp', 1), status: 'delivered', submitted_at: '2026-04-01', confirmed_at: null, error_message: null, created_at: '2026-04-01' },
];

// ============ ROYALTY STATEMENTS ============
export const mockRoyaltyStatements: RoyaltyStatement[] = [
  { id: id('rs', 1), period: '2026-05', dsp_source: 'Spotify', total_streams: 125000, total_revenue_cents: 75000, currency: 'USD', status: 'finalized', generated_at: '2026-06-01', paid_at: null, created_at: '2026-06-01' },
  { id: id('rs', 2), period: '2026-05', dsp_source: 'Apple Music', total_streams: 45000, total_revenue_cents: 54000, currency: 'USD', status: 'finalized', generated_at: '2026-06-01', paid_at: null, created_at: '2026-06-01' },
  { id: id('rs', 3), period: '2026-05', dsp_source: 'Amazon Music', total_streams: 18000, total_revenue_cents: 18000, currency: 'USD', status: 'draft', generated_at: '2026-06-01', paid_at: null, created_at: '2026-06-01' },
  { id: id('rs', 4), period: '2026-04', dsp_source: 'Spotify', total_streams: 98000, total_revenue_cents: 58800, currency: 'USD', status: 'paid', generated_at: '2026-05-01', paid_at: '2026-05-15', created_at: '2026-05-01' },
  { id: id('rs', 5), period: '2026-04', dsp_source: 'Apple Music', total_streams: 32000, total_revenue_cents: 38400, currency: 'USD', status: 'paid', generated_at: '2026-05-01', paid_at: '2026-05-20', created_at: '2026-05-01' },
];

// ============ ROYALTY SPLITS ============
export const mockRoyaltySplits: RoyaltySplit[] = [
  { id: id('rsp', 1), catalog_song_id: id('cs', 1), participant_name: 'Adea Lyric', participant_role: 'artist', share_pct: 40, ipi_cae: 'IPI-001', pro: 'ASCAP', created_at: '2025-12-01' },
  { id: id('rsp', 2), catalog_song_id: id('cs', 1), participant_name: 'Max Chen', participant_role: 'writer', share_pct: 25, ipi_cae: 'IPI-002', pro: 'ASCAP', created_at: '2025-12-01' },
  { id: id('rsp', 3), catalog_song_id: id('cs', 1), participant_name: 'Adea Publishing', participant_role: 'publisher', share_pct: 25, ipi_cae: null, pro: 'ASCAP', created_at: '2025-12-01' },
  { id: id('rsp', 4), catalog_song_id: id('cs', 1), participant_name: 'Label (Adea Lyric)', participant_role: 'label', share_pct: 25, ipi_cae: null, pro: null, created_at: '2025-12-01' },
  { id: id('rsp', 5), catalog_song_id: id('cs', 1), participant_name: 'Studio One', participant_role: 'producer', share_pct: 10, ipi_cae: 'IPI-003', pro: null, created_at: '2025-12-01' },
  { id: id('rsp', 6), catalog_song_id: id('cs', 3), participant_name: 'Adea Lyric', participant_role: 'artist', share_pct: 28, ipi_cae: 'IPI-001', pro: 'ASCAP', created_at: '2026-01-01' },
  { id: id('rsp', 7), catalog_song_id: id('cs', 3), participant_name: 'Studio One', participant_role: 'writer', share_pct: 21, ipi_cae: 'IPI-003', pro: null, created_at: '2026-01-01' },
  { id: id('rsp', 8), catalog_song_id: id('cs', 4), participant_name: 'Adea Lyric', participant_role: 'artist', share_pct: 20, ipi_cae: 'IPI-001', pro: 'ASCAP', created_at: '2025-12-15' },
  { id: id('rsp', 9), catalog_song_id: id('cs', 4), participant_name: 'DJ Maze', participant_role: 'writer', share_pct: 25, ipi_cae: 'IPI-004', pro: 'BMI', created_at: '2025-12-15' },
  { id: id('rsp', 10), catalog_song_id: id('cs', 4), participant_name: 'Adea Publishing', participant_role: 'publisher', share_pct: 25, ipi_cae: null, pro: 'ASCAP', created_at: '2025-12-15' },
  { id: id('rsp', 11), catalog_song_id: id('cs', 4), participant_name: 'DJ Maze Publishing', participant_role: 'publisher', share_pct: 25, ipi_cae: null, pro: 'BMI', created_at: '2025-12-15' },
  { id: id('rsp', 12), catalog_song_id: id('cs', 5), participant_name: 'Nova Sound Collective', participant_role: 'artist', share_pct: 40, ipi_cae: 'IPI-005', pro: 'GEMA', created_at: '2025-12-20' },
  { id: id('rsp', 13), catalog_song_id: id('cs', 5), participant_name: 'Nova Publishing', participant_role: 'publisher', share_pct: 50, ipi_cae: null, pro: 'GEMA', created_at: '2025-12-20' },
  { id: id('rsp', 14), catalog_song_id: id('cs', 5), participant_name: 'Label (Nova)', participant_role: 'label', share_pct: 25, ipi_cae: null, pro: null, created_at: '2025-12-20' },
];

// ============ SYNC LICENSE REQUESTS ============
export const mockSyncLicenseRequests: SyncLicenseRequest[] = [
  { id: id('slr', 1), catalog_song_id: id('cs', 1), requester_name: 'Sarah Kim', requester_org: 'Paramount Pictures', requester_email: 'sarah@paramount.com', usage_type: 'film', territory: 'Worldwide', term_months: 12, media: ['theatrical', 'streaming', 'home_video'], budget_range: '$5k-$15k', notes: 'Sci-fi film trailer — need an uplifting electronic track with cinematic scope', status: 'submitted', cleared_at: null, approved_at: null, fee_cents: null, created_at: '2026-06-01', updated_at: '2026-06-01' },
  { id: id('slr', 2), catalog_song_id: id('cs', 5), requester_name: 'Marcus Webb', requester_org: 'Nike Creative', requester_email: 'marcus@nike.com', usage_type: 'ad', territory: 'North America', term_months: 6, media: ['tv', 'digital', 'social'], budget_range: '$3k-$8k', notes: 'Summer campaign — deep house track for running shoe ad', status: 'under_review', cleared_at: null, approved_at: null, fee_cents: null, created_at: '2026-05-20', updated_at: '2026-05-25' },
  { id: id('slr', 3), catalog_song_id: id('cs', 3), requester_name: 'Lisa Chen', requester_org: 'HBO', requester_email: 'lisa@hbo.com', usage_type: 'tv', territory: 'US', term_months: 24, media: ['broadcast', 'streaming'], budget_range: '$2k-$5k', notes: 'Ambient track needed for limited series background score', status: 'cleared', cleared_at: '2026-06-05', approved_at: null, fee_cents: 350000, created_at: '2026-04-15', updated_at: '2026-06-05' },
  { id: id('slr', 4), catalog_song_id: id('cs', 1), requester_name: 'Ryan O\'Brien', requester_org: 'Ubisoft', requester_email: 'ryan@ubisoft.com', usage_type: 'game', territory: 'Worldwide', term_months: 36, media: ['in-game', 'trailer', 'marketing'], budget_range: '$8k-$20k', notes: 'Electronic track for open-world game ambient playlist', status: 'approved', cleared_at: '2026-05-20', approved_at: '2026-06-01', fee_cents: 1500000, created_at: '2026-04-01', updated_at: '2026-06-01' },
  { id: id('slr', 5), catalog_song_id: id('cs', 4), requester_name: 'Dana Foster', requester_org: 'Netflix', requester_email: 'dana@netflix.com', usage_type: 'tv', territory: 'Worldwide', term_months: 12, media: ['streaming'], budget_range: '$1k-$3k', notes: 'Urban hip-hop track for drama series club scene', status: 'countered', cleared_at: null, approved_at: null, fee_cents: 200000, created_at: '2026-05-01', updated_at: '2026-05-15' },
  { id: id('slr', 6), catalog_song_id: id('cs', 2), requester_name: 'Tech Corp Marketing', requester_org: 'Accenture', requester_email: 'marketing@accenture.com', usage_type: 'corporate', territory: 'US/EU', term_months: 3, media: ['digital', 'presentation'], budget_range: '$500-$1k', notes: 'Need a driving techno track for tech keynote', status: 'declined', cleared_at: null, approved_at: null, fee_cents: null, created_at: '2026-03-01', updated_at: '2026-03-15' },
];

// ============ VALIDATION CHECKS ============
export const mockValidationChecks: ValidationCheck[] = [
  { id: id('vc', 1), release_id: id('rel', 1), check_type: 'ddex', status: 'pass', message: 'ERN message schema validated', checked_at: '2026-01-18', created_at: '2026-01-18' },
  { id: id('vc', 2), release_id: id('rel', 1), check_type: 'metadata', status: 'pass', message: 'All core metadata fields complete (ISRC, UPC, IPI/CAE)', checked_at: '2026-01-18', created_at: '2026-01-18' },
  { id: id('vc', 3), release_id: id('rel', 1), check_type: 'artwork', status: 'pass', message: '3000x3000 JPEG, RGB, no URLs/borders', checked_at: '2026-01-18', created_at: '2026-01-18' },
  { id: id('vc', 4), release_id: id('rel', 1), check_type: 'audio', status: 'pass', message: 'WAV files validated, checksums generated, loudness analyzed', checked_at: '2026-01-18', created_at: '2026-01-18' },
  { id: id('vc', 5), release_id: id('rel', 1), check_type: 'copyright', status: 'pass', message: 'Rights ownership verified for all territories', checked_at: '2026-01-18', created_at: '2026-01-18' },
  { id: id('vc', 6), release_id: id('rel', 2), check_type: 'metadata', status: 'warning', message: 'Explicit content flag missing on track "Street Vibes" — Apple Music may reject', checked_at: '2026-02-01', created_at: '2026-02-01' },
  { id: id('vc', 7), release_id: id('rel', 2), check_type: 'copyright', status: 'fail', message: 'Track "City Lights" has split publishing ownership — not one-stop clearance for sync', checked_at: '2026-02-01', created_at: '2026-02-01' },
  { id: id('vc', 8), release_id: id('rel', 4), check_type: 'metadata', status: 'pending', message: 'ISRC codes not yet assigned', checked_at: '2026-06-15', created_at: '2026-06-15' },
  { id: id('vc', 9), release_id: id('rel', 4), check_type: 'artwork', status: 'pending', message: 'Artwork not yet uploaded', checked_at: '2026-06-15', created_at: '2026-06-15' },
  { id: id('vc', 10), release_id: id('rel', 4), check_type: 'audio', status: 'pending', message: 'Audio files awaiting upload', checked_at: '2026-06-15', created_at: '2026-06-15' },
];

// Additional mock data for legacy pages
export const mockTicketOrders: TicketOrder[] = [
  { id: id('to', 1), event_id: id('te', 1), user_id: null, fan_email: 'fan1@example.com', fan_name: 'Alex Rivera', tier_id: id('tt', 1), quantity: 2, total_cents: 4000, currency: 'USD', status: 'paid', stripe_payment_intent_id: null, stripe_checkout_session_id: null, created_at: '2026-06-01' },
  { id: id('to', 2), event_id: id('te', 2), user_id: null, fan_email: 'fan2@example.com', fan_name: 'Maya Chen', tier_id: id('tt', 2), quantity: 1, total_cents: 7500, currency: 'USD', status: 'paid', stripe_payment_intent_id: null, stripe_checkout_session_id: null, created_at: '2026-06-05' },
  { id: id('to', 3), event_id: id('te', 1), user_id: null, fan_email: 'fan3@example.com', fan_name: 'Jordan Lee', tier_id: id('tt', 1), quantity: 3, total_cents: 6000, currency: 'USD', status: 'pending', stripe_payment_intent_id: null, stripe_checkout_session_id: null, created_at: '2026-06-10' },
];

export const mockPortalDocuments: PortalDocument[] = [
  { id: id('pd', 1), tenant_id: 't1', user_id: id('pu', 1), request_id: null, song_id: null, file_url: '/docs/sync-license-template.pdf', file_name: 'sync-license-template.pdf', type: 'contract', esign_status: 'none', created_at: '2026-01-15', updated_at: '2026-01-15', deleted_at: null },
  { id: id('pd', 2), tenant_id: 't1', user_id: id('pu', 1), request_id: null, song_id: null, file_url: '/docs/booking-contract.pdf', file_name: 'booking-contract.pdf', type: 'contract', esign_status: 'none', created_at: '2026-02-01', updated_at: '2026-02-01', deleted_at: null },
];

export const mockPortalNotifications: PortalNotification[] = [
  { id: id('pn', 1), tenant_id: 't1', user_id: id('pu', 1), type: 'request', related_entity_type: 'sync_request', related_entity_id: id('slr', 1), body: 'A music supervisor has submitted a sync request for "Midnight Dreams"', read_at: null, created_at: '2026-06-01' },
  { id: id('pn', 2), tenant_id: 't1', user_id: id('pu', 1), type: 'deal', related_entity_type: 'sync_license', related_entity_id: id('slr', 2), body: 'Sync license for "City Lights" has been approved — $15,000', read_at: '2026-06-04T10:00:00Z', created_at: '2026-06-03' },
];

// Alias exports for legacy pages that use different names
export const mockInquiries = mockBookingInquiries;
export const mockContacts = mockCrmContacts;
export const mockActivities: CrmActivity[] = [];
export const mockCampaigns = mockEmailCampaigns;
export const mockConnections: PlatformConnection[] = [];
