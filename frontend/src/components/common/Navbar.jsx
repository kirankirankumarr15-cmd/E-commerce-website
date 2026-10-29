import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Heart, ShoppingCart, User, Menu, X, LogOut,
  Package, LayoutDashboard, ChevronDown, Sparkles,
} from 'lucide-react';
import SearchBar from './SearchBar';
import AIAssistantModal from './AIAssistantModal';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const navLinks = [
  { label: 'Home', to: '/home' },
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/shop?view=categories' },
  { label: 'Deals', to: '/shop?deals=true' },
  { label: 'New Arrivals', to: '/shop?new=true' },
];

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount, fetchCart } = useCart();
  const { wishlistCount, fetchWishlist } = useWishlist();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated, fetchCart, fetchWishlist]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-surface/95 backdrop-blur-md shadow-sm' : 'bg-surface'
      }`}
    >
      <div className="container-narrow">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          <Link to={isAuthenticated ? '/home' : '/'} className="flex items-center gap-2 shrink-0" aria-label="NOVA MART Home">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-text tracking-tight">NOVA MART</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 text-sm font-medium text-text-muted hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-tertiary transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-text" />
            </button>

            <button
              onClick={() => setAiOpen(true)}
              className="hidden md:flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-100 transition-colors"
              aria-label="Open AI style assistant"
            >
              <Sparkles className="h-4 w-4" />
              AI Style Finder
            </button>

            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg hover:bg-surface-tertiary transition-colors"
              aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ''}`}
            >
              <Heart className="h-5 w-5 text-text" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-surface-tertiary transition-colors"
              aria-label={`Cart${cartCount ? `, ${cartCount} items` : ''}`}
            >
              <ShoppingCart className="h-5 w-5 text-text" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {isAuthenticated ? (
              <Dropdown
                trigger={
                  <button className="hidden sm:flex items-center gap-2 p-2 rounded-lg hover:bg-surface-tertiary transition-colors">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-text hidden lg:block">
                      {user?.firstName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-text-muted hidden lg:block" />
                  </button>
                }
              >
                <DropdownItem onClick={() => navigate('/profile')}>
                  <span className="flex items-center gap-2"><User className="h-4 w-4" /> Profile</span>
                </DropdownItem>
                <DropdownItem onClick={() => navigate('/orders')}>
                  <span className="flex items-center gap-2"><Package className="h-4 w-4" /> Orders</span>
                </DropdownItem>
                {isAdmin && (
                  <DropdownItem onClick={() => navigate('/admin')}>
                    <span className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Admin</span>
                  </DropdownItem>
                )}
                <DropdownItem onClick={handleLogout}>
                  <span className="flex items-center gap-2 text-error"><LogOut className="h-4 w-4" /> Logout</span>
                </DropdownItem>
              </Dropdown>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <User className="h-4 w-4" />
                Account
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-tertiary transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden pb-4 overflow-hidden"
            >
              <SearchBar autoFocus onSubmit={() => setSearchOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-surface overflow-hidden"
          >
            <nav className="container-narrow py-4 space-y-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-text rounded-lg hover:bg-surface-tertiary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Login / Register
                </Link>
              )}
              {isAuthenticated && (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-text rounded-lg hover:bg-surface-tertiary">Profile</Link>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-text rounded-lg hover:bg-surface-tertiary">Orders</Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-text rounded-lg hover:bg-surface-tertiary">Admin Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-medium text-error rounded-lg hover:bg-red-50">Logout</button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
