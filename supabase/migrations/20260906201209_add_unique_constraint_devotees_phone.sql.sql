-- Make phone unique on devotees so upsert onConflict works
-- First remove the non-unique index, then add a unique constraint
DROP INDEX IF EXISTS idx_devotees_phone;
ALTER TABLE devotees ADD CONSTRAINT devotees_phone_unique UNIQUE (phone);