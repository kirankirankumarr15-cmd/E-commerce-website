import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight } from 'lucide-react';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { orderService } from '../services';
import { formatPrice } from '../utils/helpers';

const statusColors = {
  pending: 'warning',
  confirmed: 'primary',
  packed: 'primary',
  shipped: 'primary',
  out_for_delivery: 'primary',
  delivered: 'success',
  cancelled: 'error',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    orderService.getMyOrders()
      .then((res) => setOrders(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="container-narrow py-8 lg:py-12">
      <div className="flex items-center gap-3 mb-8">
        <Package className="h-7 w-7 text-primary-600" />
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text">My Orders</h1>
          <p className="text-text-muted">{orders.length} orders</p>
        </div>
      </div>

      {loading ? (
        <ProductGridSkeleton count={3} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="When you place an order, it will appear here."
          actionLabel="Start Shopping"
          onAction={() => window.location.href = '/shop'}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <p className="font-mono text-sm font-medium text-text">#{order.orderNumber}</p>
                  <p className="text-xs text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusColors[order.orderStatus] || 'default'}>
                    {order.orderStatus.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Badge>
                  <span className="font-bold text-text">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-muted">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''} · {order.paymentMethod.toUpperCase()}
                </p>
                <Link to={`/orders/${order._id}`} className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                  View Details <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
