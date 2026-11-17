"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  ShieldAlert,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
} from "lucide-react";
import {
  SLOT_WINDOWS,
  DEFAULT_CAPACITY,
  validDates,
  fmtDate,
  fmtTime,
} from "@/lib/config";
import { getAllOrders } from "@/lib/orders";

interface BlockedDate {
  id: string;
  pincode: string;
  date: string;
  reason: string;
}

export default function AdminSlotsPage() {
  const [selectedPincode, setSelectedPincode] = useState("560103");
  const [capacities, setCapacities] = useState<Record<string, number>>({});
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([
    {
      id: "block-1",
      pincode: "560103",
      date: validDates()[5] || "2026-11-23",
      reason: "Public Holiday / Festival Maintenance",
    },
  ]);

  // Block Modal State
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockPincode, setBlockPincode] = useState("560103");
  const [blockDate, setBlockDate] = useState(validDates()[1] || "");
  const [blockReason, setBlockReason] = useState("");
  const [savedNotice, setSavedNotice] = useState("");

  const dates = validDates();
  const orders = getAllOrders();

  const getCapacity = (date: string, start: string) => {
    const key = `${selectedPincode}-${date}-${start}`;
    return capacities[key] ?? DEFAULT_CAPACITY;
  };

  const setCapacity = (date: string, start: string, cap: number) => {
    const key = `${selectedPincode}-${date}-${start}`;
    setCapacities((prev) => ({ ...prev, [key]: cap }));
    setSavedNotice("Capacity updated successfully.");
    setTimeout(() => setSavedNotice(""), 3000);
  };

  const isDateBlocked = (date: string) => {
    return blockedDates.some(
      (b) => b.date === date && (b.pincode === selectedPincode || b.pincode === "ALL")
    );
  };

  const getBookedCount = (date: string, start: string) => {
    return orders.filter(
      (o) =>
        o.pincode === selectedPincode &&
        o.slot_date === date &&
        o.start_time === start
    ).length;
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate) return;

    const newBlock: BlockedDate = {
      id: `block-${Date.now()}`,
      pincode: blockPincode,
      date: blockDate,
      reason: blockReason || "Regional lockdown or scheduled maintenance",
    };

    setBlockedDates([newBlock, ...blockedDates]);
    setShowBlockModal(false);
    setBlockReason("");
    setSavedNotice("Date blocked successfully.");
    setTimeout(() => setSavedNotice(""), 3000);
  };

  const handleRemoveBlock = (id: string) => {
    setBlockedDates((prev) => prev.filter((b) => b.id !== id));
    setSavedNotice("Date block removed.");
    setTimeout(() => setSavedNotice(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Slot Capacity & Date Blocking
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure delivery window quotas per pincode and block unavailable dates across regions.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowBlockModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
          >
            <ShieldAlert className="h-4 w-4 text-red-600" />
            Block Date
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="rounded-lg bg-green-50 p-3 text-xs font-semibold text-green-800 border border-green-200 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Pincode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <label htmlFor="pincode-select" className="text-xs font-bold text-gray-700">
            Select Active Pincode:
          </label>
          <select
            id="pincode-select"
            value={selectedPincode}
            onChange={(e) => setSelectedPincode(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-900 shadow-2xs focus:border-amber-500 focus:outline-none"
          >
            <option value="560103">560103 (Bellandur, Bangalore)</option>
            <option value="577201">577201 (Shivamogga Main)</option>
            <option value="560037">560037 (Marathahalli, Bangalore)</option>
            <option value="560001">560001 (MG Road, Bangalore)</option>
          </select>
        </div>

        <span className="text-xs text-gray-500">
          Default Capacity: <strong className="text-gray-900">{DEFAULT_CAPACITY} orders / window</strong>
        </span>
      </div>

      {/* 7-Day Live Slots Capacity Grid */}
      <div className="space-y-4">
        {dates.map((date) => {
          const blocked = isDateBlocked(date);

          return (
            <div
              key={date}
              className={`rounded-xl border bg-white p-5 shadow-xs transition ${
                blocked ? "border-red-200 bg-red-50/20" : "border-gray-200"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-gray-900">
                    {fmtDate(date)} ({date})
                  </h3>
                </div>

                {blocked ? (
                  <span className="rounded-full bg-red-100 px-3 py-0.5 text-xs font-bold text-red-800">
                    Date Blocked (Unavailable to Customers)
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-green-700">
                    Slots Open for Booking
                  </span>
                )}
              </div>

              {/* Windows in this day */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {SLOT_WINDOWS.map((win) => {
                  const cap = getCapacity(date, win.start);
                  const booked = getBookedCount(date, win.start);
                  const remaining = Math.max(0, cap - booked);

                  return (
                    <div
                      key={win.start}
                      className={`rounded-lg border p-3 flex flex-col justify-between ${
                        blocked
                          ? "border-gray-200 bg-gray-50 text-gray-400"
                          : remaining === 0
                          ? "border-red-200 bg-red-50/40"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-gray-900">
                            {fmtTime(win.start)} – {fmtTime(win.end)}
                          </span>
                        </div>

                        <div className="mt-2 text-xs space-y-1">
                          <div className="flex justify-between text-gray-500">
                            <span>Booked:</span>
                            <span className="font-bold text-gray-900">{booked}</span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>Remaining:</span>
                            <span
                              className={`font-bold ${
                                remaining === 0 ? "text-red-600" : "text-green-700"
                              }`}
                            >
                              {blocked ? 0 : remaining}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Capacity adjust input */}
                      {!blocked && (
                        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                          <label className="text-gray-500">Max Cap:</label>
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={cap}
                            onChange={(e) =>
                              setCapacity(date, win.start, Number(e.target.value))
                            }
                            className="w-14 rounded border border-gray-300 p-1 text-center font-bold"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Blocked Dates List Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-sm font-bold text-gray-900">
            Active Regional Date Blocks
          </h2>
          <p className="text-xs text-gray-500">
            Dates where deliveries are temporarily suspended due to holidays or weather
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {blockedDates.map((b) => (
            <div
              key={b.id}
              className="p-4 flex flex-wrap items-center justify-between gap-4 text-xs"
            >
              <div>
                <span className="font-bold text-gray-900">{fmtDate(b.date)}</span>
                <span className="text-gray-500 ml-2">
                  (Pincode: <strong className="text-gray-800">{b.pincode}</strong>)
                </span>
                <p className="text-gray-600 mt-0.5">{b.reason}</p>
              </div>

              <button
                onClick={() => handleRemoveBlock(b.id)}
                className="flex items-center gap-1 rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Unblock Date
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BLOCK DATE MODAL */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900">Block Delivery Date</h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBlock} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Target Pincode *
                </label>
                <select
                  value={blockPincode}
                  onChange={(e) => setBlockPincode(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs"
                >
                  <option value="560103">560103 (Bellandur)</option>
                  <option value="577201">577201 (Shivamogga)</option>
                  <option value="ALL">ALL PINCODES (System-Wide Block)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Date *</label>
                <select
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs"
                >
                  {dates.map((d) => (
                    <option key={d} value={d}>
                      {fmtDate(d)} ({d})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Reason for Block *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Festival Holiday / Severe Monsoon Warning"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-5 py-2 font-bold text-white hover:bg-red-700"
                >
                  Confirm Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
