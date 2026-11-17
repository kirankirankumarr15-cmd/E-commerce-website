import { admin } from "./supabaseAdmin";

export async function getUser(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await admin.auth.getUser(token);
  return error ? null : data.user;
}

export async function getPartner(userId: string) {
  const { data } = await admin
    .from("delivery_partners")
    .select("user_id,name,pincodes")
    .eq("user_id", userId)
    .eq("active", true)
    .maybeSingle();
  return data as { user_id: string; name: string; pincodes: string[] } | null;
}
