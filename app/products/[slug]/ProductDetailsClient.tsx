"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ShieldCheck,
  RotateCcw,
  Clock,
  Truck,
  Heart,
  Share2,
  Check,
  ChevronRight,
  Sparkles,
  MapPin,
  Tag,
} from "lucide-react";
import { SeedProduct } from "@/lib/seedData";
import { useCart } from "@/lib/cartContext";
import ProductCard from "@/components/ProductCard";

interface Props {
  product: SeedProduct;
  related: SeedProduct[];
}

export default function ProductDetailsClient({ product, related }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [activeImage, setActiveImage] = useState(product.images[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const images = product.images.length > 0 ? product.images : [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&fit=crop",
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-2 text-xs text-gray-500">
        <div className="container-narrow flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-amber-700">Home</Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <Link href={`/category/${product.category_slug}`} className="hover:text-amber-700 capitalize">
            {product.category_slug}
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <main className="container-narrow py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Column 1: Gallery (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[480px] scrollbar-none">
              {images.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveImage(img)}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-md border p-1 transition ${
                    activeImage === img
                      ? "border-amber-600 ring-2 ring-amber-500/50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-square rounded-lg border border-gray-100 bg-[#f9f9f9] flex items-center justify-center p-6 overflow-hidden group">
              <img
                src={activeImage || images[0]}
                alt={product.name}
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-2 rounded-full border shadow-xs transition ${
                    isWishlisted ? "bg-red-50 border-red-200 text-red-500" : "bg-white/90 border-gray-200 text-gray-500 hover:text-red-500"
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Center Details (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <span className="text-xs font-semibold text-[#007185] hover:text-[#c45500] cursor-pointer">
                Visit the {product.brand} Store
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0f1111] leading-tight mt-1">
                {product.name}
              </h1>
            </div>

            {/* Rating Stars & Count */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <span className="font-bold text-sm text-gray-900">{product.rating.toFixed(1)}</span>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : i < product.rating
                          ? "fill-amber-400/50 text-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-[#007185] hover:underline cursor-pointer">
                {product.num_reviews.toLocaleString()} ratings
              </span>
              {product.is_best_seller && (
                <span className="ml-auto rounded-xs bg-[#e67a00] px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-wider">
                  #1 Best Seller
                </span>
              )}
            </div>

            <hr className="border-gray-200" />

            {/* Price Box */}
            <div className="space-y-1">
              {product.discount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-light text-[#cc0c39]">
                    -{product.discount}%
                  </span>
                  <div className="flex items-baseline">
                    <span className="text-sm font-semibold text-gray-900">₹</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#0f1111]">
                      {product.final_price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )}
              {product.discount > 0 ? (
                <p className="text-xs text-gray-500">
                  M.R.P.: <span className="line-through">₹{product.price.toLocaleString("en-IN")}</span>
                </p>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-sm font-semibold text-gray-900">₹</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0f1111]">
                    {product.final_price.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-500">Inclusive of all taxes</p>
              <p className="text-xs text-gray-700">
                EMI starts at <span className="font-semibold">₹{(product.final_price / 6).toFixed(0)}/mo</span>. No Cost EMI available.
              </p>
            </div>

            {/* Offers Cards */}
            <div className="rounded-lg border border-gray-200 p-3 bg-gray-50/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 mb-2">
                <Tag className="h-3.5 w-3.5 text-amber-600" />
                Available Offers
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded border border-gray-200 bg-white p-2">
                  <span className="font-bold text-gray-800 block">Bank Offer</span>
                  <span className="text-gray-600 line-clamp-2">10% Instant Discount on HDFC & ICICI Cards</span>
                </div>
                <div className="rounded border border-gray-200 bg-white p-2">
                  <span className="font-bold text-gray-800 block">Partner Offer</span>
                  <span className="text-gray-600 line-clamp-2">Get GST invoice & save up to 28% on business purchases</span>
                </div>
              </div>
            </div>

            {/* Delivery & Trust Highlights */}
            <div className="grid grid-cols-4 gap-2 text-center py-2 border-y border-gray-200">
              <div className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-amber-50 text-amber-700 mb-1">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-[10px] text-gray-700 font-medium leading-tight">
                  2-Hour Slot Delivery
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-blue-50 text-blue-700 mb-1">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-[10px] text-gray-700 font-medium leading-tight">
                  OTP Handover Code
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-green-50 text-green-700 mb-1">
                  <RotateCcw className="h-4 w-4" />
                </div>
                <span className="text-[10px] text-gray-700 font-medium leading-tight">
                  7 Days Replacement
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-purple-50 text-purple-700 mb-1">
                  <Truck className="h-4 w-4" />
                </div>
                <span className="text-[10px] text-gray-700 font-medium leading-tight">
                  Nova Mart Delivered
                </span>
              </div>
            </div>

            {/* About This Item */}
            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">About this item</h3>
              <p className="text-xs text-gray-700 leading-relaxed mb-3">
                {product.description}
              </p>
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Amazon Buy Box (3 cols on lg) */}
          <div className="lg:col-span-3">
            <div className="sticky top-20 rounded-xl border border-gray-300 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-baseline">
                <span className="text-sm font-semibold text-gray-900">₹</span>
                <span className="text-3xl font-extrabold text-[#0f1111]">
                  {product.final_price.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Delivery Promise */}
              <div className="text-xs space-y-1.5">
                <p className="text-gray-700">
                  <span className="font-bold text-green-700">FREE delivery</span> with{" "}
                  <span className="font-bold text-amber-700">2-Hour Scheduled Window</span>.
                </p>
                <div className="flex items-center gap-1 text-[#007185] hover:underline cursor-pointer">
                  <MapPin className="h-3.5 w-3.5 text-gray-500" />
                  <span>Deliver to Bangalore 560103</span>
                </div>
              </div>

              {/* Stock status */}
              <div>
                {product.stock > 10 ? (
                  <span className="text-base font-bold text-green-700">In stock</span>
                ) : product.stock > 0 ? (
                  <span className="text-sm font-bold text-red-600">
                    Only {product.stock} left in stock - order soon.
                  </span>
                ) : (
                  <span className="text-base font-bold text-red-700">Currently unavailable</span>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center gap-2">
                  <label htmlFor="pdp-qty" className="text-xs font-medium text-gray-700">
                    Quantity:
                  </label>
                  <select
                    id="pdp-qty"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1 text-xs font-semibold shadow-2xs"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="w-full rounded-full bg-[#ffd814] py-2.5 px-4 text-xs sm:text-sm font-bold text-[#0f1111] shadow-xs border border-[#fcd200] hover:bg-[#f7ca00] active:scale-95 transition disabled:opacity-50 cursor-pointer"
                >
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full rounded-full bg-[#ffa41c] py-2.5 px-4 text-xs sm:text-sm font-bold text-[#0f1111] shadow-xs border border-[#ff8f00] hover:bg-[#fa8900] active:scale-95 transition disabled:opacity-50 cursor-pointer"
                >
                  Buy Now
                </button>
              </div>

              {addedNotice && (
                <div className="rounded-md bg-green-50 p-2.5 text-xs text-green-800 flex items-center gap-1.5 animate-fade-in">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Added {quantity} item(s) to Cart!</span>
                </div>
              )}

              {/* Security and Seller Details */}
              <div className="border-t border-gray-100 pt-3 text-[11px] text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Ships from</span>
                  <span className="font-medium text-gray-900">Nova Mart Fulfilled</span>
                </div>
                <div className="flex justify-between">
                  <span>Sold by</span>
                  <span className="font-medium text-gray-900">{product.brand} Retail</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer Support</span>
                  <span className="font-medium text-green-700">24x7 Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Row */}
        {related.length > 0 && (
          <section className="mt-14 pt-8 border-t border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Customers who viewed this item also viewed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
