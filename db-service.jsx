/* global React */
/*
 * Database Service — Supabase integration
 * ----------------------------------------
 * Connects all temple forms to the Supabase database.
 * Uses the Supabase REST API directly via fetch so writes do not
 * depend on the JS client library initializing correctly.
 */

const SUPABASE_URL = 'https://eybtrqwqaprfefwlgled.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5YnRycXdxYXByZmVmd2xnbGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MjA2NTAsImV4cCI6MjEwNDI5NjY1MH0.MFMPHC6B7le4adURWeHujyM4-EY5p1lKtn-CEsVWseE';

function sbHeaders() {
  return {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  };
}

function isReady() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

async function restInsert(table, row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: sbHeaders(),
    body: JSON.stringify(row),
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!res.ok) {
    const msg = (data && data.message) || text || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return Array.isArray(data) ? data[0] : data;
}

async function restUpsert(table, row, onConflict) {
  const headers = sbHeaders();
  headers['Prefer'] = 'return=representation,resolution=merge-duplicates';
  const url = onConflict
    ? `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`
    : `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(row),
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!res.ok) {
    const msg = (data && data.message) || text || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return Array.isArray(data) ? data[0] : data;
}

/* ---------- Devotee upsert (save or update by phone) ---------- */
async function saveDevotee({ name, phone, email, gotra, nakshetra, address }) {
  if (!phone) return null;
  const row = {
    phone: phone.trim(),
    name: (name || '').trim(),
    email: (email || '').trim() || null,
    gotra: (gotra || '').trim() || null,
    nakshetra: (nakshetra || '').trim() || null,
    address: (address || '').trim() || null,
  };
  return await restUpsert('devotees', row, 'phone');
}

async function saveDevoteeSafe(props) {
  try { return await saveDevotee(props); }
  catch (e) { console.warn('[db] saveDevoteeSafe:', e && e.message || e); return null; }
}

/* ---------- Seva booking ---------- */
async function saveSevaBooking({ name, phone, email, gotra, sevaName, date, amount }) {
  await saveDevoteeSafe({ name, phone, email, gotra });
  return await restInsert('seva_bookings', {
    phone: phone.trim(),
    seva_name: sevaName,
    seva_date: date,
    amount: amount,
    gotra: (gotra || '').trim() || null,
  });
}

/* ---------- Donation ---------- */
async function saveDonation({ name, phone, email, purpose, frequency, amount }) {
  if (phone) await saveDevoteeSafe({ name, phone, email });
  return await restInsert('donations', {
    phone: (phone || '').trim() || null,
    donor_name: (name || '').trim(),
    purpose: purpose,
    frequency: frequency,
    amount: amount,
  });
}

/* ---------- Contact message ---------- */
async function saveContactMessage({ name, phone, email, message, reference }) {
  if (phone) await saveDevoteeSafe({ name, phone, email });
  return await restInsert('contact_messages', {
    phone: (phone || '').trim() || null,
    name: (name || '').trim(),
    email: (email || '').trim(),
    message: (message || '').trim(),
    reference: reference || null,
  });
}

/* ---------- Puja booking (Vishesha, Nitya Pratah, Naivedyam, Rudrabhishekam) ---------- */
async function savePujaBooking({ name, phone, email, gotra, nakshetra, address, pujaName, pujaType, date, amount }) {
  await saveDevoteeSafe({ name, phone, email, gotra, nakshetra, address });
  return await restInsert('puja_bookings', {
    phone: phone.trim(),
    puja_name: pujaName,
    puja_type: pujaType,
    puja_date: date,
    amount: amount,
    gotra: (gotra || '').trim() || null,
    nakshetra: (nakshetra || '').trim() || null,
    address: (address || '').trim() || null,
  });
}

Object.assign(window, {
  saveDevotee,
  saveSevaBooking,
  saveDonation,
  saveContactMessage,
  savePujaBooking,
  isDbReady: isReady,
});
