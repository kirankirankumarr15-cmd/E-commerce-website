import { createClient } from "@supabase/supabase-js";

// Server-only. Never import this in a client component.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-service-key";

export const admin = createClient(
  supabaseUrl,
  serviceRoleKey,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
