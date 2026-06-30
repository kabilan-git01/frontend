import { useState } from 'react';
import { useApp } from '../../context/AppProvider';

export default function AdminEnquiries() {
  const { enquiries, addEnquiry, updateEnquiry, deleteEnquiry } = useApp();
  const [editing, setEditing] = useState(null); // ID of enquiry being edited
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('new');
  const [date, setDate] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setStatus('new');
    setDate('');
    setEditing(null);
  };

  const startEdit = (enquiry) => {
    setEditing(enquiry.id);
    setName(enquiry.name);
    setEmail(enquiry.email);
    setSubject(enquiry.subject || '');
    setMessage(enquiry.message || '');
    setStatus(enquiry.status || 'new');
    setDate(enquiry.date || '');
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    const enquiryData = {
      name,
      email,
      subject,
      message,
      status,
      date: date || new Date().toISOString().split('T')[0],
    };

    if (editing) {
      updateEnquiry(editing, enquiryData);
    } else {
      addEnquiry(enquiryData);
    }

    resetForm();
    setShowForm(false);
  };

  const handleDelete = (id, senderName) => {
    if (window.confirm(`Are you sure you want to delete the enquiry from "${senderName}"?`)) {
      deleteEnquiry(id);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateEnquiry(id, { status: newStatus });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Contact Enquiries</h1>
        {!showForm && !editing && (
          <button 
            onClick={() => { resetForm(); setShowForm(true); }} 
            className="btn-primary !px-4 !py-2 !text-xs"
          >
            <i className="fa-solid fa-plus mr-1" /> Log Enquiry
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {(showForm || editing) && (
        <form onSubmit={handleSave} className="glass-card p-6 mb-6 space-y-4 animate-fade-in">
          <h2 className="text-lg font-heading font-bold text-gradient">
            {editing ? `Edit Enquiry from ${name}` : 'Log Custom Enquiry'}
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-xs text-titan-muted uppercase">Sender Name</label>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="input-field mt-1" 
                placeholder="Sender's full name"
                required 
              />
            </div>
            <div>
              <label className="text-xs text-titan-muted uppercase">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="input-field mt-1" 
                placeholder="sender@email.com"
                required 
              />
            </div>
            <div>
              <label className="text-xs text-titan-muted uppercase">Enquiry Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
                className="input-field mt-1"
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-titan-muted uppercase">Subject</label>
              <input 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                className="input-field mt-1" 
                placeholder="Topic of discussion..."
                required 
              />
            </div>
            <div>
              <label className="text-xs text-titan-muted uppercase">Date Received</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="input-field mt-1" 
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-titan-muted uppercase">Message Body</label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              className="input-field mt-1 resize-none" 
              rows={4} 
              placeholder="Type customer message here..."
              required 
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary !px-4 !py-2 !text-xs">
              {editing ? 'Save Changes' : 'Log Enquiry'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary !px-4 !py-2 !text-xs">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Enquiries Listing */}
      <div className="space-y-4">
        {enquiries.length === 0 ? (
          <p className="text-titan-muted">No enquiries logged yet.</p>
        ) : (
          enquiries.map((enquiry) => (
            <div key={enquiry.id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-heading font-bold text-lg">{enquiry.name}</h3>
                    <p className="text-titan-secondary text-sm">{enquiry.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-titan-muted text-xs font-mono">{enquiry.date}</span>
                    <select
                      value={enquiry.status}
                      onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                      className="input-field !py-1 !text-xs w-auto border hover:border-titan-red/50 transition-colors"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                <p className="text-sm font-semibold text-titan-red mb-2">{enquiry.subject}</p>
                <p className="text-titan-secondary text-sm leading-relaxed mb-4">{enquiry.message}</p>
              </div>

              <div className="flex gap-3 border-t border-white/5 pt-4">
                <button 
                  onClick={() => startEdit(enquiry)} 
                  className="btn-glass !px-3 !py-1.5 !text-xs flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-pen" /> Edit Info
                </button>
                <button 
                  onClick={() => handleDelete(enquiry.id, enquiry.name)} 
                  className="btn-glass !text-titan-muted hover:!text-titan-red !px-3 !py-1.5 !text-xs flex items-center gap-1.5 border hover:border-titan-red/30"
                >
                  <i className="fa-solid fa-trash-can" /> Delete Enquiry
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
