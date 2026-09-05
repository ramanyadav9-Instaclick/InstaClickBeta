import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");

      return NextResponse.json(
        { error: "Supabase configuration is missing" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey
    );

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let query = supabaseAdmin
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bookings: data,
    });
  } catch (err) {
    console.error("Orders API error:", err);

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}