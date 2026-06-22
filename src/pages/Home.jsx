import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import ProgramCard, { TestimonialSlider } from '../components/shared/Cards';
import { programs } from '../data/programs';
import { testimonials } from '../data/testimonials';

const features = [
  { icon: 'fa-dumbbell', title: 'Elite Equipment', desc: 'Industry-leading hammer strength plate loaders, competition-grade barbells, and customized squat cells.' },
  { icon: 'fa-user-shield', title: 'Expert Coaching', desc: 'Fully certified trainers with specialty designations in corrective biomechanics and sports nutrition.' },
  { icon: 'fa-clock', title: '24/7 Facility Access', desc: 'Keycard entry system provides Elite and VIP members with full-facility access around the clock.' },
  { icon: 'fa-apple-whole', title: 'Diet Strategies', desc: 'Direct nutritional support, custom macros allocations, and daily accountability checks.' },
];

export default function Home() {
  const revealRef = useScrollReveal();
  const featuredTestimonials = testimonials.filter((t) => t.featured && t.type === 'testimonial');

  return (
    <div ref={revealRef}>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-hero-gradient bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop')" }}>
        <div className="container-titan py-20">
          <div className="max-w-2xl reveal">
            <span className="inline-block text-titan-red text-sm font-semibold uppercase tracking-[4px] mb-4">No Pain, No Gain</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6">
              <span className="block">UNLEASH YOUR</span>
              <span className="text-gradient">INNER BEAST</span>
            </h1>
            <p className="text-titan-secondary text-lg mb-8 max-w-lg">
              Titan Fitness Gym is dedicated to building strength, endurance, and unmatched discipline. Join a premium community engineered for top physical performance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button to="/membership">Get Started <i className="fa-solid fa-arrow-right" /></Button>
              <Button to="/programs" variant="secondary">Explore Classes</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-titan-dark">
        <div className="container-titan">
          <SectionHeader subtitle="Why Titan Gym" title="Engineered For Strength" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className={`glass-card-hover p-6 text-center reveal ${i > 0 ? `animate-delay-${i * 100}` : ''}`}>
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-titan-red/10 flex items-center justify-center">
                  <i className={`fa-solid ${f.icon} text-2xl text-titan-red`} />
                </div>
                <h3 className="text-lg font-heading font-bold mb-3">{f.title}</h3>
                <p className="text-titan-secondary text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="section-padding">
        <div className="container-titan">
          <SectionHeader subtitle="Our Specializations" title="Fitness Programs" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.slice(0, 3).map((p, i) => (
              <div key={p.id} className={`reveal ${i > 0 ? `animate-delay-${i * 100}` : ''}`}>
                <ProgramCard program={p} />
              </div>
            ))}
          </div>
          <div className="text-center mt-12 reveal">
            <Button to="/programs" variant="secondary">Explore All Programs <i className="fa-solid fa-chevron-right" /></Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-titan-dark">
        <div className="container-titan">
          <SectionHeader subtitle="Real Stories" title="What They Say" />
          <div className="reveal">
            <TestimonialSlider items={featuredTestimonials} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-gradient opacity-5" />
        <div className="container-titan relative">
          <div className="glass-card p-10 md:p-16 text-center reveal">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready To Bend Your Limits?</h2>
            <p className="text-titan-secondary max-w-2xl mx-auto mb-8">
              Join a dedicated team that values grit, performance, and real results. Get access to San Francisco's top training floor, premium sauna rooms, and elite coaches.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button to="/membership">Join Titan Today <i className="fa-solid fa-arrow-right" /></Button>
              <Button to="/contact" variant="secondary">Contact A Coach</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
