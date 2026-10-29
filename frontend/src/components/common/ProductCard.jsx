import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatPrice, getProductImage } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { useState } from 'react';

const ProductCard = ({ product, index = 0 }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const [wishAnimating, setWishAnimating] = useState(false);

  const image = getProductImage(product);
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    try {
      await addToCart(product);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishAnimating(true);
    try {
      await toggleWishlist(product);
      toast.success(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTimeout(() => setWishAnimating(false), 300);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="group block bg-surface rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div className="relative aspect-square overflow-hidden bg-surface-secondary">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.discount > 0 && (
            <Badge variant="deal" className="absolute top-3 left-3">
              -{product.discount}%
            </Badge>
          )}
          {product.isNewArrival && (
            <Badge variant="new" className="absolute top-3 right-3">
              New
            </Badge>
          )}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileTap={{ scale: 0.9 }}
              animate={wishAnimating ? { scale: [1, 1.3, 1] } : {}}
              onClick={handleWishlist}
              className="p-2 bg-surface rounded-full shadow-md hover:bg-surface-secondary transition-colors"
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-text-muted'}`}
              />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="p-2 bg-primary-600 rounded-full shadow-md hover:bg-primary-700 transition-colors disabled:opacity-50"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4 text-white" />
            </motion.button>
          </div>
        </div>

        <div className="p-4">
          {product.brand && (
            <p className="text-xs text-text-muted uppercase tracking-wide mb-1">{product.brand}</p>
          )}
          <h3 className="text-sm font-medium text-text line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            <span className="text-xs text-text-muted">
              {product.rating} ({product.numReviews || 0})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-text">{formatPrice(product.finalPrice)}</span>
            {product.discount > 0 && (
              <span className="text-sm text-text-muted line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
