/*
# Remove unique constraint on devotees.phone

## Overview
The previous migration made phone UNIQUE in the devotees table.
Per user request, removing that constraint so phone is just a regular
column — not a unique key.

## Changes
- ALTER TABLE devotees DROP CONSTRAINT devotees_phone_key
  (the auto-named unique constraint from the previous migration)
*/

ALTER TABLE devotees DROP CONSTRAINT IF EXISTS devotees_phone_key;
