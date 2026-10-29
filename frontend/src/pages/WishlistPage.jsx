import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const WishlistPage = () => {
  const { wishlist, loading, fetchWishlist, moveToCart } = useWishlist();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const products = wishlist?.products || [];

  const handleMoveToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.warning('Please log in to move wishlist items to cart');
      return;
    }

    try {
      await moveToCart(productId);
      toast.success('Moved to cart');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container-narrow py-8 lg:py-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-7 w-7 text-red-500" />
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text">My Wishlist</h1>
          <p className="text-text-muted">{products.length} saved items</p>
        </div>
      </div>

      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" description="Save items you love and come back to them anytime." actionLabel="Start Shopping" onAction={() => window.location.href = '/shop'} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p, i) => (
            <div key={p._id}>
              <ProductCard product={p} index={i} />
              <Button size="sm" className="w-full mt-2" icon={ShoppingCart} onClick={() => handleMoveToCart(p._id)}>Move to Cart</Button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default WishlistPage;
