"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  DollarSign,
  Truck,
  Clock,
  ArrowUpRight,
  Package,
  Calendar,
  CheckCircle2,
  Users,
} from "lucide-react";
import { getAllOrders, ScheduledOrder } from "@/lib/orders";
import { SEED_PRODUCTS } from "@/lib/seedData";
import { fmtDate, fmtTime } from "@/lib/config";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<ScheduledOrder[]>([]);

  useEffect(() => {
    setOrders(getAllOrders());
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 48520);
  const totalOrders = orders.length > 0 ? orders.length : 14;
  const activeDropsToday = orders.filter(
    (o) => o.status === "scheduled" || o.status === "on_the_way"
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Operations Overview</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor real-time sales, scheduled deliveries, slot capacities, and partner fleet.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/products"
            className="rounded-lg bg-[#ffd814] px-4 py-2 text-xs font-bold text-gray-900 hover:bg-yellow-400 shadow-2xs"
          >
            + Add Product
          </Link>
          <Link
            href="/admin/slots"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50 shadow-2xs"
          >
            Manage Slots
          </Link>
        </div>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="rounded-full bg-green-50 p-2 text-green-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-gray-900">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <span className="mt-1 inline-flex items-center text-[11px] font-semibold text-green-700">
            +18.4% this month
          </span>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="rounded-full bg-blue-50 p-2 text-blue-600">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-gray-900">{totalOrders}</p>
          <span className="mt-1 inline-flex items-center text-[11px] font-semibold text-blue-700">
            Guaranteed scheduled slots
          </span>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Today&apos;s Active Drops
            </span>
            <div className="rounded-full bg-amber-50 p-2 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-gray-900">
            {activeDropsToday > 0 ? activeDropsToday : 3}
          </p>
          <span className="mt-1 inline-flex items-center text-[11px] font-semibold text-amber-700">
            2-Hour Windows
          </span>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Catalog Products
            </span>
            <div className="rounded-full bg-purple-50 p-2 text-purple-600">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-gray-900">
            {SEED_PRODUCTS.length}
          </p>
          <span className="mt-1 inline-flex items-center text-[11px] font-semibold text-purple-700">
            Across 6 categories
          </span>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Recent Scheduled Orders
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Customer bookings requiring 4-digit code handover verification
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs font-bold text-[#007185] hover:text-[#c45500] hover:underline"
          >
            <span>View All</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Pincode</th>
                <th className="py-3 px-4">Slot Window</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">OTP Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No orders recorded yet. Placing a test order from checkout will display it here!
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-[#007185] hover:underline"
                      >
                        #{order.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {order.customer_name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{order.pincode}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">
                      {fmtDate(order.slot_date)} ({fmtTime(order.start_time)}–{fmtTime(order.end_time)})
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      ₹{order.total_amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "on_the_way"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "returned"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {order.status === "delivered" ? (
                        <span className="text-green-700 font-semibold">Verified</span>
                      ) : (
                        <span className="text-amber-700 font-semibold">Pending Code</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
