'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { uploadImageToStorage } from '@/lib/uploadImage';
import type {
  SiteConfig,
  EventRow,
  GalleryEdition,
  VideoRow,
  MesasMap,
  FaqRow,
} from '@/lib/types';

interface Props {
  initial: {
    siteConfig: SiteConfig | null;
    activeEvent: EventRow | null;
    gallery: GalleryEdition[];
    videos: VideoRow[];
    mesasMap: MesasMap | null;
    faqs: FaqRow[];
  };
}

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminDashboard({ initial }: Props) {
  const supabase = createClient();
  const router = useRouter();

  // ---- SITE CONFIG ----
  const [cfg, setCfg] = useState({
    hero_intro: initial.siteConfig?.hero_intro ?? '',
    tickets_url: initial.siteConfig?.tickets_url ?? '',
    calendar_url: initial.siteConfig?.calendar_url ?? '',
    spotify_url: initial.siteConfig?.spotify_url ?? '',
    social_instagram: initial.siteConfig?.social_instagram ?? '',
    social_tiktok: initial.siteConfig?.social_tiktok ?? '',
    social_whatsapp: initial.siteConfig?.social_whatsapp ?? '',
  });
  const [cfgMsg, setCfgMsg] = useState('');

  async function saveCfg() {
    setCfgMsg('Guardando...');
    const { error } = await supabase.from('site_config').update(cfg).eq('id', 1);
    setCfgMsg(error ? 'Error al guardar.' : 'Guardado ✓');
    setTimeout(() => setCfgMsg(''), 2500);
  }

  // ---- EVENT ----
  const [event, setEvent] = useState({
    id: initial.activeEvent?.id ?? null,
    name: initial.activeEvent?.name ?? '',
    venue: initial.activeEvent?.venue ?? '',
    date_text: initial.activeEvent?.date_text ?? '',
    event_datetime: toDatetimeLocal(initial.activeEvent?.event_datetime ?? null),
    flyer_url: initial.activeEvent?.flyer_url ?? '',
  });
  const [eventMsg, setEventMsg] = useState('');
  const [flyerUploading, setFlyerUploading] = useState(false);
  const flyerInputRef = useRef<HTMLInputElement>(null);

  async function handleFlyerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFlyerUploading(true);
    try {
      const url = await uploadImageToStorage(file, 'flyers');
      setEvent((s) => ({ ...s, flyer_url: url }));
    } catch {
      setEventMsg('Error al subir el flyer.');
    } finally {
      setFlyerUploading(false);
      if (flyerInputRef.current) flyerInputRef.current.value = '';
    }
  }

  async function saveEvent() {
    setEventMsg('Guardando...');
    const payload = {
      name: event.name,
      venue: event.venue,
      date_text: event.date_text,
      event_datetime: event.event_datetime ? new Date(event.event_datetime).toISOString() : null,
      flyer_url: event.flyer_url,
      is_active: true,
    };
    let error;
    if (event.id) {
      ({ error } = await supabase.from('events').update(payload).eq('id', event.id));
    } else {
      const res = await supabase.from('events').insert(payload).select().single();
      error = res.error;
      if (res.data) setEvent((s) => ({ ...s, id: res.data.id }));
    }
    setEventMsg(error ? 'Error al guardar.' : 'Guardado ✓');
    setTimeout(() => setEventMsg(''), 2500);
  }

  // ---- MESAS ----
  const [mesas, setMesas] = useState({
    mesa_back_price: initial.siteConfig?.mesa_back_price ?? '',
    mesa_vip_price: initial.siteConfig?.mesa_vip_price ?? '',
    mesas_condicion: initial.siteConfig?.mesas_condicion ?? '',
    mesa_back_desc: initial.siteConfig?.mesa_back_desc ?? '',
    mesa_vip_desc: initial.siteConfig?.mesa_vip_desc ?? '',
  });
  const [mapUrl, setMapUrl] = useState(initial.mesasMap?.map_url ?? '');
  const [mesasMsg, setMesasMsg] = useState('');
  const [mapUploading, setMapUploading] = useState(false);
  const mapInputRef = useRef<HTMLInputElement>(null);

  async function handleMapUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMapUploading(true);
    try {
      const url = await uploadImageToStorage(file, 'mesas');
      setMapUrl(url);
    } catch {
      setMesasMsg('Error al subir la imagen.');
    } finally {
      setMapUploading(false);
      if (mapInputRef.current) mapInputRef.current.value = '';
    }
  }

  async function saveMesas() {
    setMesasMsg('Guardando...');
    const [r1, r2] = await Promise.all([
      supabase.from('site_config').update(mesas).eq('id', 1),
      supabase.from('mesas_map').update({ map_url: mapUrl }).eq('id', 1),
    ]);
    setMesasMsg(r1.error || r2.error ? 'Error al guardar.' : 'Guardado ✓');
    setTimeout(() => setMesasMsg(''), 2500);
  }

  // ---- GALLERY ----
  const [gallery, setGallery] = useState(initial.gallery);
  const [galleryMsg, setGalleryMsg] = useState<Record<string, string>>({});

  async function addEdition() {
    const { data, error } = await supabase
      .from('gallery_editions')
      .insert({ title: 'Nueva edición', sort_order: gallery.length })
      .select()
      .single();
    if (!error && data) setGallery((g) => [...g, { ...data, gallery_photos: [] }]);
  }

  async function removeEdition(id: string) {
    await supabase.from('gallery_editions').delete().eq('id', id);
    setGallery((g) => g.filter((e) => e.id !== id));
  }

  function updateEditionField(id: string, field: 'title' | 'external_link', value: string) {
    setGallery((g) => g.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  async function saveEditionMeta(id: string) {
    const edition = gallery.find((e) => e.id === id);
    if (!edition) return;
    setGalleryMsg((m) => ({ ...m, [id]: 'Guardando...' }));
    const { error } = await supabase
      .from('gallery_editions')
      .update({ title: edition.title, external_link: edition.external_link })
      .eq('id', id);
    setGalleryMsg((m) => ({ ...m, [id]: error ? 'Error' : 'Guardado ✓' }));
    setTimeout(() => setGalleryMsg((m) => ({ ...m, [id]: '' })), 2000);
  }

  async function addPhoto(editionId: string, file: File) {
    const edition = gallery.find((e) => e.id === editionId);
    if (!edition) return;
    if (edition.gallery_photos.length >= 6) {
      setGalleryMsg((m) => ({ ...m, [editionId]: 'Máximo 6 fotos por edición.' }));
      return;
    }
    setGalleryMsg((m) => ({ ...m, [editionId]: 'Subiendo foto...' }));
    try {
      const url = await uploadImageToStorage(file, `gallery/${editionId}`);
      const { data, error } = await supabase
        .from('gallery_photos')
        .insert({ edition_id: editionId, url, sort_order: edition.gallery_photos.length })
        .select()
        .single();
      if (error) throw error;
      setGallery((g) =>
        g.map((e) => (e.id === editionId ? { ...e, gallery_photos: [...e.gallery_photos, data] } : e))
      );
      setGalleryMsg((m) => ({ ...m, [editionId]: '' }));
    } catch {
      setGalleryMsg((m) => ({ ...m, [editionId]: 'Error al subir la foto.' }));
    }
  }

  async function removePhoto(editionId: string, photoId: string) {
    await supabase.from('gallery_photos').delete().eq('id', photoId);
    setGallery((g) =>
      g.map((e) =>
        e.id === editionId
          ? { ...e, gallery_photos: e.gallery_photos.filter((p) => p.id !== photoId) }
          : e
      )
    );
  }

  // ---- VIDEOS ----
  const [videos, setVideos] = useState(initial.videos);
  const [videoMsg, setVideoMsg] = useState<Record<string, string>>({});

  async function addVideo() {
    const { data, error } = await supabase
      .from('videos')
      .insert({ label: 'Nuevo video', sort_order: videos.length })
      .select()
      .single();
    if (!error && data) setVideos((v) => [...v, data]);
  }

  async function removeVideo(id: string) {
    await supabase.from('videos').delete().eq('id', id);
    setVideos((v) => v.filter((x) => x.id !== id));
  }

  function updateVideoField(id: string, field: 'label' | 'link', value: string) {
    setVideos((v) => v.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  }

  async function saveVideo(id: string) {
    const video = videos.find((v) => v.id === id);
    if (!video) return;
    setVideoMsg((m) => ({ ...m, [id]: 'Guardando...' }));
    const { error } = await supabase
      .from('videos')
      .update({ label: video.label, link: video.link, thumbnail_url: video.thumbnail_url })
      .eq('id', id);
    setVideoMsg((m) => ({ ...m, [id]: error ? 'Error' : 'Guardado ✓' }));
    setTimeout(() => setVideoMsg((m) => ({ ...m, [id]: '' })), 2000);
  }

  async function handleVideoThumb(id: string, file: File) {
    setVideoMsg((m) => ({ ...m, [id]: 'Subiendo...' }));
    try {
      const url = await uploadImageToStorage(file, 'videos');
      setVideos((v) => v.map((x) => (x.id === id ? { ...x, thumbnail_url: url } : x)));
      setVideoMsg((m) => ({ ...m, [id]: '' }));
    } catch {
      setVideoMsg((m) => ({ ...m, [id]: 'Error al subir.' }));
    }
  }

  // ---- FAQ ----
  const [faqs, setFaqs] = useState(initial.faqs);
  const [faqMsg, setFaqMsg] = useState<Record<string, string>>({});

  async function addFaq() {
    const { data, error } = await supabase
      .from('faqs')
      .insert({ question: 'Nueva pregunta', answer: '', sort_order: faqs.length })
      .select()
      .single();
    if (!error && data) setFaqs((f) => [...f, data]);
  }

  async function removeFaq(id: string) {
    await supabase.from('faqs').delete().eq('id', id);
    setFaqs((f) => f.filter((x) => x.id !== id));
  }

  function updateFaqField(id: string, field: 'question' | 'answer', value: string) {
    setFaqs((f) => f.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  }

  async function saveFaq(id: string) {
    const faq = faqs.find((f) => f.id === id);
    if (!faq) return;
    setFaqMsg((m) => ({ ...m, [id]: 'Guardando...' }));
    const { error } = await supabase
      .from('faqs')
      .update({ question: faq.question, answer: faq.answer })
      .eq('id', id);
    setFaqMsg((m) => ({ ...m, [id]: error ? 'Error' : 'Guardado ✓' }));
    setTimeout(() => setFaqMsg((m) => ({ ...m, [id]: '' })), 2000);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="admin-root">
      <div className="grain" />
      <header>
        <div className="brand">
          <span className="dot" />
          <div>
            <h1>Baila Morena</h1>
            <span>Panel de administración</span>
          </div>
        </div>
        <div className="top-actions" style={{ display: 'flex', gap: 12 }}>
          <a href="/" target="_blank">Ver sitio</a>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main>
        <div className="intro">
          <h2>Editá tu sitio</h2>
          <p>Los cambios se guardan directo en la base de datos — no hace falta copiar ni pegar nada. Tocá <b>Guardar</b> en cada sección.</p>
        </div>

        {/* ENLACES */}
        <div className="panel">
          <span className="eyebrow">Enlaces</span>
          <h3>Entradas, calendario y Spotify</h3>
          <div className="field">
            <label>Link de compra de entradas</label>
            <input value={cfg.tickets_url} onChange={(e) => setCfg({ ...cfg, tickets_url: e.target.value })} placeholder="https://tuentrada.com/..." />
          </div>
          <div className="row2">
            <div className="field">
              <label>Link &quot;Agendar en calendario&quot;</label>
              <input value={cfg.calendar_url} onChange={(e) => setCfg({ ...cfg, calendar_url: e.target.value })} />
            </div>
            <div className="field">
              <label>Link de Spotify</label>
              <input value={cfg.spotify_url} onChange={(e) => setCfg({ ...cfg, spotify_url: e.target.value })} />
            </div>
          </div>

          <span className="eyebrow" style={{ marginTop: 10 }}>Redes sociales</span>
          <div className="row3">
            <div className="field">
              <label>Instagram</label>
              <input value={cfg.social_instagram} onChange={(e) => setCfg({ ...cfg, social_instagram: e.target.value })} />
            </div>
            <div className="field">
              <label>TikTok</label>
              <input value={cfg.social_tiktok} onChange={(e) => setCfg({ ...cfg, social_tiktok: e.target.value })} />
            </div>
            <div className="field">
              <label>WhatsApp</label>
              <input value={cfg.social_whatsapp} onChange={(e) => setCfg({ ...cfg, social_whatsapp: e.target.value })} />
            </div>
          </div>

          <span className="eyebrow" style={{ marginTop: 10 }}>Bajada del hero</span>
          <div className="field" style={{ marginBottom: 0 }}>
            <textarea value={cfg.hero_intro} onChange={(e) => setCfg({ ...cfg, hero_intro: e.target.value })} />
          </div>

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-solid btn-sm" onClick={saveCfg}>Guardar</button>
            <span className="upload-status">{cfgMsg}</span>
          </div>
        </div>

        {/* EVENTO */}
        <div className="panel">
          <span className="eyebrow">Próxima fecha</span>
          <h3>Datos del evento</h3>
          <div className="row2">
            <div className="field">
              <label>Nombre del evento</label>
              <input value={event.name} onChange={(e) => setEvent({ ...event, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Lugar</label>
              <input value={event.venue} onChange={(e) => setEvent({ ...event, venue: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label>Fecha (texto visible)</label>
            <input value={event.date_text} onChange={(e) => setEvent({ ...event, date_text: e.target.value })} placeholder="Sábado 15 de agosto, 2026" />
          </div>
          <div className="field">
            <label>Fecha y hora exacta (para el contador)</label>
            <input type="datetime-local" value={event.event_datetime} onChange={(e) => setEvent({ ...event, event_datetime: e.target.value })} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Imagen del flyer</label>
            <div className="upload-field">
              <input ref={flyerInputRef} type="file" accept="image/*" onChange={handleFlyerUpload} />
              <div className="upload-preview">
                {flyerUploading && <span className="upload-status">Subiendo...</span>}
                {!flyerUploading && event.flyer_url && (
                  <>
                    <img src={event.flyer_url} alt="flyer" />
                    <span className="upload-status">Cargado ✓</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-solid btn-sm" onClick={saveEvent}>Guardar</button>
            <span className="upload-status">{eventMsg}</span>
          </div>
        </div>

        {/* MESAS */}
        <div className="panel">
          <span className="eyebrow">Mesas VIP</span>
          <h3>Precios y mapa</h3>
          <div className="row2">
            <div className="field">
              <label>Precio Mesa BACK</label>
              <input value={mesas.mesa_back_price} onChange={(e) => setMesas({ ...mesas, mesa_back_price: e.target.value })} />
            </div>
            <div className="field">
              <label>Precio Mesa VIP</label>
              <input value={mesas.mesa_vip_price} onChange={(e) => setMesas({ ...mesas, mesa_vip_price: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label>Condición de consumo</label>
            <input value={mesas.mesas_condicion} onChange={(e) => setMesas({ ...mesas, mesas_condicion: e.target.value })} />
          </div>
          <div className="row2">
            <div className="field">
              <label>Descripción Mesa BACK (una línea = un punto en el sitio)</label>
              <textarea
                value={mesas.mesa_back_desc}
                onChange={(e) => setMesas({ ...mesas, mesa_back_desc: e.target.value })}
                placeholder={'Mesas 3 a 9\nUbicación lateral, sobre la pista\nIdeal para grupos'}
                rows={3}
              />
            </div>
            <div className="field">
              <label>Descripción Mesa VIP (una línea = un punto en el sitio)</label>
              <textarea
                value={mesas.mesa_vip_desc}
                onChange={(e) => setMesas({ ...mesas, mesa_vip_desc: e.target.value })}
                placeholder={'Mesas 1 y 2\nUbicación junto al DJ\nLa mejor vista de la noche'}
                rows={3}
              />
            </div>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Imagen del mapa de mesas</label>
            <div className="upload-field">
              <input ref={mapInputRef} type="file" accept="image/*" onChange={handleMapUpload} />
              <div className="upload-preview">
                {mapUploading && <span className="upload-status">Subiendo...</span>}
                {!mapUploading && mapUrl && (
                  <>
                    <img src={mapUrl} alt="mapa" />
                    <span className="upload-status">Cargado ✓</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-solid btn-sm" onClick={saveMesas}>Guardar</button>
            <span className="upload-status">{mesasMsg}</span>
          </div>
        </div>

        {/* GALERIA */}
        <div className="panel">
          <span className="eyebrow">Galería</span>
          <h3>Ediciones</h3>
          <div className="hint">Hasta 6 fotos por edición. Los cambios de fotos se guardan al instante; título y link necesitan &quot;Guardar&quot;.</div>
          {gallery.map((edition) => (
            <div className="list-item" key={edition.id}>
              <div className="remove" onClick={() => removeEdition(edition.id)}>×</div>
              <div className="field" style={{ marginBottom: 12 }}>
                <label>Nombre de la edición</label>
                <input
                  value={edition.title}
                  onChange={(e) => updateEditionField(edition.id, 'title', e.target.value)}
                />
              </div>
              <div className="field" style={{ marginBottom: 12 }}>
                <label>Fotos ({edition.gallery_photos.length}/6)</label>
                <div className="upload-field">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={edition.gallery_photos.length >= 6}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) addPhoto(edition.id, file);
                      e.target.value = '';
                    }}
                  />
                  <div className="photo-grid">
                    {edition.gallery_photos.map((p) => (
                      <div className="photo-thumb" key={p.id}>
                        <img src={p.url} alt="" />
                        <div className="photo-thumb-remove" onClick={() => removePhoto(edition.id, p.id)}>×</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Link a la galería completa (opcional)</label>
                <input
                  value={edition.external_link}
                  onChange={(e) => updateEditionField(edition.id, 'external_link', e.target.value)}
                />
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => saveEditionMeta(edition.id)}>Guardar</button>
                <span className="upload-status">{galleryMsg[edition.id]}</span>
              </div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={addEdition}>+ Agregar edición</button>
        </div>

        {/* VIDEOS */}
        <div className="panel">
          <span className="eyebrow">Videos</span>
          <h3>Aftermovies y Reels</h3>
          <div className="hint">La miniatura se sube directo; el link del video (YouTube, Instagram) hay que pegarlo, siempre.</div>
          {videos.map((v) => (
            <div className="list-item" key={v.id}>
              <div className="remove" onClick={() => removeVideo(v.id)}>×</div>
              <div className="field" style={{ marginBottom: 12 }}>
                <label>Etiqueta</label>
                <input value={v.label} onChange={(e) => updateVideoField(v.id, 'label', e.target.value)} />
              </div>
              <div className="field" style={{ marginBottom: 12 }}>
                <label>Miniatura</label>
                <div className="upload-field">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleVideoThumb(v.id, file);
                      e.target.value = '';
                    }}
                  />
                  <div className="upload-preview">
                    {v.thumbnail_url && <img src={v.thumbnail_url} alt="" />}
                  </div>
                </div>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Link del video</label>
                <input value={v.link} onChange={(e) => updateVideoField(v.id, 'link', e.target.value)} />
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => saveVideo(v.id)}>Guardar</button>
                <span className="upload-status">{videoMsg[v.id]}</span>
              </div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={addVideo}>+ Agregar video</button>
        </div>

        {/* FAQ */}
        <div className="panel">
          <span className="eyebrow">Preguntas frecuentes</span>
          <h3>FAQ</h3>
          {faqs.map((f) => (
            <div className="list-item" key={f.id}>
              <div className="remove" onClick={() => removeFaq(f.id)}>×</div>
              <div className="field" style={{ marginBottom: 12 }}>
                <label>Pregunta</label>
                <input value={f.question} onChange={(e) => updateFaqField(f.id, 'question', e.target.value)} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Respuesta</label>
                <textarea value={f.answer} onChange={(e) => updateFaqField(f.id, 'answer', e.target.value)} />
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => saveFaq(f.id)}>Guardar</button>
                <span className="upload-status">{faqMsg[f.id]}</span>
              </div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={addFaq}>+ Agregar pregunta</button>
        </div>
      </main>
    </div>
  );
}
