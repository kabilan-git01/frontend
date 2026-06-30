import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button, { WishlistButton } from '../ui/Button';
import { formatCurrency } from '../../utils/helpers';

export default function ProgramCard({ program }) {
  return (
    <div className="glass-card-hover p-6 group">
      <div className="w-14 h-14 rounded-xl bg-titan-red/10 flex items-center justify-center mb-5 group-hover:bg-titan-red/20 transition-colors">
        <i className={`fa-solid ${program.icon} text-2xl text-titan-red`} />
      </div>
      <h3 className="text-xl font-heading font-bold mb-3">{program.name}</h3>
      <p className="text-titan-secondary text-sm mb-4 line-clamp-2">{program.shortDesc}</p>
      <div className="flex items-center justify-between">
        <Link to={`/programs/${program.slug}`} className="text-titan-red text-sm font-semibold uppercase tracking-wider hover:underline flex items-center gap-2">
          Read More <i className="fa-solid fa-arrow-right text-xs" />
        </Link>
        <WishlistButton item={program} type="program" />
      </div>
    </div>
  );
}

export function TrainerCard({ trainer }) {
  return (
    <div className="glass-card overflow-hidden group hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden aspect-[4/5]">
        <img src={trainer.image} alt={trainer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-titan-black via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-titan-red text-xs font-semibold uppercase tracking-wider">{trainer.specialty}</span>
          <h3 className="text-xl font-heading font-bold mt-1">{trainer.name}</h3>
        </div>
        <div className="absolute top-4 right-4">
          <WishlistButton item={trainer} type="trainer" />
        </div>
      </div>
      <div className="p-5">
        <p className="text-titan-secondary text-sm mb-4 line-clamp-2">{trainer.shortBio}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {trainer.certs.map((cert) => (
            <span key={cert} className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-white/5 border border-white/10 rounded">{cert}</span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <i className="fa-solid fa-star text-yellow-400" />
            <span>{trainer.rating}</span>
          </div>
          <Link to={`/trainers/${trainer.slug}`} className="btn-glass !px-4 !py-2 !text-xs">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PlanCard({ plan, billingPeriod, onAddToCart }) {
  const price = plan.pricing[billingPeriod];

  return (
    <div className={`glass-card p-8 relative transition-all duration-300 hover:-translate-y-2 hover:shadow-glow ${plan.popular ? 'border-titan-red/50 ring-1 ring-titan-red/30' : ''}`}>
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-gradient text-white text-xs font-bold uppercase tracking-wider rounded-full">
          Most Popular
        </span>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-heading font-bold mb-2">{plan.name}</h3>
        <div className="text-4xl font-heading font-bold text-gradient">
          {formatCurrency(price)}
          <span className="text-sm text-titan-muted font-body normal-case">
            {billingPeriod === 'monthly' ? '/mo' : billingPeriod === 'quarterly' ? '/3mo' : '/yr'}
          </span>
        </div>
      </div>
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className={`flex items-start gap-3 text-sm ${feature.included ? 'text-titan-secondary' : 'text-titan-muted line-through'}`}>
            <i className={`fa-solid ${feature.included ? 'fa-check-circle text-green-400' : 'fa-times-circle text-titan-muted'} mt-0.5`} />
            {feature.text}
          </li>
        ))}
      </ul>
      <Button
        variant={plan.popular ? 'primary' : 'glass'}
        className="w-full"
        onClick={() => onAddToCart(plan, billingPeriod, price)}
      >
        Add to Cart
      </Button>
    </div>
  );
}

export function TestimonialSlider({ items }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % items.length), 5000);
    return () => clearInterval(timer);
  }, [items?.length]);

  if (!items || items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-8">
        <p className="text-titan-secondary italic">No testimonials available.</p>
      </div>
    );
  }

  const item = items[current];
  if (!item) return null;

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="flex justify-center gap-1 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <i key={i} className={`fa-solid fa-star ${i < Math.floor(item.rating) ? 'text-yellow-400' : i < item.rating ? 'text-yellow-400 fa-star-half-stroke' : 'text-titan-muted'}`} />
        ))}
      </div>
      <p className="text-lg md:text-xl text-titan-secondary italic mb-8 leading-relaxed">"{item.quote}"</p>
      <div className="flex items-center justify-center gap-4">
        <img src={item.avatar} alt={item.name} className="w-14 h-14 rounded-full object-cover border-2 border-titan-red" />
        <div className="text-left">
          <h4 className="font-heading font-bold">{item.name}</h4>
          <span className="text-titan-muted text-sm">{item.role}</span>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-titan-red w-8' : 'bg-white/20 hover:bg-white/40'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}