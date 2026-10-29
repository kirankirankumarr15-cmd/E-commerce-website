import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingBag, DollarSign, Clock } from 'lucide-react';
import Badge from '../components/ui/Badge';
import ErrorState from '../components/ui/ErrorState';
import Skeleton from '../components/ui/Skeleton';
import { orderService } from '../services';
import { formatPrice } from '../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([orderService.getStats(), orderService.getAll()])
      .then(([statsRes, ordersRes]) => {
        setStats(statsRes.data.data);
        setOrders(ordersRes.data.data.slice(0, 10));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: status } : o))
      );
    } catch {
      // handled by toast in production
    }
  };

  if (error) return <ErrorState message={error} />;

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: Package, color: 'text-primary-600 bg-primary-50' },
    { label: 'Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Active Products', value: stats?.totalProducts || 0, icon: ShoppingBag, color: 'text-secondary-600 bg-secondary-50' },
  ];

  return (
    <div className="container-narrow py-8 lg:py-12">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="h-7 w-7 text-primary-600" />
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text">Admin Dashboard</h1>
          <p className="text-text-muted">Manage your NOVA MART store</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-xl border border-border p-5"
          >
            {loading ? (
              <Skeleton className="h-20" />
            ) : (
              <>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-text">{card.value}</p>
                <p className="text-sm text-text-muted">{card.label}</p>
              </>
            )}
          </motion.div>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-text">Recent Orders</h2>
        </div>
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-secondary">
                  <th className="text-left px-6 py-3 font-medium text-text-muted">Order</th>
                  <th className="text-left px-6 py-3 font-medium text-text-muted">Customer</th>
                  <th className="text-left px-6 py-3 font-medium text-text-muted">Total</th>
                  <th className="text-left px-6 py-3 font-medium text-text-muted">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-border">
                    <td className="px-6 py-4 font-mono text-xs">{order.orderNumber}</td>
                    <td className="px-6 py-4">{order.user?.firstName} {order.user?.lastName}</td>
                    <td className="px-6 py-4 font-medium">{formatPrice(order.totalPrice)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={order.orderStatus === 'delivered' ? 'success' : order.orderStatus === 'cancelled' ? 'error' : 'warning'}>
                        {order.orderStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="text-xs border border-border rounded-lg px-2 py-1"
                      >
                        {['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
