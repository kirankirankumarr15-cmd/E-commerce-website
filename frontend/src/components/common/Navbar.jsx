import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Heart, ShoppingCart, User, Menu, X, LogOut,
  Package, LayoutDashboard, ChevronDown, MapPin, Sparkles, Clock
} from 'lucide-react';
import SearchBar from './SearchBar';
import AIAssistantModal from './AIAssistantModal';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const subNavLinks = [
  { label: 'All', to: '/shop', isMenu: true },
  { label: "Today's Deals", to: '/shop?deals=true' },
  { label: 'Best Sellers', to: '/shop?bestsellers=true' },
  { label: 'Electronics', to: '/category/electronics' },
  { label: 'Fashion', to: '/category/fashion' },
  { label: 'Home & Living', to: '/category/home-living' },
  { label: 'New Arrivals', to: '/shop?new=true' },
  { label: 'Scheduled Delivery', to: '/orders' },
];

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount, fetchCart } = useCart();
  const { wishlistCount, fetchWishlist } = useWishlist();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated, fetchCart, fetchWishlist]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const primaryAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const deliveryLocationText = primaryAddress
    ? `${primaryAddress.city} ${primaryAddress.postalCode}`
    : 'Select delivery address';

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Tier: Amazon Black (#131921) */}
      <div className="bg-[#131921] text-white">
        <div className="container-narrow flex items-center justify-between h-15 gap-2 sm:gap-4 py-1">
          {/* Logo with Amazon-style Orange Smile Curve */}
          <Link
            to={isAuthenticated ? '/home' : '/'}
            className="flex items-center gap-1.5 p-1 rounded hover:outline hover:outline-1 hover:outline-white transition-all shrink-0"
            aria-label="NOVA MART Home"
          >
            <div className="flex flex-col">
              <div className="flex items-center tracking-tight leading-none">
                <span className="text-xl sm:text-2xl font-black text-white">nova</span>
                <span className="text-xl sm:text-2xl font-black text-[#febd69]">mart</span>
                <span className="text-[10px] text-[#febd69] font-bold ml-0.5 mt-[-8px]">.in</span>
              </div>
              {/* Curved Smile Arrow SVG */}
              <svg className="w-20 sm:w-24 h-2.5 text-[#febd69] fill-current -mt-0.5" viewBox="0 0 100 12">
                <path d="M 0 3 Q 50 14 96 3 L 90 0 Q 50 11 4 0 Z" />
                <polygon points="94,0 100,5 98,11" />
              </svg>
            </div>
          </Link>

          {/* Deliver to Location Widget (Desktop) */}
          <div
            onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
            className="hidden lg:flex items-center gap-1.5 p-1.5 rounded hover:outline hover:outline-1 hover:outline-white cursor-pointer transition-all shrink-0 max-w-[170px]"
          >
            <MapPin className="h-4 w-4 text-[#febd69] shrink-0 mt-2" />
            <div className="leading-tight truncate">
              <span className="block text-[11px] text-[#cccccc]">
                Deliver to {user?.firstName ? user.firstName : 'India'}
              </span>
              <span className="block text-xs font-bold text-white truncate">
                {deliveryLocationText}
              </span>
            </div>
          </div>

          {/* Unified Amazon Search Bar */}
          <div className="flex-1 max-w-3xl mx-1 sm:mx-3">
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* AI Assistant Pill */}
            <button
              onClick={() => setAiOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#232f3e] hover:bg-[#37475a] text-xs font-semibold text-[#febd69] border border-[#485769] transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#febd69]" />
              <span>AI Finder</span>
            </button>

            {/* Language / Region (Desktop) */}
            <div className="hidden xl:flex items-center gap-1 p-1.5 rounded hover:outline hover:outline-1 hover:outline-white cursor-default">
              <span className="text-sm">🇮🇳</span>
              <span className="text-xs font-bold text-white">EN</span>
            </div>

            {/* Account & Lists */}
            {isAuthenticated ? (
              <Dropdown
                trigger={
                  <button className="flex flex-col text-left p-1.5 rounded hover:outline hover:outline-1 hover:outline-white transition-all">
                    <span className="text-[11px] text-[#cccccc] leading-tight">
                      Hello, {user?.firstName}
                    </span>
                    <span className="flex items-center gap-0.5 text-xs font-bold text-white leading-tight">
                      Account & Lists <ChevronDown className="h-3 w-3" />
                    </span>
                  </button>
                }
              >
                <div className="px-4 py-2 border-b border-neutral-100 bg-[#f7fafa]">
                  <p className="text-xs text-neutral-500">Your Account</p>
                  <p className="text-sm font-bold text-neutral-800">{user?.fullName || user?.firstName}</p>
                </div>
                <DropdownItem onClick={() => navigate('/profile')}>
                  <span className="flex items-center gap-2"><User className="h-4 w-4 text-[#007185]" /> Your Profile & Addresses</span>
                </DropdownItem>
                <DropdownItem onClick={() => navigate('/orders')}>
                  <span className="flex items-center gap-2"><Package className="h-4 w-4 text-[#007185]" /> Your Orders & Tracking</span>
                </DropdownItem>
                <DropdownItem onClick={() => navigate('/wishlist')}>
                  <span className="flex items-center gap-2"><Heart className="h-4 w-4 text-[#007185]" /> Your Wish List ({wishlistCount})</span>
                </DropdownItem>
                {isAdmin && (
                  <DropdownItem onClick={() => navigate('/admin')}>
                    <span className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4 text-[#de7921]" /> Admin Dashboard</span>
                  </DropdownItem>
                )}
                <div className="border-t border-neutral-200 mt-1 pt-1">
                  <DropdownItem onClick={handleLogout}>
                    <span className="flex items-center gap-2 text-[#cc0c39] font-medium"><LogOut className="h-4 w-4" /> Sign Out</span>
                  </DropdownItem>
                </div>
              </Dropdown>
            ) : (
              <Link
                to="/login"
                className="flex flex-col text-left p-1.5 rounded hover:outline hover:outline-1 hover:outline-white transition-all"
              >
                <span className="text-[11px] text-[#cccccc] leading-tight">Hello, sign in</span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-white leading-tight">
                  Account & Lists <ChevronDown className="h-3 w-3" />
                </span>
              </Link>
            )}

            {/* Returns & Orders */}
            <Link
              to={isAuthenticated ? '/orders' : '/login'}
              className="hidden sm:flex flex-col text-left p-1.5 rounded hover:outline hover:outline-1 hover:outline-white transition-all"
            >
              <span className="text-[11px] text-[#cccccc] leading-tight">Returns</span>
              <span className="text-xs font-bold text-white leading-tight">& Orders</span>
            </Link>

            {/* Shopping Cart with Amazon Yellow Badge */}
            <Link
              to="/cart"
              className="flex items-center gap-1 p-1.5 rounded hover:outline hover:outline-1 hover:outline-white transition-all"
              aria-label={`Cart with ${cartCount} items`}
            >
              <div className="relative">
                <ShoppingCart className="h-7 w-7 text-white stroke-[1.8]" />
                <span className="absolute -top-1 left-3.5 min-w-[18px] h-[18px] bg-[#febd69] text-[#131921] text-[11px] font-black rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              </div>
              <span className="hidden sm:inline text-xs font-bold text-white mt-2">
                Cart
              </span>
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded hover:outline hover:outline-1 hover:outline-white text-white ml-1"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Tier: Amazon Slate (#232f3e) Navigation Strip */}
      <div className="bg-[#232f3e] text-white hidden lg:block border-t border-[#37475a]/40">
        <div className="container-narrow flex items-center justify-between text-xs font-medium py-1">
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white font-bold shrink-0 cursor-pointer"
            >
              <Menu className="h-4 w-4" />
              <span>All</span>
            </button>

            {subNavLinks.slice(1).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-2.5 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white shrink-0 whitespace-nowrap transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#febd69] font-bold">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Scheduled Handover Available
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Location Banner */}
      <div
        onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
        className="lg:hidden bg-[#232f3e] text-white px-3 py-1.5 flex items-center gap-2 text-xs cursor-pointer border-t border-[#37475a]"
      >
        <MapPin className="h-3.5 w-3.5 text-[#febd69] shrink-0" />
        <span className="truncate">Deliver to {user?.firstName ? user.firstName : 'India'} - {deliveryLocationText}</span>
      </div>

      {/* Mobile Sidebar Menu (Amazon Drawer) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 bottom-0 left-0 w-80 max-w-[85%] bg-white z-50 flex flex-col shadow-2xl overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-[#232f3e] text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#131921] flex items-center justify-center border border-[#febd69]">
                    <User className="h-5 w-5 text-[#febd69]" />
                  </div>
                  <div>
                    <span className="text-xs text-[#cccccc] block">Hello,</span>
                    <span className="text-base font-bold block">{user?.firstName ? user.firstName : 'Sign in'}</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded hover:bg-[#37475a]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Menu List */}
              <div className="p-4 space-y-5 text-sm text-[#0f1111] flex-1">
                <div>
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                    Trending
                  </h3>
                  <div className="space-y-1">
                    <Link to="/shop?bestsellers=true" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-2 hover:bg-neutral-100 rounded font-medium">
                      Best Sellers
                    </Link>
                    <Link to="/shop?new=true" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-2 hover:bg-neutral-100 rounded font-medium">
                      New Arrivals
                    </Link>
                    <Link to="/shop?deals=true" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-2 hover:bg-neutral-100 rounded font-medium text-[#cc0c39]">
                      Today's Deals
                    </Link>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                    Shop by Department
                  </h3>
                  <div className="space-y-1">
                    <Link to="/category/electronics" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-2 hover:bg-neutral-100 rounded">
                      Electronics & Gadgets
                    </Link>
                    <Link to="/category/fashion" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-2 hover:bg-neutral-100 rounded">
                      Men's & Women's Fashion
                    </Link>
                    <Link to="/category/home-living" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-2 hover:bg-neutral-100 rounded">
                      Home & Living
                    </Link>
                    <Link to="/category/beauty" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-2 hover:bg-neutral-100 rounded">
                      Beauty & Skincare
                    </Link>
                    <Link to="/category/sports" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-2 hover:bg-neutral-100 rounded">
                      Sports & Fitness
                    </Link>
                    <Link to="/category/books" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-2 hover:bg-neutral-100 rounded">
                      Books & Knowledge
                    </Link>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                    Programs & Features
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => { setAiOpen(true); setMobileMenuOpen(false); }}
                      className="w-full text-left py-2 px-2 hover:bg-neutral-100 rounded flex items-center justify-between"
                    >
                      <span>AI Style Finder</span>
                      <Sparkles className="h-4 w-4 text-[#e77600]" />
                    </button>
                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-2 hover:bg-neutral-100 rounded">
                      Your Orders & Scheduled Deliveries
                    </Link>
                    <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-2 hover:bg-neutral-100 rounded">
                      Your Wish List
                    </Link>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-2 hover:bg-neutral-100 rounded">
                      Your Account Settings
                    </Link>
                  </div>
                </div>

                {/* Sign Out / Sign In */}
                <div className="border-t border-neutral-200 pt-4">
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="w-full py-2.5 px-3 rounded-lg border border-[#cc0c39] text-[#cc0c39] font-medium hover:bg-red-50 text-center"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full py-2.5 px-3 rounded-lg bg-[#ffd814] text-[#0f1111] font-semibold text-center border border-[#fcd200]"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AIAssistantModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </header>
  );
};

export default Navbar;
