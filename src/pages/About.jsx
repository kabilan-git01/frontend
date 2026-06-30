import { PageHeader } from '../components/ui/SectionHeader';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useApp } from '../context/AppProvider';

export default function About() {
  const revealRef = useScrollReveal();
  const { aboutStory, aboutStats } = useApp();

  return (
    <div ref={revealRef}>
      <PageHeader title="Our Story" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]} />

      <section className="section-padding">
        <div className="container-titan">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <span className="text-titan-red text-sm font-semibold uppercase tracking-[3px]">{aboutStory.subtitle}</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-6">{aboutStory.title}</h2>
              {(Array.isArray(aboutStory.paragraphs) ? aboutStory.paragraphs : []).map((paragraph, index) => (
                <p key={index} className="text-titan-secondary mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="reveal animate-delay-200">
              <img src={aboutStory.image} alt="Titan Fitness Gym interior" className="rounded-2xl shadow-card w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {aboutStats.map((stat, i) => (
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
