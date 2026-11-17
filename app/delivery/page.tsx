"use client";

import { useCallback, useEffect, useState } from "react";
import { authHeader } from "@/lib/supabaseBrowser";

type Drop = { id: string; address: string; pincode: string; start: string; end: string; onTheWay: boolean };

const t = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return `${((h + 11) % 12) + 1}${m ? ":" + String(m).padStart(2, "0") : ""} ${h >= 12 ? "PM" : "AM"}`;
};

export default function DeliveryPage() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [otp, setOtp] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/delivery/today", { headers: await authHeader(), cache: "no-store" });
    const json = await res.json();
    if (!res.ok) return setError(json.error);
    setError("");
    setName(json.partner);
    setDrops(json.orders);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function act(id: string, action: "start" | "deliver" | "unavailable") {
    setBusy(id);
    setNotice("");
    try {
      const res = await fetch(`/api/delivery/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeader()) },
        body: JSON.stringify({ action, otp: otp[id] }),
      });
      const json = await res.json();
      setNotice(json.message || json.error);
      if (res.ok) load();
    } finally {
      setBusy(null);
    }
  }

  const slots = Array.from(new Set(drops.map((d) => `${d.start}-${d.end}`)));

  return (
    <main className="mx-auto max-w-xl space-y-6 p-4">
      <header>
        <h1 className="text-2xl font-semibold">Today's drops</h1>
        {name && <p className="text-sm text-neutral-600">{name}</p>}
      </header>

      {error && <p className="text-red-700">{error}</p>}
      {!error && drops.length === 0 && <p className="text-neutral-600">No scheduled drops today.</p>}

      {slots.map((s) => {
        const [start, end] = s.split("-");
        return (
          <section key={s} className="space-y-3">
            <h2 className="font-semibold">{t(start)} – {t(end)}</h2>
            {drops.filter((d) => d.start === start).map((d) => (
              <article key={d.id} className="space-y-3 rounded-lg border border-neutral-300 p-4">
                <p>{d.address} · {d.pincode}</p>
                {d.onTheWay ? (
                  <p className="text-sm font-medium text-green-700">Customer knows you're on the way.</p>
                ) : (
                  <button
                    onClick={() => act(d.id, "start")}
                    disabled={busy === d.id}
                    className="rounded-lg border border-neutral-900 px-4 py-2 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-40"
                  >
                    I'm on my way
                  </button>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor={`otp-${d.id}`}>Customer's 4-digit code</label>
                  <input
                    id={`otp-${d.id}`}
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="0000"
                    value={otp[d.id] ?? ""}
                    onChange={(e) => setOtp({ ...otp, [d.id]: e.target.value.replace(/\D/g, "") })}
                    className="w-24 rounded-lg border border-neutral-300 px-3 py-2 text-center tracking-widest focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                  />
                  <button
                    onClick={() => act(d.id, "deliver")}
                    disabled={busy === d.id || (otp[d.id] ?? "").length !== 4}
                    className="rounded-lg bg-neutral-900 px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-40"
                  >
                    Confirm delivery
                  </button>
                  <button
                    onClick={() => act(d.id, "unavailable")}
                    disabled={busy === d.id}
                    className="rounded-lg border border-neutral-300 px-4 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-40"
                  >
                    Customer not available
                  </button>
                </div>
              </article>
            ))}
          </section>
        );
      })}

      <p role="status" aria-live="polite" className="text-sm">{notice}</p>
    </main>
  );
}
