import { NextResponse } from "next/server";
import { admin } from "@/lib/supabaseAdmin";
import { getUser, getPartner } from "@/lib/auth";
import { istDate } from "@/lib/config";

export const dynamic = "force-dynamic";

// Partner's scheduled drops for today (OTP is never returned here).
export async function GET(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const partner = await getPartner(user.id);
  if (!partner) return NextResponse.json({ error: "Not a delivery partner." }, { status: 403 });

  const { data, error } = await admin
    .from("orders")
    .select("id,address,pincode,on_my_way_at,delivery_slots!inner(slot_date,start_time,end_time)")
    .eq("status", "scheduled")
    .in("pincode", partner.pincodes)
    .or(`partner_id.is.null,partner_id.eq.${user.id}`)
    .eq("delivery_slots.slot_date", istDate());

  if (error) return NextResponse.json({ error: "Could not load deliveries." }, { status: 500 });

  const orders = (data ?? [])
    .map((o: any) => ({
      id: o.id as string,
      address: o.address as string,
      pincode: o.pincode as string,
      start: String(o.delivery_slots.start_time).slice(0, 5),
      end: String(o.delivery_slots.end_time).slice(0, 5),
      onTheWay: !!o.on_my_way_at,
    }))
    .sort((a, b) => a.start.localeCompare(b.start));

  return NextResponse.json({ partner: partner.name, orders });
}
