import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Package, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ErrorState from '../components/ui/ErrorState';
import { orderService } from '../services';
import { formatPrice, getProductImage } from '../utils/helpers';
import { downloadInvoice } from '../utils/invoice';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    orderService.getById(id)
      .then(async (orderRes) => {
        const ord = orderRes.data.data.order || orderRes.data.data;
        setOrder(ord);
        try {
          const invoiceRes = await orderService.getInvoice(id);
          setInvoice(invoiceRes.data.data);
        } catch {
          setInvoice(null);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container-narrow py-16 text-center"><div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  if (error) return <ErrorState message={error} />;
  if (!order) return <ErrorState title="Order not found" />;

  const isPaid = order.paymentStatus === 'paid' || order.paymentMethod === 'cod';

  return (
    <div className="container-narrow py-12 lg:py-16">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-center mb-10">
        <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-text mb-2">
          {isPaid ? 'Payment Successful!' : 'Order Placed!'}
        </h1>
        <p className="text-text-muted">Thank you for shopping with NOVA MART</p>
      </motion.div>

      <div className="max-w-2xl mx-auto bg-surface border border-border rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div><p className="text-text-muted">Order Number</p><p className="font-mono font-medium">{order.orderNumber}</p></div>
          {order.invoiceNumber && <div><p className="text-text-muted">Invoice</p><p className="font-mono font-medium">{order.invoiceNumber}</p></div>}
          <div><p className="text-text-muted">Payment</p><Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>{order.paymentStatus}</Badge></div>
          <div><p className="text-text-muted">Total</p><p className="font-bold text-lg">{formatPrice(order.totalPrice)}</p></div>
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <img src={item.image || getProductImage(item.product)} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1"><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-text-muted">Qty: {item.quantity}</p></div>
              <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center pt-4">
          {invoice && (
            <Button icon={Download} onClick={() => downloadInvoice(invoice)}>Download Invoice</Button>
          )}
          <Link to={`/orders/${order._id}`}><Button variant="outline" icon={Package}>View Order</Button></Link>
          <Link to="/shop"><Button variant="ghost" icon={ArrowRight}>Continue Shopping</Button></Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
