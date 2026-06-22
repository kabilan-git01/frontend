import { PageHeader, EmptyState } from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppProvider';
import { formatCurrency } from '../utils/helpers';

export default function Cart() {
  const { cart, cartTotal, removeFromCart, updateCartQuantity, clearCart } = useApp();

  if (cart.length === 0) {
    return (
      <div>
        <PageHeader title="Shopping Cart" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
        <EmptyState
          icon="fa-cart-shopping"
          title="Your Cart is Empty"
          description="Browse our membership plans, programs, or book a trainer session to get started."
          action={
            <div className="flex gap-3 justify-center flex-wrap">
              <Button to="/membership">View Plans</Button>
              <Button to="/programs" variant="secondary">Browse Programs</Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Shopping Cart" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />

      <section className="section-padding">
        <div className="container-titan max-w-4xl">
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <div key={item.cartId} className="glass-card p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {item.image && (
                  <img src={item.image} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold truncate">{item.name}</h3>
                  <p className="text-titan-muted text-sm capitalize">{item.type}{item.billingPeriod ? ` · ${item.billingPeriod}` : ''}</p>
                  {item.meta && (
                    <p className="text-titan-secondary text-xs mt-1">{item.meta.date} · {item.meta.slot}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-white/10 rounded-lg">
                    <button onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:text-titan-red transition-colors" disabled={item.quantity <= 1}>
                      <i className="fa-solid fa-minus text-xs" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:text-titan-red transition-colors">
                      <i className="fa-solid fa-plus text-xs" />
                    </button>
                  </div>
                  <span className="font-bold text-titan-red w-20 text-right">{formatCurrency(item.price * item.quantity)}</span>
                  <button onClick={() => removeFromCart(item.cartId)} className="w-8 h-8 flex items-center justify-center text-titan-muted hover:text-titan-red transition-colors" aria-label="Remove item">
                    <i className="fa-solid fa-trash-can text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-heading font-bold">Total</span>
              <span className="text-2xl font-heading font-bold text-gradient">{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="flex-1">Proceed to Checkout</Button>
              <Button variant="secondary" onClick={clearCart}>Clear Cart</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
