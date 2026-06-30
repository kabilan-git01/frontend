import { useState } from 'react';
import { useApp } from '../../context/AppProvider';

export default function AdminMembers() {
  const { members, addMember, deleteMember, updateMember } = useApp();
  const [editing, setEditing] = useState(null); // Member ID being edited
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('Basic Plan');
  const [status, setStatus] = useState('active');
  const [joinDate, setJoinDate] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPlan('Basic Plan');
    setStatus('active');
    setJoinDate('');
    setEditing(null);
  };

  const startEdit = (member) => {
    setEditing(member.id);
    setName(member.name);
    setEmail(member.email);
    setPlan(member.plan || 'Basic Plan');
    setStatus(member.status || 'active');
    setJoinDate(member.joinDate || '');
    setShowForm(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    const memberData = {
      name,
      email,
      plan,
      status,
      joinDate: joinDate || new Date().toISOString().split('T')[0],
    };

    if (editing) {
      updateMember(editing, memberData);
    } else {
      addMember(memberData);
    }

    resetForm();
    setShowForm(false);
  };

  const handleDelete = (id, memberName) => {
    if (window.confirm(`Are you sure you want to delete member "${memberName}"?`)) {
      deleteMember(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Gym Registry Members</h1>
        {!showForm && !editing && (
          <button 
            onClick={() => { resetForm(); setShowForm(true); }} 
            className="btn-primary !px-4 !py-2 !text-xs"
          >
            <i className="fa-solid fa-plus mr-1" /> Add Member
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {(showForm || editing) && (
        <form onSubmit={handleSave} className="glass-card p-6 mb-6 space-y-4 animate-fade-in">
          <h2 className="text-lg font-heading font-bold text-gradient">
            {editing ? `Edit Member: ${name}` : 'Register New Member'}
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-xs text-titan-muted uppercase">Full Name</label>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="input-field mt-1" 
                placeholder="John Doe"
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
                placeholder="john@email.com"
                required 
              />
            </div>
            <div>
              <label className="text-xs text-titan-muted uppercase">Membership Plan</label>
              <select 
                value={plan} 
                onChange={(e) => setPlan(e.target.value)} 
                className="input-field mt-1"
              >
                <option>Basic Plan</option>
                <option>Elite Plan</option>
                <option>VIP Plan</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-titan-muted uppercase">Membership Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
                className="input-field mt-1"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-titan-muted uppercase">Join Date</label>
              <input 
                type="date" 
                value={joinDate} 
                onChange={(e) => setJoinDate(e.target.value)} 
                className="input-field mt-1" 
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary !px-4 !py-2 !text-xs">
              {editing ? 'Save Member' : 'Register Member'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary !px-4 !py-2 !text-xs">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Members List */}
      <div className="overflow-x-auto glass-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-titan-muted uppercase text-xs tracking-wider">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Plan</th>
              <th className="text-left py-3 px-4">Join Date</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-semibold">{member.name}</td>
                <td className="py-3 px-4 text-titan-secondary">{member.email}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 bg-titan-red/10 text-titan-red text-xs rounded">
                    {member.plan}
                  </span>
                </td>
                <td className="py-3 px-4 text-titan-secondary">{member.joinDate}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs uppercase font-bold ${
                    member.status === 'active' 
                      ? 'text-green-400' 
                      : member.status === 'suspended' 
                      ? 'text-yellow-400' 
                      : 'text-titan-muted'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => startEdit(member)} 
                      className="text-titan-secondary hover:text-white transition-colors"
                      title="Edit Member"
                    >
                      <i className="fa-solid fa-pen text-sm" />
                    </button>
                    <button 
                      onClick={() => handleDelete(member.id, member.name)} 
                      className="text-titan-muted hover:text-titan-red transition-colors"
                      title="Delete Member"
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
