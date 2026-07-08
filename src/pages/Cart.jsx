import { useState } from 'react';
import { PageHeader, EmptyState } from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppProvider';
import { formatCurrency } from '../utils/helpers';
import { processPayment } from '../utils/paymentService';

export default function Cart() {
  const { cart, cartTotal, removeFromCart, updateCartQuantity, clearCart } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' | 'failure' | null
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus(null);
    setErrorMessage('');

    //prefetch or prefill user details if auth is active
    const userPrefill = {
      name: 'Titan Member',
      email: 'member@titanfitness.com',
      contact: '9999999999',
    };

    await processPayment({
      amount: cartTotal,
      prefill: userPrefill,
      onSuccess: (verifyData, response) => {
        setIsProcessing(false);
        setPaymentStatus('success');
        clearCart();
        console.log('✅ Payment Successful & Verified:', verifyData, response);
      },
      onFailure: (error) => {
        setIsProcessing(false);
        setPaymentStatus('failure');
        setErrorMessage(error.message || 'Payment transaction failed.');
        console.error('❌ Payment Failed:', error);
      },
    });
  };

  // Render successful checkout state
  if (paymentStatus === 'success') {
    return (
      <div>
        <PageHeader title="Checkout Complete" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
        <EmptyState
          icon="fa-circle-check text-green-500"
          title="Payment Successful!"
          description="Your transaction has been verified. Welcome to Titan Fitness. Visit your profile to view active memberships."
          action={
            <div className="flex gap-3 justify-center flex-wrap">
              <Button to="/profile">Go to Profile</Button>
              <Button to="/" variant="secondary">Back to Home</Button>
            </div>
          }
        />
      </div>
    );
  }

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

      <section className="section-padding font-body">
        <div className="container-titan max-w-4xl">
          {/* Failure Alert Banner */}
          {paymentStatus === 'failure' && (
            <div className="mb-6 p-4 bg-titan-red/10 border border-titan-red/20 text-white rounded-xl flex items-center gap-3 animate-fade-in">
              <i className="fa-solid fa-triangle-exclamation text-titan-red text-xl" />
              <div>
                <p className="font-semibold text-sm">Payment Failed</p>
                <p className="text-titan-secondary text-xs">{errorMessage}</p>
              </div>
            </div>
          )}

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
                    <button 
                      onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)} 
                      className="w-8 h-8 flex items-center justify-center hover:text-titan-red transition-colors" 
                      disabled={item.quantity <= 1 || isProcessing}
                    >
                      <i className="fa-solid fa-minus text-xs" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)} 
                      className="w-8 h-8 flex items-center justify-center hover:text-titan-red transition-colors"
                      disabled={isProcessing}
                    >
                      <i className="fa-solid fa-plus text-xs" />
                    </button>
                  </div>
                  <span className="font-bold text-titan-red w-20 text-right">{formatCurrency(item.price * item.quantity)}</span>
                  <button 
                    onClick={() => removeFromCart(item.cartId)} 
                    className="w-8 h-8 flex items-center justify-center text-titan-muted hover:text-titan-red transition-colors" 
                    aria-label="Remove item"
                    disabled={isProcessing}
                  >
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
              <Button 
                className="flex-1" 
                onClick={handlePayment} 
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-credit-card" /> Pay Now
                  </>
                )}
              </Button>
              <Button variant="secondary" onClick={clearCart} disabled={isProcessing}>Clear Cart</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
