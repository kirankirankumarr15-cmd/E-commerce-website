"use client";

import { useCallback, useEffect, useState } from "react";
import { authHeader } from "@/lib/supabaseBrowser";

type Win = { start: string; end: string; left: number; available: boolean };
type Day = { date: string; windows: Win[] };

const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}${m ? ":" + String(m).padStart(2, "0") : ""} ${h >= 12 ? "PM" : "AM"}`;
};
const fmtDay = (d: string) =>
  new Date(`${d}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata",
  });

type Props = { orderId: string; pincode: string; onBooked?: () => void };

export default function SlotPicker({ orderId, pincode, onBooked }: Props) {
  const [days, setDays] = useState<Day[]>([]);
  const [date, setDate] = useState<string>("");
  const [win, setWin] = useState<Win | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/slots?pincode=${pincode}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setDays(json.days);
      setDate((prev) => prev || json.days.find((d: Day) => d.windows.some((w) => w.available))?.date || json.days[0]?.date || "");
    } catch (e: any) {
      setError(e.message || "Could not load slots.");
    } finally {
      setLoading(false);
    }
  }, [pincode]);

  useEffect(() => { load(); }, [load]);

  async function confirm() {
    if (!win || !date) return;
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
        if (json.code === "SLOT_FULL") { setWin(null); load(); }
        return;
      }
      setDone(`Booked for ${fmtDay(date)}, ${fmtTime(win.start)} – ${fmtTime(win.end)}.`);
      setWin(null);
      load();
      onBooked?.();
    } finally {
      setSaving(false);
    }
  }

  const current = days.find((d) => d.date === date);

  return (
    <section aria-labelledby="slot-heading" className="space-y-4">
      <h2 id="slot-heading" className="text-lg font-semibold">When will you be home?</h2>

      {loading && <p className="text-sm text-neutral-500">Loading available times…</p>}

      {!loading && days.length > 0 && (
        <>
          <div role="tablist" aria-label="Delivery date" className="flex gap-2 overflow-x-auto pb-1">
            {days.map((d) => {
              const open = d.windows.some((w) => w.available);
              const active = d.date === date;
              return (
                <button
                  key={d.date}
                  role="tab"
                  aria-selected={active}
                  disabled={!open}
                  onClick={() => { setDate(d.date); setWin(null); }}
                  className={`shrink-0 rounded-lg border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
                    ${active ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 bg-white"}
                    disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {fmtDay(d.date)}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Delivery time">
            {current?.windows.map((w) => {
              const selected = win?.start === w.start;
              return (
                <button
                  key={w.start}
                  role="radio"
                  aria-checked={selected}
                  disabled={!w.available}
                  onClick={() => setWin(w)}
                  className={`rounded-lg border p-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
                    ${selected ? "border-neutral-900 ring-2 ring-neutral-900" : "border-neutral-300"}
                    disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400`}
                >
                  <span className="block font-medium">{fmtTime(w.start)} – {fmtTime(w.end)}</span>
                  <span className="block text-xs text-neutral-500">
                    {w.available ? (w.left <= 3 ? `Only ${w.left} left` : "Available") : w.left === 0 ? "Full" : "Too soon"}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={confirm}
            disabled={!win || saving}
            className="w-full rounded-lg bg-neutral-900 px-4 py-3 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-40 sm:w-auto"
          >
            {saving ? "Saving…" : "Confirm this time"}
          </button>
        </>
      )}

      <p role="status" aria-live="polite" className="text-sm">
        {done && <span className="text-green-700">{done}</span>}
        {error && <span className="text-red-700">{error}</span>}
      </p>
    </section>
  );
}
