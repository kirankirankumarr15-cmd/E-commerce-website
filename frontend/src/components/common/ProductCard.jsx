import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Check } from 'lucide-react';
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
      await addToCart(product._id, 1);
      toast.success('Added to Cart');
    } catch (err) {
      toast.error(err.message || 'Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishAnimating(true);
    try {
      await toggleWishlist(product._id);
      toast.success(inWishlist ? 'Removed from Wish List' : 'Added to Wish List');
    } catch (err) {
      toast.error(err.message || 'Please log in to save items');
    } finally {
      setTimeout(() => setWishAnimating(false), 300);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.25 }}
      className="h-full"
    >
      <div className="group h-full flex flex-col bg-white rounded-md border border-[#e0e0e0] hover:border-[#b8b8b8] hover:shadow-md transition-all duration-200 overflow-hidden relative p-3 sm:p-4">
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/90 hover:bg-neutral-100 text-[#565959] hover:text-[#cc0c39] shadow-sm transition-colors cursor-pointer"
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`h-4 w-4 ${inWishlist ? 'fill-[#cc0c39] text-[#cc0c39]' : 'text-[#565959]'}`}
          />
        </button>

        {/* Product Image */}
        <Link to={`/product/${product.slug}`} className="block relative aspect-square mb-3 overflow-hidden bg-white flex items-center justify-center">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />

          {/* Amazon Deal Badge */}
          {product.discount >= 15 && (
            <div className="absolute top-1 left-1">
              <span className="bg-[#cc0c39] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                {product.discount}% off
              </span>
            </div>
          )}
          {product.isBestSeller && product.discount < 15 && (
            <div className="absolute top-1 left-1">
              <span className="bg-[#e67a00] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                Best Seller
              </span>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {product.brand && (
            <span className="text-[11px] font-medium text-[#565959] uppercase tracking-wider mb-0.5">
              {product.brand}
            </span>
          )}

          <Link
            to={`/product/${product.slug}`}
            className="text-xs sm:text-sm font-medium text-[#0f1111] hover:text-[#c7511f] line-clamp-2 leading-snug mb-1.5"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Star Rating & Review Count */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating || 4.5)
                      ? 'fill-[#de7921] text-[#de7921]'
                      : 'text-neutral-300 fill-neutral-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-[#007185] hover:underline cursor-pointer">
              {product.numReviews || Math.floor(120 + (product.price % 300))}
            </span>
          </div>

          {/* Amazon Pricing Section */}
          <div className="mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-medium text-[#0f1111] -mt-1">₹</span>
              <span className="text-lg sm:text-xl font-bold text-[#0f1111] leading-none">
                {Number(product.finalPrice || product.price).toLocaleString('en-IN')}
              </span>
              {product.discount > 0 && (
                <span className="text-xs text-[#565959] line-through ml-1">
                  M.R.P: ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="text-[11px] text-[#cc0c39] font-medium block mt-0.5">
                Save ₹{Number(product.price - product.finalPrice).toLocaleString('en-IN')} ({product.discount}%)
              </span>
            )}
          </div>

          {/* Prime & Delivery Assurance */}
          <div className="mt-auto pt-1 mb-3 text-xs text-[#565959] space-y-0.5">
            <div className="flex items-center gap-1">
              <span className="font-black italic text-[#00a8e1] tracking-tighter text-sm">
                prime
              </span>
              <Check className="h-3 w-3 text-[#00a8e1] stroke-[3] -ml-0.5" />
              <span className="font-semibold text-[#0f1111]">FREE Delivery</span>
            </div>
            <p className="text-[11px]">Get it by <strong className="text-[#0f1111]">Tomorrow, 2 PM</strong></p>
          </div>

          {/* Amazon Yellow Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="w-full py-1.5 px-3 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-[#0f1111] text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>{adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
