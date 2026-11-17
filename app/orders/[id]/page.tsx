"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Calendar,
  Phone,
  ChevronLeft,
  XCircle,
  Building2,
} from "lucide-react";
import { getOrderById, updateOrderStatus, ScheduledOrder } from "@/lib/orders";
import { fmtDate, fmtTime, isTooSoon, MAX_RESCHEDULES } from "@/lib/config";
import SlotPicker from "@/components/SlotPicker";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.id as string) || "";

  const [order, setOrder] = useState<ScheduledOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showPickupPoint, setShowPickupPoint] = useState(false);
  const [cancelNotice, setCancelNotice] = useState("");

  const load = React.useCallback(() => {
    if (!orderId) return;
    const found = getOrderById(orderId);
    setOrder(found);
    setLoading(false);
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="bg-[#eaeded] min-h-screen py-16 text-center text-gray-500">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        <p className="mt-2 text-sm">Loading order details…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-[#eaeded] min-h-screen py-16 text-center">
        <div className="container-narrow max-w-md mx-auto bg-white p-8 rounded-lg shadow-xs">
          <h1 className="text-xl font-bold text-gray-900">Order not found</h1>
          <p className="mt-2 text-xs text-gray-500">
            We could not find the requested order.
          </p>
          <Link
            href="/orders"
            className="mt-6 inline-block rounded-full bg-[#ffd814] px-6 py-2.5 text-xs font-bold text-gray-900"
          >
            View Your Orders
          </Link>
        </div>
      </div>
    );
  }

  const isDelivered = order.status === "delivered";
  const isReturned = order.status === "returned";
  const isOnTheWay = order.status === "on_the_way" || Boolean(order.on_my_way_at);
  const isMissedOnce = order.attempts === 1 && !isReturned && !isDelivered;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.delivery_otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCancelOrder = () => {
    if (isTooSoon(order.slot_date, order.start_time)) {
      setCancelNotice(
        "Orders cannot be cancelled within 2 hours of the scheduled delivery window."
      );
      return;
    }
    updateOrderStatus(order.id, (o) => ({
      ...o,
      status: "returned",
    }));
    setCancelNotice("Order has been cancelled.");
    load();
  };

  return (
    <div className="bg-[#eaeded] min-h-screen py-6 sm:py-8">
      <div className="container-narrow max-w-4xl space-y-6">
        {/* Back Link & Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007185] hover:text-[#c45500] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Your Orders
          </Link>

          <span className="text-xs text-gray-500">
            Order #{order.id}
          </span>
        </div>

        {/* AMAZON STATUS TIMELINE */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
            Delivery Status
          </h2>

          <div className="relative flex items-center justify-between px-2 sm:px-6">
            {/* Timeline Line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gray-200 -z-0" />
            <div
              className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-green-600 transition-all duration-500 -z-0"
              style={{
                width: isDelivered
                  ? "calc(100% - 3rem)"
                  : isOnTheWay
                  ? "66%"
                  : "33%",
              }}
            />

            {/* Step 1: Placed */}
            <div className="relative z-10 flex flex-col items-center bg-white px-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-bold text-xs shadow-xs">
                ✓
              </div>
              <span className="text-[11px] font-bold text-gray-800 mt-1">Placed</span>
            </div>

            {/* Step 2: Scheduled */}
            <div className="relative z-10 flex flex-col items-center bg-white px-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-bold text-xs shadow-xs">
                ✓
              </div>
              <span className="text-[11px] font-bold text-gray-800 mt-1">Scheduled</span>
            </div>

            {/* Step 3: Out for delivery */}
            <div className="relative z-10 flex flex-col items-center bg-white px-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs shadow-xs ${
                  isOnTheWay || isDelivered
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <Truck className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-gray-800 mt-1">On the way</span>
            </div>

            {/* Step 4: Delivered */}
            <div className="relative z-10 flex flex-col items-center bg-white px-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs shadow-xs ${
                  isDelivered
                    ? "bg-green-600 text-white"
                    : isReturned
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isDelivered ? "✓" : isReturned ? "✕" : "4"}
              </div>
              <span className="text-[11px] font-bold text-gray-800 mt-1">
                {isReturned ? "Returned" : "Delivered"}
              </span>
            </div>
          </div>
        </div>

        {/* SIGNATURE 4-DIGIT HANDOVER OTP CARD */}
        {!isDelivered && !isReturned && (
          <div className="rounded-xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-white to-amber-50/40 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <ShieldCheck className="h-5 w-5 text-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Handover Verification
                  </span>
                </div>
                <h3 className="text-lg font-black text-gray-900">
                  Your 4-Digit Delivery Code
                </h3>
                <p className="text-xs text-gray-600 max-w-md">
                  Keep this code ready. Share it with your delivery partner only when they arrive at your door with your parcel.
                </p>
              </div>

              {/* Large OTP Digits */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  {order.delivery_otp.split("").map((digit, i) => (
                    <div
                      key={i}
                      className="flex h-12 w-11 sm:h-14 sm:w-12 items-center justify-center rounded-lg border-2 border-amber-500 bg-white font-mono text-2xl font-black text-amber-950 shadow-xs"
                    >
                      {digit}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 py-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-green-700">Code Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PARTNER ON THE WAY BANNER */}
        {isOnTheWay && !isDelivered && (
          <div className="rounded-lg border border-blue-200 bg-blue-50/80 p-4 text-blue-950 flex items-center gap-3">
            <Truck className="h-6 w-6 text-blue-600 shrink-0 animate-bounce" />
            <div>
              <p className="text-sm font-bold">
                Your delivery partner is currently on the way!
              </p>
              <p className="text-xs text-blue-800">
                Arriving within your window: {fmtTime(order.start_time)} – {fmtTime(order.end_time)}. Please keep your 4-digit code handy.
              </p>
            </div>
          </div>
        )}

        {/* MISSED ATTEMPT NOTICE & PICKUP POINT FALLBACK */}
        {isMissedOnce && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertCircle className="h-5 w-5 text-amber-700" />
              Delivery Attempt Missed (Attempt 1 of 2)
            </div>
            <p className="text-xs text-amber-800">
              Our partner could not reach you during your scheduled window. You can pick another delivery window (up to {MAX_RESCHEDULES} reschedules) or collect from our nearest pickup point.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => setShowRescheduleModal(true)}
                className="rounded-full bg-[#ffd814] px-4 py-2 text-xs font-bold text-gray-900 shadow-xs hover:bg-yellow-400"
              >
                Reschedule Delivery Slot
              </button>
              <button
                onClick={() => setShowPickupPoint(true)}
                className="rounded-full border border-amber-700 bg-white px-4 py-2 text-xs font-bold text-amber-900 hover:bg-amber-50"
              >
                Collect from Nearest Pickup Point
              </button>
            </div>
          </div>
        )}

        {/* PICKUP POINT DRAWER/MODAL */}
        {showPickupPoint && (
          <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                <Building2 className="h-4 w-4 text-amber-600" />
                Nearest NovaMart Pickup Point
              </div>
              <button
                onClick={() => setShowPickupPoint(false)}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                ✕ Close
              </button>
            </div>
            <div className="text-xs text-gray-700 space-y-1">
              <p className="font-bold text-gray-900">NovaMart Hub - Bellandur Outer Ring Road</p>
              <p>Next to Central Mall, Bellandur, Bangalore - 560103</p>
              <p className="text-gray-500">Open Daily: 08:00 AM – 09:00 PM</p>
              <p className="text-green-700 font-medium">Your package is safely reserved here for 48 hours.</p>
            </div>
          </div>
        )}

        {/* SCHEDULED WINDOW & ACTIONS */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs font-medium text-gray-500 block">
                Scheduled Handover Window
              </span>
              <p className="text-base font-extrabold text-gray-900 mt-0.5">
                {fmtDate(order.slot_date)} from {fmtTime(order.start_time)} to {fmtTime(order.end_time)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Reschedules used: {order.reschedule_count} of {MAX_RESCHEDULES}
              </p>
            </div>

            {!isDelivered && !isReturned && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowRescheduleModal(true)}
                  disabled={order.reschedule_count >= MAX_RESCHEDULES}
                  className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-40"
                >
                  {order.reschedule_count >= MAX_RESCHEDULES
                    ? "Reschedule Limit Reached"
                    : "Change Delivery Time"}
                </button>

                <button
                  onClick={handleCancelOrder}
                  className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>

          {cancelNotice && (
            <p className="text-xs font-medium text-red-700">{cancelNotice}</p>
          )}

          {/* Delivery & Payment Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 text-xs">
            <div>
              <h4 className="font-bold text-gray-900 mb-1.5 uppercase tracking-wider text-[11px]">
                Shipping Address
              </h4>
              <p className="font-semibold text-gray-900">{order.customer_name}</p>
              <p className="text-gray-600 mt-0.5">{order.address}</p>
              <p className="text-gray-600 font-medium">Pincode: {order.pincode}</p>
              <p className="text-gray-500 mt-1">Phone: {order.customer_phone}</p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-1.5 uppercase tracking-wider text-[11px]">
                Payment Method
              </h4>
              <p className="font-semibold text-gray-900 capitalize">
                {order.payment_method === "cod"
                  ? "Pay on Delivery (Cash / UPI)"
                  : "Online Payment (Paid)"}
              </p>
              <span className="inline-block mt-1 rounded bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700">
                {order.payment_status === "paid" ? "Payment Completed" : "Payment Due on Delivery"}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-1.5 uppercase tracking-wider text-[11px]">
                Order Summary
              </h4>
              <div className="space-y-1 text-gray-600">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span>₹{order.total_amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Scheduled Delivery:</span>
                  <span className="text-green-700 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t pt-1">
                  <span>Grand Total:</span>
                  <span>₹{order.total_amount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER ITEMS LIST */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
          <h3 className="font-bold text-sm text-gray-900 mb-4">Items in this shipment</h3>
          <div className="divide-y divide-gray-100">
            {order.items && order.items.length > 0 ? (
              order.items.map(({ product, quantity }) => (
                <div key={product.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.images[0] || ""}
                      alt={product.name}
                      className="h-16 w-16 object-contain rounded border border-gray-100 p-1"
                    />
                    <div>
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#c45500]"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">Quantity: {quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-gray-900">
                    ₹{(product.final_price * quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 py-2">Shipment details recorded.</p>
            )}
          </div>
        </div>

        {/* RESCHEDULE MODAL */}
        {showRescheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
            <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-base text-gray-900">
                  Reschedule Delivery Time
                </h3>
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <SlotPicker
                orderId={order.id}
                pincode={order.pincode}
                onBooked={() => {
                  updateOrderStatus(order.id, (o) => ({
                    ...o,
                    reschedule_count: o.reschedule_count + 1,
                  }));
                  setShowRescheduleModal(false);
                  load();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
