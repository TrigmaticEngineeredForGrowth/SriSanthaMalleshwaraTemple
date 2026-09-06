/* global React */
/*
 * Contact Form Backend Wiring
 * ----------------------------
 * This file ships the form with TWO live destinations + a local fallback:
 *
 *  1) EMAIL → Formspree (zero backend, configured)
 *     - Endpoint: https://formspree.io/f/mbdbzvdk
 *     - Submissions are forwarded to the inbox associated with the form
 *       in your Formspree dashboard (set to TEMPLE_EMAIL).
 *     - AJAX mode → returns JSON, CORS-safe, no page reload.
 *
 *  2) SHEET → Google Apps Script Web App (zero backend, free)
 *     - Paste your deployed Apps Script /exec URL into SHEETS_ENDPOINT below.
 *     - Setup steps live in /docs/SHEET_SETUP.md (also written by this skill).
 *     - Until configured, sheet writes are skipped silently.
 *
 *  3) LOCAL LOG → window.localStorage['smt_contact_log']
 *     - Every submission is appended here as a safety net.
 *     - Press Ctrl+Shift+L on the live site to open the admin viewer.
 */

const TEMPLE_EMAIL = 'trigmatic07@gmail.com';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mbdbzvdk';

// Paste your Google Apps Script /exec URL here. Until then, sheet sync is skipped.
//   e.g.  'https://script.google.com/macros/s/AKfycb.../exec'
const SHEETS_ENDPOINT = '';

const LOG_KEY = 'smt_contact_log';

function genRefId() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SMT-${t.slice(-5)}-${r}`;
}

function readLog() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); }
  catch { return []; }
}
function writeLog(entries) {
  try { localStorage.setItem(LOG_KEY, JSON.stringify(entries)); } catch {}
}

async function postFormspree(payload) {
  // Formspree AJAX endpoint — JSON in, JSON out, CORS-enabled.
  // Field names use `email` and `message` so Formspree's reply-to + spam
  // filtering work out of the box; the rest are passed through as custom fields.
  const res = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || '',
      message: payload.message,
      reference: payload.ref,
      submitted_at: payload.submittedAt,
      origin: payload.origin,
      _subject: `\uD83D\uDD49 New devotee message — ${payload.name}`,
      _replyto: payload.email,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false || (data.errors && data.errors.length)) {
    const msg = (data.errors && data.errors.map(e => e.message).join('; ')) || `Formspree ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

async function postSheet(payload) {
  if (!SHEETS_ENDPOINT) return { skipped: true };
  // Apps Script doPost — use text/plain to avoid preflight
  const res = await fetch(SHEETS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Sheets ${res.status}`);
  return res.json().catch(() => ({}));
}

async function submitContact({ name, email, phone, message }) {
  const ref = genRefId();
  const submittedAt = new Date().toISOString();
  const payload = {
    name: name.trim(),
    email: email.trim(),
    phone: (phone || '').trim(),
    message: message.trim(),
    ref,
    submittedAt,
    origin: typeof location !== 'undefined' ? location.origin + location.pathname : 'prototype',
  };

  // 1) Always log locally first — never lose a submission.
  const log = readLog();
  log.unshift({ ...payload, _status: 'pending' });
  writeLog(log);

  let emailOk = false, sheetOk = false, errors = [];

  // 2) Email + Sheet in parallel
  const results = await Promise.allSettled([postFormspree(payload), postSheet(payload)]);
  if (results[0].status === 'fulfilled') emailOk = true;
  else errors.push('email: ' + (results[0].reason && results[0].reason.message || results[0].reason));
  if (results[1].status === 'fulfilled') sheetOk = results[1].value.skipped ? 'skipped' : true;
  else errors.push('sheet: ' + (results[1].reason && results[1].reason.message || results[1].reason));

  // 3) Update local entry status
  const log2 = readLog();
  if (log2[0] && log2[0].ref === ref) {
    log2[0]._status = emailOk ? 'delivered' : 'queued-local-only';
    log2[0]._emailOk = emailOk;
    log2[0]._sheetOk = sheetOk;
    writeLog(log2);
  }

  return { ok: emailOk, ref, emailOk, sheetOk, errors };
}

/* ---------- Admin Log Viewer ---------- */
function ContactLogViewer({ open, onClose }) {
  const [entries, setEntries] = React.useState([]);
  React.useEffect(() => { if (open) setEntries(readLog()); }, [open]);

  const exportCSV = () => {
    const rows = [
      ['Reference', 'Submitted', 'Name', 'Email', 'Phone', 'Message', 'Status', 'EmailOk', 'SheetOk'],
      ...entries.map(e => [
        e.ref, e.submittedAt, e.name, e.email, e.phone, e.message,
        e._status || '', String(e._emailOk || ''), String(e._sheetOk || ''),
      ]),
    ];
    const csv = rows.map(r => r.map(c =>
      `"${String(c || '').replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `temple-contact-log-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const clearLog = () => {
    if (confirm('Clear local submission log? (Data on Gmail and Sheet is untouched.)')) {
      writeLog([]); setEntries([]);
    }
  };

  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose} style={{ alignItems: 'flex-start', paddingTop: 60 }}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 1000, padding: 40 }}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 28 }}>
          <div>
            <span className="eyebrow">Admin · Local Log</span>
            <h2 style={{ marginTop: 14, fontSize: 28 }}>Contact Submissions</h2>
            <p style={{ marginTop: 8, color: 'var(--ivory-faint)', fontSize: 13, fontFamily: 'var(--f-mono)', letterSpacing: '0.08em' }}>
              {entries.length} entr{entries.length === 1 ? 'y' : 'ies'} stored in this browser ·
              Email → {TEMPLE_EMAIL} · Sheet → {SHEETS_ENDPOINT ? 'configured' : 'not configured'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn" style={{ padding: '12px 18px', fontSize: 10 }} onClick={exportCSV} disabled={!entries.length}>
              Export CSV
            </button>
            <button className="btn ghost" style={{ padding: '12px 18px', fontSize: 10 }} onClick={clearLog} disabled={!entries.length}>
              Clear Local
            </button>
          </div>
        </div>

        {entries.length === 0 ? (
          <div style={{
            padding: 60, textAlign: 'center', border: '1px dashed var(--line-soft)',
            color: 'var(--ivory-faint)', fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 20,
          }}>
            No submissions yet. Devotees' messages will appear here.
          </div>
        ) : (
          <div style={{ maxHeight: 540, overflowY: 'auto' }}>
            {entries.map((e, i) => (
              <div key={e.ref + i} style={{
                padding: '20px 0', borderBottom: '1px solid var(--line-soft)',
                display: 'grid', gridTemplateColumns: '120px 1fr', gap: 20,
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--gold)' }}>
                    {e.ref}
                  </div>
                  <div style={{ marginTop: 8, fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ivory-faint)' }}>
                    {new Date(e.submittedAt).toLocaleString()}
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.14em',
                      padding: '3px 7px',
                      background: e._emailOk ? 'rgba(255,122,46,0.15)' : 'rgba(245,245,245,0.06)',
                      color: e._emailOk ? 'var(--gold)' : 'var(--ivory-faint)',
                      border: '1px solid ' + (e._emailOk ? 'var(--gold)' : 'var(--line-soft)'),
                    }}>{e._emailOk ? 'EMAIL ✓' : 'EMAIL ⨯'}</span>
                    <span style={{
                      fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.14em',
                      padding: '3px 7px',
                      background: e._sheetOk === true ? 'rgba(255,122,46,0.15)' : 'rgba(245,245,245,0.06)',
                      color: e._sheetOk === true ? 'var(--gold)' : 'var(--ivory-faint)',
                      border: '1px solid ' + (e._sheetOk === true ? 'var(--gold)' : 'var(--line-soft)'),
                    }}>SHEET {e._sheetOk === true ? '✓' : e._sheetOk === 'skipped' ? '—' : '⨯'}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 16, color: 'var(--ivory)' }}>
                    <strong style={{ color: 'var(--gold)', fontFamily: 'var(--f-display)', fontWeight: 500, letterSpacing: '0.05em' }}>{e.name}</strong>
                    <span style={{ color: 'var(--ivory-faint)', margin: '0 8px' }}>·</span>
                    <span>{e.email}</span>
                    {e.phone && <>
                      <span style={{ color: 'var(--ivory-faint)', margin: '0 8px' }}>·</span>
                      <span>{e.phone}</span>
                    </>}
                  </div>
                  <p style={{ marginTop: 10, color: 'var(--ivory-dim)', fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {e.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{
          marginTop: 28, padding: 18, border: '1px solid var(--line-soft)',
          fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ivory-faint)',
          letterSpacing: '0.08em', lineHeight: 1.7,
        }}>
          DEPLOYMENT — 1) Email delivery is live via Formspree (form id mbdbzvdk → {TEMPLE_EMAIL}) · 2) Deploy the Apps Script in /docs/SHEET_SETUP.md and paste its /exec URL into SHEETS_ENDPOINT in contact-service.jsx · 3) Press Ctrl+Shift+L any time to reopen this admin log
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { submitContact, ContactLogViewer, TEMPLE_EMAIL });
