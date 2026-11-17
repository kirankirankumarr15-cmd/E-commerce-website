import { NextResponse } from "next/server";
import { admin } from "@/lib/supabaseAdmin";
import { getUser } from "@/lib/auth";
import {
  DEFAULT_CAPACITY, MAX_RESCHEDULES, MIN_LEAD_HOURS,
  UUID_RE, isTooSoon, isValidWindow, validDates,
} from "@/lib/config";

const ERRORS: Record<string, [number, string]> = {
  ORDER_NOT_FOUND: [404, "Order not found."],
  NOT_SCHEDULABLE: [409, "This order can't be scheduled right now."],
  SLOT_TOO_SOON: [409, `Pick a slot that starts at least ${MIN_LEAD_HOURS} hours from now.`],
  CHANGE_TOO_LATE: [409, "Your current slot is too close to change. Please be available."],
  RESCHEDULE_LIMIT: [409, `You can reschedule up to ${MAX_RESCHEDULES} times.`],
  SLOT_FULL: [409, "That slot just filled up. Pick another one."],
};

// POST /api/orders/:id/schedule  { date: "YYYY-MM-DD", start: "09:00", end: "11:00" }
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  if (!UUID_RE.test(params.id)) return NextResponse.json({ error: "Invalid order." }, { status: 400 });

  const body = await req.json().catch(() => null);
  const { date, start, end } = body ?? {};
  if (typeof date !== "string" || !validDates().includes(date) || !isValidWindow(start, end)) {
    return NextResponse.json({ error: "Invalid date or time window." }, { status: 400 });
  }
  if (isTooSoon(date, start)) {
    return NextResponse.json({ error: ERRORS.SLOT_TOO_SOON[1] }, { status: 409 });
  }

  const { data, error } = await admin.rpc("book_slot", {
    p_order_id: params.id,
    p_user_id: user.id,
    p_date: date,
    p_start: start,
    p_end: end,
    p_capacity: DEFAULT_CAPACITY,
    p_max_reschedules: MAX_RESCHEDULES,
    p_lead_hours: MIN_LEAD_HOURS,
  });

  if (error) {
    const code = Object.keys(ERRORS).find((k) => error.message.includes(k));
    if (code) return NextResponse.json({ error: ERRORS[code][1], code }, { status: ERRORS[code][0] });
    return NextResponse.json({ error: "Could not book the slot." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, slotId: data });
}
