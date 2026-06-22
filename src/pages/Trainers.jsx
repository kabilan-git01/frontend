import { PageHeader } from '../components/ui/SectionHeader';
import { TrainerCard } from '../components/shared/Cards';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useApp } from '../context/AppProvider';

export default function Trainers() {
  const revealRef = useScrollReveal();
  const { trainers } = useApp();

  return (
    <div ref={revealRef}>
      <PageHeader title="Expert Coaches" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Trainers' }]} />

      <section className="section-padding">
        <div className="container-titan">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer, i) => (
              <div key={trainer.id} className={`reveal ${i > 0 ? `animate-delay-${(i % 3) * 100}` : ''}`}>
                <TrainerCard trainer={trainer} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
