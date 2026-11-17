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
  let dbRows: any[] = [];
  let blockedRows: any[] = [];

  try {
    const [slotsRes, blocksRes] = await Promise.all([
      admin
        .from("delivery_slots")
        .select("slot_date,start_time,capacity,booked")
        .eq("pincode", pincode)
        .gte("slot_date", dates[0])
        .lte("slot_date", dates[dates.length - 1]),
      admin
        .from("slot_blocks")
        .select("slot_date,start_time,reason")
        .eq("pincode", pincode)
        .gte("slot_date", dates[0])
        .lte("slot_date", dates[dates.length - 1]),
    ]);

    if (!slotsRes.error && slotsRes.data) {
      dbRows = slotsRes.data;
    }
    if (!blocksRes.error && blocksRes.data) {
      blockedRows = blocksRes.data;
    }
  } catch (err) {
    console.warn("[slots] Database query failed, using default availability:", err);
  }

  const rows = new Map(dbRows.map((r) => [`${r.slot_date}|${String(r.start_time).slice(0, 5)}`, r]));
  const blocks = new Set(
    blockedRows.map((b) => (b.start_time ? `${b.slot_date}|${String(b.start_time).slice(0, 5)}` : `${b.slot_date}|ALL`))
  );

  const days = dates.map((date) => {
    const isDayBlocked = blocks.has(`${date}|ALL`);
    return {
      date,
      windows: SLOT_WINDOWS.map((w) => {
        const isSlotBlocked = isDayBlocked || blocks.has(`${date}|${w.start}`);
        const row = rows.get(`${date}|${w.start}`);
        const capacity = row?.capacity ?? DEFAULT_CAPACITY;
        const booked = row?.booked ?? 0;
        const left = isSlotBlocked ? 0 : Math.max(capacity - booked, 0);
        const available = !isSlotBlocked && left > 0 && !isTooSoon(date, w.start);
        return {
          start: w.start,
          end: w.end,
          left,
          available,
        };
      }),
    };
  });

  return NextResponse.json({ days });
}
