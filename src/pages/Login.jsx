import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppProvider';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, auth } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [auth.isAuthenticated, navigate, from]);

  if (auth.isAuthenticated) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid email or password');
    }
  };

  return (
    <div>
      <PageHeader 
        title="Welcome Back" 
        breadcrumbs={[
          { label: 'Home', to: '/' }, 
          { label: 'Login' }
        ]} 
      />

      <section className="section-padding">
        <div className="container-titan max-w-md">
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-2xl font-heading font-bold text-center mb-2">Login to Your Account</h2>
            <p className="text-titan-secondary text-sm text-center mb-8">Enter your credentials to access your trainer dashboard, membership plans, and active workouts.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-titan-secondary mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  className="input-field" 
                  placeholder="name@example.com"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-titan-secondary mb-2">Password</label>
                <input 
                  type="password" 
                  value={form.password} 
                  onChange={(e) => setForm({ ...form, password: e.target.value })} 
                  className="input-field" 
                  placeholder="••••••••"
                  required 
                  minLength={6} 
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" loading={loading} className="w-full">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-titan-muted">
              Don't have an account?{' '}
              <Link to="/signup" className="text-titan-red hover:underline font-semibold">
                Sign up now
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <span className="text-xs text-titan-muted">Demo Credentials:</span>
              <p className="text-xs text-titan-secondary mt-1">Admin Dashboard: admin@titan.com / admin123</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
