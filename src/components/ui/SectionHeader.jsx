import { Link } from 'react-router-dom';

export default function SectionHeader({ subtitle, title, description, className = '' }) {
  return (
    <div className={`text-center mb-12 md:mb-16 ${className}`}>
      {subtitle && (
        <span className="inline-block text-titan-red text-sm font-semibold uppercase tracking-[3px] mb-3">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">{title}</h2>
      {description && (
        <p className="mt-4 text-titan-secondary max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );
}

export function PageHeader({ title, breadcrumbs = [] }) {
  return (
    <section className="relative py-24 md:py-32 bg-hero-gradient bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.95)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop')" }}>
      <div className="container-titan text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold reveal active">
          <span className="text-gradient">{title}</span>
        </h1>
        {breadcrumbs.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2 text-titan-secondary text-sm reveal active">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-titan-red transition-colors">{crumb.label}</Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-2 border-titan-red/30 border-t-titan-red rounded-full animate-spin`} />
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-titan-card flex items-center justify-center">
        <i className={`fa-solid ${icon} text-3xl text-titan-muted`} />
      </div>
      <h3 className="text-xl font-heading font-bold mb-2">{title}</h3>
      <p className="text-titan-secondary mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}

export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-titan-red/20 text-titan-red border-titan-red/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    muted: 'bg-white/5 text-titan-secondary border-white/10',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full border ${variants[variant]}`}>
      {children}
    </span>
  );
}
