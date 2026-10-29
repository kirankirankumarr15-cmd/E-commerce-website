import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { categoryService, productService } from '../../services';
import { SelectDropdown } from '../ui/Dropdown';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const ratingOptions = [
  { value: '', label: 'All Ratings' },
  { value: '4', label: '4★ & above' },
  { value: '3', label: '3★ & above' },
];

const ShopFilters = ({ onFilterChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filters = {
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    inStock: searchParams.get('inStock') || '',
    sort: searchParams.get('sort') || 'newest',
  };

  useEffect(() => {
    categoryService.getAll().then((r) => setCategories(r.data.data));
    productService.getBrands().then((r) => setBrands(r.data.data));
  }, []);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
    onFilterChange?.();
  };

  const clearFilters = () => {
    const search = searchParams.get('search');
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    setSearchParams(params);
  };

  const hasActiveFilters = filters.category || filters.brand || filters.minPrice || filters.maxPrice || filters.minRating || filters.inStock;

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-text mb-3">Category</h3>
        <div className="space-y-2">
          <button onClick={() => updateFilter('category', '')} className={`text-sm w-full text-left px-2 py-1 rounded ${!filters.category ? 'text-primary-600 font-medium' : 'text-text-muted hover:text-text'}`}>All Categories</button>
          {categories.map((c) => (
            <button key={c._id} onClick={() => updateFilter('category', c._id)} className={`text-sm w-full text-left px-2 py-1 rounded ${filters.category === c._id ? 'text-primary-600 font-medium' : 'text-text-muted hover:text-text'}`}>{c.name}</button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text mb-3">Brand</h3>
        <select value={filters.brand} onChange={(e) => updateFilter('brand', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
          <option value="">All Brands</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text mb-3">Price Range (₹)</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text mb-3">Rating</h3>
        <select value={filters.minRating} onChange={(e) => updateFilter('minRating', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
          {ratingOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={filters.inStock === 'true'} onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')} className="rounded text-primary-600" />
          In Stock Only
        </label>
      </div>

      {hasActiveFilters && (
        <button onClick={clearFilters} className="text-sm text-error hover:underline flex items-center gap-1">
          <X className="h-4 w-4" /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="flex items-center gap-3 mb-6 lg:hidden">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
        <SelectDropdown value={filters.sort} onChange={(v) => updateFilter('sort', v)} options={sortOptions} label="Sort" />
      </div>

      {mobileOpen && (
        <div className="lg:hidden mb-6 p-4 bg-surface border border-border rounded-xl">
          <FilterContent />
        </div>
      )}

      <div className="hidden lg:block">
        <FilterContent />
      </div>
    </>
  );
};

export { sortOptions };
export default ShopFilters;
