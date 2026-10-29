import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { categoryService, productService } from '../services';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await categoryService.getBySlug(slug);
        setCategory(catRes.data.data);
        const prodRes = await productService.getAll({ category: catRes.data.data._id, page, limit: 12 });
        setProducts(prodRes.data.data);
        setPagination(prodRes.data.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, page]);

  if (error) return <ErrorState message={error} />;
  if (!loading && !category) return <EmptyState title="Category not found" />;

  return (
    <div>
      {category && (
        <div className="relative h-48 lg:h-64 bg-surface-secondary overflow-hidden">
          {category.image && (
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container-narrow pb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white">{category.name}</h1>
            {category.description && (
              <p className="text-white/80 mt-2 max-w-xl">{category.description}</p>
            )}
          </div>
        </div>
      )}

      <div className="container-narrow py-8 lg:py-12">
        {loading ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <EmptyState title="No products in this category" description="Check back soon for new arrivals." />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
            <div className="mt-10">
              <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
