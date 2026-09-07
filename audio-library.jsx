/* global React */
/* Compact Audio & Document Library — custom player for a tight, elegant layout. */

const ADB_NAME = 'templeAudioDB';
const ADB_STORE = 'files';

function openAudioDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(ADB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(ADB_STORE)) db.createObjectStore(ADB_STORE, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function adbGetAll() {
  const db = await openAudioDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ADB_STORE, 'readonly');
    const req = tx.objectStore(ADB_STORE).getAll();
    req.onsuccess = () => resolve(req.result.sort((a, b) => a.order - b.order));
    req.onerror = () => reject(req.error);
  });
}
async function adbPut(item) {
  const db = await openAudioDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ADB_STORE, 'readwrite');
    tx.objectStore(ADB_STORE).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function adbDelete(id) {
  const db = await openAudioDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ADB_STORE, 'readwrite');
    tx.objectStore(ADB_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function useAudioLibrary() {
  const [files, setFiles] = React.useState([]);
  const refresh = React.useCallback(async () => setFiles(await adbGetAll()), []);
  React.useEffect(() => { refresh(); }, [refresh]);

  const addFiles = React.useCallback(async (fileList) => {
    const existing = await adbGetAll();
    let order = existing.length ? Math.max(...existing.map(f => f.order)) + 1 : 0;
    for (const file of fileList) {
      const isAudio = file.type.startsWith('audio/');
      const isPdf = file.type === 'application/pdf';
      if (!isAudio && !isPdf) continue;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await adbPut({ id, type: isAudio ? 'audio' : 'pdf', blob: file, name: file.name, order: order++ });
    }
    await refresh();
  }, [refresh]);

  const removeFile = React.useCallback(async (id) => { await adbDelete(id); await refresh(); }, [refresh]);

  return { files, addFiles, removeFile };
}

/* ── Compact custom audio player ── */
function AudioPlayer({ src, name, onDelete }) {
  const audioRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [current, setCurrent] = React.useState(0);

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); } else { a.play().catch(() => {}); }
  };

  const seek = (e) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    a.currentTime = pct * a.duration;
  };

  return (
    <div className="audio-row" style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 18px', background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--line-soft)', borderRadius: 10,
      transition: 'border-color .25s, background .25s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'rgba(255,122,46,0.04)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-soft)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
    >
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrent(0); }}
        onTimeUpdate={e => {
          const a = e.currentTarget;
          setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
          setCurrent(a.currentTime);
        }}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
      />
      <button onClick={toggle} style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        border: '1px solid var(--gold)', background: playing ? 'var(--gold)' : 'rgba(255,122,46,0.08)',
        color: playing ? '#1a1208' : 'var(--gold)', cursor: 'pointer',
        display: 'grid', placeItems: 'center', fontSize: 14,
        transition: 'all .25s ease',
      }}>
        {playing ? '❚❚' : '▶'}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, color: 'var(--ivory)', marginBottom: 6,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            onClick={seek}
            style={{
              flex: 1, height: 4, borderRadius: 2, cursor: 'pointer',
              background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', inset: 0, width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--gold), #E8C44A)',
              borderRadius: 2, transition: 'width .15s linear',
            }} />
          </div>
          <span style={{
            fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ivory-faint)',
            flexShrink: 0, letterSpacing: '0.05em', minWidth: 64, textAlign: 'right',
          }}>{fmt(current)} / {fmt(duration)}</span>
        </div>
      </div>
      {onDelete && (
        <button onClick={onDelete} style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          border: 'none', background: 'rgba(255,255,255,0.06)',
          color: 'var(--ivory-faint)', cursor: 'pointer', fontSize: 15,
          transition: 'all .2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,80,80,0.15)'; e.currentTarget.style.color = '#ff8080'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--ivory-faint)'; }}
        >×</button>
      )}
    </div>
  );
}

/* ── PDF row ── */
function PdfRow({ src, name, onDelete }) {
  return (
    <div className="audio-row" style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 18px', background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--line-soft)', borderRadius: 10,
      transition: 'border-color .25s, background .25s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'rgba(255,122,46,0.04)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-soft)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        border: '1px solid var(--line)', display: 'grid', placeItems: 'center',
        fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--gold)',
      }}>PDF</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, color: 'var(--ivory)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{name}</div>
      </div>
      <a href={src} target="_blank" rel="noopener noreferrer" style={{
        color: 'var(--gold)', fontSize: 12, fontFamily: 'var(--f-mono)',
        letterSpacing: '0.05em', textDecoration: 'none', flexShrink: 0,
      }}>Open →</a>
      {onDelete && (
        <button onClick={onDelete} style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          border: 'none', background: 'rgba(255,255,255,0.06)',
          color: 'var(--ivory-faint)', cursor: 'pointer', fontSize: 15,
        }}>×</button>
      )}
    </div>
  );
}

/* ── Permanent (shipped) audio tracks ── */
const PERMANENT_TRACKS = [
  { name: 'Om Namaste Astu Bhagwan — Sacred Chant', src: 'audio/om_namaste_astu_bagwan.mp3' },
];

function AudioLibrary() {
  const { files, addFiles, removeFile } = useAudioLibrary();
  const [dragOver, setDragOver] = React.useState(false);
  const [showUpload, setShowUpload] = React.useState(false);
  const inputRef = React.useRef(null);

  const handleFiles = (fl) => { const arr = Array.from(fl); if (arr.length) addFiles(arr); };

  return (
    <section style={{ background: 'var(--bg-0)' }} data-screen-label="Audio Library">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 36 }} className="reveal">
          <span className="eyebrow">Sacred Recordings</span>
          <h2 style={{ marginTop: 18, fontSize: 32 }}>
            Audios &amp; <span className="serif-display" style={{ color: 'var(--gold)' }}>Sacred Texts</span>
          </h2>
          <p style={{ marginTop: 14, color: 'var(--ivory-dim)', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', fontSize: 17 }}>
            Chants, pravachanams, and sacred texts — listen or read, anywhere.
          </p>
        </div>

        {/* Permanent tracks + uploaded files in a compact two-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 12, marginBottom: 16,
        }}>
          {PERMANENT_TRACKS.map((t, i) => (
            <AudioPlayer key={`perm-${i}`} src={t.src} name={t.name} />
          ))}
          {files.map(f => {
            const url = URL.createObjectURL(f.blob);
            return f.type === 'audio' ? (
              <AudioPlayer key={f.id} src={url} name={f.name} onDelete={() => removeFile(f.id)} />
            ) : (
              <PdfRow key={f.id} src={url} name={f.name} onDelete={() => removeFile(f.id)} />
            );
          })}
        </div>

        {files.length === 0 && PERMANENT_TRACKS.length === 0 && (
          <div style={{
            padding: 32, textAlign: 'center', border: '1px dashed var(--line-soft)',
            color: 'var(--ivory-faint)', fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 17,
          }}>
            No audios or documents added yet.
          </div>
        )}

        {/* Collapsible upload area — compact toggle */}
        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => setShowUpload(s => !s)}
            style={{
              display: 'block', margin: '0 auto', padding: '10px 28px',
              border: '1px solid var(--line)', borderRadius: 24, background: 'transparent',
              color: 'var(--ivory-dim)', cursor: 'pointer', fontSize: 12,
              fontFamily: 'var(--f-mono)', letterSpacing: '0.12em', textTransform: 'uppercase',
              transition: 'all .25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--ivory-dim)'; }}
          >
            {showUpload ? '−  Close Upload' : '+  Add Your Own'}
          </button>

          {showUpload && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => inputRef.current && inputRef.current.click()}
              style={{
                border: `2px dashed ${dragOver ? 'var(--gold)' : 'var(--line)'}`,
                background: dragOver ? 'rgba(255,122,46,0.06)' : 'transparent',
                padding: '28px 24px', textAlign: 'center', cursor: 'pointer',
                transition: 'all .25s ease', marginTop: 14, borderRadius: 10,
              }}
            >
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 12, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>
                Drop Audio or PDF Files Here
              </div>
              <div style={{ color: 'var(--ivory-faint)', fontSize: 13, fontStyle: 'italic' }}>
                or click to browse · MP3, WAV, PDF supported
              </div>
              <input ref={inputRef} type="file" accept="audio/*,application/pdf" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
            </div>
          )}
        </div>

        <div style={{
          marginTop: 14, padding: '10px 16px', border: '1px solid var(--line-soft)',
          fontFamily: 'var(--f-mono)', fontSize: 9, color: 'var(--ivory-faint)',
          letterSpacing: '0.06em', lineHeight: 1.6, borderRadius: 6,
        }}>
          Files you add are stored in this browser only. To make them permanent for all visitors, attach them in chat.
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { useAudioLibrary, AudioLibrary });
