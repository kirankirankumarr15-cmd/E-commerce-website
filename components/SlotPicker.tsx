"use client";

import { useCallback, useEffect, useState } from "react";
import { authHeader } from "@/lib/supabaseBrowser";
import { Clock, CheckCircle2, AlertCircle, Calendar } from "lucide-react";

type Win = { start: string; end: string; left: number; available: boolean };
type Day = { date: string; windows: Win[] };

const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}${m ? ":" + String(m).padStart(2, "0") : ""} ${h >= 12 ? "PM" : "AM"}`;
};

const fmtDay = (d: string) =>
  new Date(`${d}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });

type Props = {
  orderId?: string;
  pincode: string;
  selectedSlot?: { date: string; start: string; end: string } | null;
  onSelectSlot?: (slot: { date: string; start: string; end: string }) => void;
  onBooked?: () => void;
};

export default function SlotPicker({
  orderId,
  pincode,
  selectedSlot,
  onSelectSlot,
  onBooked,
}: Props) {
  const [days, setDays] = useState<Day[]>([]);
  const [date, setDate] = useState<string>(selectedSlot?.date || "");
  const [win, setWin] = useState<Win | null>(
    selectedSlot ? { start: selectedSlot.start, end: selectedSlot.end, left: 1, available: true } : null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const load = useCallback(async () => {
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/slots?pincode=${pincode}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setDays(json.days || []);
      setDate((prev) => {
        if (prev && json.days?.some((d: Day) => d.date === prev)) return prev;
        const firstAvailable = json.days?.find((d: Day) => d.windows.some((w) => w.available));
        return firstAvailable?.date || json.days?.[0]?.date || "";
      });
    } catch (e: any) {
      setError(e.message || "Could not load slots.");
    } finally {
      setLoading(false);
    }
  }, [pincode]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSelectWindow = (w: Win) => {
    if (!w.available) return;
    setWin(w);
    if (onSelectSlot && date) {
      onSelectSlot({ date, start: w.start, end: w.end });
    }
  };

  async function confirm() {
    if (!win || !date) return;
    if (!orderId) {
      // Standalone mode: already emitted via onSelectSlot
      setDone(`Selected for ${fmtDay(date)}, ${fmtTime(win.start)} – ${fmtTime(win.end)}.`);
      return;
    }

    setSaving(true);
    setError("");
    setDone("");
    try {
      const res = await fetch(`/api/orders/${orderId}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeader()) },
        body: JSON.stringify({ date, start: win.start, end: win.end }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not book the slot.");
        if (json.code === "SLOT_FULL") {
          setWin(null);
          load();
        }
        return;
      }
      setDone(`Booked for ${fmtDay(date)}, ${fmtTime(win.start)} – ${fmtTime(win.end)}.`);
      setWin(null);
      load();
      onBooked?.();
    } catch (err: any) {
      setError(err.message || "Failed to confirm slot.");
    } finally {
      setSaving(false);
    }
  }

  const current = days.find((d) => d.date === date);

  return (
    <section aria-labelledby="slot-heading" className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/40 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-600" />
          <h2 id="slot-heading" className="text-base font-bold text-gray-900 sm:text-lg">
            Choose Delivery Date & 2-Hour Window
          </h2>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
          Guaranteed Handover
        </span>
      </div>

      <p className="text-xs text-gray-600 sm:text-sm">
        Select when you will be available. Handover is protected with your secret 4-digit code.
      </p>

      {loading && (
        <div className="flex items-center gap-2 py-4 text-sm text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          Checking available delivery windows for pincode {pincode}…
        </div>
      )}

      {!loading && (!days || days.length === 0) && (
        <p className="rounded-md bg-white p-3 text-sm text-gray-500">
          No slots available for pincode {pincode}. Please verify your address.
        </p>
      )}

      {!loading && days.length > 0 && (
        <>
          {/* Date Selector Tabs */}
          <div
            role="tablist"
            aria-label="Delivery date"
            className="flex gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none"
          >
            {days.map((d) => {
              const open = d.windows.some((w) => w.available);
              const active = d.date === date;
              return (
                <button
                  key={d.date}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  disabled={!open}
                  onClick={() => {
                    setDate(d.date);
                    setWin(null);
                  }}
                  className={`flex shrink-0 flex-col items-center justify-center rounded-lg border px-3 py-2 text-center text-xs font-medium transition sm:text-sm ${
                    active
                      ? "border-amber-600 bg-amber-600 text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  } disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 disabled:border-gray-200`}
                >
                  <Calendar className="mb-0.5 h-3.5 w-3.5" />
                  <span>{fmtDay(d.date)}</span>
                  <span className={`text-[10px] ${active ? "text-amber-100" : "text-gray-400"}`}>
                    {open ? "Slots open" : "Unavailable"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Time Windows Grid */}
          <div
            className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
            role="radiogroup"
            aria-label="Delivery time"
          >
            {current?.windows.map((w) => {
              const selected = win?.start === w.start;
              return (
                <button
                  key={w.start}
                  role="radio"
                  type="button"
                  aria-checked={selected}
                  disabled={!w.available}
                  onClick={() => handleSelectWindow(w)}
                  className={`relative flex flex-col justify-between rounded-lg border p-3 text-left transition ${
                    selected
                      ? "border-amber-600 bg-white ring-2 ring-amber-500 shadow-sm"
                      : "border-gray-200 bg-white hover:border-amber-300"
                  } disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-200 disabled:opacity-60`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 sm:text-sm">
                      {fmtTime(w.start)} – {fmtTime(w.end)}
                    </span>
                    {selected && <CheckCircle2 className="h-4 w-4 text-amber-600" />}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span
                      className={`font-medium ${
                        w.available
                          ? w.left <= 3
                            ? "text-red-600"
                            : "text-green-700"
                          : "text-gray-400"
                      }`}
                    >
                      {w.available
                        ? w.left <= 3
                          ? `Only ${w.left} slots left`
                          : "Available"
                        : w.left === 0
                        ? "Slot Full"
                        : "Too soon (min 2h)"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {orderId && (
            <button
              onClick={confirm}
              disabled={!win || saving}
              className="mt-3 flex w-full items-center justify-center rounded-lg bg-amazon-yellow py-2.5 text-sm font-semibold text-gray-900 shadow hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600 disabled:opacity-50 sm:w-auto sm:px-6"
            >
              {saving ? "Confirming Slot…" : "Confirm this delivery window"}
            </button>
          )}
        </>
      )}

      {done && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 p-2.5 text-xs text-green-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
          <span>{done}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-2.5 text-xs text-red-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}
    </section>
  );
}
