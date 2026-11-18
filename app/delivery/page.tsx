"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Truck,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  User,
  Check,
  ShieldAlert,
} from "lucide-react";
import { authHeader } from "@/lib/supabaseBrowser";
import { getAllOrders, updateOrderStatus, ScheduledOrder } from "@/lib/orders";
import { fmtTime, fmtDate, istDate } from "@/lib/config";
import { useAuth } from "@/lib/authContext";

type Drop = {
  id: string;
  customerName?: string;
  customerPhone?: string;
  address: string;
  pincode: string;
  start: string;
  end: string;
  onTheWay: boolean;
  status?: string;
  attempts?: number;
};

export default function DeliveryPartnerPage() {
  const { user, loading: authLoading, loginDemo } = useAuth();

  // All hooks must come BEFORE any conditional return (Rules of Hooks)
  const [drops, setDrops] = useState<Drop[]>([]);
  const [partnerName, setPartnerName] = useState("Rajesh Kumar (Partner)");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [otp, setOtp] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);

  const load = useCallback(async () => {
    setError("");

    // 1. Try backend API first
    try {
      const res = await fetch("/api/delivery/today", {
        headers: await authHeader(),
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        setPartnerName(json.partner || "Partner");
        if (json.orders && json.orders.length > 0) {
          setDrops(json.orders);
          return;
        }
      }
    } catch {
      // fallback to local orders
    }

    // 2. Local fallback from orders store
    const local = getAllOrders();
    const scheduled = local
      .filter((o) => o.status === "scheduled" || o.status === "on_the_way")
      .map((o) => ({
        id: o.id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        address: o.address,
        pincode: o.pincode,
        start: o.start_time,
        end: o.end_time,
        onTheWay: Boolean(o.on_my_way_at || o.status === "on_the_way"),
        status: o.status,
        attempts: o.attempts,
      }))
      .sort((a, b) => a.start.localeCompare(b.start));

    setDrops(scheduled);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // 60-Second Auto Refresh Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          load();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [load]);

  // Auth guard: show login prompt AFTER all hooks (Rules of Hooks compliance)
  if (!authLoading && (!user || (user.role !== "partner" && user.role !== "admin"))) {
    return (
      <div className="min-h-screen bg-[#eaeded] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 shadow-sm text-center max-w-md w-full space-y-4">
          <ShieldAlert className="h-10 w-10 text-amber-500 mx-auto" />
          <h1 className="text-lg font-bold text-gray-900">Delivery Partner Portal</h1>
          <p className="text-xs text-gray-500">
            This portal is restricted to verified Nova Mart delivery partners.
          </p>
          <div className="pt-2 space-y-2">
            <button
              onClick={() => loginDemo("partner")}
              className="w-full rounded-full bg-[#ffd814] py-2.5 text-sm font-bold text-gray-900 hover:bg-yellow-400"
            >
              Continue as Demo Partner
            </button>
            <Link href="/" className="block text-xs text-[#007185] hover:underline mt-2">
              ← Back to Nova Mart Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function act(id: string, action: "start" | "deliver" | "unavailable") {
    setBusy(id);
    setNotice("");

    // Try backend API endpoint
    try {
      const res = await fetch(`/api/delivery/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeader()) },
        body: JSON.stringify({ action, otp: otp[id] }),
      });
      const json = await res.json();
      if (res.ok) {
        setNotice(json.message || "Operation successful.");
        load();
        return;
      }
    } catch {
      // continue to local fallback
    }

    // Local handler fallback for full development & test cycle
    const currentOtp = otp[id] || "";
    if (action === "deliver") {
      if (currentOtp.length !== 4) {
        setNotice("Please enter the 4-digit code provided by the customer.");
        setBusy(null);
        return;
      }
      const updated = updateOrderStatus(id, (o) => {
        if (o.delivery_otp !== currentOtp) {
          return { ...o, otp_tries: (o.otp_tries || 0) + 1 };
        }
        return { ...o, status: "delivered", delivered_at: new Date().toISOString() };
      });

      if (updated?.status === "delivered") {
        setNotice("Delivered successfully! Code verified.");
        load();
      } else {
        setNotice("Wrong code. Ask the customer to check their order details page.");
      }
    } else if (action === "start") {
      updateOrderStatus(id, (o) => ({
        ...o,
        status: "on_the_way",
        on_my_way_at: new Date().toISOString(),
      }));
      setNotice("Trip started! Customer notified that you are on the way.");
      load();
    } else if (action === "unavailable") {
      updateOrderStatus(id, (o) => {
        const nextAttempts = (o.attempts || 0) + 1;
        if (nextAttempts >= 2) {
          return { ...o, status: "returned", attempts: nextAttempts };
        }
        return { ...o, attempts: nextAttempts };
      });
      setNotice("Customer marked unavailable. Notification dispatched for reschedule / pickup point fallback.");
      load();
    }

    setBusy(null);
  }

  const slotKeys = Array.from(new Set(drops.map((d) => `${d.start}-${d.end}`)));

  return (
    <div className="bg-[#eaeded] min-h-screen py-6 sm:py-8">
      <main className="container-narrow max-w-2xl space-y-6">
        {/* Partner Header */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white font-bold">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Delivery Partner Portal</h1>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {partnerName} · Today&apos;s Drops ({drops.length})
                </p>
              </div>
            </div>

            {/* 60s Refresh Indicator */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCountdown(60);
                  load();
                }}
                className="flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                <RotateCw className="h-3.5 w-3.5 text-amber-600" />
                <span>Refresh ({countdown}s)</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-xs text-red-800 border border-red-200 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {notice && (
          <div className="rounded-lg bg-green-50 p-4 text-xs font-semibold text-green-800 border border-green-200 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {drops.length === 0 && !error && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-xs">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-3" />
            <h2 className="text-lg font-bold text-gray-900">All caught up!</h2>
            <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
              No pending scheduled drops in your zone today. New orders booked by customers will show up automatically.
            </p>
          </div>
        )}

        {/* Drops grouped by 2-hour window */}
        {slotKeys.map((s) => {
          const [start, end] = s.split("-");
          const windowDrops = drops.filter((d) => d.start === start);

          return (
            <section key={s} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Clock className="h-4 w-4 text-amber-600" />
                  Window: {fmtTime(start)} – {fmtTime(end)}
                </h2>
                <span className="text-xs font-semibold text-gray-500">
                  {windowDrops.length} drop(s)
                </span>
              </div>

              {windowDrops.map((d) => {
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${d.address} ${d.pincode}`
                )}`;
                const phoneUrl = `tel:${d.customerPhone || "+919876543210"}`;

                return (
                  <article
                    key={d.id}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4"
                  >
                    {/* Customer & Address Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          Order #{d.id.slice(0, 8)}
                        </span>
                        <h3 className="text-base font-bold text-gray-900 mt-1">
                          {d.customerName || "Customer"}
                        </h3>
                        <p className="text-xs text-gray-700 mt-0.5 flex items-start gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                          <span>
                            {d.address} · <span className="font-bold">{d.pincode}</span>
                          </span>
                        </p>
                      </div>

                      {/* Quick Action Contact Links */}
                      <div className="flex items-center gap-2">
                        {/* Call Customer */}
                        <a
                          href={phoneUrl}
                          className="flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-800 hover:bg-gray-100 transition shadow-2xs"
                        >
                          <Phone className="h-3.5 w-3.5 text-green-600" />
                          <span>Call</span>
                        </a>

                        {/* Open in Google Maps */}
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-800 hover:bg-gray-100 transition shadow-2xs"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
                          <span>Map</span>
                        </a>
                      </div>
                    </div>

                    {/* Partner Delivery Actions */}
                    <div className="border-t border-gray-100 pt-4 space-y-3">
                      {d.onTheWay ? (
                        <div className="rounded-md bg-blue-50 p-2.5 text-xs font-semibold text-blue-800 flex items-center gap-2">
                          <Truck className="h-4 w-4 text-blue-600 shrink-0" />
                          <span>Trip started. Customer knows you are on the way.</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => act(d.id, "start")}
                          disabled={busy === d.id}
                          className="flex items-center gap-1.5 rounded-lg border border-gray-800 bg-white px-4 py-2 text-xs font-bold text-gray-900 hover:bg-gray-50 active:scale-95 transition disabled:opacity-40"
                        >
                          <Truck className="h-4 w-4" />
                          I&apos;m on my way
                        </button>
                      )}

                      {/* Handover OTP Verification Form */}
                      <div className="rounded-lg bg-gray-50 p-3.5 border border-gray-200 space-y-2">
                        <label
                          htmlFor={`otp-${d.id}`}
                          className="block text-xs font-bold text-gray-800"
                        >
                          Enter Customer&apos;s 4-Digit Handover Code:
                        </label>

                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            id={`otp-${d.id}`}
                            inputMode="numeric"
                            maxLength={4}
                            placeholder="0000"
                            value={otp[d.id] ?? ""}
                            onChange={(e) =>
                              setOtp({
                                ...otp,
                                [d.id]: e.target.value.replace(/\D/g, ""),
                              })
                            }
                            className="w-28 rounded-md border border-gray-300 bg-white px-3 py-2 text-center font-mono text-base font-black tracking-widest text-gray-900 shadow-2xs focus:border-amber-500 focus:outline-none"
                          />

                          <button
                            onClick={() => act(d.id, "deliver")}
                            disabled={busy === d.id || (otp[d.id] ?? "").length !== 4}
                            className="rounded-md bg-[#ffd814] px-4 py-2 text-xs font-bold text-gray-900 hover:bg-yellow-400 active:scale-95 transition shadow-xs disabled:opacity-40"
                          >
                            Confirm Delivery
                          </button>

                          <button
                            onClick={() => act(d.id, "unavailable")}
                            disabled={busy === d.id}
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition disabled:opacity-40"
                          >
                            Customer not available
                          </button>
                        </div>

                        <p className="text-[11px] text-gray-500">
                          OTP is provided only by the customer upon arrival. Ensures secure, tamper-free handovers.
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          );
        })}
      </main>
    </div>
  );
}
