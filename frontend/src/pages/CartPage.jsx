import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2, Bookmark, Tag } from 'lucide-react';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { couponService } from '../services';
import { formatPrice, getProductImage } from '../utils/helpers';

const CartPage = () => {
  const { cart, pricing, loading, fetchCart, updateQuantity, removeItem, saveForLater, moveToCart, applyCoupon, removeCoupon } = useCart();
  const { toast } = useToast();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const items = cart?.items || [];
  const saved = cart?.savedForLater || [];

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      await applyCoupon(couponInput.trim());
      toast.success('Coupon applied!');
      setCouponInput('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponLoading(true);
    try {
      await removeCoupon();
      toast.success('Coupon removed');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const summary = pricing || {
    itemsPrice: cart?.totalPrice || 0,
    discountPrice: 0,
    shippingPrice: (cart?.totalPrice || 0) > 999 ? 0 : 49,
    taxPrice: Math.round((cart?.totalPrice || 0) * 0.18),
    totalPrice: (cart?.totalPrice || 0) + ((cart?.totalPrice || 0) > 999 ? 0 : 49) + Math.round((cart?.totalPrice || 0) * 0.18),
  };

  const CartItem = ({ item, isSaved = false }) => (
    <div className="flex gap-4 p-4 bg-surface rounded-xl border border-border">
      <Link to={`/product/${item.product?.slug}`} className="shrink-0">
        <img src={getProductImage(item.product)} alt={item.product?.name} className="w-24 h-24 object-cover rounded-lg" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.product?.slug}`} className="font-medium text-text hover:text-primary-600 line-clamp-2">{item.product?.name}</Link>
        <p className="text-lg font-bold mt-1">{formatPrice(item.price)}</p>
        {!isSaved && (
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center border border-border rounded-lg">
              <button onClick={() => updateQuantity(item._id, item.quantity - 1).catch((e) => toast.error(e.message))} className="p-1.5 hover:bg-surface-tertiary" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
              <span className="px-3 text-sm font-medium">{item.quantity}</span>
              <button onClick={() => updateQuantity(item._id, item.quantity + 1).catch((e) => toast.error(e.message))} className="p-1.5 hover:bg-surface-tertiary" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
            </div>
            <button onClick={() => saveForLater(item._id).then(() => toast.success('Saved for later')).catch((e) => toast.error(e.message))} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              <Bookmark className="h-3.5 w-3.5" /> Save for later
            </button>
            <button onClick={() => removeItem(item._id).then(() => toast.success('Removed')).catch((e) => toast.error(e.message))} className="p-1.5 text-error hover:bg-red-50 rounded-lg" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
          </div>
        )}
        {isSaved && (
          <Button size="sm" variant="outline" className="mt-3" onClick={() => moveToCart(item._id).then(() => toast.success('Moved to cart')).catch((e) => toast.error(e.message))}>
            Move to Cart
          </Button>
        )}
      </div>
      {!isSaved && <p className="font-bold shrink-0">{formatPrice(item.price * item.quantity)}</p>}
    </div>
  );

  return (
    <div className="container-narrow py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-bold text-text mb-8">Shopping Cart</h1>

      {loading ? (
        <ProductGridSkeleton count={2} />
      ) : items.length === 0 && saved.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="Your cart is empty" description="Looks like you haven't added anything yet." actionLabel="Continue Shopping" onAction={() => window.location.href = '/shop'} />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {items.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-text">Cart Items ({items.length})</h2>
                {items.map((item) => <CartItem key={item._id} item={item} />)}
              </div>
            )}
            {saved.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-text-muted">Saved for Later ({saved.length})</h2>
                {saved.map((item) => <CartItem key={item._id} item={item} isSaved />)}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-surface rounded-2xl border border-border p-6 sticky top-24 space-y-4">
                <h3 className="font-semibold text-lg">Order Summary</h3>

                <div className="flex gap-2">
                  <input value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} placeholder="Coupon code" className="flex-1 px-3 py-2 border border-border rounded-lg text-sm" />
                  <Button size="sm" onClick={handleApplyCoupon} loading={couponLoading} icon={Tag}>Apply</Button>
                </div>
                {cart?.couponCode && (
                  <div className="flex items-center justify-between text-xs">
                    <p className="text-success">Coupon {cart.couponCode} applied</p>
                    <button type="button" onClick={handleRemoveCoupon} className="text-error hover:underline" disabled={couponLoading}>
                      Remove
                    </button>
                  </div>
                )}

                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between"><span className="text-text-muted">Subtotal</span><span>{formatPrice(summary.itemsPrice)}</span></div>
                  {summary.discountPrice > 0 && <div className="flex justify-between text-success"><span>Coupon Discount</span><span>-{formatPrice(summary.discountPrice)}</span></div>}
                  <div className="flex justify-between"><span className="text-text-muted">Delivery</span><span>{summary.shippingPrice === 0 ? 'Free' : formatPrice(summary.shippingPrice)}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Tax (18% GST)</span><span>{formatPrice(summary.taxPrice)}</span></div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                    <span>Total</span><span>{formatPrice(summary.totalPrice)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="block"><Button size="lg" className="w-full">Proceed to Checkout</Button></Link>
                <Link to="/shop" className="block text-center text-sm text-primary-600 hover:underline">Continue Shopping</Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;
