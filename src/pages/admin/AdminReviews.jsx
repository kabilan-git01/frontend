import { useState } from 'react';
import { useApp } from '../../context/AppProvider';

export default function AdminReviews() {
  const { reviews, addReview, updateReview, deleteReview } = useApp();
  const [editing, setEditing] = useState(null); // Review ID being edited
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', quote: '', rating: 5, type: 'testimonial' });

  const resetForm = () => {
    setForm({ name: '', role: '', quote: '', rating: 5, type: 'testimonial' });
    setEditing(null);
  };

  const startEdit = (review) => {
    setEditing(review.id);
    setForm({
      name: review.name,
      role: review.role || '',
      quote: review.quote || '',
      rating: review.rating || 5,
      type: review.type || 'testimonial'
    });
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.quote) return;

    const reviewData = {
      name: form.name,
      role: form.role,
      quote: form.quote,
      rating: parseFloat(form.rating) || 5,
      type: form.type,
      featured: true,
    };

    if (editing) {
      updateReview(editing, reviewData);
    } else {
      addReview({
        ...reviewData,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop'
      });
    }

    resetForm();
    setShowForm(false);
  };

  const handleDelete = (id, reviewerName) => {
    if (window.confirm(`Are you sure you want to delete the review by "${reviewerName}"?`)) {
      deleteReview(id);
    }
  };

  const testimonials = reviews.filter((r) => r.type === 'testimonial');
  const successStories = reviews.filter((r) => r.type === 'success-story');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Reviews & Success Stories</h1>
        {!showForm && !editing && (
          <button 
            onClick={() => { resetForm(); setShowForm(true); }} 
            className="btn-primary !px-4 !py-2 !text-xs"
          >
            <i className="fa-solid fa-plus mr-1" /> Add New
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {(showForm || editing) && (
        <form onSubmit={handleSave} className="glass-card p-6 mb-6 space-y-4 animate-fade-in">
          <h2 className="text-lg font-heading font-bold text-gradient">
            {editing ? `Edit Review by ${form.name}` : 'Add Review / Success Story'}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-titan-muted">Name</label>
              <input 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                className="input-field mt-1" 
                required 
              />
            </div>
            <div>
              <label className="text-xs text-titan-muted">Role / Achievement</label>
              <input 
                value={form.role} 
                onChange={(e) => setForm({ ...form, role: e.target.value })} 
                className="input-field mt-1" 
                placeholder="e.g. Member for 1 year, Lost 30 lbs"
                required 
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-titan-muted">Quote / Testimonial Message</label>
            <textarea 
              value={form.quote} 
              onChange={(e) => setForm({ ...form, quote: e.target.value })} 
              className="input-field mt-1 resize-none" 
              rows={3} 
              required 
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-titan-muted">Type</label>
              <select 
                value={form.type} 
                onChange={(e) => setForm({ ...form, type: e.target.value })} 
                className="input-field mt-1"
              >
                <option value="testimonial">Testimonial</option>
                <option value="success-story">Success Story</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-titan-muted">Rating (1 to 5 Stars)</label>
              <input 
                type="number" 
                min="1" 
                max="5" 
                step="0.5" 
                value={form.rating} 
                onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })} 
                className="input-field mt-1" 
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary !px-4 !py-2 !text-xs">
              {editing ? 'Save Review' : 'Add Review'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary !px-4 !py-2 !text-xs">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-heading font-bold mb-4 border-b border-white/5 pb-2 text-gradient">Testimonials ({testimonials.length})</h2>
          <div className="space-y-3">
            {testimonials.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                onEdit={startEdit} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-heading font-bold mb-4 border-b border-white/5 pb-2 text-gradient">Success Stories ({successStories.length})</h2>
          <div className="space-y-3">
            {successStories.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                onEdit={startEdit} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review, onEdit, onDelete }) {
  return (
    <div className="glass-card p-4 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={review.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
            <div>
              <p className="font-semibold text-sm">{review.name}</p>
              <p className="text-titan-muted text-xs">{review.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(review)} 
              className="text-titan-secondary hover:text-white transition-colors"
              title="Edit Review"
            >
              <i className="fa-solid fa-pen text-xs" />
            </button>
            <button 
              onClick={() => onDelete(review.id, review.name)} 
              className="text-titan-secondary hover:text-titan-red transition-colors"
              title="Delete Review"
            >
              <i className="fa-solid fa-trash-can text-xs" />
            </button>
          </div>
        </div>
        <p className="text-titan-secondary text-sm mt-3 italic">"{review.quote}"</p>
      </div>
      <div className="flex items-center gap-1 mt-3 pt-2 border-t border-white/5">
        {Array.from({ length: 5 }).map((_, i) => (
          <i key={i} className={`fa-solid fa-star text-xs ${i < Math.floor(review.rating) ? 'text-yellow-400' : 'text-titan-muted'}`} />
        ))}
      </div>
    </div>
  );
}
