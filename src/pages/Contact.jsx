import { useState } from 'react';
import { PageHeader } from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppProvider';

export default function Contact() {
  const { addEnquiry } = useApp();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      addEnquiry(form);
      setSubmitted(true);
      setLoading(false);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <div>
      <PageHeader title="Contact Us" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />

      <section className="section-padding">
        <div className="container-titan">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6">Get In Touch</h2>
              <div className="space-y-6">
                {[
                  { icon: 'fa-location-dot', title: 'Location', text: '123 Iron Street, San Francisco, CA 94102' },
                  { icon: 'fa-phone', title: 'Phone', text: '+1 (555) 123-4567' },
                  { icon: 'fa-envelope', title: 'Email', text: 'info@titanfitness.com' },
                  { icon: 'fa-clock', title: 'Hours', text: 'Mon-Fri: 5AM-11PM | Sat-Sun: 6AM-9PM' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-titan-red/10 flex items-center justify-center shrink-0">
                      <i className={`fa-solid ${item.icon} text-titan-red`} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm uppercase tracking-wider">{item.title}</h3>
                      <p className="text-titan-secondary text-sm mt-1">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-10">
                  <i className="fa-solid fa-circle-check text-5xl text-green-400 mb-4" />
                  <h3 className="text-xl font-heading font-bold mb-2">Message Sent!</h3>
                  <p className="text-titan-secondary mb-6">We'll get back to you within 24 hours.</p>
                  <Button variant="secondary" onClick={() => setSubmitted(false)}>Send Another</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-heading font-bold mb-4">Send a Message</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-titan-secondary mb-2">Name</label>
                      <input name="name" value={form.name} onChange={handleChange} className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm text-titan-secondary mb-2">Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-titan-secondary mb-2">Subject</label>
                    <input name="subject" value={form.subject} onChange={handleChange} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm text-titan-secondary mb-2">Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5} className="input-field resize-none" required />
                  </div>
                  <Button type="submit" loading={loading} className="w-full">Send Message</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
