import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Package, Download, ChevronLeft, MapPin, Truck, CreditCard, XCircle, RotateCcw } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ErrorState from '../components/ui/ErrorState';
import { orderService } from '../services';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { formatPrice, getProductImage } from '../utils/helpers';
import { downloadInvoice } from '../utils/invoice';

const statusColors = {
  pending: 'warning', confirmed: 'primary', packed: 'primary',
  shipped: 'primary', out_for_delivery: 'primary', delivered: 'success', cancelled: 'error',
};

const TRACK_STEPS = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

const OrderStatusTracker = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-error font-medium">
        This order was cancelled
      </div>
    );
  }

  const currentIdx = TRACK_STEPS.findIndex((s) => s.key === status);

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h2 className="font-semibold mb-6">Order Tracking</h2>
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
        {TRACK_STEPS.map((step, i) => {
          const done = i <= currentIdx;
          return (
            <div key={step.key} className="flex sm:flex-col items-center sm:flex-1 gap-3 sm:gap-2">
              <div className="flex items-center w-full sm:flex-col sm:w-auto gap-3 sm:gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done ? 'bg-primary-600 text-white' : 'bg-surface-tertiary text-text-muted'}`}>
                  {i + 1}
                </div>
                {i < TRACK_STEPS.length - 1 && (
                  <div className={`hidden sm:block h-0.5 w-full absolute ${done && i < currentIdx ? 'bg-primary-600' : 'bg-border'}`} style={{ display: 'none' }} />
                )}
                <span className={`text-xs sm:text-center ${done ? 'text-text font-medium' : 'text-text-muted'}`}>{step.label}</span>
              </div>
              {i < TRACK_STEPS.length - 1 && (
                <div className={`sm:hidden w-0.5 h-4 ml-3.5 ${i < currentIdx ? 'bg-primary-600' : 'bg-border'}`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="hidden sm:flex mt-2 px-4">
        {TRACK_STEPS.slice(0, -1).map((step, i) => (
          <div key={step.key} className={`flex-1 h-0.5 ${i < currentIdx ? 'bg-primary-600' : 'bg-border'}`} />
        ))}
      </div>
    </div>
  );
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchCart } = useCart();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadOrder = () => {
    setLoading(true);
    orderService.getById(id)
      .then((res) => {
        setOrder(res.data.data.order || res.data.data);
        setPayment(res.data.data.payment);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrder(); }, [id]);

  const handleDownloadInvoice = async () => {
    try {
      const res = await orderService.getInvoice(id);
      downloadInvoice(res.data.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setActionLoading(true);
    try {
      const res = await orderService.cancel(id);
      setOrder(res.data.data);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReorder = async () => {
    setActionLoading(true);
    try {
      const res = await orderService.reorder(id);
      await fetchCart();
      toast.success(res.data.message);
      if (res.data.data.added?.length) navigate('/cart');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="container-narrow py-16 text-center"><div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  if (error) return <ErrorState message={error} />;
  if (!order) return <ErrorState title="Order not found" />;

  const canCancel = ['pending', 'confirmed', 'packed'].includes(order.orderStatus);

  return (
    <div className="container-narrow py-8 lg:py-12">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary-600 mb-6">
        <ChevronLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Order #{order.orderNumber}</h1>
          <p className="text-text-muted text-sm">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={statusColors[order.orderStatus] || 'default'}>
            {order.orderStatus.replace(/_/g, ' ')}
          </Badge>
          <Badge variant={order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'failed' || order.paymentStatus === 'cancelled' ? 'error' : 'warning'}>
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="mb-6">
        <OrderStatusTracker status={order.orderStatus} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Package className="h-5 w-5 text-primary-600" /> Items</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <img src={item.image || getProductImage(item.product)} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-text-muted">Qty: {item.quantity} · {formatPrice(item.price)} each</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><MapPin className="h-5 w-5 text-primary-600" /> Shipping Address</h2>
            <p className="text-sm text-text-muted">
              {order.shippingAddress?.fullName}<br />
              {order.shippingAddress?.street}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
              Phone: {order.shippingAddress?.phone}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-muted">Subtotal</span><span>{formatPrice(order.itemsPrice)}</span></div>
              {order.discountPrice > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{formatPrice(order.discountPrice)}</span></div>}
              <div className="flex justify-between"><span className="text-text-muted">Delivery</span><span>{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Tax</span><span>{formatPrice(order.taxPrice)}</span></div>
              <div className="border-t border-border pt-2 flex justify-between font-bold"><span>Total</span><span>{formatPrice(order.totalPrice)}</span></div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 text-sm space-y-2">
            <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary-600" /><span className="capitalize">{order.deliveryOption} delivery</span></div>
            <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary-600" /><span className="capitalize">{order.paymentMethod}</span></div>
            {order.paymentReference && <p className="text-text-muted">Ref: {order.paymentReference}</p>}
            {payment?.razorpayOrderId && <p className="text-text-muted text-xs">Razorpay: {payment.razorpayOrderId}</p>}
          </div>

          <div className="space-y-2">
            {order.invoiceNumber && (
              <Button className="w-full" icon={Download} onClick={handleDownloadInvoice}>Download Invoice</Button>
            )}
            <Button className="w-full" variant="outline" icon={RotateCcw} loading={actionLoading} onClick={handleReorder}>
              Reorder
            </Button>
            {canCancel && (
              <Button className="w-full" variant="danger" icon={XCircle} loading={actionLoading} onClick={handleCancel}>
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
