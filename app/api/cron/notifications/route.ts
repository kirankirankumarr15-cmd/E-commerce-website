import { NextResponse } from "next/server";
import { admin } from "@/lib/supabaseAdmin";
import { buildMessage } from "@/lib/messages";
import { sendMessage } from "@/lib/notify";

export const dynamic = "force-dynamic";

// Call every 1-5 minutes with:  Authorization: Bearer <CRON_SECRET>
async function run(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: rows, error } = await admin.rpc("claim_notifications", { p_limit: 20 });
  if (error) return NextResponse.json({ error: "Could not read the queue." }, { status: 500 });

  let sent = 0;
  for (const n of rows ?? []) {
    const msg = buildMessage(n.kind, n.payload ?? {}, n.order_id);
    if (!msg) continue;

    const { data: u } = await admin.auth.admin.getUserById(n.user_id);
    const ok = await sendMessage(
      { email: u.user?.email, phone: u.user?.phone },
      msg.subject,
      msg.text
    );
    if (ok) {
      await admin.from("notifications").update({ sent_at: new Date().toISOString() }).eq("id", n.id);
      sent++;
    }
  }
  return NextResponse.json({ claimed: rows?.length ?? 0, sent });
}

export const GET = run;
export const POST = run;
