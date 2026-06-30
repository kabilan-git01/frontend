import { useState } from 'react';
import { useApp } from '../../context/AppProvider';
import { formatCurrency } from '../../utils/helpers';

export default function AdminPlans() {
  const { plans, addPlan, updatePlan, deletePlan } = useApp();
  const [editing, setEditing] = useState(null); // id of the plan being edited
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form states
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPopular, setFormPopular] = useState(false);
  const [formPricing, setFormPricing] = useState({ monthly: 0, quarterly: 0, yearly: 0 });
  const [formFeatures, setFormFeatures] = useState([
    { text: 'Access to Gym Floor & Cardio', included: true },
    { text: 'Standard Lockers & Showers', included: true },
    { text: '1 Free Physical Evaluation', included: true },
    { text: 'Access to Group Classes', included: false },
    { text: '1-on-1 Personal Trainer', included: false },
    { text: 'Free Customized Nutrition Plan', included: false },
  ]);

  const resetForm = () => {
    setFormName('');
    setFormDesc('');
    setFormPopular(false);
    setFormPricing({ monthly: 0, quarterly: 0, yearly: 0 });
    setFormFeatures([
      { text: 'Access to Gym Floor & Cardio', included: true },
      { text: 'Standard Lockers & Showers', included: true },
      { text: '1 Free Physical Evaluation', included: true },
      { text: 'Access to Group Classes', included: false },
      { text: '1-on-1 Personal Trainer', included: false },
      { text: 'Free Customized Nutrition Plan', included: false },
    ]);
    setEditing(null);
  };

  const startEdit = (plan) => {
    setEditing(plan.id);
    setFormName(plan.name);
    setFormDesc(plan.description || '');
    setFormPopular(plan.popular || false);
    setFormPricing({ ...plan.pricing });
    setFormFeatures(plan.features || []);
    setShowAddForm(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formName) return;

    const planData = {
      name: formName,
      category: 'plans',
      slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: formDesc,
      pricing: formPricing,
      features: formFeatures,
      popular: formPopular,
    };

    if (editing) {
      updatePlan(editing, planData);
    } else {
      const generatedId = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      addPlan({ ...planData, id: generatedId });
    }
    
    resetForm();
    setShowAddForm(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the plan "${name}"?`)) {
      deletePlan(id);
    }
  };

  const toggleFeature = (index) => {
    setFormFeatures(prev => 
      prev.map((f, i) => i === index ? { ...f, included: !f.included } : f)
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Membership Plans</h1>
        {!showAddForm && !editing && (
          <button 
            onClick={() => { resetForm(); setShowAddForm(true); }} 
            className="btn-primary !px-4 !py-2 !text-xs"
          >
            <i className="fa-solid fa-plus mr-1" /> Add New Plan
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {(showAddForm || editing) && (
        <form onSubmit={handleSave} className="glass-card p-6 mb-8 space-y-6 animate-fade-in">
          <h2 className="text-xl font-heading font-bold text-gradient">
            {editing ? 'Edit Membership Plan' : 'Create New Membership Plan'}
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-titan-muted uppercase">Plan Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="input-field mt-1"
                placeholder="e.g. Platinum Plan"
                required
              />
            </div>
            <div>
              <label className="text-xs text-titan-muted uppercase">Popular Badge</label>
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  id="popular"
                  checked={formPopular}
                  onChange={(e) => setFormPopular(e.target.checked)}
                  className="w-4 h-4 accent-titan-red"
                />
                <label htmlFor="popular" className="text-sm text-titan-secondary cursor-pointer">
                  Display as Popular/Featured Plan
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-titan-muted uppercase">Description</label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="input-field mt-1 resize-none"
              rows={2}
              placeholder="Short plan summary..."
              required
            />
          </div>

          {/* Pricing Grid */}
          <div>
            <label className="text-xs text-titan-muted uppercase block mb-2">Pricing Structure</label>
            <div className="grid grid-cols-3 gap-4">
              {['monthly', 'quarterly', 'yearly'].map((period) => (
                <div key={period}>
                  <label className="text-xs text-titan-secondary capitalize">{period} Rate ($)</label>
                  <input
                    type="number"
                    value={formPricing[period]}
                    onChange={(e) => setFormPricing({ ...formPricing, [period]: parseInt(e.target.value) || 0 })}
                    className="input-field mt-1"
                    min="0"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div>
            <label className="text-xs text-titan-muted uppercase block mb-2">Included Features</label>
            <div className="grid sm:grid-cols-2 gap-3 bg-titan-dark p-4 rounded-xl border border-white/5">
              {formFeatures.map((feat, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => toggleFeature(index)}
                  className="flex items-center gap-3 text-left py-1 hover:text-white transition-colors"
                >
                  <i className={`fa-solid ${feat.included ? 'fa-square-check text-green-400' : 'fa-square text-titan-muted'} text-lg`} />
                  <span className={`text-sm ${feat.included ? 'text-titan-secondary' : 'text-titan-muted line-through'}`}>
                    {feat.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary !px-5 !py-2.5">
              {editing ? 'Save Changes' : 'Create Plan'}
            </button>
            <button 
              type="button" 
              onClick={resetForm} 
              className="btn-secondary !px-5 !py-2.5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Plans List */}
      <div className="space-y-4">
        {plans.map((plan) => (
          <div key={plan.id} className="glass-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg">{plan.name}</h3>
                <p className="text-titan-secondary text-sm">{plan.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {plan.popular && <span className="px-3 py-1 bg-titan-red/20 text-titan-red text-xs font-bold uppercase rounded-full">Popular</span>}
                <span className="text-xs text-titan-muted uppercase tracking-wider font-mono">ID: {plan.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-5">
              {['monthly', 'quarterly', 'yearly'].map((period) => (
                <div key={period} className="bg-titan-dark p-3 rounded-lg text-center border border-white/5">
                  <p className="text-xs text-titan-muted uppercase">{period}</p>
                  <p className="font-bold text-titan-red">{formatCurrency(plan.pricing?.[period] || 0)}</p>
                </div>
              ))}
            </div>

            {/* Render features badges inside admin list for detail */}
            <div className="mb-5 bg-titan-dark/50 p-3 rounded-lg border border-white/5">
              <p className="text-xs text-titan-muted uppercase mb-2">Features</p>
              <div className="flex flex-wrap gap-2">
                {plan.features?.map((f, i) => (
                  <span 
                    key={i} 
                    className={`px-2 py-0.5 rounded text-xs border ${
                      f.included 
                        ? 'bg-green-400/10 border-green-400/20 text-green-400' 
                        : 'bg-white/5 border-white/10 text-titan-muted line-through'
                    }`}
                  >
                    {f.text}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => startEdit(plan)} 
                className="btn-glass !px-4 !py-2 !text-xs flex items-center gap-1.5"
              >
                <i className="fa-solid fa-pen" /> Edit Plan
              </button>
              <button 
                onClick={() => handleDelete(plan.id, plan.name)} 
                className="btn-glass !text-titan-muted hover:!text-titan-red !px-4 !py-2 !text-xs flex items-center gap-1.5 border hover:border-titan-red/30"
              >
                <i className="fa-solid fa-trash-can" /> Delete Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
