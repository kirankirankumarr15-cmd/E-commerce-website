import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import CategoryCard from '../components/common/CategoryCard';
import ShopFilters, { sortOptions } from '../components/common/ShopFilters';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { SelectDropdown } from '../components/ui/Dropdown';
import { productService, categoryService } from '../services';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const showCategories = searchParams.get('view') === 'categories';
  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    if (showCategories) {
      categoryService.getAll()
        .then((res) => setCategories(res.data.data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
      return;
    }

    const params = {
      page,
      limit: 12,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || undefined,
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      minRating: searchParams.get('minRating') || undefined,
      inStock: searchParams.get('inStock') || undefined,
      isDeal: searchParams.get('deals') === 'true' ? 'true' : undefined,
      isNewArrival: searchParams.get('new') === 'true' ? 'true' : undefined,
      isBestSeller: searchParams.get('bestsellers') === 'true' ? 'true' : undefined,
    };

    setLoading(true);
    productService.getAll(params)
      .then((res) => {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams, showCategories, page]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTitle = () => {
    if (showCategories) return 'All Categories';
    if (searchParams.get('deals') === 'true') return 'Hot Deals';
    if (searchParams.get('new') === 'true') return 'New Arrivals';
    if (searchParams.get('bestsellers') === 'true') return 'Best Sellers';
    if (searchParams.get('search')) return `Results for "${searchParams.get('search')}"`;
    return 'Shop All Products';
  };

  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="container-narrow py-8 lg:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text">{getTitle()}</h1>
          {!showCategories && pagination.total > 0 && (
            <p className="text-text-muted mt-1">{pagination.total} products found</p>
          )}
        </div>
        {!showCategories && (
          <div className="hidden lg:block">
            <SelectDropdown
              value={searchParams.get('sort') || 'newest'}
              onChange={(v) => {
                const params = new URLSearchParams(searchParams);
                params.set('sort', v);
                params.delete('page');
                setSearchParams(params);
              }}
              options={sortOptions}
              label="Sort"
            />
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {!showCategories && (
          <aside className="lg:col-span-1">
            <ShopFilters />
          </aside>
        )}

        <div className={showCategories ? 'col-span-full' : 'lg:col-span-3'}>
          {loading ? (
            <ProductGridSkeleton />
          ) : showCategories ? (
            categories.length === 0 ? (
              <EmptyState title="No categories found" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {categories.map((cat, i) => <CategoryCard key={cat._id} category={cat} index={i} />)}
              </div>
            )
          ) : products.length === 0 ? (
            <EmptyState title="No products found" description="Try adjusting your filters." actionLabel="Clear Filters" onAction={() => setSearchParams({})} />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
              <div className="mt-10">
                <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
