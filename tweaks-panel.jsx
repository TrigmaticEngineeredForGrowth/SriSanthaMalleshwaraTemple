/* global React */
const { useState: tpState, useEffect: tpEffect, useRef: tpRef, createContext: tpCtx, useContext: tpUse, useCallback: tpCb } = React;

const TweakContext = tpCtx(null);

function useTweaks(defaults) {
  const [values, setValues] = tpState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('om-tweaks') || '{}');
      return { ...defaults, ...saved };
    } catch {
      return { ...defaults };
    }
  });

  const setTweak = tpCb((key, val) => {
    setValues(prev => {
      const next = { ...prev, [key]: val };
      try { localStorage.setItem('om-tweaks', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return { values, setTweak };
}

function TweaksPanel({ title, children }) {
  const [open, setOpen] = tpState(false);
  const ref = tpRef(null);

  tpEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'T' || e.key === 't')) {
        e.preventDefault();
        setOpen(v => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!open) return null;

  return (
    <div ref={ref} style={{
      position: 'fixed', top: 80, right: 24, zIndex: 90,
      width: 320, maxHeight: '80vh', overflowY: 'auto',
      background: 'linear-gradient(180deg, #0d1428, #060814)',
      border: '1px solid var(--line)',
      padding: 28,
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <span style={{ fontFamily: 'var(--f-display)', fontSize: 13, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>{title || 'Tweaks'}</span>
        <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: '1px solid var(--line-soft)', color: 'var(--ivory)', width: 32, height: 32, cursor: 'pointer', fontFamily: 'var(--f-script)', fontSize: 18 }}>×</button>
      </div>
      {children}
    </div>
  );
}

function TweakSection({ label, style, children }) {
  return (
    <div style={{ marginBottom: 28, ...style }}>
      <div style={{ fontFamily: 'var(--f-display)', fontSize: 11, letterSpacing: '0.24em', color: 'var(--ivory-dim)', textTransform: 'uppercase', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid var(--line-soft)' }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function TweakColor({ label, value, options, onChange }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {options.map(c => (
          <button key={c} onClick={() => onChange(c)} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: c, cursor: 'pointer',
            border: value === c ? '2px solid var(--ivory)' : '2px solid transparent',
            transition: 'border-color .25s ease',
          }} />
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { useTweaks, TweaksPanel, TweakSection, TweakSelect, TweakColor });
