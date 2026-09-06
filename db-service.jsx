/* global React */
/*
 * Database Service — Supabase integration
 * ----------------------------------------
 * Connects all temple forms to the Supabase database.
 * The Supabase client is loaded via CDN in index.html.
 * The client is initialized in index.html before this file loads.
 */

let supabase = null;

function getSupabase() {
  if (supabase) return supabase;
  if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.from === 'function') {
    supabase = window.supabase;
    return supabase;
  }
  return null;
}

function isReady() {
  return !!getSupabase();
}

/* ---------- Devotee upsert (save or update by phone) ---------- */
async function saveDevotee({ name, phone, email, gotra, nakshetra, address }) {
  const sb = getSupabase();
  if (!sb || !phone) return null;
  const row = {
    phone: phone.trim(),
    name: (name || '').trim(),
    email: (email || '').trim() || null,
    gotra: (gotra || '').trim() || null,
    nakshetra: (nakshetra || '').trim() || null,
    address: (address || '').trim() || null,
  };
  const { data, error } = await sb
    .from('devotees')
    .upsert(row, { onConflict: 'phone' })
    .select()
    .maybeSingle();
  if (error) console.warn('[db] saveDevotee:', error.message);
  return data;
}

async function saveDevoteeSafe(props) {
  try { return await saveDevotee(props); }
  catch (e) { console.warn('[db] saveDevoteeSafe:', e && e.message || e); return null; }
}

/* ---------- Seva booking ---------- */
async function saveSevaBooking({ name, phone, email, gotra, sevaName, date, amount }) {
  const sb = getSupabase();
  if (!sb) return null;
  await saveDevoteeSafe({ name, phone, email, gotra });
  const { data, error } = await sb.from('seva_bookings').insert({
    phone: phone.trim(),
    seva_name: sevaName,
    seva_date: date,
    amount: amount,
    gotra: (gotra || '').trim() || null,
  }).select().maybeSingle();
  if (error) console.warn('[db] saveSevaBooking:', error.message);
  return data;
}

/* ---------- Donation ---------- */
async function saveDonation({ name, phone, email, purpose, frequency, amount }) {
  const sb = getSupabase();
  if (!sb) return null;
  if (phone) await saveDevoteeSafe({ name, phone, email });
  const { data, error } = await sb.from('donations').insert({
    phone: (phone || '').trim() || null,
    donor_name: (name || '').trim(),
    purpose: purpose,
    frequency: frequency,
    amount: amount,
  }).select().maybeSingle();
  if (error) console.warn('[db] saveDonation:', error.message);
  return data;
}

/* ---------- Contact message ---------- */
async function saveContactMessage({ name, phone, email, message, reference }) {
  const sb = getSupabase();
  if (!sb) return null;
  if (phone) await saveDevoteeSafe({ name, phone, email });
  const { data, error } = await sb.from('contact_messages').insert({
    phone: (phone || '').trim() || null,
    name: (name || '').trim(),
    email: (email || '').trim(),
    message: (message || '').trim(),
    reference: reference || null,
  }).select().maybeSingle();
  if (error) console.warn('[db] saveContactMessage:', error.message);
  return data;
}

/* ---------- Puja booking (Vishesha, Nitya Pratah, Naivedyam, Rudrabhishekam) ---------- */
async function savePujaBooking({ name, phone, email, gotra, nakshetra, address, pujaName, pujaType, date, amount }) {
  const sb = getSupabase();
  if (!sb) return null;
  await saveDevoteeSafe({ name, phone, email, gotra, nakshetra, address });
  const { data, error } = await sb.from('puja_bookings').insert({
    phone: phone.trim(),
    puja_name: pujaName,
    puja_type: pujaType,
    puja_date: date,
    amount: amount,
    gotra: (gotra || '').trim() || null,
    nakshetra: (nakshetra || '').trim() || null,
    address: (address || '').trim() || null,
  }).select().maybeSingle();
  if (error) console.warn('[db] savePujaBooking:', error.message);
  return data;
}

Object.assign(window, {
  saveDevotee,
  saveSevaBooking,
  saveDonation,
  saveContactMessage,
  savePujaBooking,
  isDbReady: isReady,
});
