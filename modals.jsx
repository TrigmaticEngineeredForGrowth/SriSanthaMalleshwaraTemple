/* global React */
const { useState: useStateM, useEffect: useEffectM } = React;

function addDuration(dateStr, label) {
  if (!dateStr || !label) return '';
  const match = label.match(/\((\d+)\s*(Month|Year|Day)s?\)/i);
  if (!match) return '';
  const n = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const d = new Date(dateStr + 'T00:00:00');
  if (unit === 'month') d.setMonth(d.getMonth() + n);
  else if (unit === 'year') d.setFullYear(d.getFullYear() + n);
  else if (unit === 'day') d.setDate(d.getDate() + n);
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function sanitizePhone(v) { return v.replace(/[^0-9]/g, '').slice(0, 10); }
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
function todayStr() {
  const d = new Date();
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function isFutureDate(s) { return s && s >= todayStr(); }

function Modal({ open, onClose, children, title, sub }) {
  useEffectM(() => {
    if (!open) return;
    const k = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', k);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {title && (
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span className="eyebrow">{sub}</span>
            <h2 style={{ marginTop: 18, fontSize: 36 }}>{title}</h2>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

/* ---------- Seva Booking Modal ---------- */
function SevaModal({ open, onClose }) {
  const [step, setStep] = useStateM(1);
  const [seva, setSeva] = useStateM('Rudrabhishekam');
  const [date, setDate] = useStateM('');
  const [name, setName] = useStateM('');
  const [gotra, setGotra] = useStateM('');
  const [phone, setPhone] = useStateM('');
  const [email, setEmail] = useStateM('');
  const [done, setDone] = useStateM(false);

  const sevaOptions = [
    { name: 'Rudrabhishekam', price: 1100 },
    { name: 'Archana', price: 251 },
    { name: 'Annadanam', price: 2500 },
    { name: 'Vahana Pooja', price: 501 },
    { name: 'Maha Mrityunjaya Homam', price: 5100 },
    { name: 'Satyanarayana Pooja', price: 1501 },
  ];
  const current = sevaOptions.find(s => s.name === seva);

  const reset = () => {
    setStep(1); setSeva('Rudrabhishekam'); setDate(''); setName('');
    setGotra(''); setPhone(''); setEmail(''); setDone(false);
  };
  const close = () => { onClose(); setTimeout(reset, 400); };

  return (
    <Modal open={open} onClose={close} title={done ? 'Sankalpa Received' : 'Book a Sacred Seva'} sub={done ? 'Confirmation' : 'Step ' + step + ' of 3'}>
      {!done && (
        <div style={{ marginBottom: 32, display: 'flex', gap: 8 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1, height: 2,
              background: s <= step ? 'var(--gold)' : 'var(--line-soft)',
              transition: 'background .4s'
            }}></div>
          ))}
        </div>
      )}

      {!done && step === 1 && (
        <div>
          <label className="field-label">Choose a Seva</label>
          <div className="modal-grid-2" style={{ gap: 10, marginBottom: 28 }}>
            {sevaOptions.map(s => (
              <button key={s.name} onClick={() => setSeva(s.name)} style={{
                padding: '18px 20px', textAlign: 'left',
                background: seva === s.name ? 'rgba(255, 122, 46,0.08)' : 'transparent',
                border: `1px solid ${seva === s.name ? 'var(--gold)' : 'var(--line-soft)'}`,
                color: 'var(--ivory)', cursor: 'pointer',
                transition: 'all .25s ease',
                fontFamily: 'inherit',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'var(--f-display)', fontSize: 13, letterSpacing: '0.08em' }}>{s.name}</span>
                <span style={{ color: 'var(--gold)', fontSize: 14 }}>₹{s.price}</span>
              </button>
            ))}
          </div>

          <label className="field-label">Preferred Date</label>
          <input type="date" value={date} min={todayStr()} onChange={e => setDate(e.target.value)} />
          {date && !isFutureDate(date) && <div style={{ marginTop: 6, fontSize: 12, color: '#ff8a8a' }}>Please select today or a future date</div>}

          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn solid" disabled={!date || !isFutureDate(date)} onClick={() => date && isFutureDate(date) && setStep(2)} style={{ opacity: date && isFutureDate(date) ? 1 : 0.45 }}>
              Continue
              <span className="arrow"></span>
            </button>
          </div>
        </div>
      )}

      {!done && step === 2 && (
        <div>
          <div className="modal-grid-2" style={{ marginBottom: 18 }}>
            <div>
              <label className="field-label">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="As to be chanted" />
            </div>
            <div>
              <label className="field-label">Gotra</label>
              <input value={gotra} onChange={e => setGotra(e.target.value)} placeholder="e.g. Bharadwaja" />
            </div>
          </div>
          <div className="modal-grid-2">
            <div>
              <label className="field-label">Phone</label>
              <input type="tel" inputMode="numeric" pattern="[0-9]*" value={phone} onChange={e => setPhone(sanitizePhone(e.target.value))} placeholder="10-digit number" />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              {email && !isValidEmail(email) && <div style={{ marginTop: 6, fontSize: 12, color: '#ff8a8a' }}>Please enter a valid email address</div>}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label className="field-label">Sankalpa (intention)</label>
            <textarea rows={3} placeholder="A few lines about why this prayer is being offered…" />
          </div>

          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn solid" disabled={!name || !name.trim() || !phone || phone.length !== 10 || !isValidEmail(email)} onClick={() => (name.trim() && phone.length === 10 && isValidEmail(email)) && setStep(3)} style={{ opacity: name.trim() && phone.length === 10 && isValidEmail(email) ? 1 : 0.45 }}>
              Continue<span className="arrow"></span>
            </button>
          </div>
        </div>
      )}

      {!done && step === 3 && (
        <div>
          <div style={{
            background: 'rgba(255, 122, 46,0.05)',
            border: '1px solid var(--line)',
            padding: 32, marginBottom: 28,
          }}>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>
              Your Sankalpa
            </div>
            <div className="modal-grid-summary" style={{ fontSize: 15 }}>
              <div style={{ color: 'var(--ivory-faint)' }}>Seva</div><div>{seva}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Date</div><div>{date}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Devotee</div><div>{name} {gotra && <span style={{ color: 'var(--gold)' }}>· {gotra} gotra</span>}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Phone</div><div>{phone}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Amount</div><div style={{ color: 'var(--gold)', fontFamily: 'var(--f-display)' }}>₹{current.price}</div>
            </div>
          </div>

          <label className="field-label">Payment Method</label>
          <div className="modal-grid-4" style={{ marginBottom: 28 }}>
            {['UPI', 'Card', 'Net Banking', 'Wallet'].map((m, i) => (
              <button key={m} style={{
                padding: '20px 8px',
                background: i === 0 ? 'rgba(255, 122, 46,0.08)' : 'transparent',
                border: `1px solid ${i === 0 ? 'var(--gold)' : 'var(--line-soft)'}`,
                color: 'var(--ivory)', cursor: 'pointer',
                fontFamily: 'var(--f-display)', fontSize: 11, letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}>{m}</button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn ghost" onClick={() => setStep(2)}>← Back</button>
            <button className="btn solid" onClick={async () => {
              await window.saveSevaBooking({
                name, phone, email, gotra,
                sevaName: seva, date, amount: current.price,
              });
              setDone(true);
            }}>
              Pay ₹{current.price} via Razorpay
              <span className="arrow"></span>
            </button>
          </div>

          <div style={{ marginTop: 16, fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--ivory-faint)', textAlign: 'center' }}>
            SECURED · RAZORPAY · 256-BIT ENCRYPTION
          </div>
        </div>
      )}

      {done && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            width: 80, height: 80, border: '1px solid var(--gold)', borderRadius: '50%',
            margin: '0 auto 28px', display: 'grid', placeItems: 'center',
            fontFamily: 'var(--f-sanskrit)', fontSize: 42, color: 'var(--gold)',
            boxShadow: '0 0 40px var(--gold-glow)'
          }}>ॐ</div>
          <p style={{ fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 22, color: 'var(--ivory)', marginBottom: 14 }}>
            Your offering is received, {name || 'devotee'}.
          </p>
          <p style={{ color: 'var(--ivory-dim)', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
            The priests will perform <span style={{ color: 'var(--gold)' }}>{seva}</span> in your name on the
            requested day. A confirmation receipt and prasadam dispatch tracking number have been sent to your email.
          </p>
          <div style={{ marginTop: 36 }}>
            <button className="btn" onClick={close}>Close</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ---------- Donation Modal ---------- */
function DonationModal({ open, onClose }) {
  const [type, setType] = useStateM('onetime');
  const [purpose, setPurpose] = useStateM('Temple Renovation Fund');
  const [amount, setAmount] = useStateM(1100);
  const [custom, setCustom] = useStateM(false);
  const [done, setDone] = useStateM(false);
  const [donor, setDonor] = useStateM({ name: '', phone: '', email: '' });

  const purposes = ['Temple Renovation Fund', 'Annadanam', 'Festival Sponsorship', 'Gau Seva', 'General Daanam'];
  const presets = [251, 501, 1100, 2500, 5100, 11000];

  const reset = () => { setType('onetime'); setPurpose('Temple Renovation Fund'); setAmount(1100); setCustom(false); setDone(false); setDonor({ name: '', phone: '', email: '' }); };
  const close = () => { onClose(); setTimeout(reset, 400); };

  return (
    <Modal open={open} onClose={close} title={done ? 'Blessings Received' : 'Offer Daanam'} sub={done ? 'Thank You' : 'Sacred Giving'}>
      {!done && (
        <div>
          {/* Frequency */}
          <label className="field-label">Frequency</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
            {[{k:'onetime',l:'One-Time'},{k:'monthly',l:'Monthly Sankalpa'},{k:'yearly',l:'Annual'}].map(o => (
              <button key={o.k} onClick={() => setType(o.k)} style={{
                flex: 1, padding: '18px',
                background: type === o.k ? 'rgba(255, 122, 46,0.08)' : 'transparent',
                border: `1px solid ${type === o.k ? 'var(--gold)' : 'var(--line-soft)'}`,
                color: type === o.k ? 'var(--gold)' : 'var(--ivory)',
                fontFamily: 'var(--f-display)', fontSize: 11, letterSpacing: '0.2em',
                cursor: 'pointer', textTransform: 'uppercase'
              }}>{o.l}</button>
            ))}
          </div>

          {/* Purpose */}
          <label className="field-label">Purpose</label>
          <div className="modal-grid-2" style={{ gap: 8, marginBottom: 28 }}>
            {purposes.map(p => (
              <button key={p} onClick={() => setPurpose(p)} style={{
                padding: '14px 18px', textAlign: 'left',
                background: purpose === p ? 'rgba(255, 122, 46,0.08)' : 'transparent',
                border: `1px solid ${purpose === p ? 'var(--gold)' : 'var(--line-soft)'}`,
                color: 'var(--ivory)', cursor: 'pointer',
                fontFamily: 'var(--f-serif)', fontSize: 16,
              }}>{p}</button>
            ))}
          </div>

          {/* Amount */}
          <label className="field-label">Amount {type === 'monthly' && '(per month)'}</label>
          <div className="modal-grid-6" style={{ marginBottom: 14 }}>
            {presets.map(p => (
              <button key={p} onClick={() => { setAmount(p); setCustom(false); }} style={{
                padding: '16px 6px',
                background: !custom && amount === p ? 'rgba(255, 122, 46,0.08)' : 'transparent',
                border: `1px solid ${!custom && amount === p ? 'var(--gold)' : 'var(--line-soft)'}`,
                color: 'var(--ivory)', cursor: 'pointer',
                fontFamily: 'var(--f-display)', fontSize: 13,
              }}>₹{p.toLocaleString('en-IN')}</button>
            ))}
          </div>
          <button onClick={() => setCustom(true)} style={{
            width: '100%', padding: '16px',
            background: custom ? 'rgba(255, 122, 46,0.08)' : 'transparent',
            border: `1px solid ${custom ? 'var(--gold)' : 'var(--line-soft)'}`,
            color: 'var(--ivory)', cursor: 'pointer',
            fontFamily: 'var(--f-serif)', fontSize: 15, marginBottom: 28,
          }}>
            {custom ? (
              <input
                autoFocus
                type="number"
                value={amount || ''}
                onChange={e => setAmount(Number(e.target.value))}
                placeholder="Enter custom amount in ₹"
                style={{ background: 'transparent', border: 'none', padding: 0, textAlign: 'center', fontFamily: 'var(--f-display)', fontSize: 18, color: 'var(--gold)' }}
              />
            ) : 'Enter Custom Amount'}
          </button>

          {/* Summary */}
          <div style={{
            background: 'rgba(255, 122, 46,0.05)',
            border: '1px solid var(--line)',
            padding: 24, marginBottom: 28,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.28em', color: 'var(--gold)', textTransform: 'uppercase' }}>
                Your Offering
              </div>
              <div style={{ marginTop: 8, fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 18, color: 'var(--ivory-dim)' }}>
                {purpose} · <span style={{ color: 'var(--gold)' }}>{type === 'onetime' ? 'one-time' : type === 'monthly' ? 'monthly' : 'annual'}</span>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 30, color: 'var(--gold)' }}>
              ₹{(amount || 0).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Donor Info */}
          <label className="field-label">Your Details</label>
          <div className="modal-grid-2" style={{ marginBottom: 18 }}>
            <div>
              <input value={donor.name} onChange={e => setDonor({ ...donor, name: e.target.value })} placeholder="Full Name *" />
            </div>
            <div>
              <input type="tel" inputMode="numeric" pattern="[0-9]*" value={donor.phone} onChange={e => setDonor({ ...donor, phone: sanitizePhone(e.target.value) })} placeholder="Phone (10-digit)" />
            </div>
          </div>
          <div style={{ marginBottom: 28 }}>
            <input type="email" value={donor.email} onChange={e => setDonor({ ...donor, email: e.target.value })} placeholder="Email *" />
          </div>

          <button className="btn solid" style={{ width: '100%' }} onClick={async () => {
            await window.saveDonation({
              name: donor.name, phone: donor.phone, email: donor.email,
              purpose, frequency: type, amount,
            });
            setDone(true);
          }}>
            Continue to Razorpay
            <span className="arrow"></span>
          </button>
          <div style={{ marginTop: 14, textAlign: 'center', fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ivory-faint)', letterSpacing: '0.2em' }}>
            80G EXEMPT · INSTANT RECEIPT · UPI · CARD · NETBANKING
          </div>
        </div>
      )}

      {done && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            width: 80, height: 80, border: '1px solid var(--gold)', borderRadius: '50%',
            margin: '0 auto 28px', display: 'grid', placeItems: 'center',
            fontFamily: 'var(--f-sanskrit)', fontSize: 42, color: 'var(--gold)',
            boxShadow: '0 0 40px var(--gold-glow)'
          }}>ॐ</div>
          <p style={{ fontFamily: 'var(--f-sanskrit)', fontSize: 24, color: 'var(--ivory)', marginBottom: 14 }}>
            ॥ धन्यवादः ॥
          </p>
          <p style={{ color: 'var(--ivory-dim)', maxWidth: 460, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Your offering of <span style={{ color: 'var(--gold)' }}>₹{(amount || 0).toLocaleString('en-IN')}</span> toward
            <span style={{ color: 'var(--gold)' }}> {purpose}</span> has been received with gratitude.
            An 80G receipt has been emailed to you.
          </p>
          <button className="btn" onClick={close}>Continue Darshan</button>
        </div>
      )}
    </Modal>
  );
}

/* ---------- Contact Modal ---------- */
function ContactModal({ open, onClose }) {
  const [form, setForm] = useStateM({ name: '', email: '', phone: '', message: '' });
  const [done, setDone] = useStateM(false);
  const [sending, setSending] = useStateM(false);
  const [result, setResult] = useStateM(null); // { ok, ref, emailOk, sheetOk, errors }
  const [errs, setErrs] = useStateM({});

  const close = () => {
    onClose();
    setTimeout(() => {
      setDone(false); setSending(false); setResult(null); setErrs({});
      setForm({ name: '', email: '', phone: '', message: '' });
    }, 400);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please share your name';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter a valid email';
    if (form.phone && form.phone.length !== 10) e.phone = 'Please enter a valid 10-digit phone number';
    if (!form.message.trim()) e.message = 'Please write a message';
    else if (form.message.trim().length < 6) e.message = 'A few more words, please';
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate() || sending) return;
    setSending(true);
    try {
      const r = await window.submitContact(form);
      setResult(r);
      setDone(true);
    } catch (err) {
      setResult({ ok: false, errors: [String(err && err.message || err)] });
      setDone(true);
    } finally {
      setSending(false);
    }
  };

  const fieldStyle = (key) => ({
    borderColor: errs[key] ? '#ff6464' : undefined,
  });

  return (
    <Modal open={open} onClose={close} title={done ? 'Message Received' : 'Write to the Temple'} sub={done ? 'Replies within 24 hrs' : 'In Reverence'}>
      {!done ? (
        <div>
          <p style={{ color: 'var(--ivory-dim)', textAlign: 'center', marginBottom: 32, fontSize: 17, lineHeight: 1.6 }}>
            Whether for a private consultation, a special pooja request, or a question of the heart —
            we read every message.
          </p>
          <div className="modal-grid-2" style={{ marginBottom: 18 }}>
            <div>
              <label className="field-label">Name *</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={fieldStyle('name')}
                disabled={sending}
              />
              {errs.name && <div style={{ marginTop: 6, fontSize: 12, color: '#ff8a8a' }}>{errs.name}</div>}
            </div>
            <div>
              <label className="field-label">Phone</label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: sanitizePhone(e.target.value) })}
                style={fieldStyle('phone')}
                placeholder="10-digit number"
                disabled={sending}
              />
              {errs.phone && <div style={{ marginTop: 6, fontSize: 12, color: '#ff8a8a' }}>{errs.phone}</div>}
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onBlur={validate}
              style={fieldStyle('email')}
              placeholder="you@example.com"
              required
              aria-invalid={Boolean(errs.email)}
              disabled={sending}
            />
            {errs.email && <div style={{ marginTop: 6, fontSize: 12, color: '#ff8a8a' }}>{errs.email}</div>}
            {form.email && !errs.email && isValidEmail(form.email) && <div style={{ marginTop: 6, fontSize: 12, color: 'var(--gold)' }}>Valid email</div>}
          </div>
          <div style={{ marginBottom: 28 }}>
            <label className="field-label">Your Message *</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              style={fieldStyle('message')}
              disabled={sending}
            />
            {errs.message && <div style={{ marginTop: 6, fontSize: 12, color: '#ff8a8a' }}>{errs.message}</div>}
          </div>
          <button
            className="btn solid"
            style={{ width: '100%', opacity: sending ? 0.6 : 1, pointerEvents: sending ? 'none' : 'auto' }}
            onClick={submit}
            disabled={sending}
            type="button"
          >
            {sending ? (
              <>
                <span style={{
                  display: 'inline-block', width: 14, height: 14, borderRadius: '50%',
                  border: '1.5px solid currentColor', borderTopColor: 'transparent',
                  animation: 'spin .8s linear infinite', marginRight: 8,
                }}></span>
                Sending to the Temple…
              </>
            ) : (
              <>
                Send to the Temple
                <span className="arrow"></span>
              </>
            )}
          </button>
          <div style={{ marginTop: 14, textAlign: 'center', fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ivory-faint)', letterSpacing: '0.2em' }}>
            DELIVERED VIA EMAIL · {window.TEMPLE_EMAIL || 'TRIGMATIC07@GMAIL.COM'}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--f-sanskrit)', fontSize: 30, color: 'var(--gold)', marginBottom: 18 }}>
            ॐ शान्तिः
          </div>
          {result && result.ok ? (
            <>
              <p style={{ color: 'var(--ivory-dim)', maxWidth: 440, margin: '0 auto 16px', lineHeight: 1.6 }}>
                Thank you, <span style={{ color: 'var(--gold)' }}>{form.name}</span>. The temple administrators have received your message and will reply within 24 hours.
              </p>
              <div style={{
                margin: '24px auto', padding: '14px 22px',
                border: '1px solid var(--line)',
                display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.18em',
                color: 'var(--ivory-faint)',
              }}>
                <div>YOUR REFERENCE</div>
                <div style={{ marginTop: 6, fontFamily: 'var(--f-display)', fontSize: 16, color: 'var(--gold)', letterSpacing: '0.16em' }}>
                  {result.ref}
                </div>
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.18em',
                  padding: '5px 10px', border: '1px solid var(--gold)', color: 'var(--gold)',
                }}>EMAIL DELIVERED ✓</span>
                <span style={{
                  fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.18em',
                  padding: '5px 10px',
                  border: '1px solid ' + (result.dbOk ? 'var(--gold)' : 'var(--line-soft)'),
                  color: result.dbOk ? 'var(--gold)' : 'var(--ivory-faint)',
                }}>SAVED {result.dbOk ? '✓' : '⨯'}</span>
              </div>
              <div style={{ marginTop: 36 }}>
                <button className="btn" onClick={close}>Close</button>
              </div>
            </>
          ) : (
            <>
              <p style={{ color: 'var(--ivory-dim)', maxWidth: 460, margin: '0 auto 18px', lineHeight: 1.6 }}>
                We could not reach the temple servers right now — but your message has been
                <span style={{ color: 'var(--gold)' }}> saved locally</span> with a reference ID.
                The administrators will retrieve it shortly, or you may resend.
              </p>
              {result && result.ref && (
                <div style={{
                  margin: '20px auto', padding: '12px 22px',
                  border: '1px solid var(--line-soft)',
                  display: 'inline-block',
                  fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--ivory-faint)',
                }}>
                  REFERENCE · <span style={{ color: 'var(--gold)' }}>{result.ref}</span>
                </div>
              )}
              {result && result.errors && result.errors.length > 0 && (
                <details style={{ marginTop: 12, fontSize: 11, color: 'var(--ivory-faint)', fontFamily: 'var(--f-mono)' }}>
                  <summary style={{ cursor: 'pointer' }}>Technical details</summary>
                  <pre style={{ textAlign: 'left', padding: 12, background: 'rgba(245,245,245,0.03)', marginTop: 8, fontSize: 10 }}>
                    {result.errors.join('\n')}
                  </pre>
                </details>
              )}
              <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="btn" onClick={() => { setDone(false); setResult(null); }}>Try Again</button>
                <button className="btn ghost" onClick={close}>Close</button>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

/* ---------- Vishesha Puja Modal (14-variety flow) ---------- */
const VISHESHA_PUJAS = [
  { name: 'Shiva-Shakti Aaradhana Puja', price: 5116 },
  { name: 'Birth Anniversary Seva with Rudrabhishekam', price: 5116 },
  { name: 'Vivaha Anniversary Seva with Rudrabhishekam', price: 5116 },
  { name: 'Navagrha Puja', price: 5116 },
  { name: 'Graha Dosha Parihara Puja', price: 2116 },
  { name: 'Saravana Puja', price: 1111 },
  { name: 'Veerabhadra Puja', price: 1111 },
  { name: 'Kaala Bhairava Puja', price: 1111 },
  { name: 'Ganesha Puja', price: 1111 },
  { name: 'Shani Tailabhishekam', price: 2116 },
  { name: 'Vastra Samarpana Seva (Shiva-Shakti)', price: 2499 },
  { name: 'Pushalankara Seva', price: 999 },
  { name: 'Visesha Bhasmarchana Puja', price: 1001 },
  { name: 'Sahasra Bilvarchana Puja', price: 1116 },
];

function VisheshaPujaModal({ open, onClose }) {
  const [step, setStep] = useStateM(1);
  const [puja, setPuja] = useStateM(null);
  const [form, setForm] = useStateM({ name: '', gotra: '', nakshetra: '', address: '', whatsapp: '', email: '', date: '' });
  const [done, setDone] = useStateM(false);

  const reset = () => { setStep(1); setPuja(null); setForm({ name: '', gotra: '', nakshetra: '', address: '', whatsapp: '', email: '', date: '' }); setDone(false); };
  const close = () => { onClose(); setTimeout(reset, 400); };

  const canContinueDetails = form.name && form.nakshetra && form.whatsapp && form.whatsapp.length === 10 && isValidEmail(form.email) && isFutureDate(form.date);

  return (
    <Modal open={open} onClose={close} title={done ? 'Sankalpa Received' : 'Book Visesha Puja'} sub={done ? 'Confirmation' : `Step ${step} of 3`}>
      {!done && (
        <div style={{ marginBottom: 32, display: 'flex', gap: 8 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 2, background: s <= step ? 'var(--gold)' : 'var(--line-soft)', transition: 'background .4s' }}></div>
          ))}
        </div>
      )}

      {!done && step === 1 && (
        <div>
          <label className="field-label">Choose a Visesha Puja</label>
          <div className="modal-grid-2" style={{ gap: 10, marginBottom: 8 }}>
            {VISHESHA_PUJAS.map(v => (
              <button key={v.name} onClick={() => setPuja(v.name)} style={{
                padding: '16px 18px', textAlign: 'left',
                background: puja === v.name ? 'rgba(255,122,46,0.08)' : 'transparent',
                border: `1px solid ${puja === v.name ? 'var(--gold)' : 'var(--line-soft)'}`,
                color: 'var(--ivory)', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontFamily: 'var(--f-display)', fontSize: 12, letterSpacing: '0.03em' }}>{v.name}</span>
                <span style={{ color: 'var(--gold)', fontSize: 17, flexShrink: 0, fontWeight: 700, letterSpacing: '0.02em' }}>₹{v.price.toLocaleString('en-IN')}</span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn solid" disabled={!puja} onClick={() => puja && setStep(2)} style={{ opacity: puja ? 1 : 0.45 }}>
              Continue<span className="arrow"></span>
            </button>
          </div>
        </div>
      )}

      {!done && step === 2 && (
        <div>
          <div className="modal-grid-2" style={{ marginBottom: 18 }}>
            <div><label className="field-label">Full Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="As to be chanted" /></div>
            <div><label className="field-label">Gotra</label>
              <input value={form.gotra} onChange={e => setForm({ ...form, gotra: e.target.value })} placeholder="e.g. Bharadwaja" /></div>
          </div>
          <div className="modal-grid-2" style={{ marginBottom: 18 }}>
            <div><label className="field-label">Nakshetra *</label>
              <input value={form.nakshetra} onChange={e => setForm({ ...form, nakshetra: e.target.value })} placeholder="Birth star" /></div>
            <div><label className="field-label">WhatsApp Phone *</label>
              <input type="tel" inputMode="numeric" pattern="[0-9]*" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: sanitizePhone(e.target.value) })} placeholder="10-digit number" /></div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Preferred Date *</label>
            <input type="date" value={form.date} min={todayStr()} onChange={e => setForm({ ...form, date: e.target.value })} />
            {form.date && !isFutureDate(form.date) && <div style={{ marginTop: 6, fontSize: 12, color: '#ff8a8a' }}>Please select today or a future date</div>}
          </div>
          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Address</label>
            <textarea rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label className="field-label">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            {form.email && !isValidEmail(form.email) && <div style={{ marginTop: 6, fontSize: 12, color: '#ff8a8a' }}>Please enter a valid email address</div>}
          </div>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn solid" disabled={!canContinueDetails} onClick={() => canContinueDetails && setStep(3)} style={{ opacity: canContinueDetails ? 1 : 0.45 }}>
              Continue<span className="arrow"></span>
            </button>
          </div>
        </div>
      )}

      {!done && step === 3 && (
        <div>
          <div style={{ background: 'rgba(255,122,46,0.05)', border: '1px solid var(--line)', padding: 32, marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>Your Sankalpa</div>
            <div className="modal-grid-summary" style={{ fontSize: 15 }}>
              <div style={{ color: 'var(--ivory-faint)' }}>Puja</div><div>{puja}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Devotee</div><div>{form.name} {form.gotra && <span style={{ color: 'var(--gold)' }}>· {form.gotra} gotra</span>}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Nakshetra</div><div>{form.nakshetra}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Date</div><div>{form.date}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>WhatsApp</div><div>{form.whatsapp}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Amount</div><div style={{ color: 'var(--gold)', fontFamily: 'var(--f-display)' }}>₹{VISHESHA_PUJAS.find(v => v.name === puja).price.toLocaleString('en-IN')}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn ghost" onClick={() => setStep(2)}>← Back</button>
            <button className="btn solid" onClick={async () => {
              await window.savePujaBooking({
                name: form.name, phone: form.whatsapp, email: form.email,
                gotra: form.gotra, nakshetra: form.nakshetra, address: form.address,
                pujaName: puja, pujaType: 'vishesha', date: form.date,
                amount: VISHESHA_PUJAS.find(v => v.name === puja).price,
              });
              setDone(true);
            }}>
              Pay ₹{VISHESHA_PUJAS.find(v => v.name === puja).price.toLocaleString('en-IN')} via Razorpay
              <span className="arrow"></span>
            </button>
          </div>
          <div style={{ marginTop: 16, fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--ivory-faint)', textAlign: 'center' }}>
            SECURED · RAZORPAY · 256-BIT ENCRYPTION
          </div>
        </div>
      )}

      {done && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            width: 80, height: 80, border: '1px solid var(--gold)', borderRadius: '50%',
            margin: '0 auto 28px', display: 'grid', placeItems: 'center',
            fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 42, color: 'var(--gold)',
            boxShadow: '0 0 40px var(--gold-glow)'
          }}>ॐ</div>
          <p style={{ fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 22, color: 'var(--ivory)', marginBottom: 14 }}>
            Your offering is received, {form.name || 'devotee'}.
          </p>
          <p style={{ color: 'var(--ivory-dim)', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
            The priests will perform <span style={{ color: 'var(--gold)' }}>{puja}</span> in your name.
            A confirmation receipt has been sent to your email and WhatsApp.
          </p>
          <div style={{ marginTop: 36 }}>
            <button className="btn" onClick={close}>Close</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ---------- Nitya Naivedyam Modal (monthly seva, single item) ---------- */
function NaivedyamModal({ open, onClose }) {
  const [step, setStep] = useStateM(1);
  const [form, setForm] = useStateM({ name: '', gotra: '', nakshetra: '', address: '', whatsapp: '', email: '', date: '' });
  const [done, setDone] = useStateM(false);

  const reset = () => { setStep(1); setForm({ name: '', gotra: '', nakshetra: '', address: '', whatsapp: '', email: '', date: '' }); setDone(false); };
  const close = () => { onClose(); setTimeout(reset, 400); };

  const canContinueDetails = form.name && form.nakshetra && form.whatsapp && form.whatsapp.length === 10 && isValidEmail(form.email) && isFutureDate(form.date);

  return (
    <Modal open={open} onClose={close} title={done ? 'Sankalpa Received' : 'Nitya Naivedyam Seva'} sub={done ? 'Confirmation' : `Step ${step} of 3`}>
      {!done && (
        <div style={{ marginBottom: 32, display: 'flex', gap: 8 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 2, background: s <= step ? 'var(--gold)' : 'var(--line-soft)', transition: 'background .4s' }}></div>
          ))}
        </div>
      )}

      {!done && step === 1 && (
        <div>
          <div style={{
            border: '1px solid var(--gold)', background: 'rgba(255,122,46,0.06)',
            padding: 32, textAlign: 'center', marginBottom: 28,
          }}>
            <div style={{ fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 26, color: 'var(--ivory)', marginBottom: 10 }}>Naivedyam</div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 34, color: 'var(--gold)', fontWeight: 700 }}>
              ₹10,000<span style={{ fontSize: 15, color: 'var(--ivory-faint)', fontWeight: 400 }}> for one month</span>
            </div>
            <p style={{ marginTop: 18, color: 'var(--ivory-dim)', fontSize: 15, fontStyle: 'italic', lineHeight: 1.6 }}>
              Daily <b style={{ color: 'var(--gold)' }}>1 kg</b> naivedyam will be offered to the deity in your name, every day for a month.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn solid" onClick={() => setStep(2)}>
              Continue<span className="arrow"></span>
            </button>
          </div>
        </div>
      )}

      {!done && step === 2 && (
        <div>
          <div className="modal-grid-2" style={{ marginBottom: 18 }}>
            <div><label className="field-label">Full Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="As to be chanted" /></div>
            <div><label className="field-label">Gotra</label>
              <input value={form.gotra} onChange={e => setForm({ ...form, gotra: e.target.value })} placeholder="e.g. Bharadwaja" /></div>
          </div>
          <div className="modal-grid-2" style={{ marginBottom: 18 }}>
            <div><label className="field-label">Nakshetra *</label>
              <input value={form.nakshetra} onChange={e => setForm({ ...form, nakshetra: e.target.value })} placeholder="Birth star" /></div>
            <div><label className="field-label">WhatsApp Phone *</label>
              <input type="tel" inputMode="numeric" pattern="[0-9]*" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: sanitizePhone(e.target.value) })} placeholder="10-digit number" /></div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Preferred Start Date *</label>
            <input type="date" value={form.date} min={todayStr()} onChange={e => setForm({ ...form, date: e.target.value })} />
            {form.date && !isFutureDate(form.date) && <div style={{ marginTop: 6, fontSize: 12, color: '#ff8a8a' }}>Please select today or a future date</div>}
          </div>
          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Address</label>
            <textarea rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label className="field-label">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            {form.email && !isValidEmail(form.email) && <div style={{ marginTop: 6, fontSize: 12, color: '#ff8a8a' }}>Please enter a valid email address</div>}
          </div>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn solid" disabled={!canContinueDetails} onClick={() => canContinueDetails && setStep(3)} style={{ opacity: canContinueDetails ? 1 : 0.45 }}>
              Continue<span className="arrow"></span>
            </button>
          </div>
        </div>
      )}

      {!done && step === 3 && (
        <div>
          <div style={{ background: 'rgba(255,122,46,0.05)', border: '1px solid var(--line)', padding: 32, marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>Your Sankalpa</div>
            <div className="modal-grid-summary" style={{ fontSize: 15 }}>
              <div style={{ color: 'var(--ivory-faint)' }}>Seva</div><div>Naivedyam (Daily 1kg, this month)</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Devotee</div><div>{form.name} {form.gotra && <span style={{ color: 'var(--gold)' }}>· {form.gotra} gotra</span>}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Nakshetra</div><div>{form.nakshetra}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Start Date</div><div>{form.date}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Till Date</div><div>{addDuration(form.date, '(1 Month)')}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>WhatsApp</div><div>{form.whatsapp}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Amount</div><div style={{ color: 'var(--gold)', fontFamily: 'var(--f-display)' }}>₹10,000 (one month)</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn ghost" onClick={() => setStep(2)}>← Back</button>
            <button className="btn solid" onClick={async () => {
              await window.savePujaBooking({
                name: form.name, phone: form.whatsapp, email: form.email,
                gotra: form.gotra, nakshetra: form.nakshetra, address: form.address,
                pujaName: 'Naivedyam (Daily 1kg, 1 Month)', pujaType: 'naivedyam',
                date: form.date, amount: 10000,
              });
              setDone(true);
            }}>
              Pay ₹10,000 for This Month via Razorpay
              <span className="arrow"></span>
            </button>
          </div>
          <div style={{ marginTop: 16, fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--ivory-faint)', textAlign: 'center' }}>
            ONE-TIME PAYMENT · NO AUTO-RENEWAL · SECURED BY RAZORPAY
          </div>
        </div>
      )}

      {done && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            width: 80, height: 80, border: '1px solid var(--gold)', borderRadius: '50%',
            margin: '0 auto 28px', display: 'grid', placeItems: 'center',
            fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 42, color: 'var(--gold)',
            boxShadow: '0 0 40px var(--gold-glow)'
          }}>ॐ</div>
          <p style={{ fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 22, color: 'var(--ivory)', marginBottom: 14 }}>
            Your offering is received, {form.name || 'devotee'}.
          </p>
          <p style={{ color: 'var(--ivory-dim)', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
            Daily <span style={{ color: 'var(--gold)' }}>1 kg naivedyam</span> will be offered in your name each day this month.
            A confirmation receipt has been sent to your email and WhatsApp.
          </p>
          <div style={{ marginTop: 36 }}>
            <button className="btn" onClick={close}>Close</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ---------- Nitya Pratah Puja Modal (8-variety flow) ---------- */
const NITYA_PRATAH_PUJAS = [
  { name: 'Nitya Archana Seva (1 Month)', price: 5116 },
  { name: 'Nitya Deeparadhana Seva (1 Month)', price: 516 },
  { name: 'Somavara Visesha Puja (1 Month)', price: 2500 },
  { name: 'Pournima Visesha Puja (1 Year)', price: 6000 },
  { name: 'Amavasya Visesha Puja (1 Year)', price: 6000 },
  { name: 'Masa Shivaratri Puja (1 Year)', price: 6000 },
  { name: 'Arudra Nakshatra Puja (1 Year)', price: 6000 },
  { name: 'Visesa Dravya Abhishekam (1 Day)', price: 516 },
];

function NityaPratahModal({ open, onClose }) {
  const [step, setStep] = useStateM(1);
  const [puja, setPuja] = useStateM(null);
  const [form, setForm] = useStateM({ name: '', gotra: '', nakshetra: '', address: '', whatsapp: '', email: '', date: '' });
  const [done, setDone] = useStateM(false);

  const reset = () => { setStep(1); setPuja(null); setForm({ name: '', gotra: '', nakshetra: '', address: '', whatsapp: '', email: '', date: '' }); setDone(false); };
  const close = () => { onClose(); setTimeout(reset, 400); };

  const canContinueDetails = form.name && form.nakshetra && form.whatsapp && form.whatsapp.length === 10 && isValidEmail(form.email) && isFutureDate(form.date);

  return (
    <Modal open={open} onClose={close} title={done ? 'Sankalpa Received' : 'Book Nitya Pratah Puja'} sub={done ? 'Confirmation' : `Step ${step} of 3`}>
      {!done && (
        <div style={{ marginBottom: 32, display: 'flex', gap: 8 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 2, background: s <= step ? 'var(--gold)' : 'var(--line-soft)', transition: 'background .4s' }}></div>
          ))}
        </div>
      )}

      {!done && step === 1 && (
        <div>
          <label className="field-label">Choose a Puja</label>
          <div className="modal-grid-2" style={{ gap: 10, marginBottom: 8 }}>
            {NITYA_PRATAH_PUJAS.map(v => (
              <button key={v.name} onClick={() => setPuja(v.name)} style={{
                padding: '16px 18px', textAlign: 'left',
                background: puja === v.name ? 'rgba(255,122,46,0.08)' : 'transparent',
                border: `1px solid ${puja === v.name ? 'var(--gold)' : 'var(--line-soft)'}`,
                color: 'var(--ivory)', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontFamily: 'var(--f-display)', fontSize: 12, letterSpacing: '0.03em' }}>{v.name}</span>
                <span style={{ color: 'var(--gold)', fontSize: 17, fontWeight: 700, letterSpacing: '0.02em', flexShrink: 0 }}>₹{v.price.toLocaleString('en-IN')}</span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn solid" disabled={!puja} onClick={() => puja && setStep(2)} style={{ opacity: puja ? 1 : 0.45 }}>
              Continue<span className="arrow"></span>
            </button>
          </div>
        </div>
      )}

      {!done && step === 2 && (
        <div>
          <div className="modal-grid-2" style={{ marginBottom: 18 }}>
            <div><label className="field-label">Full Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="As to be chanted" /></div>
            <div><label className="field-label">Gotra</label>
              <input value={form.gotra} onChange={e => setForm({ ...form, gotra: e.target.value })} placeholder="e.g. Bharadwaja" /></div>
          </div>
          <div className="modal-grid-2" style={{ marginBottom: 18 }}>
            <div><label className="field-label">Nakshetra *</label>
              <input value={form.nakshetra} onChange={e => setForm({ ...form, nakshetra: e.target.value })} placeholder="Birth star" /></div>
            <div><label className="field-label">WhatsApp Phone *</label>
              <input type="tel" inputMode="numeric" pattern="[0-9]*" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: sanitizePhone(e.target.value) })} placeholder="10-digit number" /></div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Preferred Start Date *</label>
            <input type="date" value={form.date} min={todayStr()} onChange={e => setForm({ ...form, date: e.target.value })} />
            {form.date && !isFutureDate(form.date) && <div style={{ marginTop: 6, fontSize: 12, color: '#ff8a8a' }}>Please select today or a future date</div>}
          </div>
          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Address</label>
            <textarea rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label className="field-label">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            {form.email && !isValidEmail(form.email) && <div style={{ marginTop: 6, fontSize: 12, color: '#ff8a8a' }}>Please enter a valid email address</div>}
          </div>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn solid" disabled={!canContinueDetails} onClick={() => canContinueDetails && setStep(3)} style={{ opacity: canContinueDetails ? 1 : 0.45 }}>
              Continue<span className="arrow"></span>
            </button>
          </div>
        </div>
      )}

      {!done && step === 3 && (
        <div>
          <div style={{ background: 'rgba(255,122,46,0.05)', border: '1px solid var(--line)', padding: 32, marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>Your Sankalpa</div>
            <div className="modal-grid-summary" style={{ fontSize: 15 }}>
              <div style={{ color: 'var(--ivory-faint)' }}>Puja</div><div>{puja}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Devotee</div><div>{form.name} {form.gotra && <span style={{ color: 'var(--gold)' }}>· {form.gotra} gotra</span>}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Nakshetra</div><div>{form.nakshetra}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Start Date</div><div>{form.date}</div>
              {addDuration(form.date, puja) && (<><div style={{ color: 'var(--ivory-faint)' }}>Till Date</div><div>{addDuration(form.date, puja)}</div></>)}
              <div style={{ color: 'var(--ivory-faint)' }}>WhatsApp</div><div>{form.whatsapp}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Amount</div><div style={{ color: 'var(--gold)', fontFamily: 'var(--f-display)' }}>₹{NITYA_PRATAH_PUJAS.find(v => v.name === puja).price.toLocaleString('en-IN')}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn ghost" onClick={() => setStep(2)}>← Back</button>
            <button className="btn solid" onClick={async () => {
              await window.savePujaBooking({
                name: form.name, phone: form.whatsapp, email: form.email,
                gotra: form.gotra, nakshetra: form.nakshetra, address: form.address,
                pujaName: puja, pujaType: 'nitya_pratah', date: form.date,
                amount: NITYA_PRATAH_PUJAS.find(v => v.name === puja).price,
              });
              setDone(true);
            }}>
              Pay ₹{NITYA_PRATAH_PUJAS.find(v => v.name === puja).price.toLocaleString('en-IN')} via Razorpay
              <span className="arrow"></span>
            </button>
          </div>
          <div style={{ marginTop: 16, fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--ivory-faint)', textAlign: 'center' }}>
            SECURED · RAZORPAY · 256-BIT ENCRYPTION
          </div>
        </div>
      )}

      {done && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            width: 80, height: 80, border: '1px solid var(--gold)', borderRadius: '50%',
            margin: '0 auto 28px', display: 'grid', placeItems: 'center',
            fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 42, color: 'var(--gold)',
            boxShadow: '0 0 40px var(--gold-glow)'
          }}>ॐ</div>
          <p style={{ fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 22, color: 'var(--ivory)', marginBottom: 14 }}>
            Your offering is received, {form.name || 'devotee'}.
          </p>
          <p style={{ color: 'var(--ivory-dim)', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
            The priests will perform <span style={{ color: 'var(--gold)' }}>{puja}</span> in your name.
            A confirmation receipt has been sent to your email and WhatsApp.
          </p>
          <div style={{ marginTop: 36 }}>
            <button className="btn" onClick={close}>Close</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ---------- Rudrabhishekam Modal (single-item seva, same format as Naivedyam) ---------- */
function RudrabhishekamModal({ open, onClose }) {
  const [step, setStep] = useStateM(1);
  const [form, setForm] = useStateM({ name: '', gotra: '', nakshetra: '', address: '', whatsapp: '', email: '', date: '' });
  const [done, setDone] = useStateM(false);

  const reset = () => { setStep(1); setForm({ name: '', gotra: '', nakshetra: '', address: '', whatsapp: '', email: '', date: '' }); setDone(false); };
  const close = () => { onClose(); setTimeout(reset, 400); };

  const canContinueDetails = form.name && form.nakshetra && form.whatsapp && form.whatsapp.length === 10 && isValidEmail(form.email) && isFutureDate(form.date);

  return (
    <Modal open={open} onClose={close} title={done ? 'Sankalpa Received' : 'Rudrabhishekam Seva'} sub={done ? 'Confirmation' : `Step ${step} of 3`}>
      {!done && (
        <div style={{ marginBottom: 32, display: 'flex', gap: 8 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 2, background: s <= step ? 'var(--gold)' : 'var(--line-soft)', transition: 'background .4s' }}></div>
          ))}
        </div>
      )}

      {!done && step === 1 && (
        <div>
          <div style={{
            border: '1px solid var(--gold)', background: 'rgba(255,122,46,0.06)',
            padding: 32, textAlign: 'center', marginBottom: 28,
          }}>
            <div style={{ fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 26, color: 'var(--ivory)', marginBottom: 10 }}>Rudrabhishekam</div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 34, color: 'var(--gold)', fontWeight: 700 }}>
              ₹2,116
            </div>
            <p style={{ marginTop: 18, color: 'var(--ivory-dim)', fontSize: 15, fontStyle: 'italic', lineHeight: 1.6 }}>
              Abhishekam with Sri Rudram Namakam Chamakam, performed in your name.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn solid" onClick={() => setStep(2)}>
              Continue<span className="arrow"></span>
            </button>
          </div>
        </div>
      )}

      {!done && step === 2 && (
        <div>
          <div className="modal-grid-2" style={{ marginBottom: 18 }}>
            <div><label className="field-label">Full Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="As to be chanted" /></div>
            <div><label className="field-label">Gotra</label>
              <input value={form.gotra} onChange={e => setForm({ ...form, gotra: e.target.value })} placeholder="e.g. Bharadwaja" /></div>
          </div>
          <div className="modal-grid-2" style={{ marginBottom: 18 }}>
            <div><label className="field-label">Nakshetra *</label>
              <input value={form.nakshetra} onChange={e => setForm({ ...form, nakshetra: e.target.value })} placeholder="Birth star" /></div>
            <div><label className="field-label">WhatsApp Phone *</label>
              <input type="tel" inputMode="numeric" pattern="[0-9]*" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: sanitizePhone(e.target.value) })} placeholder="10-digit number" /></div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Preferred Date *</label>
            <input type="date" value={form.date} min={todayStr()} onChange={e => setForm({ ...form, date: e.target.value })} />
            {form.date && !isFutureDate(form.date) && <div style={{ marginTop: 6, fontSize: 12, color: '#ff8a8a' }}>Please select today or a future date</div>}
          </div>
          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Address</label>
            <textarea rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label className="field-label">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            {form.email && !isValidEmail(form.email) && <div style={{ marginTop: 6, fontSize: 12, color: '#ff8a8a' }}>Please enter a valid email address</div>}
          </div>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn solid" disabled={!canContinueDetails} onClick={() => canContinueDetails && setStep(3)} style={{ opacity: canContinueDetails ? 1 : 0.45 }}>
              Continue<span className="arrow"></span>
            </button>
          </div>
        </div>
      )}

      {!done && step === 3 && (
        <div>
          <div style={{ background: 'rgba(255,122,46,0.05)', border: '1px solid var(--line)', padding: 32, marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>Your Sankalpa</div>
            <div className="modal-grid-summary" style={{ fontSize: 15 }}>
              <div style={{ color: 'var(--ivory-faint)' }}>Seva</div><div>Rudrabhishekam</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Devotee</div><div>{form.name} {form.gotra && <span style={{ color: 'var(--gold)' }}>· {form.gotra} gotra</span>}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Nakshetra</div><div>{form.nakshetra}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Date</div><div>{form.date}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>WhatsApp</div><div>{form.whatsapp}</div>
              <div style={{ color: 'var(--ivory-faint)' }}>Amount</div><div style={{ color: 'var(--gold)', fontFamily: 'var(--f-display)' }}>₹2,116</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn ghost" onClick={() => setStep(2)}>← Back</button>
            <button className="btn solid" onClick={async () => {
              await window.savePujaBooking({
                name: form.name, phone: form.whatsapp, email: form.email,
                gotra: form.gotra, nakshetra: form.nakshetra, address: form.address,
                pujaName: 'Rudrabhishekam', pujaType: 'rudrabhishekam',
                date: form.date, amount: 2116,
              });
              setDone(true);
            }}>
              Pay ₹2,116 via Razorpay
              <span className="arrow"></span>
            </button>
          </div>
          <div style={{ marginTop: 16, fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--ivory-faint)', textAlign: 'center' }}>
            SECURED · RAZORPAY · 256-BIT ENCRYPTION
          </div>
        </div>
      )}

      {done && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            width: 80, height: 80, border: '1px solid var(--gold)', borderRadius: '50%',
            margin: '0 auto 28px', display: 'grid', placeItems: 'center',
            fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 42, color: 'var(--gold)',
            boxShadow: '0 0 40px var(--gold-glow)'
          }}>ॐ</div>
          <p style={{ fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 22, color: 'var(--ivory)', marginBottom: 14 }}>
            Your offering is received, {form.name || 'devotee'}.
          </p>
          <p style={{ color: 'var(--ivory-dim)', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
            The priests will perform <span style={{ color: 'var(--gold)' }}>Rudrabhishekam</span> in your name.
            A confirmation receipt has been sent to your email and WhatsApp.
          </p>
          <div style={{ marginTop: 36 }}>
            <button className="btn" onClick={close}>Close</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

Object.assign(window, { Modal, SevaModal, DonationModal, ContactModal, VisheshaPujaModal, NaivedyamModal, NityaPratahModal, RudrabhishekamModal });
