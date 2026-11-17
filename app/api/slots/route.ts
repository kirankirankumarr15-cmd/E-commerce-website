import { NextResponse } from "next/server";
import { admin } from "@/lib/supabaseAdmin";
import { SLOT_WINDOWS, DEFAULT_CAPACITY, validDates, isTooSoon } from "@/lib/config";

export const dynamic = "force-dynamic";

// GET /api/slots?pincode=577201 -> next 7 days of windows with availability
export async function GET(req: Request) {
  const pincode = new URL(req.url).searchParams.get("pincode") ?? "";
  if (!/^\d{6}$/.test(pincode)) {
    return NextResponse.json({ error: "Enter a valid 6-digit pincode." }, { status: 400 });
  }

  const dates = validDates();
  const { data, error } = await admin
    .from("delivery_slots")
    .select("slot_date,start_time,capacity,booked")
    .eq("pincode", pincode)
    .gte("slot_date", dates[0])
    .lte("slot_date", dates[dates.length - 1]);

  if (error) return NextResponse.json({ error: "Could not load slots." }, { status: 500 });

  const rows = new Map((data ?? []).map((r) => [`${r.slot_date}|${String(r.start_time).slice(0, 5)}`, r]));

  const days = dates.map((date) => ({
    date,
    windows: SLOT_WINDOWS.map((w) => {
      const row = rows.get(`${date}|${w.start}`);
      const left = Math.max((row?.capacity ?? DEFAULT_CAPACITY) - (row?.booked ?? 0), 0);
      return { start: w.start, end: w.end, left, available: left > 0 && !isTooSoon(date, w.start) };
    }),
  }));

  return NextResponse.json({ days });
}
