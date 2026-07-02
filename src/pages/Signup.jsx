import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppProvider';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, auth } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  if (auth.isAuthenticated) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const result = await register(form.name, form.email, form.password);
    setLoading(false);

    if (result.success) {
      if (result.sessionActive) {
        navigate('/', { replace: true });
      } else {
        setSuccessMsg(result.message || 'Registration successful! Please check your email for confirmation.');
        setForm({ name: '', email: '', password: '' });
      }
    } else {
      setError(result.error || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div>
      <PageHeader 
        title="Start Your Journey" 
        breadcrumbs={[
          { label: 'Home', to: '/' }, 
          { label: 'Sign Up' }
        ]} 
      />

      <section className="section-padding">
        <div className="container-titan max-w-md">
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-2xl font-heading font-bold text-center mb-2">Create an Account</h2>
            <p className="text-titan-secondary text-sm text-center mb-8">Join Titan Fitness Gym today to access personalized workout regimes and premium coaching.</p>

            {successMsg ? (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold mb-2 text-white">Verification Email Sent</h3>
                  <p className="text-titan-secondary text-sm leading-relaxed">{successMsg}</p>
                </div>
                <Button to="/login" className="w-full">
                  Go to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-titan-secondary mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    className="input-field" 
                    placeholder="John Doe"
                    required 
                  />
                </div>

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
                  Create Account
                </Button>
              </form>
            )}

            {!successMsg && (
              <div className="mt-6 text-center text-sm text-titan-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-titan-red hover:underline font-semibold">
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
