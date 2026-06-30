import { useState } from 'react';
import { useApp } from '../../context/AppProvider';

export default function AdminTrainers() {
  const { trainers, programs: availablePrograms, addTrainer, updateTrainer, deleteTrainer } = useApp();
  const [editing, setEditing] = useState(null); // ID of trainer being edited
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [image, setImage] = useState('');
  const [experience, setExperience] = useState('');
  const [rating, setRating] = useState(5.0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [sessionPrice, setSessionPrice] = useState(50);
  const [certsInput, setCertsInput] = useState(''); // Comma-separated
  const [selectedPrograms, setSelectedPrograms] = useState([]); // List of program IDs
  const [availInput, setAvailInput] = useState(''); // Comma-separated
  const [socials, setSocials] = useState({ facebook: '#', twitter: '#', instagram: '#' });

  const resetForm = () => {
    setName('');
    setSpecialty('');
    setBio('');
    setShortBio('');
    setImage('');
    setExperience('');
    setRating(5.0);
    setSessionsCompleted(0);
    setSessionPrice(50);
    setCertsInput('');
    setSelectedPrograms([]);
    setAvailInput('');
    setSocials({ facebook: '#', twitter: '#', instagram: '#' });
    setEditing(null);
  };

  const startEdit = (trainer) => {
    setEditing(trainer.id);
    setName(trainer.name);
    setSpecialty(trainer.specialty);
    setBio(trainer.bio || '');
    setShortBio(trainer.shortBio || '');
    setImage(trainer.image || '');
    setExperience(trainer.experience || '');
    setRating(trainer.rating || 5.0);
    setSessionsCompleted(trainer.sessionsCompleted || 0);
    setSessionPrice(trainer.sessionPrice || 50);
    setCertsInput(Array.isArray(trainer.certs) ? trainer.certs.join(', ') : '');
    setSelectedPrograms(Array.isArray(trainer.programs) ? trainer.programs : []);
    setAvailInput(Array.isArray(trainer.availability) ? trainer.availability.join(', ') : '');
    setSocials(trainer.socials || { facebook: '#', twitter: '#', instagram: '#' });
    setShowAddForm(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !specialty) return;

    const parsedCerts = certsInput.split(',').map(c => c.trim()).filter(Boolean);
    const parsedAvailability = availInput.split(',').map(a => a.trim()).filter(Boolean);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const trainerData = {
      name,
      category: 'trainers',
      slug,
      specialty,
      bio,
      shortBio,
      image: image || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop',
      certs: parsedCerts,
      experience,
      rating: parseFloat(rating) || 5.0,
      sessionsCompleted: parseInt(sessionsCompleted) || 0,
      programs: selectedPrograms,
      availability: parsedAvailability,
      sessionPrice: parseInt(sessionPrice) || 50,
      socials,
    };

    if (editing) {
      updateTrainer(editing, trainerData);
    } else {
      addTrainer({ ...trainerData, id: slug });
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleDelete = (id, trainerName) => {
    if (window.confirm(`Are you sure you want to delete coach "${trainerName}"?`)) {
      deleteTrainer(id);
    }
  };

  const handleProgramToggle = (progId) => {
    setSelectedPrograms(prev => 
      prev.includes(progId) ? prev.filter(id => id !== progId) : [...prev, progId]
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Trainer Registry</h1>
        {!showAddForm && !editing && (
          <button 
            onClick={() => { resetForm(); setShowAddForm(true); }} 
            className="btn-primary !px-4 !py-2 !text-xs"
          >
            <i className="fa-solid fa-plus mr-1" /> Add Trainer
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {(showAddForm || editing) && (
        <form onSubmit={handleSave} className="glass-card p-6 mb-8 space-y-6 animate-fade-in">
          <h2 className="text-xl font-heading font-bold text-gradient">
            {editing ? `Edit Coach Profile: ${name}` : 'Add New Coach Profile'}
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-titan-muted uppercase">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field mt-1" required />
            </div>
            <div>
              <label className="text-xs text-titan-muted uppercase">Specialty Role</label>
              <input value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="input-field mt-1" placeholder="e.g. Strength & Conditioning" required />
            </div>
            <div>
              <label className="text-xs text-titan-muted uppercase">Profile Image URL</label>
              <input value={image} onChange={(e) => setImage(e.target.value)} className="input-field mt-1" placeholder="Unsplash image URL..." />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-titan-muted uppercase">Short Bio</label>
              <input value={shortBio} onChange={(e) => setShortBio(e.target.value)} className="input-field mt-1" placeholder="One sentence summary for catalog listings..." />
            </div>
            <div>
              <label className="text-xs text-titan-muted uppercase">Full Bio Profile</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input-field mt-1 resize-none" rows={2} placeholder="Full professional background..." />
            </div>
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-titan-muted uppercase">Experience Length</label>
              <input value={experience} onChange={(e) => setExperience(e.target.value)} className="input-field mt-1" placeholder="e.g. 10 years" />
            </div>
            <div>
              <label className="text-xs text-titan-muted uppercase">Hourly Rate ($)</label>
              <input type="number" value={sessionPrice} onChange={(e) => setSessionPrice(e.target.value)} className="input-field mt-1" required />
            </div>
            <div>
              <label className="text-xs text-titan-muted uppercase">Client Rating</label>
              <input type="number" step="0.1" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} className="input-field mt-1" required />
            </div>
            <div>
              <label className="text-xs text-titan-muted uppercase">Sessions Completed</label>
              <input type="number" value={sessionsCompleted} onChange={(e) => setSessionsCompleted(e.target.value)} className="input-field mt-1" required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-titan-muted uppercase">Certifications (comma separated)</label>
              <input value={certsInput} onChange={(e) => setCertsInput(e.target.value)} className="input-field mt-1" placeholder="e.g. CSCS, NASM-PES, First Aid" />
            </div>
            <div>
              <label className="text-xs text-titan-muted uppercase">Availability Slots (comma separated)</label>
              <input value={availInput} onChange={(e) => setAvailInput(e.target.value)} className="input-field mt-1" placeholder="e.g. Mon 9AM-5PM, Wed 2PM-6PM" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-titan-muted uppercase">Facebook URL</label>
              <input value={socials.facebook} onChange={(e) => setSocials({ ...socials, facebook: e.target.value })} className="input-field mt-1" />
            </div>
            <div>
              <label className="text-xs text-titan-muted uppercase">Twitter URL</label>
              <input value={socials.twitter} onChange={(e) => setSocials({ ...socials, twitter: e.target.value })} className="input-field mt-1" />
            </div>
            <div>
              <label className="text-xs text-titan-muted uppercase">Instagram URL</label>
              <input value={socials.instagram} onChange={(e) => setSocials({ ...socials, instagram: e.target.value })} className="input-field mt-1" />
            </div>
          </div>

          {/* Programs Checklist */}
          <div>
            <label className="text-xs text-titan-muted uppercase block mb-2">Assigned Programs</label>
            <div className="flex flex-wrap gap-3 bg-titan-dark p-4 rounded-xl border border-white/5">
              {availablePrograms.map((prog) => (
                <button
                  type="button"
                  key={prog.id}
                  onClick={() => handleProgramToggle(prog.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 hover:border-titan-red/50 hover:bg-white/5 transition-colors"
                >
                  <i className={`fa-solid ${selectedPrograms.includes(prog.id) ? 'fa-square-check text-titan-red' : 'fa-square text-titan-muted'}`} />
                  <span className="text-xs uppercase tracking-wider">{prog.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary !px-5 !py-2.5">
              {editing ? 'Save Profiles' : 'Create Profile'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary !px-5 !py-2.5">Cancel</button>
          </div>
        </form>
      )}

      {/* Trainers Table */}
      <div className="overflow-x-auto glass-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-titan-muted uppercase text-xs tracking-wider">
              <th className="text-left py-3 px-4">Trainer</th>
              <th className="text-left py-3 px-4">Specialty</th>
              <th className="text-left py-3 px-4">Rating</th>
              <th className="text-left py-3 px-4">Rate</th>
              <th className="text-left py-3 px-4">Sessions</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((trainer) => (
              <tr key={trainer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={trainer.image} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    <div>
                      <span className="font-semibold block">{trainer.name}</span>
                      <span className="text-xs text-titan-muted font-mono">{trainer.id}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-titan-secondary">{trainer.specialty}</td>
                <td className="py-3 px-4">
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-star text-yellow-400 text-xs" />
                    {trainer.rating}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-titan-red">${trainer.sessionPrice}/hr</td>
                <td className="py-3 px-4 text-titan-muted">{trainer.sessionsCompleted}+</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => startEdit(trainer)} 
                      className="text-titan-secondary hover:text-white transition-colors"
                      title="Edit Profile"
                    >
                      <i className="fa-solid fa-pen text-sm" />
                    </button>
                    <button 
                      onClick={() => handleDelete(trainer.id, trainer.name)} 
                      className="text-titan-muted hover:text-titan-red transition-colors"
                      title="Delete Profile"
                    >
                      <i className="fa-solid fa-trash-can text-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
