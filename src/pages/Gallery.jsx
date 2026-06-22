import { useState } from 'react';
import { PageHeader } from '../components/ui/SectionHeader';
import { galleryImages } from '../data/testimonials';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Gallery() {
  const [selected, setSelected] = useState(null);
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef}>
      <PageHeader title="Gallery" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Gallery' }]} />

      <section className="section-padding">
        <div className="container-titan">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelected(img)}
                className={`reveal relative overflow-hidden rounded-xl aspect-[4/3] group cursor-pointer ${i > 0 ? `animate-delay-${(i % 3) * 100}` : ''}`}
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-titan-red/0 group-hover:bg-titan-red/20 transition-colors flex items-center justify-center">
                  <i className="fa-solid fa-expand text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[2000] bg-black/90 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white text-xl" aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>
          <img src={selected.src} alt={selected.alt} className="max-w-full max-h-[85vh] rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
