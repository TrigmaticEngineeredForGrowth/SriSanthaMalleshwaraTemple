/* global React */
const { useEffect: useEffectS, useRef: useRefS, useState: useStateS } = React;

// Scroll reveal hook
function useReveal() {
  useEffectS(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

/* Temple imagery — generic Hindu temple stock photos via Unsplash.
   Swap any of these for authentic temple photos by attaching files in chat. */
function TempleImg({ keywords, style, className, alt, sig }) {
  const src = `https://source.unsplash.com/featured/?${encodeURIComponent(keywords)}&sig=${sig || 1}`;
  const onError = (e) => {
    // Hide broken image, show gradient fallback underneath
    e.currentTarget.style.opacity = '0';
  };
  return (
    <div className={className} style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0d1428 0%, #1a1238 50%, #2a1410 100%)',
      ...style
    }}>
      <img
        src={src}
        alt={alt || keywords}
        loading="lazy"
        onError={onError}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          display: 'block',
          transition: 'transform 1.2s ease, opacity .6s',
        }}
      />
      {/* Subtle dark overlay for text legibility on top */}
      <div style={{
        position: 'absolute', inset: 0, pointer: 'none',
        background: 'linear-gradient(180deg, transparent 50%, rgba(5,5,5,0.35) 100%)',
        pointerEvents: 'none',
      }}></div>
    </div>
  );
}

function Divider() {
  return (
    <div className="divider">
      <span className="line"></span>
      <span className="dot"></span>
      <span className="dot" style={{ opacity: 0.6 }}></span>
      <span className="dot"></span>
      <span className="line"></span>
    </div>
  );
}

/* ---------- Introduction ---------- */
function Introduction() {
  return (
    <section style={{ background: 'linear-gradient(180deg, var(--bg-0), var(--bg-1) 60%, var(--bg-0))' }} data-screen-label="02 Introduction">
      <div className="container grid-2col">
        <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <img
            src="assets/temple-trishul-hilltop.jpeg"
            alt="Temple trishul overlooking the town"
            style={{ aspectRatio: '4/5', width: '100%', objectFit: 'cover', border: '1px solid var(--line-soft)' }} />
          <img
            src="assets/temple-hilltop-view.jpeg"
            alt="Temple complex on the hilltop overlooking the town"
            style={{ aspectRatio: '16/9', width: '100%', objectFit: 'cover', border: '1px solid var(--line-soft)' }} />
        </div>
        <div className="reveal delay-1">
          <span className="eyebrow">Sacred Heritage</span>
          <h2 style={{ marginTop: 28 }}>
            A sanctuary woven of<br/>
            <span className="serif-display" style={{ color: 'var(--gold)' }}>silence, fire, and starlight.</span>
          </h2>
          <div style={{ marginTop: 32, fontSize: 20, color: 'var(--ivory-dim)', lineHeight: 1.7 }}>
            <p>This temple dates to the 12th century AD, built during the Kakatiya period when they ruled Orugallu. It is associated with Sri Chenna Basaveshwara Swamy, one of the Panchacharya peethadhipathas. Some Shivalingas consecrated by the Kakatiyas still show arrow marks.</p>
            <br/>
            <p>The temple stands on Navaratna Shikhara, a hill known for its multicolored rock strata. A natural spring emerges at a corner of the hill, feeding the temple pond and flowing beneath the mandapa. Over time the pond became silted and the flow was choked; after removal of the silt, the water returned to its original course.<br/><br/></p>
            <div>Within the complex are five sacred lingas:</div>
            <ul style={{ marginTop: 12, paddingLeft: 24, color: 'var(--ivory-dim)', fontSize: 20, lineHeight: 1.7 }}>
              <li><b>Sadyojata Linga</b> facing West resembles Earth element behind the principal shrine called Bhogalingeswara</li>
              <li><b>Vamadeva Linga</b> facing North resembles Water element beside the pond called Tyagarajeswara</li>
              <li><b>Aghora Linga</b> facing South resembles Fire element in the SouthEast called Yogalingeswara</li>
              <li><b>Tatpurusha Linga</b> facing East resembles Air element in the NorthWest called Muktheswara</li>
              <li><b>Ishana Linga</b> — The Principal Shrine facing Upward resembles Space element called "SANTHA MALLESWARA"</li>
            </ul>
            <div style={{ marginTop: 12 }}>These five lingas correspond to the five-faced aspects of the Supreme Lord, enhancing the sanctity of the temple.</div>
          </div>
          <p style={{ marginTop: 22, fontSize: 18, color: 'var(--ivory-faint)', fontStyle: 'italic', lineHeight: 1.7 }}>
          </p>
          <div style={{ marginTop: 38, display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 36, color: 'var(--gold)' }}>25+</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.28em', color: 'var(--ivory-faint)', textTransform: 'uppercase', marginTop: 6 }}>Years of Seva</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 36, color: 'var(--gold)' }}>25</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.28em', color: 'var(--ivory-faint)', textTransform: 'uppercase', marginTop: 6 }}>Annual Festivals</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 36, color: 'var(--gold)' }}>∞</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.28em', color: 'var(--ivory-faint)', textTransform: 'uppercase', marginTop: 6 }}>Continuous Aarti</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Pooja Timings ---------- */
const POOJA_TIMES = [
  { name: 'Nitya Pratah|Puja', desc: 'The awakening of the deity with sacred chants', icon: '☀' },
  { name: 'Visesha|Pujas', desc: 'Sacred bathing with special Dravyas', icon: '❖' },
  { name: 'RudrAbhishekam', desc: 'Abhishekam with Sri Rudram Namakam Chamakam', icon: 'ॐ' },
  { name: 'Pradosha|Puja', desc: 'Twilight worship to Lord Shiva', icon: '◇' },
  { name: 'Sri Chakra KumkumArchana', desc: 'Kumkuma puja', icon: '✴' },
  { name: 'Sacred Homas', desc: 'Vedic fire rituals', icon: '🔥' },
  { name: 'Nitya Naivedyam', desc: 'Prasadam offering (Daily 1kg)', icon: '◐' },
  { name: 'Maha Shivaratri Special', desc: 'Auspicious Maghamasa Pujas & Abhishekas (30 Days)', icon: '✶' },
];

function PoojaTimings({ onBookSeva, onVisheshaPuja, onNaivedyam, onNityaPratah, onRudrabhishekam, onSacredHoma, onPradosha, onSriChakra, onMahaShivaratri }) {
  return (
    <section style={{ background: 'var(--bg-0)' }} data-screen-label="03 Pooja Timings">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 80 }} className="reveal">
          <span className="eyebrow">Daily Rhythm</span>
          <h2 style={{ marginTop: 24 }}>
            The Hours of <span className="serif-display" style={{ color: 'var(--gold)' }}>Devotion & Seva</span>
          </h2>
          <p style={{ marginTop: 20, color: 'var(--ivory-dim)', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', fontSize: 19 }}>
            Sacred services mark our days — each a returning to silence, each an offering of light.
            Choose a seva, name the divine intention, and our priests will perform it in your name.
          </p>
        </div>

        <div className="grid-auto-4" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18 }}>
          {POOJA_TIMES.map((p, i) => {
            const isShivaratri = p.name === 'Maha Shivaratri Special';
            return (
            <div key={i} className={`card pooja-card reveal delay-${i % 4}${isShivaratri ? ' maha-shivaratri-card' : ''}`} style={{ padding: '40px 24px', textAlign: 'center', flex: '1 1 calc(25% - 18px)', minWidth: 220, display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {isShivaratri && <div className="shivaratri-glow" />}
              <div className="pooja-card-icon" style={{ fontSize: 32, color: isShivaratri ? '#E8C44A' : 'var(--gold)', fontFamily: 'var(--f-script)', marginBottom: 22, position: 'relative' }}>{p.icon}</div>
              <h3 style={{ fontSize: 17, marginBottom: 14, letterSpacing: '0.06em', position: 'relative' }}>{p.name.includes('|') ? p.name.split('|').map((line, li) => <React.Fragment key={li}>{line}{li === 0 && <br/>}</React.Fragment>) : p.name}</h3>
              <p style={{ fontSize: 14, color: isShivaratri ? 'var(--ivory-dim)' : 'var(--ivory-faint)', fontStyle: 'italic', lineHeight: 1.5, flex: 1, position: 'relative' }}>{p.desc === 'Prasadam offering (Daily 1kg)' ? <span style={{ fontSize: 16 }}>Prasadam offering<br/>(Daily <b>1</b>kg)</span> : p.desc}</p>
              <button className="btn" style={{ marginTop: 24, padding: '12px 20px', fontSize: 10, width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }} onClick={() => p.name === 'Visesha|Pujas' ? onVisheshaPuja && onVisheshaPuja() : p.name === 'Nitya Naivedyam' ? onNaivedyam && onNaivedyam() : p.name === 'Nitya Pratah|Puja' ? onNityaPratah && onNityaPratah() : p.name === 'RudrAbhishekam' ? onRudrabhishekam && onRudrabhishekam() : p.name === 'Sacred Homas' ? onSacredHoma && onSacredHoma() : p.name === 'Pradosha|Puja' ? onPradosha && onPradosha() : p.name === 'Sri Chakra KumkumArchana' ? onSriChakra && onSriChakra() : isShivaratri ? onMahaShivaratri && onMahaShivaratri() : onBookSeva()}>Book Now</button>
            </div>
          );})}
        </div>
      </div>
    </section>
  );
}

/* ---------- Upcoming Festivals ---------- */
const FESTIVALS = [
  {
    image: 'assets/Maha_Shivaratri_upcome_2027.jpeg?v=2',
    date: 'Maha shivaratri',
    gregorian: 'March 6 · 2027',
    name: 'Maha Shivaratri',
    desc: 'The Great Night of Shiva — an all-night vigil of chants, abhishekams, and meditation.',
    tag: 'Festival of supreme',
  },
  {
    image: 'assets/rudra_homam_upcome.jpeg?v=2',
    date: 'Rudra Homam',
    gregorian: 'MaaghaMasa · 2027',
    name: 'Rudra Homam',
    desc: 'The most sacred and powerful Vedic ritual dedicated to Lord Shiva (in his fierce Rudra form)',
    tag: 'Havan',
  },
  {
    image: 'assets/Shiva_parvati_kalyanam_new_upcome.jpeg?v=1',
    date: 'Shiva Parvati kalyanam',
    gregorian: 'March 7 · 2027',
    name: 'Shiva Parvati Kalyanam',
    desc: 'Divine marriage of Lord Shiva and Goddess Parvati - Symbolizing the ultimate Union of Consciousness and Primordial energy',
    tag: 'Festival',
  },
  {
    image: 'assets/kartika_deepam_upcome.jpeg?v=2',
    date: 'Kartika Masa Deeparadhana',
    gregorian: 'Kartika Masa . 2027',
    name: 'Kartika Masa Deeparadhana',
    desc: 'A sacred ritual of lighting oil lamps during the holy Hindu month of Kartika to honor Lord Shiva and Lord Vishnu',
    tag: 'deeparadhana',
  },
  {
    image: 'assets/Sopana_deepa_upcome.jpeg?v=2',
    date: 'Kartika Sopana Deepotsavam',
    gregorian: 'Kartika Masa · 2027',
    name: 'Kartika Sopana Deepotsavam',
    desc: 'A sacred Hindu ritual celebrated during Kartika month, where as countless oil lamps are lit on the steps of temple to symbolize the triumph of spiritual light over darkness',
    tag: 'Kartika Pournami',
  },
];

const PAST_FESTIVALS = [
  {
    image: 'assets/festival-maha-shivaratri.jpeg?v=3',
    date: 'Maha Shivaratri',
    gregorian: 'March 8 · 2024',
    name: 'Maha Shivaratri',
    desc: 'The Great Night of Shiva — an all-night vigil of chants, abhishekams, and meditation.',
    tag: 'Festival of Supreme',
  },
  {
    image: 'assets/festival-rudra-homam.jpeg?v=3',
    date: 'Nakshatra Homam',
    gregorian: 'February · 2025',
    name: 'Nakshatra Homam',
    desc: 'Most sacred Vedic ritual performed on each Nakshatra to neutralize negative planetary influences and balance cosmic energies',
    tag: 'Havan',
  },
  {
    image: 'assets/festival-kumbha-abhishekam.jpeg?v=3',
    date: 'Kumbha Abhishekam',
    gregorian: 'February · 2025',
    name: 'Kumbha Abhishekam',
    desc: 'A ritual rejuvenates a temple by empowering the deities and the Kumbha atop the temple spire with divine energy',
    tag: 'Festival',
  },
  {
    image: 'assets/Kalasha_puja_mega.jpeg?v=3',
    date: 'kalasha puja',
    gregorian: 'February . 2025',
    name: 'Kalasha Puja',
    desc: 'A ritual where a kalash filled with water and topped with coconut and mango leaves is worshipped as a symbol of divine',
    tag: 'Kalasha Puja',
  },
  {
    image: 'assets/rajat_mahotsav_past.jpeg?v=3',
    date: 'Rajata mahotsav',
    gregorian: 'February · 2026',
    name: 'Chinmaya Rajata Mahotsav',
    desc: 'Celebrating on a occasion of completing 25 Years Silver Jubilee of service to the temple',
    tag: 'Chinmaya Amrit mahotsav',
  },
];

function FestivalCarousel({ heading, accentHeading, id, festivals, description, showSponsor }) {
  const scrollerRef = React.useRef(null);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(false);

  const updateEdges = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  React.useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, []);

  const arrowBtn = (disabled) => ({
    width: 52, height: 52, border: '1px solid var(--gold)',
    background: disabled ? 'transparent' : 'rgba(255, 122, 46, 0.08)',
    color: disabled ? 'var(--ivory-faint)' : 'var(--gold)',
    borderColor: disabled ? 'var(--line-soft)' : 'var(--gold)',
    cursor: disabled ? 'default' : 'pointer', display: 'grid', placeItems: 'center',
    fontFamily: 'var(--f-display)', fontSize: 18, transition: 'all .3s ease', flexShrink: 0,
    boxShadow: disabled ? 'none' : '0 0 16px rgba(255, 122, 46, 0.25)',
  });

  return (
    <section id={id} style={{ background: 'var(--bg-0)' }} data-screen-label="04 Festivals">
      <div className="container">
        <div className="flex-header reveal" style={{ marginBottom: 70 }}>
          <div>
            <span className="eyebrow">The Sacred Calendar</span>
            <h2 style={{ marginTop: 24 }}>{heading}<br/><span className="serif-display" style={{ color: 'var(--gold)' }}>{accentHeading}</span></h2>
            <p style={{ color: 'var(--ivory-dim)', fontSize: 19, lineHeight: 1.7, marginTop: 20, maxWidth: 520 }}>
              {description}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button aria-label="Previous festivals" style={arrowBtn(atStart)} onClick={() => !atStart && scrollerRef.current.scrollBy({ left: -338, behavior: 'smooth' })} disabled={atStart}>←</button>
            <button aria-label="More festivals" style={arrowBtn(atEnd)} onClick={() => !atEnd && scrollerRef.current.scrollBy({ left: 338, behavior: 'smooth' })} disabled={atEnd}>→</button>
          </div>
        </div>
        <div ref={scrollerRef} className="festival-scroll" style={{ display: 'flex', gap: 18, overflowX: 'auto', overflowY: 'hidden', scrollSnapType: 'x mandatory', paddingBottom: 8, marginRight: -48, paddingRight: 48, WebkitOverflowScrolling: 'touch' }}>
          {festivals.map((f, i) => (
            <div key={i} className={`reveal delay-${i % 4}`} style={{ flex: '0 0 320px', scrollSnapAlign: 'start', background: 'linear-gradient(180deg, rgba(20,26,44,0.55), rgba(11,17,32,0.3))', border: '1px solid var(--line-soft)', position: 'relative', transition: 'all .4s' }}>
              {f.image ? <img src={f.image} alt={f.name} style={{ aspectRatio: '4/3', width: '100%', objectFit: 'cover', display: 'block' }} /> : i === 0 ? <img src="assets/festival-maha-shivaratri.jpeg" alt={f.name} style={{ aspectRatio: '4/3', width: '100%', objectFit: 'cover', display: 'block' }} /> : i === 1 ? <img src="assets/festival-rudra-homam.jpeg" alt={f.name} style={{ aspectRatio: '4/3', width: '100%', objectFit: 'cover', display: 'block' }} /> : i === 2 ? <img src="assets/festival-kumbha-abhishekam.jpeg" alt={f.name} style={{ aspectRatio: '4/3', width: '100%', objectFit: 'cover', display: 'block' }} /> : <TempleImg keywords={['shiva lingam temple', 'fire ritual yajna homam', 'abhishekam milk ritual', 'oil lamp diya temple', 'nataraja bronze statue'][i] || 'hindu temple ritual'} alt={f.name} sig={i + 10} style={{ aspectRatio: '4/3' }} />}
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 20 }}><div><div style={{ fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase' }}>{f.date}</div><div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ivory-faint)', marginTop: 6, letterSpacing: '0.1em' }}>{f.gregorian}</div></div><div style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: 'var(--ivory-faint)', letterSpacing: '0.2em', textTransform: 'uppercase', border: '1px solid var(--line)', padding: '4px 10px' }}>{f.tag}</div></div>
                <h3 style={{ fontSize: 21, fontFamily: 'var(--f-script)', fontStyle: 'italic', fontWeight: 400, color: 'var(--ivory)', marginBottom: 14, letterSpacing: 'normal' }}>{f.name}</h3>
                <p style={{ fontSize: 14, color: 'var(--ivory-dim)', lineHeight: 1.55, marginBottom: 22 }}>{f.desc}</p>
                {showSponsor && <a style={{ fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.28em', color: 'var(--gold)', textTransform: 'uppercase', cursor: 'pointer', borderBottom: '1px solid var(--gold)', paddingBottom: 4 }}>Sponsor This Festival</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Festivals() {
  return <>
    <FestivalCarousel id="events" heading="Upcoming" accentHeading="Celebrations" festivals={FESTIVALS} description="Mark your calendars for days filled with divine blessings and spiritual joy. Sponsorships open" showSponsor />
    <FestivalCarousel heading="Mega" accentHeading="Celebrations" festivals={PAST_FESTIVALS} description="A look back at the grand celebrations and divine blessings that have shaped our temple's journey" showSponsor={false} />
  </>;
}

/* ---------- Seva Booking Preview ---------- */
const SEVAS = [
  { name: 'Rudrabhishekam', sanskrit: 'रुद्राभिषेकम्', price: 1100, dur: '45 min', desc: 'Sacred bathing of the Lingam with eleven chants' },
  { name: 'Archana', sanskrit: 'अर्चना', price: 251, dur: '15 min', desc: 'Personal name-and-gotra prayer offering' },
  { name: 'Annadanam', sanskrit: 'अन्नदानम्', price: 2500, dur: 'Full day', desc: 'Sponsor a day of meals for devotees' },
  { name: 'Vahana Pooja', sanskrit: 'वाहन पूजा', price: 501, dur: '20 min', desc: 'Blessing for vehicles and travel' },
];

function SevaBooking({ onBookSeva }) {
  return (
    <section style={{ background: 'var(--bg-0)' }} data-screen-label="05 Seva Booking">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 70 }} className="reveal">
          <span className="eyebrow">Sacred Offerings</span>
          <h2 style={{ marginTop: 24 }}>
            Online <span className="serif-display" style={{ color: 'var(--gold)' }}>Seva</span> Booking
          </h2>
          <p style={{ marginTop: 20, color: 'var(--ivory-dim)', maxWidth: 620, marginLeft: 'auto', marginRight: 'auto', fontSize: 19 }}>
            Offer your devotion from anywhere in the world. Choose a seva, name the divine intention,
            and our priests will perform it in your name. Prasadam delivered via post.
          </p>
        </div>

        <div className="grid-auto-4">
          {SEVAS.map((s, i) => (
            <div key={i} className={`card seva-card reveal delay-${i}`} style={{ padding: 32 }}>
              <div style={{ fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 22, color: 'var(--gold)', marginBottom: 10 }}>{s.sanskrit}</div>
              <h3 style={{ fontSize: 19, marginBottom: 12 }}>{s.name}</h3>
              <p style={{ fontSize: 14, color: 'var(--ivory-faint)', lineHeight: 1.5, minHeight: 60, marginBottom: 24 }}>{s.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--line-soft)', paddingTop: 22 }}>
                <div>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, color: 'var(--gold)' }}>₹{s.price}</div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ivory-faint)', letterSpacing: '0.15em', marginTop: 4 }}>{s.dur}</div>
                </div>
                <button
                  className="btn"
                  style={{ padding: '12px 18px', fontSize: 10 }}
                  onClick={onBookSeva}
                >Book</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Donation CTA ---------- */
const CAMPAIGNS = [
  { name: 'Temple Renovation Fund', raised: 18.4, goal: 25, donors: 412 },
  { name: 'Annadanam — Year of Meals', raised: 7.2, goal: 12, donors: 1842 },
  { name: 'Gau Seva — Cow Shelter', raised: 4.6, goal: 6, donors: 287 },
];

function DonationCTA({ onDonate }) {
  return (
    <section style={{
      background: 'linear-gradient(180deg, #07091a, #0d1428, #07091a)',
      borderTop: '1px solid var(--line-soft)',
      borderBottom: '1px solid var(--line-soft)',
    }} data-screen-label="06 Donation">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 80, maxWidth: 720, margin: '0 auto' }}>
          <div className="reveal">
            <span className="eyebrow">Daanam · The Act of Giving</span>
            <h2 style={{ marginTop: 24 }}>
              Every flame is kindled<br/>
              <span className="serif-display" style={{ color: 'var(--gold)' }}>by an open hand.</span>
            </h2>
            <p style={{ marginTop: 28, color: 'var(--ivory-dim)', fontSize: 19, lineHeight: 1.7 }}>
              The temple is sustained entirely by the generosity of devotees. From the oil in the lamps
              to the meals served each day, every offering returns multifold as blessing.
            </p>
            <div style={{ marginTop: 38, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button className="btn solid" onClick={onDonate}>
                Donate Now
                <span className="arrow"></span>
              </button>
              <button className="btn ghost" onClick={onDonate}>
                Monthly Sankalpa
              </button>
            </div>
            <div style={{ marginTop: 36, display: 'flex', gap: 24, alignItems: 'center', color: 'var(--ivory-faint)', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase' }}>Secure via</span>
              <span style={{ fontFamily: 'var(--f-display)', fontSize: 13, letterSpacing: '0.2em', color: 'var(--ivory-dim)' }}>RAZORPAY</span>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.2em' }}>UPI · CARD · NET BANKING · WALLETS</span>
            </div>
            <div style={{ marginTop: 16, fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ivory-faint)', letterSpacing: '0.18em' }}>
              80G EXEMPT · INSTANT RECEIPT · WEBHOOK-VERIFIED
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ---------- Gallery ---------- */
const GALLERY_TILES = [
  { label: 'GOPURAM AT DAWN', span: 'tall' },
  { label: 'ABHISHEKAM RITUAL', span: 'wide' },
  { label: 'GARBHA GRIHA' },
  { label: 'DEEPOTSAVAM LAMPS' },
  { label: 'KARTIKA NIGHT' },
  { label: 'TEMPLE CORRIDOR' },
];

function Gallery({ onManageGallery }) {
  const { media, loaded } = window.useGalleryMedia();
  const hasCustom = loaded && media.length > 0;

  return (
    <section style={{ background: 'var(--bg-0)' }} data-screen-label="07 Gallery">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 60, flexWrap: 'wrap', gap: 20 }} className="reveal">
          <div>
            <span className="eyebrow">Through the Lens</span>
            <h2 style={{ marginTop: 24 }}>
              Glimpses of the <span className="serif-display" style={{ color: 'var(--gold)' }}>Sacred</span>
            </h2>
          </div>
          <button
            onClick={onManageGallery}
            style={{
              fontFamily: 'var(--f-display)', fontSize: 11, letterSpacing: '0.28em', color: 'var(--gold)',
              textTransform: 'uppercase', cursor: 'pointer', background: 'transparent',
              border: '1px solid var(--gold)', padding: '12px 22px',
            }}
          >
            + Add Photos &amp; Videos
          </button>
        </div>

        {hasCustom ? (
          <div className="grid-auto-4" style={{ gridAutoRows: '280px', gap: 16 }}>
            {media.map((item, i) => (
              <window.MediaThumb
                key={item.id}
                item={item}
                className="reveal"
                style={i === 0 ? { gridRow: 'span 2' } : i === 1 ? { gridColumn: 'span 2' } : {}}
              />
            ))}
          </div>
        ) : (
          <div className="grid-auto-4" style={{ gridTemplateRows: 'repeat(2, 280px)', gap: 16 }}>
            <div className="reveal" style={{ gridRow: 'span 2', overflow: 'hidden', position: 'relative' }}>
              <img src="assets/temple-real-photo.jpeg" alt="Temple entrance" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="reveal delay-1" style={{ gridColumn: 'span 2', overflow: 'hidden', position: 'relative' }}>
              <img src="assets/temple-real-photo-garland.jpeg" alt="Temple with garlands" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="reveal delay-2" style={{ overflow: 'hidden', position: 'relative' }}>
              <img src="assets/temple-real-photo-clean.jpeg" alt="Temple sanctum" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="reveal delay-1" style={{ overflow: 'hidden', position: 'relative' }}>
              <img src="assets/temple-real-photo-nandi.jpeg" alt="Nandi at the temple" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="reveal delay-2" style={{ overflow: 'hidden', position: 'relative' }}>
              <img src="assets/jyotirlinga-abhishekam.png" alt="Jyotirlinga abhishekam" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="reveal delay-3" style={{ overflow: 'hidden', position: 'relative' }}>
              <img src="assets/jyotirlinga-shrine-full.png" alt="Jyotirlinga shrine" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer({ onContact }) {
  return (
    <footer data-screen-label="10 Footer">
      <div className="container">
        <div className="grid-footer" style={{ marginBottom: 80 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{
                width: 48, height: 48, border: '1px solid var(--gold)', borderRadius: '50%',
                display: 'grid', placeItems: 'center',
                fontFamily: 'var(--f-sanskrit)',
                color: 'var(--gold)', fontSize: 24,
              }}>ॐ</div>
              <div>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 15, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  SRI SANTHA MALLESWARA TEMPLE
                </div>
                <div style={{ fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 13, color: 'var(--ivory-faint)' }}>
                  Sacred Sanctuary of Cosmic Shiva
                </div>
              </div>
            </div>
            <p style={{ color: 'var(--ivory-faint)', fontSize: 15, lineHeight: 1.6, maxWidth: 360 }}>
              17/B, Sampige Road · Malleshwaram<br/>
              Bengaluru, Karnataka 560003<br/>
              India
            </p>
            <p style={{ marginTop: 20, fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ivory-faint)', letterSpacing: '0.14em' }}>
              +91 80 2334 9090<br/>
              hello@shantamalleshwara.org
            </p>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 22 }}>
              Explore
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['About', '#about'], ['Services', '#services'], ['Donation', '#donation'], ['Sacred Audios', '#audio'], ['Gallery', '#gallery'], ['Contact', '#']].map(([l, href]) => (
                <li key={l}><a href={href} style={{ color: 'var(--ivory-dim)', textDecoration: 'none', fontSize: 15 }}>{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 22 }}>
              Sevas
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Book a Pooja', 'Annadanam', 'Festival Sponsorship', 'Recurring Sankalpa', 'Gau Seva', 'Live Darshan'].map(l => (
                <li key={l}><a style={{ color: 'var(--ivory-dim)', textDecoration: 'none', fontSize: 15 }}>{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 22 }}>
              Stay Connected
            </div>
            <p style={{ color: 'var(--ivory-faint)', fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
              Receive the panchanga, festival reminders, and dharmic reflections.
            </p>
            <form onSubmit={e => { e.preventDefault(); alert('Subscribed — Om Namah Shivaya'); }}>
              <input type="email" placeholder="your@email.com" style={{ marginBottom: 12 }} />
              <button type="submit" className="btn" style={{ width: '100%', padding: '14px 18px', fontSize: 10 }}>
                Subscribe
              </button>
            </form>
            <button onClick={onContact} style={{
              marginTop: 18, background: 'transparent', border: 'none',
              fontFamily: 'var(--f-display)', fontSize: 10, letterSpacing: '0.28em',
              color: 'var(--gold)', textTransform: 'uppercase', cursor: 'pointer',
              borderBottom: '1px solid var(--gold)', paddingBottom: 4,
            }}>
              Write to Us →
            </button>
            <div style={{ marginTop: 22, display: 'flex', gap: 14, alignItems: 'center' }}>
              {/* WhatsApp */}
              <a href="#" title="WhatsApp" style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: '#25D366', transition: 'all .3s ease', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.background = 'rgba(37,211,102,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.967-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" title="Instagram" style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: '#E4405F', transition: 'all .3s ease', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#E4405F'; e.currentTarget.style.background = 'rgba(228,64,95,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* Email */}
              <a href="#" title="Email" style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: '#EA4335', transition: 'all .3s ease', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#EA4335'; e.currentTarget.style.background = 'rgba(234,67,53,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.563c0-.474-.383-.857-.857-.857H.857C.383 3.706 0 4.089 0 4.563v14.874c0 .474.383.857.857.857h22.286c.474 0 .857-.383.857-.857V4.563zM12 14.143L1.714 5.831h20.572L12 14.143zm0 2.286L1.714 8.114v10.743h20.572V8.114L12 16.429z"/></svg>
              </a>
              {/* YouTube */}
              <a href="#" title="YouTube" style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: '#FF0000', transition: 'all .3s ease', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF0000'; e.currentTarget.style.background = 'rgba(255,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom" style={{
          paddingTop: 36,
          borderTop: '1px solid var(--line-soft)',
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ivory-faint)',
          letterSpacing: '0.18em', textTransform: 'uppercase',
        }}>
          <div>© Saka 1947 · Shanta Malleshwara Swami Temple Trust · 80G Registered</div>
          <div style={{ display: 'flex', gap: 30 }}>
            <a>Privacy</a><a>Terms</a><a>Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  useReveal, Divider, TempleImg, Introduction, PoojaTimings, Festivals,
  SevaBooking, DonationCTA, Gallery, Footer
});
