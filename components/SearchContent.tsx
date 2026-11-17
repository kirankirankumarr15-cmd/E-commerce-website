"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, Filter, X, SlidersHorizontal, Check, Clock } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { SEED_CATEGORIES, SEED_PRODUCTS, SeedProduct } from "@/lib/seedData";

interface Props {
  initialParams: { [key: string]: string | string[] | undefined };
}

export default function SearchContent({ initialParams }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams?.get("q") || (initialParams.q as string) || "";
  const categoryParam = searchParams?.get("category") || (initialParams.category as string) || "";
  const sortParam = searchParams?.get("sort") || (initialParams.sort as string) || "featured";
  const dealsParam = searchParams?.get("deals") === "true" || initialParams.deals === "true";
  const ratingParam = Number(searchParams?.get("rating") || initialParams.rating || 0);

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedRating, setSelectedRating] = useState(ratingParam);
  const [onlyDeals, setOnlyDeals] = useState(dealsParam);
  const [onlyScheduled, setOnlyScheduled] = useState(false);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState(sortParam);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter products locally for instantaneous UI response
  const filteredProducts = SEED_PRODUCTS.filter((product) => {
    // 1. Text search
    if (query) {
      const q = query.toLowerCase();
      const match =
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    // 2. Category
    if (selectedCategory && product.category_slug !== selectedCategory) {
      return false;
    }

    // 3. Rating
    if (selectedRating > 0 && product.rating < selectedRating) {
      return false;
    }

    // 4. Deals
    if (onlyDeals && !product.is_deal) {
      return false;
    }

    // 5. Price Range
    if (priceRange === "under1000" && product.final_price >= 1000) return false;
    if (priceRange === "1000to5000" && (product.final_price < 1000 || product.final_price > 5000)) return false;
    if (priceRange === "5000to20000" && (product.final_price < 5000 || product.final_price > 20000)) return false;
    if (priceRange === "above20000" && product.final_price <= 20000) return false;

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.final_price - b.final_price;
    if (sortBy === "price-desc") return b.final_price - a.final_price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "reviews") return b.num_reviews - a.num_reviews;
    return (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0);
  });

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedRating(0);
    setOnlyDeals(false);
    setOnlyScheduled(false);
    setPriceRange("all");
    setSortBy("featured");
    router.push("/search");
  };

  const hasActiveFilters =
    Boolean(selectedCategory) || selectedRating > 0 || onlyDeals || priceRange !== "all" || onlyScheduled;

  return (
    <div className="bg-white min-h-screen">
      {/* Search Header Bar */}
      <div className="border-b border-gray-200 bg-gray-50/70 px-4 py-3">
        <div className="container-narrow flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div>
            <span className="text-gray-500">
              Showing 1–{sortedProducts.length} of {sortedProducts.length} results
            </span>
            {query && (
              <span className="font-bold text-gray-900 ml-1.5">
                for <span className="text-[#c45500]">&quot;{query}&quot;</span>
              </span>
            )}
            {selectedCategory && (
              <span className="text-gray-700 ml-1.5">
                in <span className="font-semibold">{SEED_CATEGORIES.find((c) => c.slug === selectedCategory)?.name}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 font-medium"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {hasActiveFilters && (
                <span className="h-2 w-2 rounded-full bg-amber-500" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-gray-600 hidden sm:inline">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-800 shadow-2xs focus:border-amber-500 focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container-narrow py-6">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6 pr-4 border-r border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#007185] hover:text-[#c45500] hover:underline font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Scheduled Delivery Filter */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2.5">
                Delivery Mode
              </h4>
              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyScheduled}
                  onChange={(e) => setOnlyScheduled(e.target.checked)}
                  className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                  <Clock className="h-3 w-3" />
                  2-Hour Scheduled
                </span>
              </label>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2.5">
                Category
              </h4>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`block text-left w-full py-1 px-1.5 rounded transition ${
                    selectedCategory === ""
                      ? "font-bold text-[#c45500] bg-orange-50"
                      : "text-gray-700 hover:text-[#c45500]"
                  }`}
                >
                  All Categories
                </button>
                {SEED_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`block text-left w-full py-1 px-1.5 rounded transition ${
                      selectedCategory === cat.slug
                        ? "font-bold text-[#c45500] bg-orange-50"
                        : "text-gray-700 hover:text-[#c45500]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Review Filter */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2.5">
                Customer Review
              </h4>
              <div className="space-y-1.5">
                {[4, 3, 2, 1].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setSelectedRating(selectedRating === stars ? 0 : stars)}
                    className={`flex items-center gap-1.5 text-xs py-1 px-1.5 rounded w-full text-left transition ${
                      selectedRating === stars
                        ? "bg-amber-50 font-bold text-amber-900"
                        : "text-gray-700 hover:text-[#c45500]"
                    }`}
                  >
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < stars ? "fill-amber-400 text-amber-400" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span>& Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2.5">
                Price
              </h4>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under1000", label: "Under ₹1,000" },
                  { id: "1000to5000", label: "₹1,000 to ₹5,000" },
                  { id: "5000to20000", label: "₹5,000 to ₹20,000" },
                  { id: "above20000", label: "Above ₹20,000" },
                ].map((range) => (
                  <label
                    key={range.id}
                    className="flex items-center gap-2 text-gray-700 cursor-pointer py-0.5"
                  >
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === range.id}
                      onChange={() => setPriceRange(range.id)}
                      className="border-gray-300 text-amber-500 focus:ring-amber-500"
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Deals & Discounts */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2.5">
                Deals & Discounts
              </h4>
              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyDeals}
                  onChange={(e) => setOnlyDeals(e.target.checked)}
                  className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                />
                <span>Today&apos;s Deals & Discounts</span>
              </label>
            </div>
          </aside>

          {/* Product Results Grid */}
          <main className="flex-1">
            {sortedProducts.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-12 text-center">
                <p className="text-base font-bold text-gray-800">
                  No matching products found
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Try clearing some filters or searching with different keywords.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-[#ffd814] text-xs font-bold text-gray-900 hover:bg-yellow-400"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-2xs lg:hidden">
          <div className="ml-auto w-full max-w-xs bg-white h-full overflow-y-auto p-5 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 text-base">Filter Products</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Category */}
              <div>
                <h4 className="font-bold text-xs uppercase text-gray-800 mb-2">Category</h4>
                <div className="space-y-1 text-sm">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`block w-full text-left py-1.5 px-2 rounded ${
                      selectedCategory === "" ? "bg-amber-100 font-bold" : "text-gray-700"
                    }`}
                  >
                    All Categories
                  </button>
                  {SEED_CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`block w-full text-left py-1.5 px-2 rounded ${
                        selectedCategory === c.slug ? "bg-amber-100 font-bold" : "text-gray-700"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div>
                <h4 className="font-bold text-xs uppercase text-gray-800 mb-2">Price</h4>
                <div className="space-y-1.5 text-sm">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under1000", label: "Under ₹1,000" },
                    { id: "1000to5000", label: "₹1,000 to ₹5,000" },
                    { id: "5000to20000", label: "₹5,000 to ₹20,000" },
                    { id: "above20000", label: "Above ₹20,000" },
                  ].map((r) => (
                    <label key={r.id} className="flex items-center gap-2 text-gray-700">
                      <input
                        type="radio"
                        name="mobilePrice"
                        checked={priceRange === r.id}
                        onChange={() => setPriceRange(r.id)}
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex gap-2">
              <button
                onClick={clearFilters}
                className="flex-1 py-2.5 border border-gray-300 rounded-md text-xs font-semibold text-gray-700"
              >
                Reset
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-2.5 bg-[#ffd814] rounded-md text-xs font-bold text-gray-900"
              >
                View ({sortedProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
