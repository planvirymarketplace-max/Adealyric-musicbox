"use client";

import { useState } from "react";
import { PageShell, PageIntro } from "./SiteChrome";

const INQUIRY_TYPES = [
  { id: "promoter", label: "Promoter / Festival / Hall", desc: "Headline concerts, festival lineups, multi-bill showcases with full 5-piece live band." },
  { id: "bar_club", label: "Bar & Nightclub", desc: "High-energy late night sets, club appearances, vocal + DJ tracks or trio setup." },
  { id: "restaurant_lounge", label: "Restaurant & Lounge", desc: "Intimate soul residencies, dinner ambiance, neo-soul acoustic duo or trio sets." },
  { id: "private_corporate", label: "Private & Corporate Event", desc: "Exclusive galas, brand activations, private celebrations, and VIP gatherings." },
];

const BUDGET_RANGES = [
  "$1,500 – $3,000 (Acoustic / Small Venue)",
  "$3,000 – $5,000 (Bar / Club / Trio Set)",
  "$5,000 – $10,000 (Full Live Band / Venue)",
  "$10,000+ (Festival / Major Corporate / Regional)",
];

const PERFORMANCE_FORMATS = [
  { title: "Full 5-Piece Live Band", idealFor: "Concert Halls, Music Festivals, Major Venues", specs: "Vocals, Drums, Bass, Keys, Electric Guitar. 60-90 min headline set." },
  { title: "Neo-Soul Trio Set", idealFor: "Bars, Nightclubs, Boutique Venues", specs: "Vocals, Keys/Synth, Percussion/Drums. 45-75 min set." },
  { title: "Acoustic Soul Duo", idealFor: "Restaurants, Cocktail Lounges, Private Dinners", specs: "Vocals & Acoustic Guitar/Keys. Unplugged, atmospheric 2-hour set." },
  { title: "Vocalist + Live DJ Set", idealFor: "Late Night Clubs, Brand Activations, Afterparties", specs: "Live vocals over custom re-edits and instrumental tracks. 45 min showcase." },
];

export function BookingPage() {
  const [selectedType, setSelectedType] = useState("promoter");
  const [formData, setFormData] = useState({
    name: "", org: "", email: "", phone: "", eventDate: "", venueName: "",
    location: "", capacity: "", budget: BUDGET_RANGES[1], format: "Full 5-Piece Live Band", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = "BK-" + Math.floor(100000 + Math.random() * 900000);
    setRefCode(code);
    setSubmitted(true);
  };

  return (
    <PageShell>
      <PageIntro eyebrow="Direct Line for Talent Buyers" title="Book Adea," italic="live." sub="Promoters, music halls, bars, restaurants, festivals, and private affairs. Choose your format and request available dates." />
      <section className="border-t border-border px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="text-eyebrow text-ash">Performance Formats</div>
              <h2 className="mt-4 text-display text-4xl text-bone md:text-6xl">Tailored for every venue.</h2>
            </div>
            <p className="max-w-md text-sm text-ash">
              From high-capacity concert stages to intimate cocktail lounges and dining spaces, Adea Lyric brings West Philly neo-soul to every environment.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PERFORMANCE_FORMATS.map((fmt, i) => (
              <div key={i} className="flex flex-col justify-between border border-border bg-ink/60 p-8 transition-colors hover:border-bone/60">
                <div>
                  <div className="text-eyebrow text-ash">0{i + 1} — Format</div>
                  <h3 className="mt-4 text-display text-2xl text-bone">{fmt.title}</h3>
                  <div className="mt-4 text-xs uppercase tracking-wider text-ash">Ideal For</div>
                  <p className="mt-1 text-sm text-bone/90">{fmt.idealFor}</p>
                </div>
                <div className="mt-8 border-t border-border pt-4">
                  <div className="text-xs uppercase tracking-wider text-ash">Setup & Time</div>
                  <p className="mt-1 text-xs text-bone/70">{fmt.specs}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="inquiry-form" className="border-t border-border bg-ink px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="sticky top-32">
                <div className="text-eyebrow text-ash">Inquiry Portal</div>
                <h2 className="mt-4 text-display text-4xl text-bone md:text-6xl">Submit a booking request.</h2>
                <p className="mt-6 text-lg leading-relaxed text-bone/80">Our management team reviews all official inquiries within 24–48 hours.</p>
                <div className="mt-12 space-y-6 border-t border-border pt-8 text-sm">
                  <div><div className="text-eyebrow text-ash">Direct Booking Management</div><div className="mt-1 text-display text-xl text-bone">booking@adealyric.com</div></div>
                  <div><div className="text-eyebrow text-ash">Press & Media Enquiries</div><div className="mt-1 text-display text-xl text-bone">press@adealyric.com</div></div>
                  <div><div className="text-eyebrow text-ash">Philly HQ Contact</div><div className="mt-1 text-display text-xl text-bone">+1 (215) 555-0197</div></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              {submitted ? (
                <div className="border border-bone bg-ink/90 p-8 text-bone md:p-12">
                  <div className="text-eyebrow text-ash">Request Received</div>
                  <h3 className="mt-4 text-display text-4xl text-bone">Inquiry logged successfully.</h3>
                  <p className="mt-4 text-lg text-bone/80">
                    Thank you, <span className="text-bone font-semibold">{formData.name}</span>. Your booking request for{" "}
                    <span className="text-bone italic">{formData.venueName || "your event"}</span> has been transmitted directly to Adea&apos;s team.
                  </p>
                  <div className="mt-8 border-y border-border py-6 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-ash">Reference Code:</span><span className="font-mono text-bone">{refCode}</span></div>
                    <div className="flex justify-between"><span className="text-ash">Inquiry Type:</span><span className="text-bone uppercase">{selectedType.replace("_", " ")}</span></div>
                    <div className="flex justify-between"><span className="text-ash">Target Date:</span><span className="text-bone">{formData.eventDate || "TBD"}</span></div>
                    <div className="flex justify-between"><span className="text-ash">Format:</span><span className="text-bone">{formData.format}</span></div>
                  </div>
                  <p className="mt-6 text-sm text-ash">A confirmation copy has been queued for <span className="text-bone">{formData.email}</span>.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-8 border border-bone bg-bone px-6 py-3 text-eyebrow text-ink transition-colors hover:bg-transparent hover:text-bone cursor-pointer">
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 border border-border bg-ink/40 p-6 md:p-10">
                  <div>
                    <label className="text-eyebrow text-ash">1. Select Event Type</label>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {INQUIRY_TYPES.map((type) => {
                        const active = selectedType === type.id;
                        return (
                          <button type="button" key={type.id} onClick={() => setSelectedType(type.id)} className={`flex flex-col text-left p-4 border transition-all cursor-pointer ${active ? "border-bone bg-bone/10" : "border-border bg-transparent hover:border-bone/40"}`}>
                            <span className="text-display text-lg text-bone">{type.label}</span>
                            <span className="mt-2 text-xs text-ash">{type.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="text-eyebrow text-ash">Your Name *</label>
                      <input type="text" required placeholder="e.g. Marcus Vance" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-bone placeholder:text-ash/50 focus:border-bone focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-eyebrow text-ash">Company / Venue / Org *</label>
                      <input type="text" required placeholder="e.g. The Blue Note" value={formData.org} onChange={(e) => setFormData({ ...formData, org: e.target.value })} className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-bone placeholder:text-ash/50 focus:border-bone focus:outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="text-eyebrow text-ash">Email Address *</label>
                      <input type="email" required placeholder="promoter@venue.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-bone placeholder:text-ash/50 focus:border-bone focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-eyebrow text-ash">Phone Number *</label>
                      <input type="tel" required placeholder="+1 (215) 555-0100" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-bone placeholder:text-ash/50 focus:border-bone focus:outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                      <label className="text-eyebrow text-ash">Target Event Date</label>
                      <input type="date" value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-bone placeholder:text-ash/50 focus:border-bone focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-eyebrow text-ash">City & State</label>
                      <input type="text" placeholder="Philadelphia, PA" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-bone placeholder:text-ash/50 focus:border-bone focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-eyebrow text-ash">Venue Capacity</label>
                      <input type="text" placeholder="e.g. 250 seats" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-bone placeholder:text-ash/50 focus:border-bone focus:outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="text-eyebrow text-ash">Preferred Setup</label>
                      <select value={formData.format} onChange={(e) => setFormData({ ...formData, format: e.target.value })} className="mt-2 w-full border border-border bg-ink px-4 py-3 text-bone focus:border-bone focus:outline-none">
                        {PERFORMANCE_FORMATS.map((f, i) => <option key={i} value={f.title} className="bg-ink text-bone">{f.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-eyebrow text-ash">Estimated Budget Range</label>
                      <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="mt-2 w-full border border-border bg-ink px-4 py-3 text-bone focus:border-bone focus:outline-none">
                        {BUDGET_RANGES.map((b, i) => <option key={i} value={b} className="bg-ink text-bone">{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-eyebrow text-ash">Event Notes & Sound Specs</label>
                    <textarea rows={4} placeholder="Tell us about the atmosphere, set length expectations..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="mt-2 w-full border border-border bg-transparent p-4 text-bone placeholder:text-ash/50 focus:border-bone focus:outline-none" />
                  </div>
                  <button type="submit" className="w-full border border-bone bg-bone py-4 text-eyebrow text-ink transition-all hover:bg-transparent hover:text-bone cursor-pointer">
                    Submit Booking Request →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-border bg-ink/80 px-6 py-20 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1600px] grid grid-cols-1 gap-12 md:grid-cols-3">
          {[
            { id: "01", title: "Sound & Stage", desc: "Shure Beta 58A / KSM8 wireless vocal mics, 2 Stereo DI boxes, 4 Stage Monitor Wedges.", link: "Download Tech Rider (PDF)" },
            { id: "02", title: "Electronic Press Kit", desc: "High-res promotional photography, official biography, media quotes, and stage plots.", link: "Download EPK Assets (ZIP)" },
            { id: "03", title: "Travel & Green Room", desc: "Standard hospitality rider specs for regional travel outside the Philadelphia metro area.", link: "View Hospitality Rider" },
          ].map((item) => (
            <div key={item.id} className="border border-border p-8">
              <div className="text-eyebrow text-ash">{item.id}</div>
              <h3 className="mt-4 text-display text-2xl text-bone">{item.title}</h3>
              <p className="mt-3 text-sm text-bone/70">{item.desc}</p>
              <a href="#" onClick={(e) => e.preventDefault()} className="mt-6 inline-block text-eyebrow text-bone underline hover:opacity-70">{item.link}</a>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
