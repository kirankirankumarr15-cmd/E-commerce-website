"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { getAllOrders, ScheduledOrder } from "@/lib/orders";
import { fmtDate, fmtTime } from "@/lib/config";

export default function OrdersListPage() {
  const [orders, setOrders] = useState<ScheduledOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const list = getAllOrders();
    setOrders(list);
    setLoading(false);
  }, []);

  return (
    <div className="bg-[#eaeded] min-h-screen py-8">
      <div className="container-narrow max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0f1111]">Your Orders</h1>
            <p className="text-xs text-gray-600 mt-1">
              Track, reschedule, or reorder with 2-hour scheduled delivery
            </p>
          </div>

          <Link
            href="/search"
            className="rounded-full bg-[#ffd814] px-5 py-2 text-xs font-bold text-gray-900 shadow-xs hover:bg-yellow-400"
          >
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="rounded-lg bg-white p-12 text-center text-gray-500 shadow-xs">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            <p className="mt-2 text-sm">Loading your orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-xs">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h2 className="text-lg font-bold text-gray-900">No orders placed yet</h2>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              You haven&apos;t placed any orders yet. Explore our deals and experience guaranteed 2-hour scheduled deliveries!
            </p>
            <Link
              href="/"
              className="mt-5 inline-block rounded-full bg-[#ffd814] px-6 py-2.5 text-xs font-bold text-gray-900 hover:bg-yellow-400"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const isDelivered = order.status === "delivered";
              const isReturned = order.status === "returned";
              const isOnWay = order.status === "on_the_way";

              return (
                <div
                  key={order.id}
                  className="rounded-lg border border-gray-200 bg-white shadow-xs overflow-hidden"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50/80 px-4 py-3 text-xs text-gray-600 border-b border-gray-200">
                    <div className="flex flex-wrap gap-6 sm:gap-10">
                      <div>
                        <span className="block text-[11px] text-gray-500 uppercase">
                          Order Placed
                        </span>
                        <span className="font-semibold text-gray-900">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[11px] text-gray-500 uppercase">
                          Total
                        </span>
                        <span className="font-semibold text-gray-900">
                          ₹{order.total_amount.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[11px] text-gray-500 uppercase">
                          Ship To
                        </span>
                        <span className="font-semibold text-gray-900">
                          {order.customer_name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-gray-500">
                        Order #{order.id.slice(0, 8)}
                      </span>
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-bold text-[#007185] hover:text-[#c45500] hover:underline"
                      >
                        View Order Details
                      </Link>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-4 sm:p-5">
                    {/* Status Banner */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        {isDelivered ? (
                          <div className="flex items-center gap-1.5 text-sm font-bold text-green-700">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            Delivered on {fmtDate(order.slot_date)}
                          </div>
                        ) : isReturned ? (
                          <div className="flex items-center gap-1.5 text-sm font-bold text-red-700">
                            <RotateCcw className="h-5 w-5 text-red-600" />
                            Order Returned (Missed Handover Limit)
                          </div>
                        ) : isOnWay ? (
                          <div className="flex items-center gap-1.5 text-sm font-bold text-blue-700">
                            <Truck className="h-5 w-5 text-blue-600 animate-pulse" />
                            Partner is on the way!
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-sm font-bold text-amber-800">
                            <Clock className="h-5 w-5 text-amber-600" />
                            Scheduled: {fmtDate(order.slot_date)} ({fmtTime(order.start_time)} – {fmtTime(order.end_time)})
                          </div>
                        )}
                      </div>

                      {/* 4-Digit Handover Code badge for Customer */}
                      {!isDelivered && !isReturned && (
                        <div className="flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-200 px-3 py-1">
                          <span className="text-xs text-amber-900 font-medium">
                            Handover Code:
                          </span>
                          <span className="font-mono text-sm font-extrabold tracking-widest text-amber-950">
                            {order.delivery_otp}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Items and Quick Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-3">
                        {order.items && order.items.length > 0 ? (
                          order.items.slice(0, 3).map(({ product, quantity }) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              className="h-16 w-16 rounded border border-gray-100 bg-[#f9f9f9] p-1 flex items-center justify-center hover:border-amber-400 transition"
                            >
                              <img
                                src={product.images[0] || ""}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </Link>
                          ))
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Package className="h-5 w-5 text-gray-400" />
                            <span>1 scheduled shipment</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <Link
                          href={`/orders/${order.id}`}
                          className="flex-1 sm:flex-none text-center rounded-full bg-[#ffd814] px-4 py-2 text-xs font-bold text-gray-900 shadow-xs hover:bg-yellow-400"
                        >
                          Track Package
                        </Link>
                        {!isDelivered && !isReturned && (
                          <Link
                            href={`/orders/${order.id}/schedule`}
                            className="flex-1 sm:flex-none text-center rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50"
                          >
                            Reschedule Slot
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
