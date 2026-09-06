/* global React, ReactDOM */
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lingamStyle": "cosmic",
  "accent": "#FF7A2E",
  "headerStyle": "elegant",
  "showOrbits": true,
  "particleDensity": "balanced"
} /*EDITMODE-END*/;

function App() {
  const tweaks = window.useTweaks(TWEAK_DEFAULTS);
  const t = tweaks.values;

  const [sevaOpen, setSevaOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [visheshaOpen, setVisheshaOpen] = useState(false);
  const [naivedyamOpen, setNaivedyamOpen] = useState(false);
  const [nityaPratahOpen, setNityaPratahOpen] = useState(false);
  const [rudrabhishekamOpen, setRudrabhishekamOpen] = useState(false);
  const [sacredHomasOpen, setSacredHomasOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && /[?&]log=1/.test(window.location.search)) {
      setLogOpen(true);
    }
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
        e.preventDefault();
        setLogOpen(v => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  window.useReveal();

  useEffect(() => {
    document.documentElement.style.setProperty('--gold', t.accent || '#FF7A2E');
    const a = t.accent || '#FF7A2E';
    document.documentElement.style.setProperty('--gold-glow', a + '59');
  }, [t.accent]);

  return (
    <>
      <window.Nav
        active="home"
        onBookSeva={() => setSevaOpen(true)}
        onDonate={() => setDonateOpen(true)}
        onContact={() => setContactOpen(true)} />

      <Hero
        onBookSeva={() => setSevaOpen(true)}
        onDonate={() => setDonateOpen(true)}
        lingamStyle={t.lingamStyle} />

      <div id="about">
        <window.OmDivider />
        <Introduction />
      </div>

      <div id="services">
        <window.OmDivider />
        <PoojaTimings onBookSeva={() => setSevaOpen(true)} onVisheshaPuja={() => setVisheshaOpen(true)} onNaivedyam={() => setNaivedyamOpen(true)} onNityaPratah={() => setNityaPratahOpen(true)} onRudrabhishekam={() => setRudrabhishekamOpen(true)} onSacredHomas={() => setSacredHomasOpen(true)} />
      </div>

      <div id="events">
        <window.OmDivider />
        <Festivals items={window.MEGA_FESTIVALS} heading="Mega" hideSponsor dateSize={10} />
        <Festivals bg="#07091a" />
      </div>

      <div id="donation">
        <window.OmDivider />
        <SevaBooking onBookSeva={() => setSevaOpen(true)} />
        <DonationCTA onDonate={() => setDonateOpen(true)} />
      </div>

      <div id="gallery">
        <window.OmDivider />
        <Gallery onManageGallery={() => setGalleryOpen(true)} />
        <QuoteBand />
        <Testimonials />
      </div>

      <div id="audio">
        <window.OmDivider />
        <window.AudioLibrary />
      </div>

      <Footer onContact={() => setContactOpen(true)} />

      <button className="sticky-orb" onClick={() => setDonateOpen(true)}>DONATE</button>

      <SevaModal open={sevaOpen} onClose={() => setSevaOpen(false)} />
      <DonationModal open={donateOpen} onClose={() => setDonateOpen(false)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <VisheshaPujaModal open={visheshaOpen} onClose={() => setVisheshaOpen(false)} />
      <NaivedyamModal open={naivedyamOpen} onClose={() => setNaivedyamOpen(false)} />
      <NityaPratahModal open={nityaPratahOpen} onClose={() => setNityaPratahOpen(false)} />
      <RudrabhishekamModal open={rudrabhishekamOpen} onClose={() => setRudrabhishekamOpen(false)} />
      <SacredHomasModal open={sacredHomasOpen} onClose={() => setSacredHomasOpen(false)} />
      <window.GalleryManager open={galleryOpen} onClose={() => setGalleryOpen(false)} />
      <window.ContactLogViewer open={logOpen} onClose={() => setLogOpen(false)} />

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Visual Direction" style={{ fontSize: "26px" }}>
          <window.TweakSelect
            label="Shiva Lingam Style"
            value={t.lingamStyle}
            options={[
            { value: 'cosmic', label: 'Cosmic Glowing' },
            { value: 'stone', label: 'Black Stone (Realistic)' },
            { value: 'golden', label: 'Golden Divine' },
            { value: 'minimal', label: 'Minimal Modern' }]
            }
            onChange={(v) => tweaks.setTweak('lingamStyle', v)} />

          <window.TweakColor
            label="Accent Color"
            value={t.accent}
            options={['#FF7A2E', '#E89154', '#FFA85C', '#C95B14', '#FF9050']}
            onChange={(v) => tweaks.setTweak('accent', v)} />

        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
