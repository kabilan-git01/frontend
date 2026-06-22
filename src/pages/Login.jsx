import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppProvider';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, auth } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(auth.role === 'admin' ? '/admin' : '/', { replace: true });
    }
  }, [auth.isAuthenticated, auth.role, navigate]);

  if (auth.isAuthenticated) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        const result = login(form.email, form.password);
        if (result.success) {
          navigate(result.role === 'admin' ? '/admin' : '/');
        } else {
          setError(result.error);
        }
      } else {
        const result = register(form.name, form.email, form.password);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error);
        }
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <PageHeader title={mode === 'login' ? 'Login' : 'Sign Up'} breadcrumbs={[{ label: 'Home', to: '/' }, { label: mode === 'login' ? 'Login' : 'Sign Up' }]} />

      <section className="section-padding">
        <div className="container-titan max-w-md">
          <div className="glass-card p-6 md:p-8">
            <div className="flex gap-2 mb-6">
              {['login', 'register'].map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  className={`flex-1 py-2 text-sm uppercase tracking-wider rounded-lg border transition-all ${
                    mode === m ? 'bg-titan-red border-titan-red text-white' : 'border-white/20 text-titan-secondary'
                  }`}
                >
                  {m === 'login' ? 'Login' : 'Sign Up'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm text-titan-secondary mb-2">Full Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
                </div>
              )}
              <div>
                <label className="block text-sm text-titan-secondary mb-2">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm text-titan-secondary mb-2">Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" required minLength={6} />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              {mode === 'login' && (
                <p className="text-titan-muted text-xs">Admin demo: admin@titan.com / admin123</p>
              )}

              <Button type="submit" loading={loading} className="w-full">
                {mode === 'login' ? 'Login' : 'Create Account'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
