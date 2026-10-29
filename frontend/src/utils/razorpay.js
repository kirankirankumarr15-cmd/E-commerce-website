export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = async ({ key, amount, orderId, razorpayOrderId, user, onSuccess, onFailure }) => {
  const loaded = await loadRazorpay();
  if (!loaded) throw new Error('Failed to load payment gateway');

  const options = {
    key,
    amount: Math.round(amount * 100),
    currency: 'INR',
    name: 'NOVA MART',
    description: `Order ${orderId}`,
    order_id: razorpayOrderId,
    prefill: {
      name: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
      email: user?.email || '',
      contact: user?.phone || '',
    },
    theme: { color: '#4f46e5' },
    handler: onSuccess,
    modal: {
      ondismiss: onFailure,
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', (response) => {
    onFailure(response.error);
  });
  rzp.open();
};
