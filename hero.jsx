/* global React */
const { useEffect, useRef, useState } = React;

function Particles({ count = 28 }) {
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 10,
      drift: (Math.random() - 0.5) * 80,
      size: 1 + Math.random() * 2,
      cyan: Math.random() > 0.7
    }));
  }, [count]);
  return (
    <div className="particles">
      {particles.map((p, i) =>
      <span
        key={i}
        className="particle"
        style={{
          left: `${p.left}%`,
          bottom: '0px',
          width: `${p.size}px`,
          height: `${p.size}px`,
          background: p.cyan ? '#8ad0ff' : 'var(--gold)',
          boxShadow: p.cyan ? '0 0 10px rgba(120,190,255,0.6)' : '0 0 10px rgba(255, 122, 46,0.5)',
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
          '--drift': `${p.drift}px`
        }} />

      )}
    </div>);

}

function Hero({ onBookSeva, onDonate, lingamStyle }) {
  return (
    <section className="hero" id="home" data-screen-label="01 Hero" style={{ padding: 0 }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src="assets/hero-lingam-new.jpeg"
          alt="Sri Santha Malleswara Jyotirlinga"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(5,5,5,.3), rgba(5,5,5,.15) 45%, rgba(5,5,5,.92) 100%)',
        }}></div>
      </div>

      <div style={{ position: 'absolute', left: 60, bottom: 60, zIndex: 3, maxWidth: 520 }}>
        <span className="om" style={{ display: 'block', fontSize: 20, fontFamily: 'Times New Roman', letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: 16 }}>
          <b><span style={{ fontWeight: 'normal' }}><b style={{ fontSize: 23, color: '#D4CCCC', background: 'linear-gradient(180deg, #4B4B4B00, #28211a)' }}><span style={{ fontSize: 20 }}>⥥नमः शिवाभ्यां नवयौवनाभ्यां⥥</span></b></span></b>
        </span>
        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 52, letterSpacing: '0.05em', lineHeight: 1.1, margin: 0 }}>
          <span style={{ fontFamily: 'Times New Roman' }}>Sri Santha</span><br/>
          <span className="glow serif-display" style={{ fontStyle: 'italic', fontWeight: 400, fontFamily: 'Times New Roman', color: '#FF7A2E' }}>Malleswara Swami</span>
        </h1>
        <div style={{
          marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.15em',
          color: 'var(--ivory-faint)', border: '1px solid var(--line)',
          padding: '7px 16px', borderRadius: 20, textTransform: 'uppercase',
        }}>
          <b style={{ color: '#FFFFF8' }}>12TH CENTURY TEMPLE . RENOVATED BY CHINMAYA MISSION . ADONI</b>
        </div>
        <p style={{ marginTop: 22, fontFamily: 'var(--f-script)', fontStyle: 'italic', color: 'var(--ivory-dim)', fontSize: 16, maxWidth: 460, lineHeight: 1.5 }}>
          ॐ सद्योजात-वामदेव-अघोरा-तत्पुरुष-ईशान पञ्चमुख |<br/><span style={{ paddingLeft: '3em' }}>पञ्चभूतात्म स्वरूप श्री शान्त मलेश्वर देवताभ्यो नमो नमः ||</span>
        </p>
        <div style={{ marginTop: 28, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <button className="btn solid" onClick={onBookSeva}>
            <b><span style={{ fontWeight: 'normal' }}><span style={{ color: 'rgb(5, 5, 5)', letterSpacing: '3.84px' }}>Book a seva</span></span></b>
            <span className="arrow"></span>
          </button>
          <button className="btn" onClick={onDonate}>
            OFFER DONATION
          </button>
        </div>
      </div>
    </section>);

}

Object.assign(window, { Hero, Particles });