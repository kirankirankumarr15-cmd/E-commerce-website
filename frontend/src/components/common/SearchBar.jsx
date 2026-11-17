import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../../services';
import { formatPrice } from '../../utils/helpers';
import { useDebounce } from '../../hooks/useDebounce';

const departments = [
  { label: 'All Categories', value: '' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Home & Living', value: 'home-living' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Sports', value: 'sports' },
  { label: 'Books', value: 'books' },
];

const SearchBar = ({ className = '', placeholder = 'Search NOVA MART', autoFocus = false }) => {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      productService.getSearchSuggestions(debouncedQuery)
        .then((res) => setSuggestions(res.data.data))
        .catch(() => setSuggestions(null));
    } else {
      setSuggestions(null);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() || department) {
      let url = `/shop?`;
      const params = new URLSearchParams();
      if (query.trim()) params.set('search', query.trim());
      if (department) params.set('category', department);
      navigate(`/shop?${params.toString()}`);
      setShowSuggestions(false);
    }
  };

  const goToProduct = (slug) => {
    navigate(`/product/${slug}`);
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex items-center w-full h-10 rounded-md overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#e77600] border border-transparent"
      >
        {/* Amazon-style Department Dropdown */}
        <div className="relative shrink-0 bg-[#f3f3f3] hover:bg-[#dadada] border-r border-[#cdcdcd] transition-colors hidden sm:flex items-center">
          <select
            value={department}
            aria-label="Select Category"
            onChange={(e) => setDepartment(e.target.value)}
            className="h-10 pl-3 pr-6 text-xs text-[#0f1111] bg-transparent cursor-pointer focus:outline-none appearance-none"
          >
            {departments.map((dept) => (
              <option key={dept.value} value={dept.value} className="text-sm bg-white text-black">
                {dept.label}
              </option>
            ))}
          </select>
          <div className="absolute right-2 pointer-events-none text-neutral-600 text-[10px]">▼</div>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 h-full flex items-center">
          <input
            id="search-input"
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full h-full px-3 text-sm text-[#0f1111] placeholder:text-neutral-500 focus:outline-none bg-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions(null); }}
              className="p-1 mr-2 text-neutral-400 hover:text-neutral-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Amazon-style Orange Magnifying Glass Button */}
        <button
          type="submit"
          className="h-10 px-4 bg-[#febd69] hover:bg-[#f3a847] active:bg-[#e77600] flex items-center justify-center transition-colors shrink-0 cursor-pointer text-[#131921]"
          aria-label="Search"
        >
          <Search className="h-5 w-5 stroke-[2.2]" />
        </button>
      </form>

      {/* Auto-suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions && (suggestions.products?.length > 0 || suggestions.brands?.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#cdcdcd] rounded-b-md shadow-2xl z-50 overflow-hidden"
          >
            {suggestions.products?.map((p) => (
              <button
                key={p._id}
                onClick={() => goToProduct(p.slug)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f3f3f3] text-left border-b border-neutral-100 last:border-0"
              >
                {p.image && <img src={p.image} alt="" className="w-10 h-10 rounded object-cover border border-neutral-200" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0f1111] truncate">{p.name}</p>
                  <p className="text-xs text-[#565959]">{p.brand} · <span className="font-semibold text-[#0f1111]">{formatPrice(p.finalPrice)}</span></p>
                </div>
              </button>
            ))}
            {suggestions.brands?.length > 0 && (
              <div className="bg-[#fcfcfc] border-t border-neutral-200 px-4 py-2">
                <p className="text-xs text-[#565959] mb-1.5 flex items-center gap-1 font-semibold">
                  <TrendingUp className="h-3 w-3 text-[#e77600]" /> Popular Brands
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => { navigate(`/shop?brand=${encodeURIComponent(b)}`); setShowSuggestions(false); }}
                      className="text-xs px-2.5 py-1 bg-white border border-neutral-200 rounded-full hover:border-[#e77600] hover:text-[#e77600]"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
