/**
 * Helper to dynamically load the external Razorpay Checkout SDK script.
 * Returns a promise resolving to true if loaded successfully, otherwise false.
 */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // If Razorpay SDK is already loaded, resolve immediately
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Reusable utility to process a payment with Razorpay.
 * 
 * @param {Object} params
 * @param {number} params.amount - The amount in main currency units (e.g., INR/USD)
 * @param {Object} [params.prefill] - Customer prefill details (name, email, contact)
 * @param {Function} params.onSuccess - Callback on verification success
 * @param {Function} params.onFailure - Callback on verification/checkout failure
 */
export const processPayment = async ({ amount, prefill = {}, onSuccess, onFailure }) => {
  // Load the external SDK
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    onFailure(new Error('Razorpay SDK failed to load. Please check your internet connection.'));
    return;
  }

  const apiUrl = import.meta.env.VITE_API_URL || 'https://backend-1-h6k5.onrender.com';

  try {
    // 1. Create order on the Express backend
    const orderResponse = await fetch(`${apiUrl}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      throw new Error(errorData.message || 'Failed to create payment order on server.');
    }

    const orderData = await orderResponse.json();
    const { order_id, amount: orderAmount, currency, key_id } = orderData;

    // 2. Configure Razorpay checkout options
    const options = {
      key: key_id,
      amount: orderAmount,
      currency: currency,
      name: 'Titan Fitness Gym',
      description: 'Membership Purchase / Training Session',
      image: 'https://img.icons8.com/ios-filled/100/ff003c/dumbbells.png',
      order_id: order_id,
      handler: async function (response) {
        // 3. Verify payment signature on the backend
        try {
          const verifyResponse = await fetch(`${apiUrl}/api/payment/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            onSuccess(verifyData, response);
          } else {
            throw new Error(verifyData.message || 'Payment signature verification failed.');
          }
        } catch (verifyError) {
          onFailure(verifyError);
        }
      },
      prefill: {
        name: prefill.name || '',
        email: prefill.email || '',
        contact: prefill.contact || '',
      },
      theme: {
        color: '#ff003c', // Titan Red brand color
      },
    };

    // Open checkout window
    const rzp = new window.Razorpay(options);
    
    // Listen for transaction failures
    rzp.on('payment.failed', function (response) {
      onFailure(new Error(response.error.description || 'Payment transaction was declined/failed.'));
    });

    rzp.open();
  } catch (error) {
    onFailure(error);
  }
};
