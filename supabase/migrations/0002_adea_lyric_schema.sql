-- ============================================================================
-- ADEA LYRIC — Supabase Schema (Single-Tenant Artist Site)
-- ============================================================================
-- Design principle: Single-tenant, no multi-tenancy complexity
-- Auth via Supabase Auth, Storage via Supabase Storage
-- Run via: supabase migration new adea_lyric_schema
--          supabase db push
-- Types:   supabase gen types typescript --local > types/adea-lyric.ts
-- ============================================================================

-- ----------------------------------------------------------------------------
-- EXTENSIONS
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "pg_trgm";       -- fuzzy search

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------
create type release_type as enum ('ALBUM', 'EP', 'SINGLE', 'MIXTAPE');
create type release_status as enum ('DRAFT', 'PUBLISHED', 'ARCHIVED');
create type booking_status as enum ('INQUIRY', 'PENDING', 'CONFIRMED', 'DEPOSIT_PAID', 'COMPLETED', 'CANCELLED');
create type order_status as enum ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'REFUNDED', 'CANCELLED');
create type product_type as enum ('MERCH', 'VINYL', 'CD', 'DIGITAL_BUNDLE', 'USB');
create type sync_status as enum ('AVAILABLE', 'ON_HOLD', 'WITHDRAWN', 'IN_NEGOTIATION', 'LICENSED');
create type ticket_status as enum ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
create type social_platform as enum ('INSTAGRAM', 'TWITTER', 'TIKTOK', 'FACEBOOK', 'YOUTUBE');

-- ----------------------------------------------------------------------------
-- CATALOG — Releases & Tracks
-- ----------------------------------------------------------------------------
create table releases (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  type        release_type not null,
  year        int not null,
  cover_url   text,
  hero_url    text,
  runtime     text,
  color       text,
  credits     text,
  story       text,
  status      release_status not null default 'DRAFT',
  release_date date,
  
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_releases_status on releases(status);
create index idx_releases_type on releases(type);
create index idx_releases_year on releases(year);

create table tracks (
  id          uuid primary key default gen_random_uuid(),
  release_id  uuid references releases(id) on delete cascade,
  n           int not null,
  title       text not null,
  length      text not null,
  feat        text,
  isrc        text unique,
  bpm         int,
  musical_key text,
  genre       text,
  mood        text,
  
  created_at  timestamptz not null default now(),
  
  unique (release_id, n)
);

create index idx_tracks_release on tracks(release_id);

-- ----------------------------------------------------------------------------
-- BOOKINGS — Events & Inquiries
-- ----------------------------------------------------------------------------
create table bookings (
  id          uuid primary key default gen_random_uuid(),
  event_name  text not null,
  venue_name  text,
  venue_city  text,
  event_date  date not null,
  status      booking_status not null default 'PENDING',
  deposit_cents int,
  total_cents int,
  notes       text,
  
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_bookings_status on bookings(status);
create index idx_bookings_date on bookings(event_date);

create table booking_inquiries (
  id          uuid primary key default gen_random_uuid(),
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  event_name  text,
  event_date  date,
  venue_name  text,
  budget      text,
  notes       text,
  status      booking_status not null default 'INQUIRY',
  
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_booking_inquiries_status on booking_inquiries(status);

-- ----------------------------------------------------------------------------
-- COMMERCE — Products & Orders
-- ----------------------------------------------------------------------------
create table products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  type        product_type not null,
  price_cents int not null,
  description text,
  images      text[] not null default '{}',
  inventory   int default 0,
  status      release_status not null default 'DRAFT',
  
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_products_status on products(status);
create index idx_products_type on products(type);

create table orders (
  id          uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  buyer_email text not null,
  buyer_name  text,
  shipping_address jsonb,
  amount_total_cents int not null,
  status      order_status not null default 'PENDING',
  
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_orders_status on orders(status);
create index idx_orders_email on orders(buyer_email);

create table order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references orders(id) on delete cascade,
  product_id  uuid references products(id),
  quantity    int not null,
  price_cents int not null,
  
  created_at  timestamptz not null default now()
);

create index idx_order_items_order on order_items(order_id);
create index idx_order_items_product on order_items(product_id);

-- ----------------------------------------------------------------------------
-- CRM — Contacts
-- ----------------------------------------------------------------------------
create table crm_contacts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text unique,
  phone       text,
  company     text,
  role        text,
  source      text, -- instagram, website, referral, etc.
  notes       text,
  tags        text[] not null default '{}',
  
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_crm_contacts_email on crm_contacts(email);
create index idx_crm_contacts_tags on crm_contacts using gin (tags);

-- ----------------------------------------------------------------------------
-- SOCIAL MEDIA — Posts
-- ----------------------------------------------------------------------------
create table social_posts (
  id          uuid primary key default gen_random_uuid(),
  platform    social_platform not null,
  content     text not null,
  media_urls  text[] not null default '{}',
  scheduled_for timestamptz,
  posted_at   timestamptz,
  status      text not null default 'DRAFT', -- DRAFT, SCHEDULED, POSTED
  external_id text, -- ID from social platform
  
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_social_posts_status on social_posts(status);
create index idx_social_posts_platform on social_posts(platform);

-- ----------------------------------------------------------------------------
-- FANS — Fan Portal
-- ----------------------------------------------------------------------------
create table fans (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  name        text,
  location    text,
  signup_source text,
  
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_fans_email on fans(email);

create table fan_interactions (
  id          uuid primary key default gen_random_uuid(),
  fan_id      uuid references fans(id) on delete cascade,
  interaction_type text not null, -- stream, download, purchase, event_attend
  metadata    jsonb,
  
  created_at  timestamptz not null default now()
);

create index idx_fan_interactions_fan on fan_interactions(fan_id);
create index idx_fan_interactions_type on fan_interactions(interaction_type);

-- ----------------------------------------------------------------------------
-- SYNC MARKETPLACE — For Sync Agents
-- ----------------------------------------------------------------------------
create table sync_listings (
  id          uuid primary key default gen_random_uuid(),
  track_id    uuid references tracks(id) on delete cascade,
  title       text not null,
  description text,
  tags        text[] not null default '{}',
  mood        text[],
  genre       text[],
  vocal_gender text,
  explicit    boolean not null default false,
  one_stop   boolean not null default false,
  status      sync_status not null default 'AVAILABLE',
  
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_sync_listings_status on sync_listings(status);
create index idx_sync_listings_tags on sync_listings using gin (tags);

create table sync_inquiries (
  id          uuid primary key default gen_random_uuid(),
  sync_listing_id uuid references sync_listings(id) on delete cascade,
  agent_name  text not null,
  agent_email text not null,
  company     text,
  project_name text,
  usage_type  text, -- film, tv, commercial, etc.
  budget      text,
  notes       text,
  status      sync_status not null default 'AVAILABLE',
  
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_sync_inquiries_status on sync_inquiries(status);
create index idx_sync_inquiries_listing on sync_inquiries(sync_listing_id);

-- ----------------------------------------------------------------------------
-- TICKETS — Support
-- ----------------------------------------------------------------------------
create table tickets (
  id          uuid primary key default gen_random_uuid(),
  subject     text not null,
  description text not null,
  contact_email text not null,
  contact_name text,
  status      ticket_status not null default 'OPEN',
  priority    text not null default 'NORMAL', -- LOW, NORMAL, HIGH, URGENT
  
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_tickets_status on tickets(status);
create index idx_tickets_priority on tickets(priority);

-- ----------------------------------------------------------------------------
-- CMS — Pages & Media
-- ----------------------------------------------------------------------------
create table cms_pages (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  content     jsonb not null,
  meta_title  text,
  meta_description text,
  published   boolean not null default false,
  
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_cms_pages_slug on cms_pages(slug);
create index idx_cms_pages_published on cms_pages(published);

create table media_assets (
  id          uuid primary key default gen_random_uuid(),
  filename    text not null,
  storage_path text not null, -- Supabase Storage path
  mime_type   text,
  size_bytes  bigint,
  alt_text    text,
  
  created_at  timestamptz not null default now()
);

create index idx_media_assets_path on media_assets(storage_path);

-- ----------------------------------------------------------------------------
-- SETTINGS — Site Configuration
-- ----------------------------------------------------------------------------
create table settings (
  id          uuid primary key default gen_random_uuid(),
  key         text unique not null,
  value       jsonb not null,
  
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_settings_key on settings(key);

-- ----------------------------------------------------------------------------
-- TRIGGERS — updated_at
-- ----------------------------------------------------------------------------
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply to all tables with updated_at
create trigger trg_releases_updated_at before update on releases for each row execute function set_updated_at();
create trigger trg_bookings_updated_at before update on bookings for each row execute function set_updated_at();
create trigger trg_booking_inquiries_updated_at before update on booking_inquiries for each row execute function set_updated_at();
create trigger trg_products_updated_at before update on products for each row execute function set_updated_at();
create trigger trg_orders_updated_at before update on orders for each row execute function set_updated_at();
create trigger trg_crm_contacts_updated_at before update on crm_contacts for each row execute function set_updated_at();
create trigger trg_social_posts_updated_at before update on social_posts for each row execute function set_updated_at();
create trigger trg_fans_updated_at before update on fans for each row execute function set_updated_at();
create trigger trg_sync_listings_updated_at before update on sync_listings for each row execute function set_updated_at();
create trigger trg_sync_inquiries_updated_at before update on sync_inquiries for each row execute function set_updated_at();
create trigger trg_tickets_updated_at before update on tickets for each row execute function set_updated_at();
create trigger trg_cms_pages_updated_at before update on cms_pages for each row execute function set_updated_at();
create trigger trg_settings_updated_at before update on settings for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
-- For single-tenant Adea Lyric, we can keep RLS simple:
-- - Public: read-only published content
-- - Authenticated: full access (admin dashboard)

alter table releases enable row level security;
alter table tracks enable row level security;
alter table bookings enable row level security;
alter table booking_inquiries enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table crm_contacts enable row level security;
alter table social_posts enable row level security;
alter table fans enable row level security;
alter table sync_listings enable row level security;
alter table sync_inquiries enable row level security;
alter table tickets enable row level security;
alter table cms_pages enable row level security;
alter table media_assets enable row level security;
alter table settings enable row level security;

-- Public can read published releases and tracks
create policy releases_public_read on releases for select using (status = 'PUBLISHED');
create policy tracks_public_read on tracks for select using (
  exists (select 1 from releases r where r.id = tracks.release_id and r.status = 'PUBLISHED')
);

-- Authenticated users have full access
create policy releases_admin_all on releases for all using (auth.role() = 'authenticated');
create policy tracks_admin_all on tracks for all using (auth.role() = 'authenticated');
create policy bookings_admin_all on bookings for all using (auth.role() = 'authenticated');
create policy booking_inquiries_admin_all on booking_inquiries for all using (auth.role() = 'authenticated');
create policy products_admin_all on products for all using (auth.role() = 'authenticated');
create policy orders_admin_all on orders for all using (auth.role() = 'authenticated');
create policy crm_contacts_admin_all on crm_contacts for all using (auth.role() = 'authenticated');
create policy social_posts_admin_all on social_posts for all using (auth.role() = 'authenticated');
create policy fans_admin_all on fans for all using (auth.role() = 'authenticated');
create policy sync_listings_admin_all on sync_listings for all using (auth.role() = 'authenticated');
create policy sync_inquiries_admin_all on sync_inquiries for all using (auth.role() = 'authenticated');
create policy tickets_admin_all on tickets for all using (auth.role() = 'authenticated');
create policy cms_pages_admin_all on cms_pages for all using (auth.role() = 'authenticated');
create policy media_assets_admin_all on media_assets for all using (auth.role() = 'authenticated');
create policy settings_admin_all on settings for all using (auth.role() = 'authenticated');

-- Sync agents can read sync listings (public marketplace)
create policy sync_listings_public_read on sync_listings for select using (status = 'AVAILABLE');
