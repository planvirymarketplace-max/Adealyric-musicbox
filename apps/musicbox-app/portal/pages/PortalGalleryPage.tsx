'use client';

import { useState } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockGalleries, mockImages } from '@/lib/mock-data';

export default function PortalGalleryPage() {
  const [activeGallery, setActiveGallery] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const galleries = mockGalleries.filter((g) => g.kind === 'image' && g.published);
  const currentGallery = galleries.find((g) => g.id === activeGallery);
  const images = currentGallery ? mockImages.filter((i) => i.gallery_id === currentGallery.id) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Gallery</h1>

      {activeGallery ? (
        <div>
          <button onClick={() => setActiveGallery(null)} className="text-sm text-white/40 hover:text-white mb-4">← Back to galleries</button>
          <h2 className="text-xl font-semibold text-white mb-4">{currentGallery?.title}</h2>
          {images.length === 0 ? (
            <p className="text-white/30 text-center py-12">No images in this gallery</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button key={img.id} onClick={() => setLightbox(i)} className="group relative rounded-lg overflow-hidden bg-white/5">
                  <div className="w-full h-40 bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center">
                    <ImageIcon size={32} className="text-white/10" />
                  </div>
                  {img.title && <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2"><p className="text-xs text-white">{img.title}</p></div>}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : galleries.length === 0 ? (
        <div className="text-center py-20"><ImageIcon size={48} className="text-white/10 mx-auto mb-4" /><p className="text-white/30">No galleries yet</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleries.map((g) => (
            <button key={g.id} onClick={() => setActiveGallery(g.id)} className="group rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-white/10 transition-colors text-left">
              <div className="w-full h-44 bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center"><ImageIcon size={32} className="text-white/10" /></div>
              <div className="p-4">
                <p className="text-lg font-semibold text-white">{g.title}</p>
                {g.description && <p className="text-sm text-white/50 mt-1 line-clamp-2">{g.description}</p>}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && images[lightbox] && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white" onClick={() => setLightbox(null)}><X size={28} /></button>
          <button className="absolute left-4 text-white/60 hover:text-white" onClick={(e) => { e.stopPropagation(); setLightbox(Math.max(0, lightbox - 1)); }}><ChevronLeft size={32} /></button>
          <div className="max-w-full max-h-[85vh] bg-gradient-to-br from-neutral-700 to-neutral-900 w-[600px] h-[400px] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <ImageIcon size={64} className="text-white/10" />
          </div>
          <button className="absolute right-4 text-white/60 hover:text-white" onClick={(e) => { e.stopPropagation(); setLightbox(Math.min(images.length - 1, lightbox + 1)); }}><ChevronRight size={32} /></button>
          {images[lightbox].title && <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">{images[lightbox].title}</p>}
        </div>
      )}
    </div>
  );
}
