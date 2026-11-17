"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  X,
  User,
  Package,
  Clock,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Truck,
  LayoutDashboard,
} from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { useAuth } from "@/lib/authContext";

const categories = [
  { label: "All Categories", value: "" },
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Home & Living", value: "home-living" },
  { label: "Beauty", value: "beauty" },
  { label: "Sports & Fitness", value: "sports" },
  { label: "Books", value: "books" },
];

export default function Navbar() {
  const router = useRouter();
  const { cartCount } = useCart();
  const { user, addresses, loginDemo, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
  const locationText = defaultAddress
    ? `${defaultAddress.city} ${defaultAddress.pincode}`
    : "Bangalore 560103";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md select-none">
      {/* 1. Main Top Bar (Amazon Dark #131921) */}
      <div className="bg-[#131921] text-white">
        <div className="container-narrow flex items-center justify-between h-[60px] gap-2 sm:gap-4 py-1">
          {/* Logo with smile curve */}
          <Link
            href="/"
            className="flex items-center gap-1 p-1 rounded hover:outline hover:outline-1 hover:outline-white shrink-0"
          >
            <div className="flex flex-col">
              <div className="flex items-center tracking-tight leading-none">
                <span className="text-xl sm:text-2xl font-black text-white">nova</span>
                <span className="text-xl sm:text-2xl font-black text-[#febd69]">mart</span>
                <span className="text-[10px] text-[#febd69] font-bold ml-0.5 mt-[-8px]">.in</span>
              </div>
              <svg className="w-20 sm:w-24 h-2.5 text-[#febd69] fill-current -mt-0.5" viewBox="0 0 100 12">
                <path d="M 0 3 Q 50 14 96 3 L 90 0 Q 50 11 4 0 Z" />
                <polygon points="94,0 100,5 98,11" />
              </svg>
            </div>
          </Link>

          {/* Location Delivery Selector (Desktop) */}
          <Link
            href="/account"
            className="hidden lg:flex items-center gap-1.5 p-1.5 rounded hover:outline hover:outline-1 hover:outline-white shrink-0 max-w-[170px]"
          >
            <MapPin className="h-4 w-4 text-[#febd69] shrink-0 mt-2" />
            <div className="leading-tight truncate">
              <span className="block text-[11px] text-[#cccccc]">
                Deliver to {user?.name || "Customer"}
              </span>
              <span className="block text-xs font-bold text-white truncate">
                {locationText}
              </span>
            </div>
          </Link>

          {/* Amazon Unified Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-3xl flex items-center h-10 rounded-md overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#e77600] border border-transparent mx-1 sm:mx-2"
          >
            {/* Category Dropdown */}
            <div className="relative shrink-0 bg-[#f3f3f3] hover:bg-[#dadada] border-r border-[#cdcdcd] hidden sm:flex items-center h-full">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-full pl-3 pr-6 text-xs text-[#0f1111] bg-transparent cursor-pointer focus:outline-none appearance-none"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 pointer-events-none text-neutral-600 text-[9px]">▼</div>
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Search NOVA MART"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full px-3 text-sm text-[#0f1111] placeholder:text-neutral-500 focus:outline-none"
            />

            {/* Orange Magnifier Button */}
            <button
              type="submit"
              className="h-full px-4 bg-[#febd69] hover:bg-[#f3a847] active:bg-[#e77600] flex items-center justify-center transition-colors text-[#131921] cursor-pointer shrink-0"
              aria-label="Search"
            >
              <Search className="h-5 w-5 stroke-[2.2]" />
            </button>
          </form>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Country / Language */}
            <div className="hidden xl:flex items-center gap-1 p-1.5 rounded hover:outline hover:outline-1 hover:outline-white cursor-default">
              <span className="text-sm">🇮🇳</span>
              <span className="text-xs font-bold text-white">EN</span>
            </div>

            {/* Account & Lists Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex flex-col text-left p-1.5 rounded hover:outline hover:outline-1 hover:outline-white cursor-pointer"
              >
                <span className="text-[11px] text-[#cccccc] leading-tight">
                  Hello, {user?.name || "Sign in"}
                </span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-white leading-tight">
                  Account & Lists <ChevronDown className="h-3 w-3" />
                </span>
              </button>

              {/* Account Dropdown Menu */}
              {accountMenuOpen && (
                <div
                  onMouseLeave={() => setAccountMenuOpen(false)}
                  className="absolute right-0 top-full mt-1 w-64 bg-white text-[#0f1111] rounded-md shadow-2xl border border-neutral-200 z-50 p-3 space-y-3"
                >
                  <div className="p-2 bg-[#f7fafa] rounded border border-neutral-200">
                    <p className="text-xs text-neutral-500">Signed in as</p>
                    <p className="text-sm font-bold text-neutral-800">{user?.name} ({user?.role})</p>
                    <p className="text-xs text-neutral-600 truncate">{user?.email}</p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <Link
                      href="/account"
                      onClick={() => setAccountMenuOpen(false)}
                      className="block p-1.5 hover:bg-neutral-100 rounded font-medium"
                    >
                      Your Account & Addresses
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setAccountMenuOpen(false)}
                      className="block p-1.5 hover:bg-neutral-100 rounded font-medium"
                    >
                      Your Orders & Scheduled Deliveries
                    </Link>
                    <Link
                      href="/delivery"
                      onClick={() => setAccountMenuOpen(false)}
                      className="block p-1.5 hover:bg-neutral-100 rounded text-[#007185] font-semibold flex items-center justify-between"
                    >
                      <span>Partner Portal (/delivery)</span>
                      <Truck className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setAccountMenuOpen(false)}
                      className="block p-1.5 hover:bg-neutral-100 rounded text-[#e67a00] font-semibold flex items-center justify-between"
                    >
                      <span>Admin Dashboard (/admin)</span>
                      <LayoutDashboard className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-neutral-200">
                    <p className="text-[11px] font-bold text-neutral-500 mb-1.5">Switch Persona (Quick Test):</p>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => { loginDemo("customer"); setAccountMenuOpen(false); }}
                        className="p-1 text-[10px] bg-neutral-100 hover:bg-neutral-200 rounded font-medium text-center"
                      >
                        Customer
                      </button>
                      <button
                        onClick={() => { loginDemo("partner"); setAccountMenuOpen(false); }}
                        className="p-1 text-[10px] bg-[#e3f2fd] hover:bg-[#bbdefb] text-[#0d47a1] rounded font-semibold text-center"
                      >
                        Partner
                      </button>
                      <button
                        onClick={() => { loginDemo("admin"); setAccountMenuOpen(false); }}
                        className="p-1 text-[10px] bg-[#fff3e0] hover:bg-[#ffe0b2] text-[#e65100] rounded font-semibold text-center"
                      >
                        Admin
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Returns & Orders */}
            <Link
              href="/orders"
              className="hidden sm:flex flex-col text-left p-1.5 rounded hover:outline hover:outline-1 hover:outline-white shrink-0"
            >
              <span className="text-[11px] text-[#cccccc] leading-tight">Returns</span>
              <span className="text-xs font-bold text-white leading-tight">& Orders</span>
            </Link>

            {/* Cart Icon with Live Badge */}
            <Link
              href="/cart"
              className="flex items-center gap-1 p-1.5 rounded hover:outline hover:outline-1 hover:outline-white shrink-0"
              aria-label={`Shopping cart with ${cartCount} items`}
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

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded hover:outline hover:outline-1 hover:outline-white text-white ml-0.5"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Bar (Amazon Slate #232f3e) */}
      <div className="bg-[#232f3e] text-white hidden lg:block border-t border-[#37475a]/40 text-xs font-medium py-1">
        <div className="container-narrow flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            <Link
              href="/search"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white font-bold shrink-0"
            >
              <Menu className="h-4 w-4" />
              <span>All</span>
            </Link>
            <Link href="/search?deals=true" className="px-2.5 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white text-[#ff9900] font-semibold shrink-0">
              Today&apos;s Deals
            </Link>
            <Link href="/search?bestsellers=true" className="px-2.5 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white shrink-0">
              Best Sellers
            </Link>
            <Link href="/search?category=electronics" className="px-2.5 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white shrink-0">
              Electronics
            </Link>
            <Link href="/search?category=fashion" className="px-2.5 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white shrink-0">
              Fashion
            </Link>
            <Link href="/search?category=home-living" className="px-2.5 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white shrink-0">
              Home & Living
            </Link>
            <Link href="/orders" className="px-2.5 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white shrink-0">
              Scheduled Deliveries
            </Link>
            <Link href="/delivery" className="px-2.5 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white text-[#90caf9] font-medium shrink-0">
              Delivery Partner
            </Link>
            <Link href="/admin" className="px-2.5 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white text-[#ffcc80] font-medium shrink-0">
              Admin
            </Link>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#febd69] font-bold shrink-0">
            <Clock className="h-3.5 w-3.5" />
            <span>2-Hour Delivery Slots with Handover OTP</span>
          </div>
        </div>
      </div>

      {/* Mobile Location Header Strip */}
      <div className="lg:hidden bg-[#232f3e] text-white px-3 py-1.5 flex items-center gap-2 text-xs border-t border-[#37475a]">
        <MapPin className="h-3.5 w-3.5 text-[#febd69] shrink-0" />
        <span className="truncate">Deliver to {user?.name || "Customer"} - {locationText}</span>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-80 max-w-[85%] bg-white text-[#0f1111] flex flex-col h-full shadow-2xl z-10 overflow-y-auto">
            {/* Drawer Top */}
            <div className="bg-[#232f3e] text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#131921] flex items-center justify-center border border-[#febd69]">
                  <User className="h-5 w-5 text-[#febd69]" />
                </div>
                <div>
                  <span className="text-xs text-[#cccccc] block">Hello,</span>
                  <span className="text-base font-bold block">{user?.name || "Sign in"}</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded hover:bg-[#37475a]"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Links */}
            <div className="p-4 space-y-4 text-sm flex-1">
              <div>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Shop by Category</p>
                <div className="space-y-1">
                  <Link href="/search?category=electronics" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#007185]">
                    Electronics
                  </Link>
                  <Link href="/search?category=fashion" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#007185]">
                    Fashion
                  </Link>
                  <Link href="/search?category=home-living" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#007185]">
                    Home & Living
                  </Link>
                  <Link href="/search?category=beauty" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#007185]">
                    Beauty & Personal Care
                  </Link>
                  <Link href="/search?category=sports" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#007185]">
                    Sports & Fitness
                  </Link>
                  <Link href="/search?category=books" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#007185]">
                    Books & Knowledge
                  </Link>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Programs & Workflows</p>
                <div className="space-y-1">
                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#007185]">
                    Your Orders & Slots
                  </Link>
                  <Link href="/delivery" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 font-bold text-[#0277bd]">
                    Delivery Partner Drops (/delivery)
                  </Link>
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 font-bold text-[#e65100]">
                    Admin Dashboard (/admin)
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
