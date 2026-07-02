import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../../context/AppProvider';

export default function Footer() {
  const { gymHours, addEnquiry } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    addEnquiry({
      name: 'Newsletter Subscriber',
      email: email,
      subject: 'Newsletter Subscription',
      message: 'User subscribed to the newsletter from the footer.',
    });
    setSubmitted(true);
    setEmail('');
  };

  return (
    <footer className="bg-titan-dark border-t border-white/5 pt-16 pb-8">
      <div className="container-titan grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div>
          <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold tracking-wider mb-5">
            <i className="fa-solid fa-dumbbell text-titan-red" />
            TITAN <span className="text-titan-red">FITNESS</span>
          </Link>
          <p className="text-titan-secondary text-sm leading-relaxed">
            Engineered for excellence. Premium gym equipment and world-class trainers to help you exceed limit barriers.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold mb-5">Sitemap</h3>
          <ul className="space-y-2.5">
            {[
              { to: '/about', label: 'Our Story' },
              { to: '/programs', label: 'Training Classes' },
              { to: '/trainers', label: 'Expert Coaches' },
              { to: '/membership', label: 'Pricing Plans' },
              { to: '/gallery', label: 'Interior Gallery' },
              { to: '/bmi-calculator', label: 'BMI Calculator' },
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-titan-secondary text-sm hover:text-titan-red transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold mb-5">Gym Hours</h3>
          <ul className="space-y-2.5 text-sm">
            {gymHours.map((hour) => (
              <li key={hour.id} className="flex justify-between text-titan-secondary">
                <span>{hour.day}</span>
                <span className={hour.isRed ? 'text-titan-red' : ''}>{hour.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold mb-5">Newsletter</h3>
          <p className="text-titan-secondary text-sm mb-4">Subscribe for discount alerts, nutrition tips, and class updates.</p>
          {submitted ? (
            <div className="text-green-400 text-sm py-2.5 px-3.5 bg-green-400/10 border border-green-400/20 rounded-xl flex items-center gap-2.5 animate-fade-in">
              <i className="fa-solid fa-circle-check text-lg" />
              <span>Thanks for subscribing!</span>
            </div>
          ) : (
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Your Email"
                className="input-field flex-1 !py-2.5 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary !px-4">
                <i className="fa-solid fa-paper-plane" />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="container-titan border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-titan-muted">
        <p>&copy; 2026 Titan Fitness Gym. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-titan-red transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-titan-red transition-colors">Terms of Use</a>
          <Link to="/admin" className="hover:text-titan-red transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
