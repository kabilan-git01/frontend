import { PageHeader } from '../components/ui/SectionHeader';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function About() {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef}>
      <PageHeader title="Our Story" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]} />

      <section className="section-padding">
        <div className="container-titan">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <span className="text-titan-red text-sm font-semibold uppercase tracking-[3px]">Since 2015</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-6">Built On Grit & Performance</h2>
              <p className="text-titan-secondary mb-4">
                Titan Fitness Gym was founded with a singular vision: create a training environment where serious athletes and everyday warriors alike could push beyond their perceived limits in a premium, high-intensity atmosphere.
              </p>
              <p className="text-titan-secondary mb-4">
                Our 15,000 sq ft facility houses competition-grade equipment, dedicated CrossFit zones, private coaching suites, and recovery amenities including saunas and cold plunge pools.
              </p>
              <p className="text-titan-secondary">
                With over 10,000 members transformed and a team of 20+ certified coaches, Titan has become the benchmark for premium fitness in the region.
              </p>
            </div>
            <div className="reveal animate-delay-200">
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop" alt="Titan Fitness Gym interior" className="rounded-2xl shadow-card w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {[
              { num: '10K+', label: 'Members Transformed' },
              { num: '20+', label: 'Expert Coaches' },
              { num: '15K', label: 'Sq Ft Facility' },
              { num: '24/7', label: 'VIP Access' },
            ].map((stat, i) => (
              <div key={stat.label} className={`glass-card p-6 text-center reveal ${i > 0 ? `animate-delay-${i * 100}` : ''}`}>
                <div className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-2">{stat.num}</div>
                <p className="text-titan-secondary text-sm uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
