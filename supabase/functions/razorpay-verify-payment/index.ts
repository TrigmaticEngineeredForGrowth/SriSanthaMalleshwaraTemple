// Razorpay Payment Verification Edge Function
// Verifies the payment signature and updates the payment record.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") || "dX4Rl3q3wM9bV2Y7sN1pZ6cT8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

async function hmacSha256(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, reference_type, reference_id } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({ error: "Missing payment verification fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify signature: HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret)
    const expectedSignature = await hmacSha256(
      `${razorpay_order_id}|${razorpay_payment_id}`,
      RAZORPAY_KEY_SECRET
    );

    const verified = expectedSignature === razorpay_signature;

    const updatePayload = verified
      ? {
          status: "paid",
          razorpay_payment_id: razorpay_payment_id,
          razorpay_signature: razorpay_signature,
          reference_type: reference_type || null,
          reference_id: reference_id || null,
          updated_at: new Date().toISOString(),
        }
      : {
          status: "failed",
          razorpay_payment_id: razorpay_payment_id,
          updated_at: new Date().toISOString(),
        };

    // Update the payment record
    const updateRes = await fetch(
      `${SUPABASE_URL}/rest/v1/payments?razorpay_order_id=eq.${razorpay_order_id}`,
      {
        method: "PATCH",
        headers: {
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation",
        },
        body: JSON.stringify(updatePayload),
      }
    );

    const updatedRows = await updateRes.json();

    return new Response(
      JSON.stringify({
        verified: verified,
        status: verified ? "paid" : "failed",
        payment_id: updatedRows[0]?.id || null,
      }),
      {
        status: verified ? 200 : 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
