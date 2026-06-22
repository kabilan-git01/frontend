import { useState } from 'react';
import { PageHeader } from '../components/ui/SectionHeader';
import { PlanCard } from '../components/shared/Cards';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useApp } from '../context/AppProvider';
import { billingPeriods } from '../data/plans';

export default function MembershipPlans() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const revealRef = useScrollReveal();
  const { plans, addToCart, setPreferences, preferences } = useApp();

  const handleAddToCart = (plan, period, price) => {
    setPreferences({ ...preferences, billingPeriod: period });
    addToCart({
      id: plan.id,
      name: `${plan.name} (${billingPeriods.find((b) => b.id === period)?.label})`,
      price,
      type: 'plan',
      billingPeriod: period,
    });
  };

  return (
    <div ref={revealRef}>
      <PageHeader title="Membership Plans" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Membership' }]} />

      <section className="section-padding">
        <div className="container-titan">
          {/* Billing Toggle */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12 reveal">
            {billingPeriods.map((period) => (
              <button
                key={period.id}
                onClick={() => setBillingPeriod(period.id)}
                className={`px-6 py-3 rounded-lg border text-sm font-semibold uppercase tracking-wider transition-all ${
                  billingPeriod === period.id
                    ? 'bg-titan-red border-titan-red text-white shadow-glow'
                    : 'border-white/20 text-titan-secondary hover:border-titan-red/50'
                }`}
              >
                {period.label}
                {period.discount && <span className="block text-[10px] text-titan-red mt-0.5 normal-case">{period.discount}</span>}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div key={plan.id} className={`reveal ${i > 0 ? `animate-delay-${i * 100}` : ''}`}>
                <PlanCard plan={plan} billingPeriod={billingPeriod} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
