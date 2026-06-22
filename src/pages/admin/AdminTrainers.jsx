import { useState } from 'react';
import { useApp } from '../../context/AppProvider';

export default function AdminTrainers() {
  const { trainers, updateTrainer } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const startEdit = (trainer) => {
    setEditing(trainer.id);
    setForm({ specialty: trainer.specialty, sessionPrice: trainer.sessionPrice, rating: trainer.rating });
  };

  const saveEdit = (id) => {
    updateTrainer(id, form);
    setEditing(null);
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-heading font-bold mb-8">Trainers</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-titan-muted uppercase text-xs tracking-wider">
              <th className="text-left py-3 px-4">Trainer</th>
              <th className="text-left py-3 px-4">Specialty</th>
              <th className="text-left py-3 px-4">Rating</th>
              <th className="text-left py-3 px-4">Session Price</th>
              <th className="text-left py-3 px-4">Sessions</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((trainer) => (
              <tr key={trainer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={trainer.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <span className="font-semibold">{trainer.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {editing === trainer.id ? (
                    <input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="input-field !py-1 !text-sm" />
                  ) : (
                    <span className="text-titan-secondary">{trainer.specialty}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {editing === trainer.id ? (
                    <input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })} className="input-field !py-1 !text-sm w-20" />
                  ) : (
                    <span><i className="fa-solid fa-star text-yellow-400 mr-1" />{trainer.rating}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {editing === trainer.id ? (
                    <input type="number" value={form.sessionPrice} onChange={(e) => setForm({ ...form, sessionPrice: parseInt(e.target.value) })} className="input-field !py-1 !text-sm w-24" />
                  ) : (
                    <span className="text-titan-red font-semibold">${trainer.sessionPrice}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-titan-secondary">{trainer.sessionsCompleted}+</td>
                <td className="py-3 px-4 text-right">
                  {editing === trainer.id ? (
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => saveEdit(trainer.id)} className="text-green-400 hover:text-green-300"><i className="fa-solid fa-check" /></button>
                      <button onClick={() => setEditing(null)} className="text-titan-muted hover:text-white"><i className="fa-solid fa-xmark" /></button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(trainer)} className="text-titan-secondary hover:text-titan-red transition-colors">
                      <i className="fa-solid fa-pen" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
