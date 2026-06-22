import { NavLink, Outlet, Link } from 'react-router-dom';
import { useApp } from '../../context/AppProvider';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'fa-chart-line', end: true },
  { to: '/admin/plans', label: 'Membership Plans', icon: 'fa-tags' },
  { to: '/admin/trainers', label: 'Trainers', icon: 'fa-user-tie' },
  { to: '/admin/members', label: 'Members', icon: 'fa-users' },
  { to: '/admin/reviews', label: 'Reviews', icon: 'fa-star' },
  { to: '/admin/enquiries', label: 'Contact Enquiries', icon: 'fa-envelope' },
];

export default function AdminLayout() {
  const { logout, auth } = useApp();

  return (
    <div className="min-h-screen bg-titan-black flex">
      <aside className="w-64 bg-titan-dark border-r border-white/5 fixed h-full z-50 hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold tracking-wider">
            <i className="fa-solid fa-dumbbell text-titan-red" />
            TITAN <span className="text-titan-red">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm uppercase tracking-wider transition-all ${
                  isActive ? 'bg-titan-red/20 text-titan-red border border-titan-red/30' : 'text-titan-secondary hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <i className={`fa-solid ${link.icon} w-5 text-center`} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <p className="text-titan-muted text-xs mb-3 truncate">{auth.user?.email}</p>
          <div className="flex gap-2">
            <Link to="/" className="flex-1 text-center py-2 text-xs uppercase tracking-wider border border-white/10 rounded-lg hover:border-titan-red/50 transition-colors">
              View Site
            </Link>
            <button onClick={logout} className="flex-1 py-2 text-xs uppercase tracking-wider border border-white/10 rounded-lg hover:border-titan-red hover:text-titan-red transition-colors">
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile admin nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-titan-dark border-b border-white/5 p-4">
        <div className="flex items-center justify-between">
          <Link to="/admin" className="font-heading font-bold text-sm">TITAN ADMIN</Link>
          <div className="flex gap-2 overflow-x-auto">
            {adminLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `px-3 py-1 text-xs uppercase whitespace-nowrap rounded ${isActive ? 'bg-titan-red text-white' : 'text-titan-secondary'}`}>
                {link.label.split(' ')[0]}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
