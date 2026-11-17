"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Heart,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/lib/cartContext";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    saved,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCart,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = useCart();

  const freeDeliveryThreshold = 499;
  const isFreeDelivery = itemsPrice >= freeDeliveryThreshold;
  const amountNeeded = Math.max(0, freeDeliveryThreshold - itemsPrice);
  const progressPercent = Math.min(100, (itemsPrice / freeDeliveryThreshold) * 100);

  return (
    <div className="bg-[#eaeded] min-h-screen py-6 sm:py-8">
      <div className="container-narrow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Cart Items Section (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Free Delivery Banner */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2
                  className={`h-5 w-5 ${
                    isFreeDelivery ? "text-green-600" : "text-amber-500"
                  }`}
                />
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {isFreeDelivery ? (
                    <span className="text-green-700">
                      Your order qualifies for FREE Scheduled 2-Hour Delivery!
                    </span>
                  ) : (
                    <span>
                      Add{" "}
                      <span className="text-red-700 font-extrabold">
                        ₹{amountNeeded.toLocaleString("en-IN")}
                      </span>{" "}
                      of eligible items to get FREE Scheduled Delivery.
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isFreeDelivery ? "bg-green-600" : "bg-amber-500"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Box */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0f1111]">
                  Shopping Cart
                </h1>
                <span className="hidden sm:inline text-xs text-gray-500">Price</span>
              </div>

              {items.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-4">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Your Nova Mart Cart is empty
                  </h2>
                  <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                    Explore today&apos;s lightning deals and pick your favorite gadgets, apparel, and essentials.
                  </p>
                  <Link
                    href="/search?deals=true"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ffd814] px-6 py-2.5 text-xs font-bold text-[#0f1111] shadow-xs hover:bg-[#f7ca00]"
                  >
                    Explore Today&apos;s Deals
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="py-5 flex flex-col sm:flex-row gap-4 sm:gap-6"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="h-28 w-28 sm:h-36 sm:w-36 shrink-0 rounded-md border border-gray-100 bg-[#f9f9f9] flex items-center justify-center p-2 group"
                      >
                        <img
                          src={product.images[0] || ""}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-3">
                            <Link
                              href={`/products/${product.slug}`}
                              className="text-sm sm:text-base font-bold text-[#0f1111] hover:text-[#c45500] leading-snug"
                            >
                              {product.name}
                            </Link>
                            <span className="font-extrabold text-sm sm:text-base text-gray-900 whitespace-nowrap">
                              ₹{(product.final_price * quantity).toLocaleString("en-IN")}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-green-700 font-semibold">
                            In stock
                          </p>

                          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-600">
                            <Clock className="h-3.5 w-3.5 text-amber-600" />
                            <span>
                              Eligible for{" "}
                              <span className="font-semibold text-gray-900">
                                2-Hour Scheduled Handover
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Quantity & Actions Bar */}
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                          {/* Qty Selector */}
                          <div className="flex items-center gap-1 rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1">
                            <label
                              htmlFor={`qty-${product.id}`}
                              className="text-gray-600 font-medium text-[11px]"
                            >
                              Qty:
                            </label>
                            <select
                              id={`qty-${product.id}`}
                              value={quantity}
                              onChange={(e) =>
                                updateQuantity(product.id, Number(e.target.value))
                              }
                              className="bg-transparent font-bold text-gray-900 focus:outline-none"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                          </div>

                          <span className="text-gray-300">|</span>

                          {/* Delete */}
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-[#007185] hover:text-[#c45500] hover:underline"
                          >
                            Delete
                          </button>

                          <span className="text-gray-300">|</span>

                          {/* Save for later */}
                          <button
                            onClick={() => saveForLater(product.id)}
                            className="text-[#007185] hover:text-[#c45500] hover:underline"
                          >
                            Save for later
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {items.length > 0 && (
                <div className="border-t border-gray-200 pt-4 text-right">
                  <p className="text-base sm:text-lg text-gray-900">
                    Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items):{" "}
                    <span className="font-extrabold">
                      ₹{itemsPrice.toLocaleString("en-IN")}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Saved For Later Section */}
            {saved.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-xs">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Saved for later ({saved.length} items)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {saved.map(({ product }) => (
                    <div
                      key={product.id}
                      className="rounded-lg border border-gray-200 p-3 flex flex-col justify-between"
                    >
                      <div className="h-32 w-full flex items-center justify-center p-2 mb-2 bg-gray-50 rounded">
                        <img
                          src={product.images[0] || ""}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm font-extrabold text-gray-900 mt-1">
                          ₹{product.final_price.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => moveToCart(product.id)}
                          className="flex-1 rounded-full bg-[#ffd814] py-1.5 text-xs font-bold text-[#0f1111] hover:bg-yellow-400"
                        >
                          Move to cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Subtotal & Checkout Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs text-green-700">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                <span>
                  {isFreeDelivery
                    ? "Part of your order qualifies for FREE Scheduled Delivery."
                    : `Add items of ₹${amountNeeded} for FREE delivery.`}
                </span>
              </div>

              <div>
                <p className="text-base sm:text-lg text-gray-900">
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items):{" "}
                  <span className="font-extrabold text-xl text-gray-900 block mt-0.5">
                    ₹{itemsPrice.toLocaleString("en-IN")}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Shipping: {shippingPrice === 0 ? "FREE" : `₹${shippingPrice}`}
                </p>
              </div>

              {/* Proceed to Buy button */}
              <button
                onClick={() => router.push("/checkout")}
                disabled={items.length === 0}
                className="w-full rounded-full bg-[#ffd814] py-3 text-sm font-bold text-[#0f1111] shadow-sm hover:bg-[#f7ca00] active:scale-95 transition border border-[#fcd200] disabled:opacity-40 cursor-pointer"
              >
                Proceed to Buy
              </button>

              <div className="rounded-md bg-amber-50/70 border border-amber-200 p-3 text-xs text-gray-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Clock className="h-4 w-4 text-amber-700" />
                  Scheduled Delivery Available
                </div>
                <p className="text-[11px] text-gray-600">
                  Select your exact date & 2-hour window on the next step. Handover confirmed with secret OTP.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-3 text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-gray-400" />
                <span>Safe and Secure 256-bit SSL Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
