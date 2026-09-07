import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // Read environment variables at request time
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

    const body = await req.json();

    const {
      userId,
      customerName,
      customerPhone,
      cartItems,
      totalPrice,
      paymentMode,
      eventDate,
      startTime,
      endTime,
      address,
    } = body;

    // 1. Validation
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // 2. Generate Unique Booking ID
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `INSTA-${randomDigits}`;

    // 3. Calculate Advance vs Total
    const isAdvanceDisabled = totalPrice <= 40000;
    const isAdvanceMode =
      paymentMode === "advance" && !isAdvanceDisabled;

    const advancePaid = isAdvanceMode
      ? Math.round(totalPrice * 0.2)
      : totalPrice;

    const remainingAmount = totalPrice - advancePaid;

    const paymentStatus =
      remainingAmount === 0 ? "100_full" : "20_advance";

    const packageName = cartItems
      .map((item: any) => item.name)
      .join(", ");

    // 4. Save to Supabase
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .insert([
        {
          booking_id: bookingId,
          user_id: userId || null,
          customer_name: customerName || "Guest User",
          customer_phone: customerPhone || "N/A",
          package_name: packageName,
          total_amount: totalPrice,
          advance_paid: advancePaid,
          remaining_amount: remainingAmount,
          payment_status: paymentStatus,
          payment_mode: "online",
          shoot_status: "booked",
          event_date: eventDate || null,
          address: `${address} | Time: ${startTime} - ${endTime}`,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bookingId: data.booking_id,
      order: data,
    });
  } catch (err) {
    console.error("Checkout API Error:", err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}