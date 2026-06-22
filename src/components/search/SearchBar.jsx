import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { programs } from '../../data/programs';
import { trainers } from '../../data/trainers';
import { useApp } from '../../context/AppProvider';

const categories = ['All', 'Programs', 'Trainers', 'Plans'];

export default function SearchBar({ onClose, autoFocus = true }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const debouncedQuery = useDebounce(query, 250);
  const navigate = useNavigate();
  const { plans } = useApp();

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const q = debouncedQuery.toLowerCase();
    let items = [];

    if (category === 'All' || category === 'Programs') {
      items = items.concat(
        programs
          .filter((p) => p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q))
          .map((p) => ({ ...p, type: 'program', link: `/programs/${p.slug}` }))
      );
    }

    if (category === 'All' || category === 'Trainers') {
      items = items.concat(
        trainers
          .filter((t) => t.name.toLowerCase().includes(q) || t.specialty.toLowerCase().includes(q))
          .map((t) => ({ ...t, type: 'trainer', link: `/trainers/${t.slug}` }))
      );
    }

    if (category === 'All' || category === 'Plans') {
      items = items.concat(
        plans
          .filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
          .map((p) => ({ ...p, type: 'plan', link: '/membership' }))
      );
    }

    return items.slice(0, 8);
  }, [debouncedQuery, category, plans]);

  const handleSelect = (link) => {
    navigate(link);
    setQuery('');
    onClose?.();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-titan-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search programs, trainers, plans..."
          className="input-field pl-11 pr-4"
          autoFocus={autoFocus}
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 text-xs uppercase tracking-wider rounded-full border transition-all ${
              category === cat
                ? 'bg-titan-red border-titan-red text-white'
                : 'border-white/20 text-titan-secondary hover:border-titan-red/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {debouncedQuery.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card border border-white/10 rounded-xl overflow-hidden z-50 shadow-card max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="p-4 text-titan-secondary text-sm text-center">No results found for "{debouncedQuery}"</p>
          ) : (
            results.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelect(item.link)}
                className="w-full flex items-center gap-3 p-3 hover:bg-titan-red/10 transition-colors text-left border-b border-white/5 last:border-0"
              >
                {item.image && (
                  <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-titan-muted capitalize">{item.type}{item.specialty ? ` · ${item.specialty}` : ''}</p>
                </div>
                <i className="fa-solid fa-arrow-right text-titan-muted text-xs" />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
