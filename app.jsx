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
  const [sacredHomaOpen, setSacredHomaOpen] = useState(false);
  const [pradoshaOpen, setPradoshaOpen] = useState(false);
  const [sriChakraOpen, setSriChakraOpen] = useState(false);

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

  // Audio autoplay paused — re-enable when going live.
  // useEffect(() => {
  //   const audio = new Audio('audio/om_namaste_astu_bagwan.mp3');
  //   audio.volume = 0.6;
  //   let played = false;
  //   const tryPlay = () => {
  //     if (played) return;
  //     audio.play().then(() => { played = true; cleanup(); }).catch(() => {});
  //   };
  //   const cleanup = () => {
  //     document.removeEventListener('click', tryPlay);
  //     document.removeEventListener('scroll', tryPlay);
  //     document.removeEventListener('keydown', tryPlay);
  //     document.removeEventListener('touchstart', tryPlay);
  //   };
  //   audio.play().then(() => { played = true; cleanup(); }).catch(() => {
  //     document.addEventListener('click', tryPlay, { once: false });
  //     document.addEventListener('scroll', tryPlay, { once: false });
  //     document.addEventListener('keydown', tryPlay, { once: false });
  //     document.addEventListener('touchstart', tryPlay, { once: false });
  //   });
  //   return cleanup;
  // }, []);

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
        <PoojaTimings onBookSeva={() => setSevaOpen(true)} onVisheshaPuja={() => setVisheshaOpen(true)} onNaivedyam={() => setNaivedyamOpen(true)} onNityaPratah={() => setNityaPratahOpen(true)} onRudrabhishekam={() => setRudrabhishekamOpen(true)} onSacredHoma={() => setSacredHomaOpen(true)} onPradosha={() => setPradoshaOpen(true)} onSriChakra={() => setSriChakraOpen(true)} />
        <window.OmDivider />
        <Festivals />
      </div>

      <div id="gallery">
        <window.OmDivider />
        <Gallery onManageGallery={() => setGalleryOpen(true)} />
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
      <SacredHomaModal open={sacredHomaOpen} onClose={() => setSacredHomaOpen(false)} />
      <RudrabhishekamModal open={pradoshaOpen} onClose={() => setPradoshaOpen(false)} pujaName="Pradosha Puja" amount={516} pujaType="pradosha" description="Twilight worship to Lord Shiva, performed during the auspicious Pradosha window." />
      <RudrabhishekamModal open={sriChakraOpen} onClose={() => setSriChakraOpen(false)} pujaName="Sri Chakra Kumkumarchana" pujaType="sri_chakra_kumkumarchana" description="Sacred Kumkuma puja to the Sri Chakra." options={[{ label: '1 Day Puja', amount: 516 }, { label: '1 Month Puja', amount: 15116 }]} />
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
