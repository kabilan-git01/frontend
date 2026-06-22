import { useState } from 'react';
import { useApp } from '../../context/AppProvider';

export default function AdminReviews() {
  const { reviews, addReview, deleteReview } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', quote: '', rating: 5, type: 'testimonial' });

  const handleAdd = (e) => {
    e.preventDefault();
    addReview({ ...form, featured: true, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop' });
    setForm({ name: '', role: '', quote: '', rating: 5, type: 'testimonial' });
    setShowForm(false);
  };

  const testimonials = reviews.filter((r) => r.type === 'testimonial');
  const successStories = reviews.filter((r) => r.type === 'success-story');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Reviews & Success Stories</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary !px-4 !py-2 !text-xs">
          <i className="fa-solid fa-plus" /> Add New
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="glass-card p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-titan-muted">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field mt-1" required />
            </div>
            <div>
              <label className="text-xs text-titan-muted">Role / Achievement</label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field mt-1" required />
            </div>
          </div>
          <div>
            <label className="text-xs text-titan-muted">Quote</label>
            <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="input-field mt-1 resize-none" rows={3} required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-titan-muted">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field mt-1">
                <option value="testimonial">Testimonial</option>
                <option value="success-story">Success Story</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-titan-muted">Rating</label>
              <input type="number" min="1" max="5" step="0.5" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })} className="input-field mt-1" />
            </div>
          </div>
          <button type="submit" className="btn-primary">Add Review</button>
        </form>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-heading font-bold mb-4">Testimonials ({testimonials.length})</h2>
          <div className="space-y-3">
            {testimonials.map((review) => (
              <ReviewCard key={review.id} review={review} onDelete={deleteReview} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-heading font-bold mb-4">Success Stories ({successStories.length})</h2>
          <div className="space-y-3">
            {successStories.map((review) => (
              <ReviewCard key={review.id} review={review} onDelete={deleteReview} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review, onDelete }) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={review.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-sm">{review.name}</p>
            <p className="text-titan-muted text-xs">{review.role}</p>
          </div>
        </div>
        <button onClick={() => onDelete(review.id)} className="text-titan-muted hover:text-titan-red transition-colors">
          <i className="fa-solid fa-trash-can text-sm" />
        </button>
      </div>
      <p className="text-titan-secondary text-sm mt-3 italic">"{review.quote}"</p>
      <div className="flex items-center gap-1 mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <i key={i} className={`fa-solid fa-star text-xs ${i < Math.floor(review.rating) ? 'text-yellow-400' : 'text-titan-muted'}`} />
        ))}
      </div>
    </div>
  );
}
