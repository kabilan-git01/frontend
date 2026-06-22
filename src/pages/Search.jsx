import { PageHeader } from '../components/ui/SectionHeader';
import SearchBar from '../components/search/SearchBar';

export default function Search() {
  return (
    <div>
      <PageHeader title="Search" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />

      <section className="section-padding">
        <div className="container-titan max-w-3xl">
          <p className="text-titan-secondary text-center mb-8">
            Search across fitness programs, expert trainers, and membership plans. Use category filters to narrow your results.
          </p>
          <SearchBar autoFocus />
        </div>
      </section>
    </div>
  );
}
