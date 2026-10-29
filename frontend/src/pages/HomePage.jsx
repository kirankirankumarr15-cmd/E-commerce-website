import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/home/Hero';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Reviews from '../components/home/Reviews';
import WhatsAppCTA from '../components/home/WhatsAppCTA';
import Newsletter from '../components/home/Newsletter';
import ProductSection from '../components/common/ProductSection';
import ProductCard from '../components/common/ProductCard';
import CategoryCard from '../components/common/CategoryCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import Button from '../components/ui/Button';
import { categoryService, productService } from '../services';
import { getRecentlyViewed } from '../utils/helpers';

const HomePage = () => {
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
        setCategories(catRes.data.data);
        setTrending(trendRes.data.data);
        setBestSellers(bestRes.data.data);
        setDeals(dealRes.data.data);
        setNewArrivals(newRes.data.data);
        setFeatured(featRes.data.data);
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

  const ViewAllButton = ({ to }) => (
    <Link to={to}>
      <Button variant="ghost" className="text-primary-600">
        View All <ArrowRight className="h-4 w-4" />
      </Button>
    </Link>
  );

  return (
    <>
      <Hero />

      <ProductSection title="Featured Categories" subtitle="Browse by category">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-surface-tertiary rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <CategoryCard key={cat._id} category={cat} index={i} />
            ))}
          </div>
        )}
      </ProductSection>

      <ProductSection title="Trending Products" subtitle="What everyone is buying" action={<ViewAllButton to="/shop?sort=rating" />}>
        {loading ? <ProductGridSkeleton count={4} /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {trending.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </ProductSection>

      <ProductSection title="Best Sellers" subtitle="Customer favorites" action={<ViewAllButton to="/shop?bestsellers=true" />}>
        {loading ? <ProductGridSkeleton count={4} /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </ProductSection>

      <ProductSection title="Hot Deals" subtitle="Limited time offers" action={<ViewAllButton to="/shop?deals=true" />}>
        {loading ? <ProductGridSkeleton count={4} /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {deals.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </ProductSection>

      <ProductSection title="New Arrivals" subtitle="Fresh picks just for you" action={<ViewAllButton to="/shop?new=true" />}>
        {loading ? <ProductGridSkeleton count={4} /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </ProductSection>

      <ProductSection title="Recommended For You" subtitle="Handpicked selections" action={<ViewAllButton to="/shop" />}>
        {loading ? <ProductGridSkeleton count={4} /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </ProductSection>

      {recentlyViewed.length > 0 && (
        <ProductSection title="Recently Viewed" subtitle="Pick up where you left off">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {recentlyViewed.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </ProductSection>
      )}

      <WhyChooseUs />
      <Reviews />
      <WhatsAppCTA />
      <Newsletter />
    </>
  );
};

export default HomePage;
