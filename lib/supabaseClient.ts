import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

const FALLBACK_URL = "https://gapvcmsapunprvxihyml.supabase.co";
const FALLBACK_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhcHZjbXNhcHVucHJ2eGloeW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2OTM5NjQsImV4cCI6MjEwMDI2OTk2NH0.rp0ut0rYyM1-B7fzveeyCZjjNvDKP-k9N6APjWk2wPE";

function getSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON;

  if (!supabaseClient) {
    supabaseClient = createClient(url, anonKey);
  }

  return supabaseClient;
}

/**
 * Lazy Supabase client.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    const client = getSupabaseClient();
    const value = (client as any)[property];

    if (typeof value === "function") {
      return value.bind(client);
    }

    return value;
  },
});