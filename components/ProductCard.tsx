"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Star, Check, ShoppingCart, Heart } from "lucide-react";
import { SeedProduct } from "@/lib/seedData";
import { useCart } from "@/lib/cartContext";

interface ProductCardProps {
  product: SeedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const image = product.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop";

  return (
    <div className="h-full flex flex-col bg-white rounded-md border border-[#e0e0e0] hover:border-[#b8b8b8] hover:shadow-md transition-all duration-150 overflow-hidden relative p-3 sm:p-4">
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-square mb-2 overflow-hidden bg-white flex items-center justify-center"
      >
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-200"
        />

        {/* Amazon Deal Badge */}
        {product.discount >= 20 && (
          <div className="absolute top-1 left-1">
            <span className="bg-[#cc0c39] text-white text-[11px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wide">
              {product.discount}% off
            </span>
          </div>
        )}
        {product.is_best_seller && product.discount < 20 && (
          <div className="absolute top-1 left-1">
            <span className="bg-[#e67a00] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider">
              Best Seller
            </span>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col">
        {product.brand && (
          <span className="text-[11px] font-medium text-[#565959] uppercase tracking-wider mb-0.5">
            {product.brand}
          </span>
        )}

        <Link
          href={`/products/${product.slug}`}
          className="text-xs sm:text-sm font-medium text-[#0f1111] hover:text-[#c7511f] line-clamp-2 leading-snug mb-1.5"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating || 4.5)
                    ? "fill-[#de7921] text-[#de7921]"
                    : "text-neutral-300 fill-neutral-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-[#007185] hover:underline cursor-pointer">
            {product.num_reviews}
          </span>
        </div>

        {/* Pricing */}
        <div className="mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-medium text-[#0f1111] -mt-1">₹</span>
            <span className="text-lg sm:text-xl font-bold text-[#0f1111] leading-none">
              {Number(product.final_price).toLocaleString("en-IN")}
            </span>
            {product.discount > 0 && (
              <span className="text-xs text-[#565959] line-through ml-1">
                M.R.P: ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {product.discount > 0 && (
            <span className="text-[11px] text-[#cc0c39] font-medium block mt-0.5">
              Save ₹{Number(product.price - product.final_price).toLocaleString("en-IN")} ({product.discount}%)
            </span>
          )}
        </div>

        {/* Prime Tag & Fast Delivery Promise */}
        <div className="mt-auto pt-1 mb-3 text-xs text-[#565959] space-y-0.5">
          <div className="flex items-center gap-1">
            <span className="font-black italic text-[#00a8e1] tracking-tighter text-sm">
              prime
            </span>
            <Check className="h-3 w-3 text-[#00a8e1] stroke-[3] -ml-0.5" />
            <span className="font-semibold text-[#0f1111]">FREE Delivery</span>
          </div>
          <p className="text-[11px]">Get it by <strong className="text-[#0f1111]">Tomorrow, 2 PM</strong></p>
        </div>

        {/* Amazon Yellow Add to Cart Button */}
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="w-full py-1.5 px-3 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-[#0f1111] text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          <span>{added ? "Added!" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  );
}
