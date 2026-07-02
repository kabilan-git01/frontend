import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppProvider';

export default function Profile() {
  const { auth, logout } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  if (!auth.isAuthenticated || !auth.user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div>
      <PageHeader 
        title="My Profile" 
        breadcrumbs={[
          { label: 'Home', to: '/' }, 
          { label: 'Profile' }
        ]} 
      />

      <section className="section-padding">
        <div className="container-titan max-w-2xl">
          <div className="glass-card p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-titan-red/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-white/5">
              <div className="w-20 h-20 rounded-full bg-titan-red/20 border-2 border-titan-red flex items-center justify-center text-3xl font-bold text-white uppercase shadow-md">
                {auth.user.name ? auth.user.name.charAt(0) : 'U'}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-heading font-bold text-white">{auth.user.name || 'Titan Member'}</h2>
                <p className="text-titan-muted text-sm uppercase tracking-wider mt-1">{auth.user.role === 'admin' ? 'Administrator' : 'Premium Member'}</p>
              </div>
            </div>

            <div className="py-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-titan-muted block mb-1">Full Name</span>
                  <span className="text-white font-medium text-lg">{auth.user.name || 'Not Provided'}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-titan-muted block mb-1">Email Address</span>
                  <span className="text-white font-medium text-lg">{auth.user.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div>
                  <span className="text-xs uppercase tracking-wider text-titan-muted block mb-1">Account Role</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-titan-red/20 text-titan-red border border-titan-red/30 uppercase tracking-wider">
                    {auth.user.role}
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-titan-muted block mb-1">Status</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-wider">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-white/5">
              <Button to="/" variant="secondary" className="flex-1">
                Back to Home
              </Button>
              <Button onClick={handleLogout} variant="danger" className="flex-1">
                Logout Account
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
