// Razorpay Order Creation Edge Function
// Creates a Razorpay order and stores it in the payments table.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID") || "rzp_test_1DP5mmOlF5G5MN";
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") || "dX4Rl3q3wM9bV2Y7sN1pZ6cT8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { amount, purpose, name, email, phone, notes } = body;

    if (!amount || amount < 100) {
      return new Response(
        JSON.stringify({ error: "Amount must be at least ₹1 (100 paise)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create order on Razorpay
    const orderPayload = {
      amount: amount,
      currency: "INR",
      notes: {
        purpose: purpose || "temple offering",
        name: name || "",
        email: email || "",
        phone: phone || "",
      },
    };

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + btoa(RAZORPAY_KEY_ID + ":" + RAZORPAY_KEY_SECRET),
      },
      body: JSON.stringify(orderPayload),
    });

    const orderData = await razorpayRes.json();

    if (!razorpayRes.ok) {
      return new Response(
        JSON.stringify({ error: orderData.error?.description || "Razorpay order creation failed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Store the order in our payments table
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        razorpay_order_id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        status: "created",
        purpose: purpose || null,
        devotee_name: name || null,
        devotee_email: email || null,
        devotee_phone: phone || null,
        notes: notes || null,
      }),
    });

    const paymentRow = await insertRes.json();

    return new Response(
      JSON.stringify({
        order_id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        key_id: RAZORPAY_KEY_ID,
        payment_record_id: paymentRow[0]?.id || null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
