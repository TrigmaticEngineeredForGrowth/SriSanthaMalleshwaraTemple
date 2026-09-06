/* global React */
/* Self-service Audio & Document Library — same IndexedDB pattern as the
   gallery manager, for audio files (mp3/wav) and documents (PDF). */

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

function AudioLibrary() {
  const { files, addFiles, removeFile } = useAudioLibrary();
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef(null);

  const handleFiles = (fl) => { const arr = Array.from(fl); if (arr.length) addFiles(arr); };

  return (
    <section style={{ background: 'var(--bg-0)' }} data-screen-label="Audio Library">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 60 }} className="reveal">
          <span className="eyebrow">Sacred Recordings</span>
          <h2 style={{ marginTop: 24 }}>
            Audios &amp; <span className="serif-display" style={{ color: 'var(--gold)' }}>Sacred Texts</span>
          </h2>
          <p style={{ marginTop: 20, color: 'var(--ivory-dim)', maxWidth: 620, marginLeft: 'auto', marginRight: 'auto', fontSize: 19 }}>
            Chants, pravachanams, and downloadable sacred texts — for listening or reading anywhere.
          </p>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current && inputRef.current.click()}
          style={{
            border: `2px dashed ${dragOver ? 'var(--gold)' : 'var(--line)'}`,
            background: dragOver ? 'rgba(255,122,46,0.06)' : 'transparent',
            padding: '48px 24px', textAlign: 'center', cursor: 'pointer',
            transition: 'all .25s ease', marginBottom: 40,
          }}
        >
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 13, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 10 }}>
            Drop Audio or PDF Files Here
          </div>
          <div style={{ color: 'var(--ivory-faint)', fontSize: 14, fontStyle: 'italic' }}>
            or click to browse · MP3, WAV, PDF supported
          </div>
          <input ref={inputRef} type="file" accept="audio/*,application/pdf" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
        </div>

        {files.length === 0 ? (
          <div style={{
            padding: 60, textAlign: 'center', border: '1px dashed var(--line-soft)',
            color: 'var(--ivory-faint)', fontFamily: 'var(--f-script)', fontStyle: 'italic', fontSize: 20,
          }}>
            No audios or documents added yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {files.map(f => {
              const url = URL.createObjectURL(f.blob);
              return (
                <div key={f.id} className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{
                    fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--gold)',
                    border: '1px solid var(--line)', padding: '4px 10px', flexShrink: 0,
                  }}>{f.type === 'audio' ? 'AUDIO' : 'PDF'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, color: 'var(--ivory)', marginBottom: f.type === 'audio' ? 10 : 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                    {f.type === 'audio' ? (
                      <audio src={url} controls style={{ width: '100%', height: 36 }} />
                    ) : (
                      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', fontSize: 13, fontFamily: 'var(--f-mono)', letterSpacing: '0.05em' }}>Open PDF →</a>
                    )}
                  </div>
                  <button onClick={() => removeFile(f.id)} style={{
                    width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.06)',
                    color: '#fff', cursor: 'pointer', fontSize: 16, flexShrink: 0,
                  }}>×</button>
                </div>
              );
            })}
          </div>
        )}

        <div style={{
          marginTop: 28, padding: 16, border: '1px solid var(--line-soft)',
          fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ivory-faint)',
          letterSpacing: '0.06em', lineHeight: 1.7,
        }}>
          NOTE — files added here are stored in this browser only (not visible to other visitors yet). To make
          any file permanent for all visitors, attach it in chat and it will be shipped as a real site asset.
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { useAudioLibrary, AudioLibrary });
