import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Clock, ShieldCheck, Truck, RotateCcw, Award, ChevronRight, User } from 'lucide-react';
import Hero from '../components/home/Hero';
import ProductCard from '../components/common/ProductCard';
import CategoryCard from '../components/common/CategoryCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import { categoryService, productService } from '../services';
import { getRecentlyViewed, formatPrice } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const recentlyViewed = getRecentlyViewed();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, trendRes, bestRes, dealRes, newRes, featRes] = await Promise.all([
          categoryService.getAll(),
          productService.getTrending(),
          productService.getBestSellers(),
          productService.getDeals(),
          productService.getNewArrivals(),
          productService.getFeatured(),
        ]);
        setCategories(catRes.data.data || []);
        setTrending(trendRes.data.data || []);
        setBestSellers(bestRes.data.data || []);
        setDeals(dealRes.data.data || []);
        setNewArrivals(newRes.data.data || []);
        setFeatured(featRes.data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="bg-[#eaeded] min-h-screen pb-12">
      {/* 1. Amazon Top Hero Banner Carousel */}
      <Hero />

      {/* 2. Amazon 4-Card Quad Grid (Overlaps the hero bottom) */}
      <div className="container-narrow relative z-20 -mt-10 sm:-mt-20 md:-mt-28 lg:-mt-36 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Electronics */}
          <div className="bg-white p-4 rounded-md shadow-sm border border-[#e0e0e0] flex flex-col justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0f1111] mb-3 leading-snug">
                Up to 60% off | Top tech & gadgets
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Link to="/category/electronics" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop"
                      alt="Earbuds"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Wireless Audio</span>
                </Link>
                <Link to="/category/electronics" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"
                      alt="Smart Watches"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Smartwatches</span>
                </Link>
                <Link to="/category/electronics" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop"
                      alt="Fitness Trackers"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Fitness Bands</span>
                </Link>
                <Link to="/category/electronics" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop"
                      alt="Accessories"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Cables & Chargers</span>
                </Link>
              </div>
            </div>
            <Link to="/category/electronics" className="text-xs font-medium text-[#007185] hover:text-[#c7511f] hover:underline">
              See more deals
            </Link>
          </div>

          {/* Card 2: Fashion & Apparel */}
          <div className="bg-white p-4 rounded-md shadow-sm border border-[#e0e0e0] flex flex-col justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0f1111] mb-3 leading-snug">
                Revamp your style | Trending fashion
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Link to="/category/fashion" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&h=300&fit=crop"
                      alt="Clothing"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Men's Apparel</span>
                </Link>
                <Link to="/category/fashion" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop"
                      alt="Footwear"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Footwear</span>
                </Link>
                <Link to="/category/fashion" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&h=300&fit=crop"
                      alt="Watches"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Classic Watches</span>
                </Link>
                <Link to="/category/fashion" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop"
                      alt="Bags"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Bags & Luggage</span>
                </Link>
              </div>
            </div>
            <Link to="/category/fashion" className="text-xs font-medium text-[#007185] hover:text-[#c7511f] hover:underline">
              Explore fashion sale
            </Link>
          </div>

          {/* Card 3: Home & Living */}
          <div className="bg-white p-4 rounded-md shadow-sm border border-[#e0e0e0] flex flex-col justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0f1111] mb-3 leading-snug">
                Home Essentials | Up to 50% off
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Link to="/category/home-living" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop"
                      alt="Home Decor"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Living & Decor</span>
                </Link>
                <Link to="/category/home-living" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&h=300&fit=crop"
                      alt="Kitchen"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Kitchen & Dining</span>
                </Link>
                <Link to="/category/home-living" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop"
                      alt="Lighting"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Smart Lighting</span>
                </Link>
                <Link to="/category/home-living" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&h=300&fit=crop"
                      alt="Storage"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Storage Essentials</span>
                </Link>
              </div>
            </div>
            <Link to="/category/home-living" className="text-xs font-medium text-[#007185] hover:text-[#c7511f] hover:underline">
              Shop home collection
            </Link>
          </div>

          {/* Card 4: Sign-in Prompt or Personalized User Card */}
          <div className="bg-white p-4 rounded-md shadow-sm border border-[#e0e0e0] flex flex-col justify-between">
            {isAuthenticated ? (
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0f1111] mb-2 leading-snug">
                  Welcome back, {user?.firstName}!
                </h2>
                <p className="text-xs text-[#565959] mb-4">
                  Check your orders, deliveries and wishlist items anytime.
                </p>
                <div className="space-y-2 mb-4">
                  <Link
                    to="/orders"
                    className="flex items-center justify-between p-2.5 bg-[#f7fafa] hover:bg-[#ebf0f0] rounded border border-neutral-200 text-xs font-medium text-[#0f1111]"
                  >
                    <span>Your Orders & Scheduled Deliveries</span>
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center justify-between p-2.5 bg-[#f7fafa] hover:bg-[#ebf0f0] rounded border border-neutral-200 text-xs font-medium text-[#0f1111]"
                  >
                    <span>Your Wish List</span>
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center justify-between p-2.5 bg-[#f7fafa] hover:bg-[#ebf0f0] rounded border border-neutral-200 text-xs font-medium text-[#0f1111]"
                  >
                    <span>Manage Addresses & Settings</span>
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0f1111] mb-2 leading-snug">
                  Sign in for your best experience
                </h2>
                <p className="text-xs text-[#565959] mb-4">
                  Track orders, schedule deliveries at your doorstep, and enjoy personalized deals.
                </p>
                <Link
                  to="/login"
                  className="block w-full py-2 px-4 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-semibold text-xs text-center border border-[#fcd200] shadow-sm mb-3"
                >
                  Sign in securely
                </Link>
                <div className="pt-2 border-t border-neutral-100">
                  <span className="text-xs text-[#565959]">New customer? </span>
                  <Link to="/register" className="text-xs font-medium text-[#007185] hover:underline">
                    Start here.
                  </Link>
                </div>
              </div>
            )}
            <div className="p-3 bg-[#fff8e5] rounded border border-[#ffe082] mt-3">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#b45309]">
                <Clock className="h-4 w-4 shrink-0" />
                Scheduled 2-Hour Delivery Slots
              </span>
              <p className="text-[11px] text-[#78350f] mt-0.5">
                Pick your exact delivery window with handover OTP verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Today's Deals Carousel / Rail */}
      <div className="container-narrow mb-6">
        <div className="bg-white p-4 sm:p-5 rounded-md shadow-sm border border-[#e0e0e0]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="bg-[#cc0c39] text-white text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider flex items-center gap-1">
                <Zap className="h-3 w-3 fill-current" /> Deals of the Day
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#0f1111]">
                Today's Lightning Deals
              </h2>
            </div>
            <Link to="/shop?deals=true" className="text-xs sm:text-sm font-semibold text-[#007185] hover:text-[#c7511f] hover:underline">
              See all deals
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {deals.slice(0, 4).map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Best Sellers Rail */}
      <div className="container-narrow mb-6">
        <div className="bg-white p-4 sm:p-5 rounded-md shadow-sm border border-[#e0e0e0]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#e67a00]">Top Ranked</span>
              <h2 className="text-lg sm:text-xl font-bold text-[#0f1111]">
                Best Sellers in Store
              </h2>
            </div>
            <Link to="/shop?bestsellers=true" className="text-xs sm:text-sm font-semibold text-[#007185] hover:text-[#c7511f] hover:underline">
              View all best sellers
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {bestSellers.slice(0, 4).map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Amazon Fast Delivery & Prime Banner */}
      <div className="container-narrow mb-6">
        <div className="bg-gradient-to-r from-[#002f36] via-[#004f5a] to-[#007185] text-white p-6 rounded-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
              <Truck className="h-6 w-6 text-[#febd69]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-black italic tracking-tight text-[#00a8e1]">prime</span>
                <span className="bg-[#febd69] text-[#131921] text-[10px] font-black px-1.5 py-0.5 rounded uppercase">Fast Delivery</span>
              </div>
              <p className="text-sm text-neutral-100">
                Enjoy Free Next-Day Delivery & Scheduled 2-Hour Handover Slots with verified delivery codes.
              </p>
            </div>
          </div>
          <Link
            to="/shop"
            className="px-5 py-2.5 rounded-full bg-[#febd69] hover:bg-[#f3a847] text-[#131921] font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-sm"
          >
            Shop Prime Deals
          </Link>
        </div>
      </div>

      {/* 6. Trending Products */}
      <div className="container-narrow mb-6">
        <div className="bg-white p-4 sm:p-5 rounded-md shadow-sm border border-[#e0e0e0]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Popular Now</span>
              <h2 className="text-lg sm:text-xl font-bold text-[#0f1111]">
                Trending Right Now
              </h2>
            </div>
            <Link to="/shop?sort=rating" className="text-xs sm:text-sm font-semibold text-[#007185] hover:text-[#c7511f] hover:underline">
              Explore more
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {trending.slice(0, 4).map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 7. Explore Categories Strip */}
      <div className="container-narrow mb-6">
        <div className="bg-white p-4 sm:p-5 rounded-md shadow-sm border border-[#e0e0e0]">
          <h2 className="text-lg sm:text-xl font-bold text-[#0f1111] mb-4 pb-2 border-b border-neutral-100">
            Explore All Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat, i) => (
              <CategoryCard key={cat._id} category={cat} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* 8. Amazon Trust Badges Section */}
      <div className="container-narrow">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-md border border-[#e0e0e0] flex items-center gap-3">
            <Truck className="h-7 w-7 text-[#007185] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#0f1111]">Free Delivery</p>
              <p className="text-[11px] text-[#565959]">On all eligible orders</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md border border-[#e0e0e0] flex items-center gap-3">
            <RotateCcw className="h-7 w-7 text-[#007185] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#0f1111]">7 Days Replacement</p>
              <p className="text-[11px] text-[#565959]">Hassle-free returns</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md border border-[#e0e0e0] flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-[#007185] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#0f1111]">100% Secure Checkout</p>
              <p className="text-[11px] text-[#565959]">UPI, Cards, COD</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md border border-[#e0e0e0] flex items-center gap-3">
            <Clock className="h-7 w-7 text-[#007185] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#0f1111]">Scheduled Slots</p>
              <p className="text-[11px] text-[#565959]">4-digit OTP handover</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
