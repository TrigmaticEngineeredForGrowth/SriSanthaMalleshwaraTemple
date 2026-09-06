/*
# Create payments table for Razorpay integration

1. New Tables
- `payments`
  - `id` (uuid, primary key)
  - `razorpay_order_id` (text, unique) — order ID from Razorpay
  - `razorpay_payment_id` (text, nullable) — payment ID after successful payment
  - `razorpay_signature` (text, nullable) — signature for verification
  - `amount` (integer, not null) — amount in paise (Indian Rupees × 100)
  - `currency` (text, default 'INR')
  - `status` (text, default 'created') — created / paid / failed
  - `purpose` (text, nullable) — seva / donation / puja / naivedyam / rudrabhishekam
  - `reference_type` (text, nullable) — seva_bookings / donations / puja_bookings
  - `reference_id` (uuid, nullable) — FK to the booking/donation row
  - `devotee_name` (text, nullable)
  - `devotee_email` (text, nullable)
  - `devotee_phone` (text, nullable)
  - `notes` (jsonb, nullable) — additional metadata
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `payments`.
- Allow anon + authenticated INSERT (devotees create orders from the frontend).
- Allow anon + authenticated SELECT (to check payment status after checkout).
- Allow anon + authenticated UPDATE (to update payment status after verification).
*/

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_order_id text UNIQUE,
  razorpay_payment_id text,
  razorpay_signature text,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'created',
  purpose text,
  reference_type text,
  reference_id uuid,
  devotee_name text,
  devotee_email text,
  devotee_phone text,
  notes jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_payments" ON payments;
CREATE POLICY "anon_select_payments" ON payments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_payments" ON payments;
CREATE POLICY "anon_insert_payments" ON payments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_payments" ON payments;
CREATE POLICY "anon_update_payments" ON payments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
