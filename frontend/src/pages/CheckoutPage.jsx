import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Truck, CreditCard } from 'lucide-react';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { paymentService, authService } from '../services';
import { formatPrice, getProductImage } from '../utils/helpers';
import { openRazorpayCheckout } from '../utils/razorpay';

const steps = ['Address', 'Delivery', 'Payment', 'Confirmation'];

const DELIVERY_OPTIONS = [
  { value: 'standard', label: 'Standard Delivery', price: 49, days: '5-7 business days', desc: 'Free on orders above ₹999' },
  { value: 'express', label: 'Express Delivery', price: 149, days: '1-2 business days', desc: 'Priority shipping' },
];

const CheckoutPage = () => {
  const { cart, loading: cartLoading, fetchCart, refreshPricing, clearCart } = useCart();
  const { user, loadUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [saveAddress, setSaveAddress] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'India',
  });
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [pricing, setPricing] = useState(null);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  useEffect(() => {
    if (user) {
      setShipping((s) => ({
        ...s,
        fullName: s.fullName || `${user.firstName} ${user.lastName}`,
        phone: s.phone || user.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (cart?.items?.length) {
      refreshPricing(deliveryOption).then(() => {});
      import('../services').then(({ cartService }) => {
        cartService.getSummary({ deliveryOption, couponCode: cart.couponCode })
          .then((res) => setPricing(res.data.data))
          .catch(() => {});
      });
    }
  }, [deliveryOption, cart?.couponCode, cart?.items?.length]);

  const items = cart?.items || [];

  if (cartLoading || cart === null) {
    return (
      <div className="container-narrow py-16 text-center">
        <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-text-muted">Loading your checkout...</p>
      </div>
    );
  }

  if (items.length === 0 && !completedOrder) {
    navigate('/cart');
    return null;
  }

  const selectAddress = (addr) => {
    setShipping({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || 'India',
    });
    setSaveAddress(false);
  };

  const maybeSaveAddress = async () => {
    if (!saveAddress) return;
    try {
      await authService.addAddress({
        ...shipping,
        label: 'Home',
        isDefault: !(user?.addresses?.length),
      });
      await loadUser();
      toast.success('Address saved to profile');
    } catch (err) {
      toast.error(err.message || 'Could not save address');
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await maybeSaveAddress();

      const orderData = {
        shippingAddress: shipping,
        deliveryOption,
        paymentMethod: paymentMethod === 'online' ? 'upi' : 'cod',
        couponCode: cart.couponCode,
      };

      const { data } = await paymentService.createOrder(orderData);
      const { order, payment: paymentData } = data.data;

      if (paymentMethod === 'online' && paymentData?.razorpayOrderId) {
        await openRazorpayCheckout({
          key: paymentData.key,
          amount: paymentData.amount,
          orderId: order.orderNumber,
          razorpayOrderId: paymentData.razorpayOrderId,
          user,
          onSuccess: async (response) => {
            try {
              const verifyRes = await paymentService.verify({
                orderId: order._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              setCompletedOrder(verifyRes.data.data.order);
              await fetchCart();
              setStep(3);
              toast.success('Payment successful!');
            } catch (err) {
              toast.error(err.message);
              navigate(`/orders/${order._id}`);
            }
          },
          onFailure: () => {
            toast.error('Payment cancelled or failed. Your cart items are still saved.');
            navigate(`/orders/${order._id}`);
          },
        });
      } else {
        setCompletedOrder(order);
        await clearCart();
        setStep(3);
        toast.success('Order placed successfully!');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (completedOrder && step === 3) {
    navigate(`/order-confirmation/${completedOrder._id}`, { replace: true });
    return null;
  }

  const summary = pricing || { itemsPrice: 0, discountPrice: 0, shippingPrice: 0, taxPrice: 0, totalPrice: 0 };
  const freeShipping = summary.itemsPrice >= 999;

  return (
    <div className="container-narrow py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-bold text-text mb-8">Checkout</h1>

      <div className="flex items-center justify-center gap-1 sm:gap-2 mb-10 overflow-x-auto">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step ? 'bg-primary-600 text-white' : 'bg-surface-tertiary text-text-muted'}`}>{i + 1}</div>
            <span className={`text-xs sm:text-sm hidden sm:block ${i <= step ? 'text-text font-medium' : 'text-text-muted'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`w-4 sm:w-12 h-0.5 ${i < step ? 'bg-primary-600' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-surface rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-6"><MapPin className="h-5 w-5 text-primary-600" /> Shipping Address</h3>

                {user?.addresses?.length > 0 && (
                  <div className="mb-6 space-y-2">
                    <p className="text-sm font-medium text-text-muted">Saved Addresses</p>
                    {user.addresses.map((addr) => (
                      <button key={addr._id} type="button" onClick={() => selectAddress(addr)} className="w-full text-left p-3 border border-border rounded-lg hover:border-primary-600 text-sm">
                        <span className="font-medium">{addr.label}</span> — {addr.fullName}, {addr.city}
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {['fullName', 'phone', 'street', 'city', 'state', 'postalCode'].map((field) => (
                    <div key={field} className={field === 'street' ? 'sm:col-span-2' : ''}>
                      <label className="block text-sm font-medium mb-1.5 capitalize">{field === 'postalCode' ? 'Postal Code' : field.replace(/([A-Z])/g, ' $1')}</label>
                      <input value={shipping[field]} onChange={(e) => setShipping({ ...shipping, [field]: e.target.value })} required className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                  ))}
                </div>

                <label className="mt-4 flex items-center gap-2 text-sm text-text-muted cursor-pointer">
                  <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="rounded border-border" />
                  Save this address to my profile
                </label>

                <Button className="mt-6" onClick={() => setStep(1)} disabled={!shipping.fullName || !shipping.street || !shipping.phone}>Continue to Delivery</Button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-surface rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-6"><Truck className="h-5 w-5 text-primary-600" /> Delivery Option</h3>
                <div className="space-y-3">
                  {DELIVERY_OPTIONS.map((opt) => (
                    <label key={opt.value} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer ${deliveryOption === opt.value ? 'border-primary-600 bg-primary-50' : 'border-border'}`}>
                      <input type="radio" name="delivery" value={opt.value} checked={deliveryOption === opt.value} onChange={() => setDeliveryOption(opt.value)} />
                      <div className="flex-1">
                        <p className="font-medium">{opt.label}</p>
                        <p className="text-sm text-text-muted">{opt.days} · {opt.desc}</p>
                      </div>
                      <span className="font-medium">{freeShipping ? 'Free' : formatPrice(opt.price)}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                  <Button onClick={() => setStep(2)}>Continue to Payment</Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-surface rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-6"><CreditCard className="h-5 w-5 text-primary-600" /> Payment Method</h3>
                <div className="space-y-3">
                  {[
                    { value: 'online', label: 'Pay Online', desc: 'UPI, Cards, Net Banking, Wallets via Razorpay' },
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                  ].map((m) => (
                    <label key={m.value} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer ${paymentMethod === m.value ? 'border-primary-600 bg-primary-50' : 'border-border'}`}>
                      <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} />
                      <div><p className="font-medium">{m.label}</p><p className="text-sm text-text-muted">{m.desc}</p></div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={handlePlaceOrder} loading={loading}>Place Order</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6 h-fit sticky top-24">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div key={item._id} className="flex gap-2 items-center text-sm">
                <img src={getProductImage(item.product)} alt="" className="w-10 h-10 rounded object-cover" />
                <span className="flex-1 truncate">{item.product?.name}</span>
                <span>x{item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between"><span className="text-text-muted">Subtotal</span><span>{formatPrice(summary.itemsPrice)}</span></div>
            {summary.discountPrice > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{formatPrice(summary.discountPrice)}</span></div>}
            <div className="flex justify-between"><span className="text-text-muted">Delivery</span><span>{summary.shippingPrice === 0 ? 'Free' : formatPrice(summary.shippingPrice)}</span></div>
            <div className="flex justify-between"><span className="text-text-muted">Tax</span><span>{formatPrice(summary.taxPrice)}</span></div>
            <div className="border-t border-border pt-2 flex justify-between font-bold"><span>Total</span><span>{formatPrice(summary.totalPrice)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
