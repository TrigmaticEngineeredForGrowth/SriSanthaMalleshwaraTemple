/* global React */
function Nav({ active, onBookSeva, onDonate, onContact }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  React.useEffect(() => {
    const s = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', s, { passive: true });
    return () => window.removeEventListener('scroll', s);
  }, []);
  const link = (label, href, key) => (
    <a href={href} className={active === key ? 'active' : ''} onClick={() => setMobileOpen(false)}>{label}</a>
  );
  return (
    <nav className={'nav ' + (scrolled ? 'scrolled' : '') + (mobileOpen ? ' mobile-open' : '')}>
      <div className="nav-mark">
        <div className="sigil" style={{ fontFamily: "var(--f-sanskrit)" }}>ॐ</div>
        <div>
          <div style={{ width: "200px", height: "40px", fontSize: "14px" }}>
            <span style={{ width: "147px", height: "63px", fontSize: "11px" }}>SRI SANTHA MALLESWARA TEMPLE</span>
          </div>
          <span className="sub" style={{ fontSize: "10px" }}>
            <span style={{ color: "#FFF9F96B", background: "linear-gradient(180deg, #52504F, #28211a)", fontSize: "11px" }}>Built by Kakatiyas,<br/>Developed by Krishnadevaraya</span>
          </span>
        </div>
      </div>
      <div className="nav-links">
        {link('Home', '#home', 'home')}
        {link('About', '#about', 'about')}
        {link('Services', '#services', 'services')}
        {link('Events', '#events', 'events')}
        {link('Gallery', '#gallery', 'gallery')}
        {link('Audio', '#audio', 'audio')}
        <a onClick={() => { setMobileOpen(false); onContact(); }} style={{ cursor: 'pointer' }}>Contact</a>
      </div>
      <div className="nav-cta">
        <button className="ico" title="Live Darshan">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
          </svg>
        </button>
        <button className="mini-btn" onClick={onDonate}>Donate</button>
        <button className="nav-hamburger" aria-label="Menu" onClick={() => setMobileOpen(v => !v)}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}

function LiveDarshanBand() {
  return (
    <div className="marquee" data-screen-label="Marquee">
      <div className="marquee-track">
        {Array.from({ length: 2 }).map((_, k) => (
          <React.Fragment key={k}>
            <span className="marquee-item">॥ Om Namah Shivaya ॥ <span className="dot"></span></span>
            <span className="marquee-item">Live Darshan available — Suryodayam Aarti 8:30 AM IST <span className="dot"></span></span>
            <span className="marquee-item">Maha Shivaratri 2027 · March 6 — Sponsorship Open <span className="dot"></span></span>
            <span className="marquee-item">Karthika Deepotsavam · Thousand Lamp Festival <span className="dot"></span></span>
            <span className="marquee-item">Annadanam served daily 12:00 — 2:00 PM <span className="dot"></span></span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function OmDivider() {
  return (
    <div style={{
      height: 2, position: 'relative', marginTop: 24,
      background: 'linear-gradient(90deg, transparent, var(--gold) 15%, var(--gold) 85%, transparent)',
      opacity: 0.9,
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 46, height: 46, borderRadius: '50%',
        background: 'var(--bg-0)', border: '2px solid var(--gold)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 24px var(--gold-glow)',
      }}>
        <span style={{ fontFamily: 'var(--f-sanskrit)', color: 'var(--gold)', fontSize: 22, lineHeight: 1 }}>ॐ</span>
      </div>
    </div>
  );
}

Object.assign(window, { Nav, LiveDarshanBand, OmDivider });
