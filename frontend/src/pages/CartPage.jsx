import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2, Bookmark, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, getProductImage } from '../utils/helpers';

const CartPage = () => {
  const { cart, pricing, loading, fetchCart, updateQuantity, removeItem, saveForLater, moveToCart, applyCoupon, removeCoupon } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCart();
  }, [fetchCart]);

  const items = cart?.items || [];
  const saved = cart?.savedForLater || [];

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      await applyCoupon(couponInput.trim());
      toast.success('Coupon applied successfully!');
      setCouponInput('');
    } catch (err) {
      toast.error(err.message || 'Invalid coupon code');
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

  const totalItemsCount = items.reduce((acc, it) => acc + (it.quantity || 1), 0);

  const summary = pricing || {
    itemsPrice: cart?.totalPrice || 0,
    discountPrice: 0,
    shippingPrice: (cart?.totalPrice || 0) > 499 ? 0 : 49,
    taxPrice: Math.round((cart?.totalPrice || 0) * 0.18),
    totalPrice: (cart?.totalPrice || 0) + ((cart?.totalPrice || 0) > 499 ? 0 : 49) + Math.round((cart?.totalPrice || 0) * 0.18),
  };

  return (
    <div className="bg-[#eaeded] min-h-screen py-6">
      <div className="container-narrow">
        {loading ? (
          <div className="bg-white p-6 rounded-md border border-[#e0e0e0]">
            <ProductGridSkeleton count={2} />
          </div>
        ) : items.length === 0 && saved.length === 0 ? (
          <div className="bg-white p-8 rounded-md border border-[#e0e0e0] text-center">
            <EmptyState
              icon={ShoppingCart}
              title="Your Amazon Cart is empty"
              description="Shop today's deals, electronics, fashion and more."
              actionLabel="Explore Today's Deals"
              onAction={() => navigate('/shop?deals=true')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Columns: Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {/* Amazon Free Delivery Progress Bar Banner */}
              <div className="bg-white p-4 rounded-md border border-[#e0e0e0] flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#007600] shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-[#007600]">
                    Your order qualifies for FREE Delivery.{' '}
                  </span>
                  <span className="text-[#565959]">
                    Select this option at checkout. Details
                  </span>
                </div>
              </div>

              {/* Main Items Box */}
              <div className="bg-white p-4 sm:p-6 rounded-md border border-[#e0e0e0]">
                <div className="flex items-end justify-between pb-3 border-b border-neutral-200 mb-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0f1111]">
                      Shopping Cart
                    </h1>
                    <span className="text-xs text-[#007185] hover:underline cursor-pointer">
                      Deselect all items
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#565959] hidden sm:block">
                    Price
                  </span>
                </div>

                {/* Items List */}
                <div className="divide-y divide-neutral-200">
                  {items.map((item) => (
                    <div key={item._id} className="py-4 flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <Link
                        to={`/product/${item.product?.slug}`}
                        className="shrink-0 aspect-square w-24 sm:w-28 bg-white border border-neutral-200 rounded p-1 flex items-center justify-center self-start"
                      >
                        <img
                          src={getProductImage(item.product)}
                          alt={item.product?.name}
                          className="w-full h-full object-contain"
                        />
                      </Link>

                      {/* Details & Controls */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/product/${item.product?.slug}`}
                            className="text-sm sm:text-base font-medium text-[#0f1111] hover:text-[#c7511f] line-clamp-2 leading-snug"
                          >
                            {item.product?.name}
                          </Link>
                          {/* Price on mobile */}
                          <span className="sm:hidden text-base font-bold text-[#0f1111]">
                            ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Stock & Delivery Tag */}
                        <div className="mt-1 space-y-0.5 text-xs">
                          <span className="text-[#007600] font-semibold block">In Stock</span>
                          <span className="text-[#565959] flex items-center gap-1">
                            Eligible for FREE Shipping · Handover OTP enabled
                          </span>
                        </div>

                        {/* Quantity and Actions Bar */}
                        <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 text-xs">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-[#d5d9d9] rounded bg-[#f0f2f2] shadow-sm">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1).catch((e) => toast.error(e.message))}
                              className="p-1 hover:bg-[#e3e6e6] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-3 font-semibold text-[#0f1111]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1).catch((e) => toast.error(e.message))}
                              className="p-1 hover:bg-[#e3e6e6] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <span className="text-neutral-300">|</span>

                          {/* Delete */}
                          <button
                            onClick={() => removeItem(item._id).then(() => toast.success('Removed from cart')).catch((e) => toast.error(e.message))}
                            className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer"
                          >
                            Delete
                          </button>

                          <span className="text-neutral-300">|</span>

                          {/* Save for Later */}
                          <button
                            onClick={() => saveForLater(item._id).then(() => toast.success('Saved for later')).catch((e) => toast.error(e.message))}
                            className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer"
                          >
                            Save for later
                          </button>

                          <span className="text-neutral-300">|</span>

                          {/* Share */}
                          <button
                            onClick={() => { navigator.clipboard?.writeText(window.location.origin + `/product/${item.product?.slug}`); toast.success('Product link copied!'); }}
                            className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer"
                          >
                            Share
                          </button>
                        </div>
                      </div>

                      {/* Desktop Price */}
                      <div className="hidden sm:block text-right shrink-0">
                        <span className="text-base font-bold text-[#0f1111]">
                          ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-xs text-[#565959]">
                            (₹{Number(item.price).toLocaleString('en-IN')} each)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal bottom line */}
                <div className="text-right pt-4 border-t border-neutral-200">
                  <span className="text-sm sm:text-base text-[#0f1111]">
                    Subtotal ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}):{' '}
                    <strong className="text-lg font-bold text-[#0f1111]">
                      ₹{Number(summary.itemsPrice).toLocaleString('en-IN')}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Saved for Later Section */}
              {saved.length > 0 && (
                <div className="bg-white p-4 sm:p-6 rounded-md border border-[#e0e0e0]">
                  <h2 className="text-lg font-bold text-[#0f1111] mb-4 pb-2 border-b border-neutral-200">
                    Saved for Later ({saved.length} {saved.length === 1 ? 'item' : 'items'})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {saved.map((item) => (
                      <div key={item._id} className="p-3 border border-neutral-200 rounded flex gap-3">
                        <img
                          src={getProductImage(item.product)}
                          alt={item.product?.name}
                          className="w-16 h-16 object-contain"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#0f1111] truncate">{item.product?.name}</p>
                          <p className="text-sm font-bold text-[#0f1111] mt-0.5">₹{Number(item.price).toLocaleString('en-IN')}</p>
                          <button
                            onClick={() => moveToCart(item._id).then(() => toast.success('Moved to Cart')).catch((e) => toast.error(e.message))}
                            className="mt-2 py-1 px-3 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] text-xs font-medium rounded-full border border-[#fcd200]"
                          >
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Columns: Amazon Checkout Summary */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-4 sm:p-5 rounded-md border border-[#e0e0e0] shadow-sm space-y-4">
                {/* Subtotal */}
                <div>
                  <span className="text-base text-[#0f1111]">
                    Subtotal ({totalItemsCount} items):{' '}
                    <strong className="text-xl font-bold text-[#0f1111] block sm:inline">
                      ₹{Number(summary.totalPrice).toLocaleString('en-IN')}
                    </strong>
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="gift" className="rounded text-[#e77600] focus:ring-[#e77600]" />
                    <label htmlFor="gift" className="text-xs text-[#0f1111]">This order contains a gift</label>
                  </div>
                </div>

                {/* Amazon Yellow CTA: Proceed to Buy */}
                <button
                  onClick={() => navigate('/checkout')}
                  disabled={items.length === 0}
                  className="w-full py-2.5 px-4 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-[#0f1111] font-bold text-sm shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  Proceed to Buy ({totalItemsCount} items)
                </button>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-neutral-100 text-xs space-y-1.5 text-[#565959]">
                  <div className="flex justify-between">
                    <span>Items Total:</span>
                    <span className="text-[#0f1111]">₹{Number(summary.itemsPrice).toLocaleString('en-IN')}</span>
                  </div>
                  {summary.discountPrice > 0 && (
                    <div className="flex justify-between text-[#cc0c39] font-medium">
                      <span>Promotion Discount:</span>
                      <span>-₹{Number(summary.discountPrice).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className={summary.shippingPrice === 0 ? 'text-[#007600] font-bold' : 'text-[#0f1111]'}>
                      {summary.shippingPrice === 0 ? 'FREE' : `₹${summary.shippingPrice}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated GST (18%):</span>
                    <span className="text-[#0f1111]">₹{Number(summary.taxPrice).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Promo / Coupon Box */}
                <div className="pt-3 border-t border-neutral-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-1.5 border border-[#d5d9d9] rounded text-xs uppercase focus:outline-none focus:ring-1 focus:ring-[#e77600]"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-3 py-1.5 bg-white border border-[#d5d9d9] hover:bg-[#f7fafa] text-xs font-semibold rounded text-[#0f1111] cursor-pointer disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {cart?.coupon && (
                    <div className="mt-2 flex items-center justify-between p-2 bg-[#f0f8ff] rounded text-xs text-[#007185]">
                      <span>Code <strong>{cart.coupon.code}</strong> applied</span>
                      <button onClick={handleRemoveCoupon} className="text-[#cc0c39] hover:underline">Remove</button>
                    </div>
                  )}
                </div>

                {/* Trust Guarantee */}
                <div className="pt-3 border-t border-neutral-100 flex items-center gap-2 text-xs text-[#565959]">
                  <ShieldCheck className="h-4 w-4 text-[#007600] shrink-0" />
                  <span>Safe and Secure Payments. 100% Authentic Products.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
