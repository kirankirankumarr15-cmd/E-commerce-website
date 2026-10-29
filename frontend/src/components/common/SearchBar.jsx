import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../../services';
import { formatPrice } from '../../utils/helpers';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({ className = '', placeholder = 'Search products...', autoFocus = false }) => {
  const [query, setQuery] = useState('');
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
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const goToProduct = (slug) => {
    navigate(`/product/${slug}`);
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} role="search">
        <label htmlFor="search-input" className="sr-only">Search products</label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" aria-hidden="true" />
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-10 py-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        {query && (
          <button type="button" onClick={() => { setQuery(''); setSuggestions(null); }} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Clear search">
            <X className="h-4 w-4 text-text-muted" />
          </button>
        )}
      </form>

      <AnimatePresence>
        {showSuggestions && suggestions && (suggestions.products?.length > 0 || suggestions.brands?.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {suggestions.products?.map((p) => (
              <button key={p._id} onClick={() => goToProduct(p.slug)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-secondary text-left">
                {p.image && <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{p.name}</p>
                  <p className="text-xs text-text-muted">{p.brand} · {formatPrice(p.finalPrice)}</p>
                </div>
              </button>
            ))}
            {suggestions.brands?.length > 0 && (
              <div className="border-t border-border px-4 py-2">
                <p className="text-xs text-text-muted mb-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Brands</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.brands.map((b) => (
                    <button key={b} onClick={() => { navigate(`/shop?brand=${encodeURIComponent(b)}`); setShowSuggestions(false); }} className="text-xs px-2 py-1 bg-surface-secondary rounded-full hover:bg-primary-50 hover:text-primary-600">
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
