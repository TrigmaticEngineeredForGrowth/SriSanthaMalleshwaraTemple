/* global React */
/*
 * Payment Service — Razorpay Integration
 * ----------------------------------------
 * Handles the full Razorpay checkout flow:
 *   1) Create an order via our edge function
 *   2) Open the Razorpay checkout modal
 *   3) Verify the payment signature via our edge function
 *   4) Return the verified result so the caller can save booking/donation records
 *
 * In test mode, Razorpay provides test cards that always succeed/fail.
 * Test cards: https://razorpay.com/docs/testing/
 */

const SUPABASE_URL = 'https://eybtrqwqaprfefwlgled.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5YnRycXdxYXByZmVmd2xnbGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MjA2NTAsImV4cCI6MjEwNDI5NjY1MH0.MFMPHC6B7le4adURWeHujyM4-EY5p1lKtn-CEsVWseE';

/**
 * Starts a Razorpay payment.
 *
 * @param {object} opts
 * @param {number} opts.amount        — amount in rupees (e.g. 1100)
 * @param {string} opts.purpose       — 'Seva: Rudrabhishekam', 'Donation: Temple Renovation Fund', etc.
 * @param {string} opts.name          — devotee name
 * @param {string} opts.email         — devotee email
 * @param {string} opts.phone         — devotee phone (10-digit)
 * @param {string} opts.referenceType — 'seva_bookings' | 'donations' | 'puja_bookings' (optional, set after DB save)
 * @param {string} opts.referenceId   — UUID of the booking/donation row (optional, set after DB save)
 * @returns {Promise<{verified: boolean, orderId: string, paymentId: string|null, error?: string}>}
 */
async function startRazorpayPayment(opts) {
  const { amount, purpose, name, email, phone } = opts;

  if (!amount || amount < 1) {
    return { verified: false, orderId: null, paymentId: null, error: 'Invalid amount' };
  }

  // 1) Create order via edge function
  const orderRes = await fetch(`${SUPABASE_URL}/functions/v1/razorpay-create-order`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // convert rupees to paise
      purpose,
      name,
      email,
      phone,
    }),
  });

  if (!orderRes.ok) {
    const errData = await orderRes.json().catch(() => ({}));
    return { verified: false, orderId: null, paymentId: null, error: errData.error || `Order creation failed (${orderRes.status})` };
  }

  const order = await orderRes.json();

  // 2) Open Razorpay checkout
  const paymentResult = await new Promise((resolve) => {
    const options = {
      key: order.key_id,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Shri Shanta Malleshwara Temple',
      description: purpose || 'Temple Offering',
      order_id: order.order_id,
      prefill: {
        name: name || '',
        email: email || '',
        contact: phone || '',
      },
      theme: { color: '#FF7A2E' },
      handler: function (response) {
        resolve({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: function () {
          resolve({ dismissed: true });
        },
      },
    };

    if (typeof window.Razorpay === 'undefined') {
      resolve({ error: 'Razorpay checkout script not loaded. Please refresh and try again.' });
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (resp) {
      resolve({ error: resp.error?.description || 'Payment failed' });
    });
    rzp.open();
  });

  if (paymentResult.dismissed) {
    return { verified: false, orderId: order.order_id, paymentId: null, error: 'Payment cancelled' };
  }

  if (paymentResult.error) {
    return { verified: false, orderId: order.order_id, paymentId: null, error: paymentResult.error };
  }

  // 3) Verify payment via edge function
  const verifyRes = await fetch(`${SUPABASE_URL}/functions/v1/razorpay-verify-payment`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razorpay_order_id: paymentResult.razorpay_order_id,
      razorpay_payment_id: paymentResult.razorpay_payment_id,
      razorpay_signature: paymentResult.razorpay_signature,
      reference_type: opts.referenceType || null,
      reference_id: opts.referenceId || null,
    }),
  });

  const verifyData = await verifyRes.json().catch(() => ({}));

  if (!verifyRes.ok || !verifyData.verified) {
    return {
      verified: false,
      orderId: order.order_id,
      paymentId: paymentResult.razorpay_payment_id,
      error: verifyData.error || 'Payment verification failed',
    };
  }

  return {
    verified: true,
    orderId: order.order_id,
    paymentId: paymentResult.razorpay_payment_id,
  };
}

Object.assign(window, { startRazorpayPayment });
