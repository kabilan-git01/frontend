import { useState } from 'react';
import { PageHeader } from '../components/ui/SectionHeader';
import Button, { WishlistButton } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useApp } from '../context/AppProvider';
import { programs } from '../data/programs';
import { formatCurrency } from '../utils/helpers';

const categories = ['All', 'Strength Training', 'Cardio', 'CrossFit', 'Weight Loss', 'Personal Training'];

export default function Programs() {
  const [category, setCategory] = useState('All');
  const revealRef = useScrollReveal();
  const { addToCart } = useApp();

  const filtered = category === 'All'
    ? programs
    : programs.filter((p) => p.name.toLowerCase().includes(category.toLowerCase().split(' ')[0]));

  return (
    <div ref={revealRef}>
      <PageHeader title="Fitness Programs" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Programs' }]} />

      <section className="section-padding">
        <div className="container-titan">
          <div className="flex flex-wrap gap-2 justify-center mb-12 reveal">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-sm uppercase tracking-wider rounded-lg border transition-all ${
                  category === cat ? 'bg-titan-red border-titan-red text-white' : 'border-white/20 text-titan-secondary hover:border-titan-red/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-20">
            {filtered.map((program, i) => (
              <div key={program.id} className={`grid lg:grid-cols-2 gap-10 items-center reveal ${i % 2 === 1 ? 'lg:[direction:rtl]' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:[direction:ltr]' : ''}>
                  <img src={program.image} alt={program.name} className="rounded-2xl shadow-card w-full aspect-[4/3] object-cover" />
                </div>
                <div className={i % 2 === 1 ? 'lg:[direction:ltr]' : ''}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="text-titan-red text-xs font-semibold uppercase tracking-wider">{program.level} · {program.duration}</span>
                      <h2 className="text-2xl md:text-3xl font-heading font-bold mt-2">{program.name}</h2>
                    </div>
                    <WishlistButton item={program} type="program" />
                  </div>
                  <p className="text-titan-secondary mb-4">{program.description}</p>
                  <ul className="grid grid-cols-2 gap-2 mb-6">
                    {program.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-titan-secondary">
                        <i className="fa-solid fa-square-check text-titan-red text-xs" /> {h}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-2xl font-heading font-bold text-gradient">{formatCurrency(program.price)}</span>
                    <Button to={`/programs/${program.slug}`} variant="secondary">Learn More</Button>
                    <Button onClick={() => addToCart({ id: program.id, name: program.name, price: program.price, type: 'program', image: program.image })}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
