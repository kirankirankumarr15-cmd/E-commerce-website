import { NextResponse } from "next/server";
import { admin } from "@/lib/supabaseAdmin";
import { getUser } from "@/lib/auth";
import { UUID_RE } from "@/lib/config";

const RESULT: Record<string, [number, string]> = {
  OK: [200, "Delivered."],
  ON_THE_WAY: [200, "The customer has been told you are on the way."],
  RESCHEDULE: [200, "Marked. The customer will be asked to pick a new slot."],
  RETURNED: [200, "Second miss. Order marked for return."],
  WRONG_OTP: [422, "Wrong code. Ask the customer to check their order page."],
  LOCKED: [423, "Too many wrong codes. Contact support."],
  TOO_EARLY: [409, "Too early. You can start 30 minutes before the window, and mark a miss only after it starts."],
  NOT_DELIVERABLE: [409, "This order isn't ready for delivery."],
  NOT_FOUND: [404, "Order not found in your area."],
  FORBIDDEN: [403, "Not a delivery partner."],
};

// POST /api/delivery/:id  { action: "start" } | { action: "deliver", otp: "1234" } | { action: "unavailable" }
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  if (!UUID_RE.test(params.id)) return NextResponse.json({ error: "Invalid order." }, { status: 400 });

  const body = await req.json().catch(() => null);
  let result: string | null = null;

  if (body?.action === "deliver") {
    if (!/^\d{4}$/.test(String(body.otp ?? ""))) {
      return NextResponse.json({ error: "Enter the 4-digit code." }, { status: 400 });
    }
    const { data, error } = await admin.rpc("complete_delivery", {
      p_order_id: params.id, p_partner: user.id, p_otp: String(body.otp),
    });
    if (error) return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    result = data;
  } else if (body?.action === "start") {
    const { data, error } = await admin.rpc("start_trip", {
      p_order_id: params.id, p_partner: user.id,
    });
    if (error) return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    result = data;
  } else if (body?.action === "unavailable") {
    const { data, error } = await admin.rpc("mark_failed_attempt", {
      p_order_id: params.id, p_partner: user.id,
    });
    if (error) return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    result = data;
  } else {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  const [status, message] = RESULT[result ?? ""] ?? [500, "Unexpected result."];
  return NextResponse.json({ code: result, message }, { status });
}
