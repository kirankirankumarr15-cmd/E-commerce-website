import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Truck, Shield, ChevronRight, Minus, Plus, Zap } from 'lucide-react';
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
  const { isAuthenticated } = useAuth();
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
  const recentlyViewed = getRecentlyViewed().filter((p) => p.slug !== slug);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productService.getBySlug(slug);
        setProduct(data.data);
        addRecentlyViewed(data.data);
        const [rel, freq] = await Promise.all([
          productService.getRelated(slug),
          productService.getFrequentlyBought(slug),
        ]);
        setRelated(rel.data.data);
        setFrequentlyBought(freq.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async (buyNow = false) => {
    if (!isAuthenticated) { toast.warning('Please log in'); return; }
    setAdding(true);
    try {
      await addToCart(product._id, quantity);
      toast.success(buyNow ? 'Proceeding to checkout...' : 'Added to cart');
      if (buyNow) navigate('/checkout');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.warning('Please log in'); return; }
    try {
      await toggleWishlist(product._id);
      toast.success(isInWishlist(product._id) ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="container-narrow py-12"><ProductGridSkeleton count={1} /></div>;
  if (error) return <ErrorState message={error} />;
  if (!product) return <ErrorState title="Product not found" />;

  const images = product.images?.length ? product.images : [{ url: getProductImage(product), alt: product.name }];
  const inWishlist = isInWishlist(product._id);
  const specs = product.specifications || {};

  return (
    <div className="container-narrow py-8 lg:py-12">
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-8" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/shop" className="hover:text-primary-600">Shop</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-text font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <ImageZoom src={images[selectedImage]?.url} alt={images[selectedImage]?.alt || product.name} className="aspect-square bg-surface-secondary rounded-2xl mb-4" />
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === i ? 'border-primary-600' : 'border-transparent'}`} aria-label={`View image ${i + 1}`}>
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.brand && <p className="text-sm text-text-muted uppercase tracking-wide mb-2">{product.brand}</p>}
          <h1 className="text-2xl lg:text-3xl font-bold text-text mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-text-muted">({product.numReviews} reviews)</span>
            </div>
            {product.discount > 0 && <Badge variant="deal">-{product.discount}%</Badge>}
            {product.sku && <span className="text-xs text-text-muted">SKU: {product.sku}</span>}
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-text">{formatPrice(product.finalPrice)}</span>
            {product.discount > 0 && <span className="text-lg text-text-muted line-through">{formatPrice(product.price)}</span>}
          </div>

          <p className="text-text-muted leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border border-border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-surface-tertiary" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
              <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 hover:bg-surface-tertiary" aria-label="Increase"><Plus className="h-4 w-4" /></button>
            </div>
            <span className={`text-sm ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <Button size="lg" onClick={() => handleAddToCart(false)} loading={adding} disabled={product.stock === 0} icon={ShoppingCart}>Add to Cart</Button>
            <Button size="lg" variant="secondary" onClick={() => handleAddToCart(true)} disabled={product.stock === 0} icon={Zap}>Buy Now</Button>
            <Button size="lg" variant="outline" onClick={handleWishlist} icon={Heart} className={inWishlist ? 'text-red-500 border-red-300' : ''}>
              {inWishlist ? 'Saved' : 'Wishlist'}
            </Button>
          </div>

          <div className="p-4 bg-surface-secondary rounded-xl space-y-3 text-sm">
            <div className="flex items-center gap-3"><Truck className="h-5 w-5 text-primary-600 shrink-0" /><div><p className="font-medium">Free delivery on orders above ₹999</p><p className="text-text-muted">Standard: 5-7 days · Express: 1-2 days</p></div></div>
            <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-primary-600 shrink-0" /><span>7-day easy returns · Secure checkout</span></div>
          </div>

          {Object.keys(specs).length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-4">Specifications</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 bg-surface-secondary rounded-lg text-sm">
                    <dt className="text-text-muted">{key}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      <ProductReviews productSlug={slug} productId={product._id} />

      {frequentlyBought.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Frequently Bought Together</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {frequentlyBought.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </div>
      )}

      {recentlyViewed.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recentlyViewed.slice(0, 4).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
