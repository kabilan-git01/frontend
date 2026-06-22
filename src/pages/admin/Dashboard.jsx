import { useApp } from '../../context/AppProvider';
import { formatCurrency } from '../../utils/helpers';

export default function AdminDashboard() {
  const { members, enquiries, reviews, plans, trainers, cart } = useApp();

  const stats = [
    { label: 'Total Members', value: members.length, icon: 'fa-users', color: 'text-blue-400' },
    { label: 'Active Plans', value: plans.length, icon: 'fa-tags', color: 'text-green-400' },
    { label: 'Trainers', value: trainers.length, icon: 'fa-user-tie', color: 'text-purple-400' },
    { label: 'New Enquiries', value: enquiries.filter((e) => e.status === 'new').length, icon: 'fa-envelope', color: 'text-yellow-400' },
    { label: 'Reviews', value: reviews.length, icon: 'fa-star', color: 'text-titan-red' },
    { label: 'Cart Items', value: cart.length, icon: 'fa-cart-shopping', color: 'text-orange-400' },
  ];

  const recentEnquiries = enquiries.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-heading font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <i className={`fa-solid ${stat.icon} ${stat.color} text-xl mb-2`} />
            <div className="text-2xl font-heading font-bold">{stat.value}</div>
            <p className="text-titan-muted text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="font-heading font-bold mb-4">Recent Enquiries</h2>
          {recentEnquiries.length === 0 ? (
            <p className="text-titan-muted text-sm">No enquiries yet.</p>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map((e) => (
                <div key={e.id} className="flex items-center justify-between p-3 bg-titan-dark rounded-lg">
                  <div>
                    <p className="font-semibold text-sm">{e.name}</p>
                    <p className="text-titan-muted text-xs">{e.subject}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${e.status === 'new' ? 'bg-titan-red/20 text-titan-red' : 'bg-white/5 text-titan-muted'}`}>
                    {e.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <h2 className="font-heading font-bold mb-4">Membership Plans Overview</h2>
          <div className="space-y-3">
            {plans.map((plan) => (
              <div key={plan.id} className="flex items-center justify-between p-3 bg-titan-dark rounded-lg">
                <div>
                  <p className="font-semibold text-sm">{plan.name}</p>
                  {plan.popular && <span className="text-titan-red text-xs">Popular</span>}
                </div>
                <span className="text-titan-red font-bold text-sm">{formatCurrency(plan.pricing.monthly)}/mo</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
