import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for Adea Lyric database
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      releases: {
        Row: {
          id: string;
          slug: string;
          title: string;
          type: 'ALBUM' | 'EP' | 'SINGLE' | 'MIXTAPE';
          year: number;
          cover_url: string | null;
          hero_url: string | null;
          runtime: string | null;
          color: string | null;
          credits: string | null;
          story: string | null;
          status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
          release_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          type: 'ALBUM' | 'EP' | 'SINGLE' | 'MIXTAPE';
          year: number;
          cover_url?: string | null;
          hero_url?: string | null;
          runtime?: string | null;
          color?: string | null;
          credits?: string | null;
          story?: string | null;
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
          release_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          type?: 'ALBUM' | 'EP' | 'SINGLE' | 'MIXTAPE';
          year?: number;
          cover_url?: string | null;
          hero_url?: string | null;
          runtime?: string | null;
          color?: string | null;
          credits?: string | null;
          story?: string | null;
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
          release_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tracks: {
        Row: {
          id: string;
          release_id: string;
          n: number;
          title: string;
          length: string;
          feat: string | null;
          isrc: string | null;
          bpm: number | null;
          musical_key: string | null;
          genre: string | null;
          mood: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          release_id: string;
          n: number;
          title: string;
          length: string;
          feat?: string | null;
          isrc?: string | null;
          bpm?: number | null;
          musical_key?: string | null;
          genre?: string | null;
          mood?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          release_id?: string;
          n?: number;
          title?: string;
          length?: string;
          feat?: string | null;
          isrc?: string | null;
          bpm?: number | null;
          musical_key?: string | null;
          genre?: string | null;
          mood?: string | null;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          event_name: string;
          venue_name: string | null;
          venue_city: string | null;
          event_date: string;
          status: 'INQUIRY' | 'PENDING' | 'CONFIRMED' | 'DEPOSIT_PAID' | 'COMPLETED' | 'CANCELLED';
          deposit_cents: number | null;
          total_cents: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_name: string;
          venue_name?: string | null;
          venue_city?: string | null;
          event_date: string;
          status?: 'INQUIRY' | 'PENDING' | 'CONFIRMED' | 'DEPOSIT_PAID' | 'COMPLETED' | 'CANCELLED';
          deposit_cents?: number | null;
          total_cents?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_name?: string;
          venue_name?: string | null;
          venue_city?: string | null;
          event_date?: string;
          status?: 'INQUIRY' | 'PENDING' | 'CONFIRMED' | 'DEPOSIT_PAID' | 'COMPLETED' | 'CANCELLED';
          deposit_cents?: number | null;
          total_cents?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      booking_inquiries: {
        Row: {
          id: string;
          contact_name: string;
          contact_email: string;
          contact_phone: string | null;
          event_name: string | null;
          event_date: string | null;
          venue_name: string | null;
          budget: string | null;
          notes: string | null;
          status: 'INQUIRY' | 'PENDING' | 'CONFIRMED' | 'DEPOSIT_PAID' | 'COMPLETED' | 'CANCELLED';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contact_name: string;
          contact_email: string;
          contact_phone?: string | null;
          event_name?: string | null;
          event_date?: string | null;
          venue_name?: string | null;
          budget?: string | null;
          notes?: string | null;
          status?: 'INQUIRY' | 'PENDING' | 'CONFIRMED' | 'DEPOSIT_PAID' | 'COMPLETED' | 'CANCELLED';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          contact_name?: string;
          contact_email?: string;
          contact_phone?: string | null;
          event_name?: string | null;
          event_date?: string | null;
          venue_name?: string | null;
          budget?: string | null;
          notes?: string | null;
          status?: 'INQUIRY' | 'PENDING' | 'CONFIRMED' | 'DEPOSIT_PAID' | 'COMPLETED' | 'CANCELLED';
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          type: 'MERCH' | 'VINYL' | 'CD' | 'DIGITAL_BUNDLE' | 'USB';
          price_cents: number;
          description: string | null;
          images: string[];
          inventory: number;
          status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          type: 'MERCH' | 'VINYL' | 'CD' | 'DIGITAL_BUNDLE' | 'USB';
          price_cents: number;
          description?: string | null;
          images?: string[];
          inventory?: number;
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          type?: 'MERCH' | 'VINYL' | 'CD' | 'DIGITAL_BUNDLE' | 'USB';
          price_cents?: number;
          description?: string | null;
          images?: string[];
          inventory?: number;
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          buyer_email: string;
          buyer_name: string | null;
          shipping_address: Json;
          amount_total_cents: number;
          status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'REFUNDED' | 'CANCELLED';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          buyer_email: string;
          buyer_name?: string | null;
          shipping_address?: Json;
          amount_total_cents: number;
          status?: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'REFUNDED' | 'CANCELLED';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          buyer_email?: string;
          buyer_name?: string | null;
          shipping_address?: Json;
          amount_total_cents?: number;
          status?: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'REFUNDED' | 'CANCELLED';
          created_at?: string;
          updated_at?: string;
        };
      };
      crm_contacts: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          company: string | null;
          role: string | null;
          source: string | null;
          notes: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          role?: string | null;
          source?: string | null;
          notes?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          role?: string | null;
          source?: string | null;
          notes?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      sync_listings: {
        Row: {
          id: string;
          track_id: string;
          title: string;
          description: string | null;
          tags: string[];
          mood: string[] | null;
          genre: string[] | null;
          vocal_gender: string | null;
          explicit: boolean;
          one_stop: boolean;
          status: 'AVAILABLE' | 'ON_HOLD' | 'WITHDRAWN' | 'IN_NEGOTIATION' | 'LICENSED';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          track_id: string;
          title: string;
          description?: string | null;
          tags?: string[];
          mood?: string[] | null;
          genre?: string[] | null;
          vocal_gender?: string | null;
          explicit?: boolean;
          one_stop?: boolean;
          status?: 'AVAILABLE' | 'ON_HOLD' | 'WITHDRAWN' | 'IN_NEGOTIATION' | 'LICENSED';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          track_id?: string;
          title?: string;
          description?: string | null;
          tags?: string[];
          mood?: string[] | null;
          genre?: string[] | null;
          vocal_gender?: string | null;
          explicit?: boolean;
          one_stop?: boolean;
          status?: 'AVAILABLE' | 'ON_HOLD' | 'WITHDRAWN' | 'IN_NEGOTIATION' | 'LICENSED';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
