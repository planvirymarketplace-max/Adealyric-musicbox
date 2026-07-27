'use client';

import { useState } from 'react';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { toast } from '@/components/ui/Toast';
import {
  Search, MapPin, Building2, Users, Phone, Mail, Plus, SlidersHorizontal,
  X, Star, Image, CalendarDays, ExternalLink
} from 'lucide-react';

// ── Types ──
interface Venue {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  address: string;
  capacity: number;
  type: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  rating: number;
  pastEvents: number;
  imagePlaceholder: string;
  amenities: string[];
}

// ── Mock Data: 10 venues across different cities ──
const MOCK_VENUES: Venue[] = [
  { id: 'v-1', name: 'The Fillmore', city: 'San Francisco', state: 'CA', country: 'US', address: '1805 Geary Blvd, San Francisco, CA 94115', capacity: 1250, type: 'Concert Hall', contactName: 'Sarah Chen', contactEmail: 'bookings@fillmore.com', contactPhone: '(415) 346-6000', rating: 4.8, pastEvents: 4, imagePlaceholder: 'https://placehold.co/400x250/222/fff?text=The+Fillmore', amenities: ['Full bar', 'Merch area', 'Green room', 'Parking'] },
  { id: 'v-2', name: 'Terminal 5', city: 'New York', state: 'NY', country: 'US', address: '610 W 56th St, New York, NY 10019', capacity: 3000, type: 'Nightclub', contactName: 'Mike Rodriguez', contactEmail: 'events@terminal5.com', contactPhone: '(212) 582-6600', rating: 4.2, pastEvents: 3, imagePlaceholder: 'https://placehold.co/400x250/222/fff?text=Terminal+5', amenities: ['VIP area', 'Full bar', 'Merch area', 'Loading dock'] },
  { id: 'v-3', name: 'Blue Note', city: 'New York', state: 'NY', country: 'US', address: '131 W 3rd St, New York, NY 10012', capacity: 250, type: 'Jazz Club', contactName: 'Jazz Booking Desk', contactEmail: 'info@bluenotejazz.com', contactPhone: '(212) 475-8592', rating: 5.0, pastEvents: 8, imagePlaceholder: 'https://placehold.co/400x250/222/fff?text=Blue+Note', amenities: ['Dinner seating', 'Full bar', 'Piano', 'Intimate setting'] },
  { id: 'v-4', name: 'Greek Theatre', city: 'Los Angeles', state: 'CA', country: 'US', address: '2700 N Vermont Ave, Los Angeles, CA 90027', capacity: 5870, type: 'Outdoor Amphitheatre', contactName: 'LA Parks Dept', contactEmail: 'greektheatre@lacity.gov', contactPhone: '(323) 665-3388', rating: 4.5, pastEvents: 2, imagePlaceholder: 'https://placehold.co/400x250/222/fff?text=Greek+Theatre', amenities: ['Outdoor stage', 'Concession stands', 'Merch area', 'Parking lot'] },
  { id: 'v-5', name: 'The Troubadour', city: 'Los Angeles', state: 'CA', country: 'US', address: '268 Santa Monica Blvd, Los Angeles, CA 90046', capacity: 400, type: 'Listening Room', contactName: 'Booking Team', contactEmail: 'booking@troubadour.com', contactPhone: '(310) 652-6923', rating: 4.9, pastEvents: 1, imagePlaceholder: 'https://placehold.co/400x250/222/fff?text=Troubadour', amenities: ['Intimate setting', 'Full bar', 'Acoustic-friendly', 'History'] },
  { id: 'v-6', name: 'Webster Hall', city: 'New York', state: 'NY', country: 'US', address: '125 E 11th St, New York, NY 10003', capacity: 1500, type: 'Multi-Level Club', contactName: 'Operations Team', contactEmail: 'ops@websterhall.com', contactPhone: '(212) 353-6300', rating: 3.8, pastEvents: 5, imagePlaceholder: 'https://placehold.co/400x250/222/fff?text=Webster+Hall', amenities: ['3 floors', 'VIP area', 'Full bar', 'Sound system'] },
  { id: 'v-7', name: 'SFJAZZ Center', city: 'San Francisco', state: 'CA', country: 'US', address: '201 Franklin St, San Francisco, CA 94102', capacity: 700, type: 'Concert Hall', contactName: 'Programming Dept', contactEmail: 'prog@sfjazz.org', contactPhone: '(415) 289-8100', rating: 4.7, pastEvents: 6, imagePlaceholder: 'https://placehold.co/400x250/222/fff?text=SFJAZZ', amenities: ['Dinner seating', 'Full bar', 'Piano', 'Acoustic design'] },
  { id: 'v-8', name: 'Red Rocks Amphitheatre', city: 'Morrison', state: 'CO', country: 'US', address: '18300 W Alameda Pkwy, Morrison, CO 80465', capacity: 9525, type: 'Outdoor Amphitheatre', contactName: 'Denver Parks & Rec', contactEmail: 'redrocks@denvergov.org', contactPhone: '(720) 865-0900', rating: 5.0, pastEvents: 0, imagePlaceholder: 'https://placehold.co/400x250/222/fff?text=Red+Rocks', amenities: ['Iconic outdoor', 'Concession stands', 'Merch area', 'Parking lot'] },
  { id: 'v-9', name: 'The Roxy', city: 'Los Angeles', state: 'CA', country: 'US', address: '9009 Sunset Blvd, Los Angeles, CA 90069', capacity: 500, type: 'Nightclub', contactName: 'Talent Dept', contactEmail: 'talent@theroxy.com', contactPhone: '(310) 278-8965', rating: 4.3, pastEvents: 2, imagePlaceholder: 'https://placehold.co/400x250/222/fff?text=The+Roxy', amenities: ['Full bar', 'Merch area', 'Green room', 'Loading dock'] },
  { id: 'v-10', name: 'House of Blues', city: 'Chicago', state: 'IL', country: 'US', address: '329 N Dearborn St, Chicago, IL 60654', capacity: 1400, type: 'Music Hall', contactName: 'Booking Dept', contactEmail: 'booking@hobchicago.com', contactPhone: '(312) 923-9300', rating: 4.1, pastEvents: 3, imagePlaceholder: 'https://placehold.co/400x250/222/fff?text=House+of+Blues', amenities: ['Restaurant', 'Full bar', 'VIP area', 'Merch area'] },
];

const VENUE_TYPES = ['All', 'Concert Hall', 'Nightclub', 'Jazz Club', 'Outdoor Amphitheatre', 'Listening Room', 'Multi-Level Club', 'Music Hall'];
const CITIES = ['All', 'New York', 'Los Angeles', 'San Francisco', 'Morrison', 'Chicago'];
const CAPACITY_RANGES = [
  { label: 'All', min: 0, max: Infinity },
  { label: '< 500', min: 0, max: 500 },
  { label: '500–1,500', min: 500, max: 1500 },
  { label: '1,500–3,000', min: 1500, max: 3000 },
  { label: '3,000–6,000', min: 3000, max: 6000 },
  { label: '6,000+', min: 6000, max: Infinity },
];

export function AdminTourVenuesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterCapacity, setFilterCapacity] = useState('All');
  const [showFilters, setShowFilters] = useState(true);

  // ── Filtering ──
  const capacityRange = CAPACITY_RANGES.find(r => r.label === filterCapacity) ?? CAPACITY_RANGES[0];

  const filteredVenues = MOCK_VENUES.filter(v => {
    const matchesSearch = searchQuery === '' || 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = filterCity === 'All' || v.city === filterCity;
    const matchesType = filterType === 'All' || v.type === filterType;
    const matchesCapacity = v.capacity >= capacityRange.min && v.capacity <= capacityRange.max;
    return matchesSearch && matchesCity && matchesType && matchesCapacity;
  });

  // ── Stats ──
  const totalCapacity = filteredVenues.reduce((sum, v) => sum + v.capacity, 0);
  const avgRating = filteredVenues.length > 0 ? filteredVenues.reduce((sum, v) => sum + v.rating, 0) / filteredVenues.length : 0;
  const totalPastEvents = filteredVenues.reduce((sum, v) => sum + v.pastEvents, 0);

  const activeFilterCount = [filterCity, filterType, filterCapacity].filter(v => v !== 'All').length;
  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterCity('All');
    setFilterType('All');
    setFilterCapacity('All');
  };

  return (
    <div>
      <PageHeader
        title="Venues"
        description="Per IA §23.7: Searchable venue database (Overture/Pollstar-style). Browse, filter, and manage venue information and contacts."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={16} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              {activeFilterCount > 0 && <span className="ml-1 inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-medium">{activeFilterCount}</span>}
            </Button>
            <Button variant="primary" size="sm" onClick={() => toast('info', 'Add Venue form coming soon')}>
              <Plus size={16} /> Add Venue
            </Button>
          </>
        }
      />

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Venues" value={filteredVenues.length} icon={<Building2 size={28} />} trend={`${MOCK_VENUES.length} total`} />
        <StatCard label="Total Capacity" value={totalCapacity.toLocaleString()} icon={<Users size={28} />} />
        <StatCard label="Avg Rating" value={avgRating.toFixed(1)} icon={<Star size={28} />} trend="out of 5.0" />
        <StatCard label="Past Events" value={totalPastEvents} icon={<CalendarDays size={28} />} />
      </div>

      {/* ── Search & Filters ── */}
      {showFilters && (
        <Card className="p-5 mb-6">
          {/* Search bar */}
          <div className="mb-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search venues by name, city, or address…"
                className="w-full pl-10 pr-10 py-3 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Filter dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">City</label>
              <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm">
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Venue Type</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm">
                {VENUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Capacity Range</label>
              <select value={filterCapacity} onChange={e => setFilterCapacity(e.target.value)} className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm">
                {CAPACITY_RANGES.map(r => <option key={r.label} value={r.label}>{r.label}</option>)}
              </select>
            </div>
          </div>

          {/* Active filter badges */}
          {activeFilterCount > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-neutral-400">Active filters:</span>
              {filterCity !== 'All' && <Badge color="blue" size="sm">City: {filterCity} <button onClick={() => setFilterCity('All')} className="ml-1 hover:text-red-500"><X size={10} /></button></Badge>}
              {filterType !== 'All' && <Badge color="blue" size="sm">Type: {filterType} <button onClick={() => setFilterType('All')} className="ml-1 hover:text-red-500"><X size={10} /></button></Badge>}
              {filterCapacity !== 'All' && <Badge color="blue" size="sm">Capacity: {filterCapacity} <button onClick={() => setFilterCapacity('All')} className="ml-1 hover:text-red-500"><X size={10} /></button></Badge>}
              {searchQuery && <Badge color="blue" size="sm">Search: "{searchQuery}" <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-red-500"><X size={10} /></button></Badge>}
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>Clear all</Button>
            </div>
          )}
        </Card>
      )}

      {/* ── Venue Card Grid ── */}
      {filteredVenues.length === 0 ? (
        <Card className="p-5">
          <div className="flex flex-col items-center justify-center py-12">
            <Building2 size={32} className="text-neutral-300 mb-4" />
            <p className="text-sm font-semibold text-neutral-900">No venues match your filters</p>
            <p className="text-sm text-neutral-500 mt-1">Try adjusting your search or filter criteria.</p>
            <Button variant="secondary" size="sm" onClick={clearAllFilters} className="mt-3">Clear Filters</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVenues.map(venue => (
            <Card key={venue.id} className="p-0 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              {/* Image placeholder */}
              <div className="relative h-40 bg-neutral-800 overflow-hidden">
                <img
                  src={venue.imagePlaceholder}
                  alt={venue.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <Badge color="green">
                    <Star size={10} /> {venue.rating}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge color="gray">
                    {venue.type}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-neutral-900 text-sm">{venue.name}</h4>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {venue.city}, {venue.state}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-neutral-900">{venue.capacity.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">capacity</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-500 mb-3">{venue.address}</p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {venue.amenities.map(a => (
                    <Badge key={a} color="gray" size="sm">{a}</Badge>
                  ))}
                </div>

                {/* Contact info */}
                <div className="space-y-1.5 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-neutral-400" />
                    <span>{venue.contactName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-neutral-400" />
                    <span>{venue.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-neutral-400" />
                    <span>{venue.contactPhone}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">{venue.pastEvents} past events</span>
                  <Button variant="ghost" size="sm" onClick={() => toast('info', `Viewing ${venue.name} details`)}>
                    <ExternalLink size={12} /> Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
