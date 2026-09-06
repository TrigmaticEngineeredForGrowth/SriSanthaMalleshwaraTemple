/* global React */
/* Self-service Gallery Manager — stores media in IndexedDB so devotees'
   browser keeps uploads across reloads without a backend. Note: uploads
   live in THIS browser only; to make them visible to every site visitor,
   the images need to be attached in chat so they ship as real project files. */

const DB_NAME = 'templeGalleryDB';
const STORE_NAME = 'media';

function openGalleryDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbGetAll() {
  const db = await openGalleryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result.sort((a, b) => a.order - b.order));
    req.onerror = () => reject(req.error);
  });
}

async function dbPut(item) {
  const db = await openGalleryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function dbDelete(id) {
  const db = await openGalleryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function useGalleryMedia() {
  const [media, setMedia] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);

  const refresh = React.useCallback(async () => {
    const items = await dbGetAll();
    setMedia(items);
    setLoaded(true);
  }, []);

  React.useEffect(() => { refresh(); }, [refresh]);

  const addFiles = React.useCallback(async (files) => {
    const existing = await dbGetAll();
    let order = existing.length ? Math.max(...existing.map(m => m.order)) + 1 : 0;
    for (const file of files) {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      if (!isVideo && !isImage) continue;
      const blob = file;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await dbPut({ id, type: isVideo ? 'video' : 'image', blob, name: file.name, order: order++ });
    }
    await refresh();
  }, [refresh]);

  const removeMedia = React.useCallback(async (id) => {
    await dbDelete(id);
    await refresh();
  }, [refresh]);

  return { media, loaded, addFiles, removeMedia, refresh };
}

function MediaThumb({ item, style, className }) {
  const url = React.useMemo(() => URL.createObjectURL(item.blob), [item.blob]);
  React.useEffect(() => () => URL.revokeObjectURL(url), [url]);
  const common = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', border: '1px solid var(--line-soft)', ...style }}>
      {item.type === 'video' ? (
        <video src={url} style={common} muted loop autoPlay playsInline />
      ) : (
        <img src={url} alt={item.name} style={common} />
      )}
    </div>
  );
}

/* ---------- Upload / Manage Panel ---------- */
function GalleryManager({ open, onClose }) {
  const { media, addFiles, removeMedia } = useGalleryMedia();
  const [dragOver, setDragOver] = React.useState(false);
  const fileInputRef = React.useRef(null);

  if (!open) return null;

  const handleFiles = (fileList) => {
    const files = Array.from(fileList);
    if (files.length) addFiles(files);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 900, padding: 44 }}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span className="eyebrow">Temple Gallery</span>
          <h2 style={{ marginTop: 16, fontSize: 30 }}>Add Photos &amp; Videos</h2>
          <p style={{ marginTop: 10, color: 'var(--ivory-faint)', fontSize: 13, fontFamily: 'var(--f-mono)', letterSpacing: '0.05em' }}>
            {media.length} item{media.length === 1 ? '' : 's'} in your gallery · stored in this browser
          </p>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{
            border: `2px dashed ${dragOver ? 'var(--gold)' : 'var(--line)'}`,
            background: dragOver ? 'rgba(255,122,46,0.06)' : 'transparent',
            borderRadius: 4, padding: '48px 24px', textAlign: 'center',
            cursor: 'pointer', transition: 'all .25s ease', marginBottom: 32,
          }}
        >
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 13, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 10 }}>
            Drop Photos or Videos Here
          </div>
          <div style={{ color: 'var(--ivory-faint)', fontSize: 14, fontStyle: 'italic' }}>
            or click to browse your device · JPG, PNG, MP4, MOV supported
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            style={{ display: 'none' }}
            onChange={e => handleFiles(e.target.files)}
          />
        </div>

        {media.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12, maxHeight: 360, overflowY: 'auto',
          }}>
            {media.map(item => (
              <div key={item.id} style={{ position: 'relative' }}>
                <MediaThumb item={item} style={{ aspectRatio: '1/1', borderRadius: 2 }} />
                <button
                  onClick={() => removeMedia(item.id)}
                  title="Remove"
                  style={{
                    position: 'absolute', top: 6, right: 6, width: 26, height: 26,
                    borderRadius: '50%', border: 'none', background: 'rgba(5,5,5,0.75)',
                    color: '#fff', cursor: 'pointer', fontSize: 15, lineHeight: 1,
                    display: 'grid', placeItems: 'center',
                  }}
                >×</button>
                {item.type === 'video' && (
                  <div style={{
                    position: 'absolute', bottom: 6, left: 6,
                    fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em',
                    background: 'rgba(5,5,5,0.75)', color: 'var(--gold)', padding: '2px 6px',
                  }}>VIDEO</div>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{
          marginTop: 28, padding: 16, border: '1px solid var(--line-soft)',
          fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ivory-faint)',
          letterSpacing: '0.06em', lineHeight: 1.7,
        }}>
          NOTE — media you add here is stored in this browser's local storage (IndexedDB) and will show
          on your Gallery section immediately. It is NOT yet uploaded anywhere visitors on other devices
          can see it — for that, export or re-attach the files here in chat so they can be shipped as
          permanent site assets.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { useGalleryMedia, MediaThumb, GalleryManager });
