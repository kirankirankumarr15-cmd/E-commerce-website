"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { getAllOrders, updateOrderStatus, ScheduledOrder } from "@/lib/orders";
import { fmtDate, fmtTime } from "@/lib/config";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<ScheduledOrder[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ScheduledOrder | null>(null);

  const load = () => {
    setOrders(getAllOrders());
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.pincode.includes(search) ||
      o.customer_phone.includes(search);
    return matchStatus && matchSearch;
  });

  const handleUpdateStatus = (
    orderId: string,
    newStatus: "scheduled" | "on_the_way" | "delivered" | "returned"
  ) => {
    updateOrderStatus(orderId, (o) => ({
      ...o,
      status: newStatus,
      delivered_at: newStatus === "delivered" ? new Date().toISOString() : o.delivered_at,
    }));
    load();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Orders & Shipments</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor delivery slots, verify 4-digit handover codes, and track fulfillment status.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer, Phone, or Pincode…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-1.5 pl-9 pr-3 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-xs text-gray-600 font-medium">
            Status:
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-2xs focus:border-amber-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="on_the_way">On The Way</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b">
              <tr>
                <th className="py-3 px-4">Order Details</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Scheduled Slot</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-gray-900 block">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900">{order.customer_name}</p>
                      <p className="text-[11px] text-gray-500">
                        {order.pincode} · {order.customer_phone}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-800 block">
                        {fmtDate(order.slot_date)}
                      </span>
                      <span className="text-[11px] text-amber-800 font-semibold">
                        {fmtTime(order.start_time)} – {fmtTime(order.end_time)}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-gray-900">
                      ₹{order.total_amount.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          order.payment_method === "cod"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.payment_method}
                      </span>
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

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="rounded border border-gray-300 px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          View
                        </button>
                        {order.status !== "delivered" && order.status !== "returned" && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, "delivered")}
                            className="rounded bg-green-50 text-green-700 border border-green-200 px-2 py-1 text-[11px] font-semibold hover:bg-green-100"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  Order Details #{selectedOrder.id}
                </h3>
                <span className="text-xs text-gray-500">
                  Customer Delivery Handover Record
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Slot & Code */}
              <div className="rounded-lg border border-amber-300 bg-amber-50/60 p-4 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-900 block">
                    Scheduled Delivery Window:
                  </span>
                  <span className="font-extrabold text-sm text-gray-900">
                    {fmtDate(selectedOrder.slot_date)}, {fmtTime(selectedOrder.start_time)} – {fmtTime(selectedOrder.end_time)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-gray-500 block">Customer OTP:</span>
                  <span className="font-mono text-base font-black text-amber-950 bg-white px-2 py-0.5 rounded border border-amber-300">
                    {selectedOrder.delivery_otp}
                  </span>
                </div>
              </div>

              {/* Customer and Address */}
              <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 p-3 bg-gray-50/50">
                <div>
                  <span className="font-bold text-gray-700 block mb-1">Customer Info</span>
                  <p className="font-semibold text-gray-900">{selectedOrder.customer_name}</p>
                  <p className="text-gray-600">{selectedOrder.customer_phone}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-700 block mb-1">Shipping Address</span>
                  <p className="text-gray-900">{selectedOrder.address}</p>
                  <p className="font-semibold text-gray-900">Pincode: {selectedOrder.pincode}</p>
                </div>
              </div>

              {/* Status Update Options */}
              <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-gray-700">Change Status:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "scheduled")}
                    className="rounded px-2.5 py-1 text-xs border border-gray-300 hover:bg-gray-50"
                  >
                    Scheduled
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "on_the_way")}
                    className="rounded px-2.5 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                  >
                    On The Way
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "delivered")}
                    className="rounded px-2.5 py-1 text-xs bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "returned")}
                    className="rounded px-2.5 py-1 text-xs bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                  >
                    Returned
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
