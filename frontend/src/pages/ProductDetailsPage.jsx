import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Heart, ShoppingCart, Truck, ShieldCheck, ChevronRight,
  Minus, Plus, Zap, Check, Lock, MapPin, Tag, Share2, Award, Clock, ArrowRight
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ImageZoom from '../components/common/ImageZoom';
import ProductReviews from '../components/common/ProductReviews';
import ProductCard from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import { productService } from '../services';
import { formatPrice, getProductImage, addRecentlyViewed, getRecentlyViewed } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [frequentlyBought, setFrequentlyBought] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const recentlyViewed = getRecentlyViewed().filter((p) => p.slug !== slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const { data } = await productService.getBySlug(slug);
        setProduct(data.data);
        addRecentlyViewed(data.data);
        const [rel, freq] = await Promise.all([
          productService.getRelated(slug),
          productService.getFrequentlyBought(slug),
        ]);
        setRelated(rel.data.data || []);
        setFrequentlyBought(freq.data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async (buyNow = false) => {
    if (buyNow) setBuyingNow(true);
    else setAdding(true);

    try {
      await addToCart(product._id, quantity);
      toast.success(buyNow ? 'Redirecting to checkout...' : 'Added to Cart');
      if (buyNow) navigate('/checkout');
    } catch (err) {
      toast.error(err.message || 'Could not add to cart');
    } finally {
      setAdding(false);
      setBuyingNow(false);
    }
  };

  const handleWishlist = async () => {
    try {
      await toggleWishlist(product._id);
      toast.success(isInWishlist(product._id) ? 'Removed from Wish List' : 'Added to Wish List');
    } catch (err) {
      toast.error(err.message || 'Please log in to manage Wish List');
    }
  };

  if (loading) return <div className="container-narrow py-12"><ProductGridSkeleton count={1} /></div>;
  if (error) return <ErrorState message={error} />;
  if (!product) return <ErrorState title="Product not found" />;

  const images = product.images?.length ? product.images : [{ url: getProductImage(product), alt: product.name }];
  const inWishlist = isInWishlist(product._id);
  const specs = product.specifications || {};
  const primaryAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const userPincode = primaryAddress?.postalCode || '560001';
  const userCity = primaryAddress?.city || 'Bangalore';

  return (
    <div className="bg-[#eaeded] min-h-screen py-4 sm:py-6">
      <div className="container-narrow">
        {/* Amazon-style Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#565959] mb-4 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#c7511f]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-[#c7511f]">Products</Link>
          {product.category?.name && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link to={`/category/${product.category.slug}`} className="hover:text-[#c7511f]">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#0f1111] font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Amazon 3-Column PDP Container */}
        <div className="bg-white rounded-md border border-[#e0e0e0] p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Column 1: Image Gallery (4 cols) */}
            <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-3">
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[460px] shrink-0">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onMouseEnter={() => setSelectedImage(i)}
                      onClick={() => setSelectedImage(i)}
                      className={`w-14 h-14 rounded border p-1 bg-white cursor-pointer transition-all ${
                        selectedImage === i ? 'border-[#e77600] ring-1 ring-[#e77600]' : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                      aria-label={`Thumbnail ${i + 1}`}
                    >
                      <img src={img.url} alt={img.alt} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image with Zoom */}
              <div className="flex-1 relative aspect-square bg-white rounded flex items-center justify-center p-4 border border-neutral-100">
                <ImageZoom
                  src={images[selectedImage]?.url}
                  alt={images[selectedImage]?.alt || product.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Column 2: Product Information & Offers (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Brand Link */}
              {product.brand && (
                <Link
                  to={`/shop?brand=${encodeURIComponent(product.brand)}`}
                  className="text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline uppercase tracking-wide block"
                >
                  Visit the {product.brand} Store
                </Link>
              )}

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-medium text-[#0f1111] leading-snug">
                {product.name}
              </h1>

              {/* Amazon's Choice / Best Seller Badge */}
              <div className="flex flex-wrap items-center gap-2">
                {product.isBestSeller && (
                  <span className="bg-[#e67a00] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    #1 Best Seller
                  </span>
                )}
                <span className="bg-[#232f3e] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1">
                  <span className="text-[#febd69]">Nova's</span> Choice
                </span>
                <span className="text-xs text-[#565959]">in {product.category?.name || 'Store'}</span>
              </div>

              {/* Ratings & Reviews */}
              <div className="flex items-center gap-2 pt-1 border-b border-neutral-200 pb-3">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 4.5)
                          ? 'fill-[#de7921] text-[#de7921]'
                          : 'text-neutral-300 fill-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#0f1111]">{product.rating}</span>
                <span className="text-xs text-neutral-400">|</span>
                <span className="text-xs text-[#007185] hover:underline cursor-pointer">
                  {product.numReviews || 248} ratings
                </span>
                <span className="text-xs text-neutral-400">|</span>
                <span className="text-xs text-[#565959]">50+ bought in past month</span>
              </div>

              {/* Amazon Pricing Block */}
              <div className="space-y-1 pt-1">
                <div className="flex items-baseline gap-2">
                  {product.discount > 0 && (
                    <span className="text-2xl text-[#cc0c39] font-light">
                      -{product.discount}%
                    </span>
                  )}
                  <span className="text-sm font-semibold text-[#0f1111] -mt-2">₹</span>
                  <span className="text-3xl font-bold text-[#0f1111] leading-none">
                    {Number(product.finalPrice || product.price).toLocaleString('en-IN')}
                  </span>
                </div>

                {product.discount > 0 && (
                  <div className="text-xs text-[#565959]">
                    M.R.P.: <span className="line-through">₹{Number(product.price).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <p className="text-xs text-[#565959]">Inclusive of all taxes</p>
                <p className="text-xs text-[#0f1111] font-semibold pt-1">
                  EMI starts at <span className="text-[#007185]">₹194/month</span>. No Cost EMI available.
                </p>
              </div>

              {/* Amazon Offers Box */}
              <div className="border border-neutral-200 rounded-md p-3 bg-[#fcfcfc] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f1111]">
                  <Tag className="h-3.5 w-3.5 text-[#007185]" /> Offers & Promotions
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 border border-neutral-200 rounded bg-white">
                    <p className="font-bold text-[#0f1111]">Bank Offer</p>
                    <p className="text-[11px] text-[#565959] mt-0.5">Upto ₹1,000 discount on Select Cards</p>
                  </div>
                  <div className="p-2 border border-neutral-200 rounded bg-white">
                    <p className="font-bold text-[#0f1111]">Partner Offer</p>
                    <p className="text-[11px] text-[#565959] mt-0.5">Get GST invoice & save up to 28%</p>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div className="pt-2 border-t border-neutral-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f1111] mb-2">
                  About this item
                </h3>
                <p className="text-xs sm:text-sm text-[#0f1111] leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specs Table */}
              {Object.keys(specs).length > 0 && (
                <div className="pt-2 border-t border-neutral-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f1111] mb-2">
                    Specifications
                  </h3>
                  <table className="w-full text-xs text-left">
                    <tbody>
                      {Object.entries(specs).map(([k, v]) => (
                        <tr key={k} className="border-b border-neutral-100 last:border-0">
                          <td className="py-1.5 font-bold text-[#565959] w-1/3">{k}</td>
                          <td className="py-1.5 text-[#0f1111]">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Column 3: The Iconic Amazon Buy Box (3 cols) */}
            <div className="lg:col-span-3">
              <div className="border border-[#d5d9d9] rounded-lg p-4 bg-white shadow-sm space-y-3 sticky top-20">
                {/* Price Display in Buy Box */}
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-semibold text-[#0f1111]">₹</span>
                  <span className="text-2xl font-bold text-[#0f1111]">
                    {Number(product.finalPrice || product.price).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Delivery Date & Prime Promise */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black italic text-[#00a8e1] text-base">prime</span>
                    <span className="font-semibold text-[#0f1111]">FREE Delivery</span>
                  </div>
                  <p className="text-[#0f1111]">
                    Delivery by <strong className="text-[#007600]">Tomorrow, 2:00 PM</strong>
                  </p>
                  <p className="text-[#565959] text-[11px]">
                    Order within <strong className="text-[#cc0c39]">4 hrs 22 mins</strong>.
                  </p>
                </div>

                {/* Scheduled Handover Highlight */}
                <div className="p-2 bg-[#f0f8ff] border border-[#b8daff] rounded text-[11px] text-[#004085] flex items-center gap-1.5">
                  <Clock className="h-4 w-4 shrink-0 text-[#007185]" />
                  <span>Choose 2-hour scheduled slot & handover code after order.</span>
                </div>

                {/* Delivery Location Selector */}
                <div
                  onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
                  className="flex items-start gap-1.5 text-xs text-[#007185] hover:text-[#c7511f] cursor-pointer pt-1"
                >
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-neutral-600" />
                  <span className="line-clamp-2">
                    Deliver to {user?.firstName ? user.firstName : 'Customer'} - {userCity} {userPincode}
                  </span>
                </div>

                {/* In Stock Status */}
                <div>
                  <span className={`text-base font-bold ${product.stock > 0 ? 'text-[#007600]' : 'text-[#cc0c39]'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Currently Unavailable'}
                  </span>
                  {product.stock > 0 && product.stock <= 5 && (
                    <span className="text-xs text-[#cc0c39] font-medium block">
                      Only {product.stock} left in stock - order soon.
                    </span>
                  )}
                </div>

                {/* Quantity Dropdown */}
                {product.stock > 0 && (
                  <div className="flex items-center gap-2">
                    <label htmlFor="qty-select" className="text-xs text-[#565959] font-medium">Quantity:</label>
                    <select
                      id="qty-select"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="text-xs p-1.5 border border-[#d5d9d9] rounded bg-[#f0f2f2] hover:bg-[#e3e6e6] focus:outline-none focus:ring-1 focus:ring-[#e77600] cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5].slice(0, Math.min(5, product.stock)).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  {/* Yellow: Add to Cart */}
                  <button
                    onClick={() => handleAddToCart(false)}
                    disabled={adding || product.stock === 0}
                    className="w-full py-2 px-4 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-[#0f1111] text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{adding ? 'Adding...' : 'Add to Cart'}</span>
                  </button>

                  {/* Orange: Buy Now */}
                  <button
                    onClick={() => handleAddToCart(true)}
                    disabled={buyingNow || product.stock === 0}
                    className="w-full py-2 px-4 rounded-full bg-[#ffa41c] hover:bg-[#fa8900] active:bg-[#e67a00] border border-[#ff8f00] text-[#0f1111] text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <Zap className="h-4 w-4" />
                    <span>{buyingNow ? 'Processing...' : 'Buy Now'}</span>
                  </button>
                </div>

                {/* Security Guarantee & Fulfillment */}
                <div className="text-[11px] text-[#565959] space-y-1 pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-1.5 text-neutral-700">
                    <Lock className="h-3.5 w-3.5 text-neutral-500" />
                    <span>Secure transaction</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ships from</span>
                    <span className="font-medium text-[#0f1111]">Nova Mart Fulfillment</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sold by</span>
                    <span className="font-medium text-[#007185] hover:underline cursor-pointer">
                      Nova Retail Store (4.8 ★)
                    </span>
                  </div>
                </div>

                {/* Add to Wish List Button */}
                <button
                  onClick={handleWishlist}
                  className="w-full py-1.5 text-xs text-[#0f1111] bg-white border border-[#d5d9d9] hover:bg-[#f7fafa] rounded-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Heart className={`h-3.5 w-3.5 ${inWishlist ? 'fill-[#cc0c39] text-[#cc0c39]' : 'text-[#565959]'}`} />
                  <span>{inWishlist ? 'In your Wish List' : 'Add to Wish List'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-md border border-[#e0e0e0] p-4 sm:p-6 mb-6">
          <ProductReviews productSlug={slug} productId={product._id} />
        </div>

        {/* Frequently Bought Together */}
        {frequentlyBought.length > 0 && (
          <div className="bg-white rounded-md border border-[#e0e0e0] p-4 sm:p-6 mb-6">
            <h2 className="text-base sm:text-lg font-bold text-[#0f1111] mb-4 pb-2 border-b border-neutral-100">
              Frequently Bought Together
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {frequentlyBought.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div className="bg-white rounded-md border border-[#e0e0e0] p-4 sm:p-6 mb-6">
            <h2 className="text-base sm:text-lg font-bold text-[#0f1111] mb-4 pb-2 border-b border-neutral-100">
              Products Related to this Item
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {related.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="bg-white rounded-md border border-[#e0e0e0] p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-[#0f1111] mb-4 pb-2 border-b border-neutral-100">
              Your Recently Viewed Items
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {recentlyViewed.slice(0, 4).map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
