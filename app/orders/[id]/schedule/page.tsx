"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import SlotPicker from "@/components/SlotPicker";

type Order = {
  id: string;
  pincode: string;
  address: string;
  status: string;
  delivery_otp: string | null;
  reschedule_count: number;
  on_my_way_at: string | null;
  delivery_slots: { slot_date: string; start_time: string; end_time: string } | null;
};

const t = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return `${((h + 11) % 12) + 1}${m ? ":" + String(m).padStart(2, "0") : ""} ${h >= 12 ? "PM" : "AM"}`;
};

export default function SchedulePage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [state, setState] = useState<"loading" | "signin" | "missing" | "ready">("loading");

  const load = useCallback(async () => {
    const { data: s } = await supabase.auth.getSession();
    if (!s.session) return setState("signin");
    const { data } = await supabase
      .from("orders")
      .select("id,pincode,address,status,delivery_otp,reschedule_count,on_my_way_at,delivery_slots(slot_date,start_time,end_time)")
      .eq("id", id)
      .maybeSingle();
    if (!data) return setState("missing");
    setOrder(data as unknown as Order);
    setState("ready");
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (state === "loading") return <main className="mx-auto max-w-xl p-4">Loading…</main>;
  if (state === "signin") return <main className="mx-auto max-w-xl p-4">Sign in to schedule your delivery.</main>;
  if (state === "missing" || !order) return <main className="mx-auto max-w-xl p-4">We couldn't find this order.</main>;

  const slot = order.delivery_slots;
  const editable = order.status === "placed" || order.status === "scheduled";

  return (
    <main className="mx-auto max-w-xl space-y-6 p-4">
      <header>
        <h1 className="text-2xl font-semibold">Schedule your delivery</h1>
        <p className="text-sm text-neutral-600">{order.address} · {order.pincode}</p>
      </header>

      {slot && order.status === "scheduled" && (
        <div className="rounded-lg border border-neutral-300 p-4">
          <p className="font-medium">
            Arriving {new Date(`${slot.slot_date}T00:00:00+05:30`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kolkata" })},{" "}
            {t(slot.start_time.slice(0, 5))} – {t(slot.end_time.slice(0, 5))}
          </p>
          {order.on_my_way_at && (
            <p className="mt-2 text-sm font-medium text-green-700">Your delivery partner is on the way. Keep your code ready.</p>
          )}
          {order.delivery_otp && (
            <p className="mt-2 text-sm">
              Handover code: <strong className="text-lg tracking-widest">{order.delivery_otp}</strong>
              <span className="block text-neutral-600">Share it only when you receive the package.</span>
            </p>
          )}
        </div>
      )}

      {order.status === "placed" && !slot && (
        <p className="text-sm text-neutral-600">Pick a time and the delivery partner will come to you.</p>
      )}
      {order.status === "delivered" && <p className="text-green-700">Delivered.</p>}
      {order.status === "returned" && <p className="text-red-700">This order was returned after two missed attempts. Contact support.</p>}

      {editable && <SlotPicker orderId={order.id} pincode={order.pincode} onBooked={load} />}
    </main>
  );
}
