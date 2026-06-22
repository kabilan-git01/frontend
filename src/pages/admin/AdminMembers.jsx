import { useState } from 'react';
import { useApp } from '../../context/AppProvider';

export default function AdminMembers() {
  const { members, addMember, deleteMember } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', plan: 'Basic Plan' });

  const handleAdd = (e) => {
    e.preventDefault();
    addMember(form);
    setForm({ name: '', email: '', plan: 'Basic Plan' });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Members</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary !px-4 !py-2 !text-xs">
          <i className="fa-solid fa-plus" /> Add Member
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="glass-card p-6 mb-6 grid sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs text-titan-muted">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field mt-1" required />
          </div>
          <div>
            <label className="text-xs text-titan-muted">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field mt-1" required />
          </div>
          <div>
            <label className="text-xs text-titan-muted">Plan</label>
            <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} className="input-field mt-1">
              <option>Basic Plan</option>
              <option>Elite Plan</option>
              <option>VIP Plan</option>
            </select>
          </div>
          <button type="submit" className="btn-primary !py-3">Add</button>
        </form>
      )}

      <div className="overflow-x-auto">
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
              <tr key={member.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 font-semibold">{member.name}</td>
                <td className="py-3 px-4 text-titan-secondary">{member.email}</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 bg-titan-red/10 text-titan-red text-xs rounded">{member.plan}</span></td>
                <td className="py-3 px-4 text-titan-secondary">{member.joinDate}</td>
                <td className="py-3 px-4"><span className="text-green-400 text-xs uppercase">{member.status}</span></td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => deleteMember(member.id)} className="text-titan-muted hover:text-titan-red transition-colors">
                    <i className="fa-solid fa-trash-can" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
