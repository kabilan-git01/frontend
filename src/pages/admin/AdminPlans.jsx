import { useState } from 'react';
import { useApp } from '../../context/AppProvider';
import { formatCurrency } from '../../utils/helpers';

export default function AdminPlans() {
  const { plans, updatePlan } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const startEdit = (plan) => {
    setEditing(plan.id);
    setForm({ ...plan.pricing });
  };

  const saveEdit = (id) => {
    updatePlan(id, { pricing: { ...form } });
    setEditing(null);
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-heading font-bold mb-8">Membership Plans</h1>

      <div className="space-y-4">
        {plans.map((plan) => (
          <div key={plan.id} className="glass-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg">{plan.name}</h3>
                <p className="text-titan-secondary text-sm">{plan.description}</p>
              </div>
              {plan.popular && <span className="px-3 py-1 bg-titan-red/20 text-titan-red text-xs font-bold uppercase rounded-full">Popular</span>}
            </div>

            {editing === plan.id ? (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {['monthly', 'quarterly', 'yearly'].map((period) => (
                  <div key={period}>
                    <label className="text-xs text-titan-muted uppercase">{period}</label>
                    <input
                      type="number"
                      value={form[period]}
                      onChange={(e) => setForm({ ...form, [period]: parseInt(e.target.value) })}
                      className="input-field mt-1"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {['monthly', 'quarterly', 'yearly'].map((period) => (
                  <div key={period} className="bg-titan-dark p-3 rounded-lg text-center">
                    <p className="text-xs text-titan-muted uppercase">{period}</p>
                    <p className="font-bold text-titan-red">{formatCurrency(plan.pricing[period])}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              {editing === plan.id ? (
                <>
                  <button onClick={() => saveEdit(plan.id)} className="btn-primary !px-4 !py-2 !text-xs">Save</button>
                  <button onClick={() => setEditing(null)} className="btn-secondary !px-4 !py-2 !text-xs">Cancel</button>
                </>
              ) : (
                <button onClick={() => startEdit(plan)} className="btn-glass !px-4 !py-2 !text-xs">
                  <i className="fa-solid fa-pen" /> Edit Pricing
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
