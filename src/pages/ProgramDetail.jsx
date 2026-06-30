import { useParams, Link } from 'react-router-dom';
import { PageHeader, EmptyState } from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppProvider';

export default function ProgramDetail() {
  const { slug } = useParams();
  const { programs } = useApp();
  const program = programs.find((p) => p.slug === slug);

  if (!program) {
    return (
      <EmptyState
        icon="fa-dumbbell"
        title="Program Not Found"
        description="The program you're looking for doesn't exist."
        action={<Button to="/programs">Browse Programs</Button>}
      />
    );
  }

  return (
    <div>
      <PageHeader title={program.name} breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Programs', to: '/programs' }, { label: program.name }]} />
      <section className="section-padding">
        <div className="container-titan">
          <div className="grid lg:grid-cols-2 gap-12">
            <img src={program.image} alt={program.name} className="rounded-2xl shadow-card w-full aspect-[4/3] object-cover" />
            <div>
              <span className="text-titan-red text-sm font-semibold uppercase tracking-wider">{program.level} · {program.duration}</span>
              <h2 className="text-3xl font-heading font-bold mt-2 mb-4">{program.name}</h2>
              <p className="text-titan-secondary mb-6 leading-relaxed">{program.description}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {program.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-titan-secondary">
                    <i className="fa-solid fa-square-check text-titan-red" /> {h}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <Button to="/contact">Inquire Program</Button>
                <Button to="/programs" variant="secondary">Back to Programs</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
