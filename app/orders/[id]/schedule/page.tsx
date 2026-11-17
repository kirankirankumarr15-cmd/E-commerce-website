"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock, ShieldCheck, CheckCircle2, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabaseBrowser";
import SlotPicker from "@/components/SlotPicker";
import { getOrderById, updateOrderStatus, ScheduledOrder } from "@/lib/orders";
import { fmtDate, fmtTime } from "@/lib/config";

export default function SchedulePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [state, setState] = useState<"loading" | "ready">("loading");

  const load = useCallback(async () => {
    if (!id) return;

    // 1. Check local order first
    const local = getOrderById(id);
    if (local) {
      setOrder(local);
      setState("ready");
      return;
    }

    // 2. Try Supabase
    try {
      const { data } = await supabase
        .from("orders")
        .select(
          "id,pincode,address,status,delivery_otp,reschedule_count,on_my_way_at,customer_name,delivery_slots(slot_date,start_time,end_time)"
        )
        .eq("id", id)
        .maybeSingle();

      if (data) {
        setOrder({
          id: data.id,
          pincode: data.pincode,
          address: data.address,
          customer_name: (data as any).customer_name || "Customer",
          status: data.status,
          delivery_otp: data.delivery_otp,
          reschedule_count: data.reschedule_count,
          on_my_way_at: data.on_my_way_at,
          slot_date: (data.delivery_slots as any)?.slot_date,
          start_time: (data.delivery_slots as any)?.start_time,
          end_time: (data.delivery_slots as any)?.end_time,
        });
        setState("ready");
        return;
      }
    } catch {
      // fallback
    }

    setState("ready");
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (state === "loading") {
    return (
      <main className="mx-auto max-w-xl p-8 text-center text-gray-500">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        <p className="mt-2 text-xs">Loading delivery schedule…</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-xl p-8 text-center bg-white rounded-lg shadow-xs my-8">
        <p className="text-base font-bold text-gray-900">Order not found</p>
        <Link
          href="/orders"
          className="mt-4 inline-block rounded-full bg-[#ffd814] px-5 py-2 text-xs font-bold text-gray-900"
        >
          View Your Orders
        </Link>
      </main>
    );
  }

  const editable = order.status === "placed" || order.status === "scheduled";

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6 my-6">
      <Link
        href={`/orders/${order.id}`}
        className="inline-flex items-center gap-1 text-xs font-semibold text-[#007185] hover:text-[#c45500] hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Order Details
      </Link>

      <header className="border-b pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Schedule or Change Delivery Time
        </h1>
        <p className="text-xs text-gray-600 mt-1">
          {order.address} · Pincode:{" "}
          <span className="font-semibold text-gray-900">{order.pincode}</span>
        </p>
      </header>

      {order.slot_date && order.status === "scheduled" && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <Clock className="h-4 w-4 text-amber-700" />
            Currently Scheduled Window
          </div>
          <p className="text-base font-extrabold text-gray-900">
            {fmtDate(order.slot_date)}, {fmtTime(order.start_time)} – {fmtTime(order.end_time)}
          </p>
          {order.delivery_otp && (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-800">
              <ShieldCheck className="h-4 w-4 text-green-700" />
              <span>Handover Code:</span>
              <span className="font-mono font-black tracking-widest text-base text-gray-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                {order.delivery_otp}
              </span>
            </div>
          )}
        </div>
      )}

      {order.status === "delivered" && (
        <div className="rounded-lg bg-green-50 p-4 text-xs font-bold text-green-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          This order has already been delivered.
        </div>
      )}

      {order.status === "returned" && (
        <div className="rounded-lg bg-red-50 p-4 text-xs font-bold text-red-800 flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-red-600" />
          This order was returned after exceeding missed handover attempts.
        </div>
      )}

      {editable && (
        <SlotPicker
          orderId={order.id}
          pincode={order.pincode}
          onBooked={() => {
            load();
            router.push(`/orders/${order.id}`);
          }}
        />
      )}
    </main>
  );
}
