'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  SiteConfig,
  EventRow,
  GalleryEdition,
  VideoRow,
  MesasMap,
  FaqRow,
} from '@/lib/types';

interface Props {
  siteConfig: SiteConfig | null;
  activeEvent: EventRow | null;
  gallery: GalleryEdition[];
  videos: VideoRow[];
  mesasMap: MesasMap | null;
  faqs: FaqRow[];
}

const EXPERIENCES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M9 18V5l11-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="17" cy="16" r="3" />
      </svg>
    ),
    t: 'Reggaetón Old School',
    d: 'Los clásicos de los 2000 que marcaron una generación.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 8l2-3h12l2 3" />
        <rect x="3" y="8" width="18" height="12" rx="2" />
        <circle cx="12" cy="14" r="3.5" />
      </svg>
    ),
    t: 'Fotografía Profesional',
    d: 'Un equipo capturando cada momento de la noche.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
    t: 'Golosinas',
    d: 'Dulces retro para revivir la nostalgia de los 2000.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M9 18V6l8 3-8 3" />
        <path d="M4 21h16" />
      </svg>
    ),
    t: 'Shows',
    d: 'Performances en vivo entre set y set.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 10l1.5-5h11L19 10" />
        <path d="M4 10h16v3a8 8 0 0 1-16 0v-3z" />
        <path d="M12 17v4M8 21h8" />
      </svg>
    ),
    t: 'Mesas VIP',
    d: 'Zonas exclusivas con servicio de botella.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="4" y="3" width="16" height="10" rx="1" />
        <path d="M8 21l2-5h4l2 5M9 13v3M15 13v3" />
      </svg>
    ),
    t: 'Ambiente +21',
    d: 'Una experiencia pensada exclusivamente para adultos.',
  },
];

function useCountdown(target: string | null) {
  const [time, setTime] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    if (!target) return;
    const targetDate = new Date(target);
    const tick = () => {
      const diff = Math.max(0, targetDate.getTime() - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime({
        d: String(d).padStart(2, '0'),
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return time;
}

export default function PublicSite({
  siteConfig,
  activeEvent,
  gallery,
  videos,
  mesasMap,
  faqs,
}: Props) {
  const [booting, setBooting] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const countdown = useCountdown(activeEvent?.event_datetime ?? null);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1650);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [gallery, videos, faqs]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft')
        setLightbox((s) => (s ? { ...s, index: (s.index - 1 + s.images.length) % s.images.length } : s));
      if (e.key === 'ArrowRight')
        setLightbox((s) => (s ? { ...s, index: (s.index + 1) % s.images.length } : s));
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  const ticketsUrl = siteConfig?.tickets_url || '#';
  const calendarUrl = siteConfig?.calendar_url || '#';
  const spotifyUrl = siteConfig?.spotify_url || '#';

  const sortedGallery = useMemo(
    () =>
      [...gallery].map((g) => ({
        ...g,
        gallery_photos: [...g.gallery_photos].sort((a, b) => a.sort_order - b.sort_order),
      })),
    [gallery]
  );

  return (
    <>
      <div className="grain" />
      <div className="scanlines" />
      <div className="vignette" />

      {/* BOOT */}
      <div id="boot" className={booting ? '' : 'hide'}>
        <div className="boot-noise" />
        <div className="boot-line" />
        <div className="boot-content">
          <img src="/logo.webp" alt="Baila Morena" />
          <div className="boot-tag">Sintonizando señal — 2000s FM</div>
        </div>
      </div>

      {/* NAV */}
      <header>
        <a href="#top" className="nav-logo">
          <img src="/logo.webp" alt="Baila Morena" />
        </a>
        <nav className="nav-links" style={navOpen ? { display: 'flex', position: 'fixed', top: 70, left: 0, right: 0, background: '#0a0908', flexDirection: 'column', padding: 24, zIndex: 600, borderBottom: '1px solid var(--gray)' } : undefined}>
          <a href="#proxima-fecha">Próxima fecha</a>
          <a href="#experiencia">Experiencia</a>
          <a href="#galeria">Galería</a>
          <a href="#vip">Mesas VIP</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a href={ticketsUrl} className="nav-cta">Comprar entradas</a>
        <button className="nav-toggle" onClick={() => setNavOpen((v) => !v)}>☰</button>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero" style={{ paddingTop: 0 }}>
          <div className="hero-bg" />
          <div className="hero-blob blob1" />
          <div className="hero-blob blob2" />
          <div className="hero-content">
            <span className="hero-eyebrow"><span className="dot" /> En vivo — próxima edición confirmada</span>
            <img className="hero-logo" src="/logo.webp" alt="Baila Morena" />
            <h1>Donde los <span>clásicos</span> vuelven.</h1>
            {siteConfig?.hero_intro && <p className="sub">{siteConfig.hero_intro}</p>}
            <div className="hero-ctas">
              <a href={ticketsUrl} className="btn btn-solid">🎟 Comprar entradas</a>
              <a href="#vip" className="btn btn-ghost">🍾 Reservar mesa</a>
            </div>
          </div>
          <div className="scroll-cue">SCROLL</div>
        </section>

        <div className="divider" />

        {/* COUNTDOWN */}
        {activeEvent?.event_datetime && (
          <section className="reveal">
            <div className="countdown-wrap glass">
              <div className="countdown-label">Próxima edición en</div>
              <div className="countdown">
                <div className="cd-unit"><div className="cd-num">{countdown.d}</div><div className="cd-sub">Días</div></div>
                <div className="cd-unit"><div className="cd-num">{countdown.h}</div><div className="cd-sub">Horas</div></div>
                <div className="cd-unit"><div className="cd-num">{countdown.m}</div><div className="cd-sub">Minutos</div></div>
                <div className="cd-unit"><div className="cd-num">{countdown.s}</div><div className="cd-sub">Segundos</div></div>
              </div>
            </div>
          </section>
        )}

        {/* PROXIMA FECHA */}
        {activeEvent && (
          <section id="proxima-fecha" className="reveal">
            <div className="section-head">
              <span className="eyebrow">Próxima fecha</span>
              <h2>No te la pierdas</h2>
            </div>
            <div className="event-card glass">
              <div className="event-visual">
                {activeEvent.flyer_url ? (
                  <img
                    src={activeEvent.flyer_url}
                    alt={`Flyer ${activeEvent.name}`}
                    className="event-flyer-img"
                    style={{ cursor: 'zoom-in' }}
                    onClick={() => setLightbox({ images: [activeEvent.flyer_url], index: 0 })}
                  />
                ) : (
                  <div className="event-flyer-tag">FLYER · PRÓXIMAMENTE</div>
                )}
              </div>
              <div className="event-info">
                <span className="eyebrow">Baila Morena</span>
                <h3>{activeEvent.name}</h3>
                <ul className="event-meta">
                  <li><b>📅</b> {activeEvent.date_text}</li>
                  <li><b>📍</b> {activeEvent.venue}</li>
                </ul>
                <div className="event-ctas">
                  <a href={ticketsUrl} className="btn btn-solid btn-sm">Comprar entradas</a>
                  <a href={calendarUrl} className="btn btn-ghost btn-sm">Agendar en calendario</a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* EXPERIENCIA */}
        <section id="experiencia" className="reveal">
          <div className="section-head">
            <span className="eyebrow">La experiencia</span>
            <h2>Lo que nos hace diferentes</h2>
            <p>Cada detalle está pensado para transportarte a la mejor época del reggaetón.</p>
          </div>
          <div className="exp-grid">
            {EXPERIENCES.map((e) => (
              <div className="exp-card glass" key={e.t}>
                <div className="exp-icon">{e.icon}</div>
                <h4>{e.t}</h4>
                <p>{e.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* GALERIA */}
        {sortedGallery.length > 0 && (
          <section id="galeria" className="reveal">
            <div className="section-head">
              <span className="eyebrow">Galería</span>
              <h2>Cada noche, una edición</h2>
            </div>
            <div className="gallery-editions">
              {sortedGallery.map((g, i) => {
                const photos = g.gallery_photos.map((p) => p.url);
                const cover = photos[0];
                return (
                  <div
                    className="edition-card"
                    key={g.id}
                    onClick={() => {
                      if (photos.length) setLightbox({ images: photos, index: 0 });
                      else if (g.external_link) window.open(g.external_link, '_blank');
                    }}
                  >
                    {cover ? (
                      <img
                        src={cover}
                        alt={g.title}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="edition-mosaic">
                        {Array.from({ length: 12 }).map((_, k) => <div key={k} />)}
                      </div>
                    )}
                    <div className="edition-overlay">
                      <span className="eyebrow">{String(i + 1).padStart(2, '0')}</span>
                      <h3>{g.title}</h3>
                      <span className="edition-link">
                        {photos.length ? `Ver ${photos.length} foto${photos.length > 1 ? 's' : ''} →` : g.external_link ? 'Ver galería →' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* VIDEOS */}
        {videos.length > 0 && (
          <section className="reveal">
            <div className="section-head">
              <span className="eyebrow">Videos</span>
              <h2>Aftermovies & Reels</h2>
            </div>
            <div className="video-grid">
              {videos.map((v) => (
                <div
                  className="video-card"
                  key={v.id}
                  style={v.thumbnail_url ? { backgroundImage: `url('${v.thumbnail_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                  onClick={() => v.link && window.open(v.link, '_blank')}
                >
                  <div className="video-play">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                  <span className="video-tag">{v.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VIP */}
        <section id="vip" className="reveal">
          <div className="section-head">
            <span className="eyebrow">Mesas VIP</span>
            <h2>Viví la noche desde arriba</h2>
          </div>
          <div className="vip-wrap">
            <div className="vip-floor glass">
              {mesasMap?.map_url && (
                <img
                  src={mesasMap.map_url}
                  alt="Mapa de mesas"
                  className="vip-floor-img"
                  style={{ cursor: 'zoom-in' }}
                  onClick={() => setLightbox({ images: [mesasMap.map_url], index: 0 })}
                />
              )}
            </div>
            <div className="vip-cards">
              <div className="vip-card glass">
                <div>
                  <h4>Mesa BACK</h4>
                  <ul>
                    <li>Mesas 3 a 9</li>
                    <li>Ubicación lateral, sobre la pista</li>
                    <li>Ideal para grupos</li>
                  </ul>
                </div>
                <div className="vip-price">
                  <div className="amount">{siteConfig?.mesa_back_price || '$—'}</div>
                  <div className="cap">{siteConfig?.mesas_condicion}</div>
                </div>
              </div>
              <div className="vip-card glass">
                <div>
                  <h4>Mesa VIP</h4>
                  <ul>
                    <li>Mesas 1 y 2</li>
                    <li>Ubicación junto al DJ</li>
                    <li>La mejor vista de la noche</li>
                  </ul>
                </div>
                <div className="vip-price">
                  <div className="amount">{siteConfig?.mesa_vip_price || '$—'}</div>
                  <div className="cap">{siteConfig?.mesas_condicion}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLAYLIST */}
        <section className="reveal">
          <div className="section-head">
            <span className="eyebrow">Playlist oficial</span>
            <h2>Precalentá antes de la fiesta</h2>
          </div>
          <div className="playlist-panel glass">
            <div className="playlist-art" />
            <div className="playlist-info">
              <h4>Baila Morena — Old School Mix</h4>
              <p>Los clásicos del reggaetón 2000s que sonarán en la pista.</p>
              <a href={spotifyUrl} className="btn btn-solid btn-sm">Escuchar en Spotify</a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section id="faq" className="reveal">
            <div className="section-head">
              <span className="eyebrow">Preguntas frecuentes</span>
              <h2>Todo lo que necesitás saber</h2>
            </div>
            <div className="faq-wrap">
              {faqs.map((f) => (
                <div className={`faq-item glass ${openFaq === f.id ? 'open' : ''}`} key={f.id}>
                  <div className="faq-q" onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}>
                    <span>{f.question}</span>
                    <span className="plus">+</span>
                  </div>
                  <div className="faq-a"><p>{f.answer}</p></div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer>
        <div className="footer-top">
          <div className="footer-logo">
            <img src="/logo.webp" alt="Baila Morena" />
          </div>
          <div className="footer-socials">
            {siteConfig?.social_instagram && (
              <a href={siteConfig.social_instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg>
              </a>
            )}
            {siteConfig?.social_tiktok && (
              <a href={siteConfig.social_tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 3c.5 2.5 2 4 4.5 4.3v3c-1.7 0-3.2-.5-4.5-1.4v6.6a5.5 5.5 0 1 1-5.5-5.5c.3 0 .7 0 1 .1v3.1a2.4 2.4 0 1 0 1.7 2.3V3H16z" /></svg>
              </a>
            )}
            {siteConfig?.social_whatsapp && (
              <a href={siteConfig.social_whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zm0 16.3a7.2 7.2 0 0 1-3.7-1l-.3-.2-2.7.7.7-2.6-.2-.3A7.3 7.3 0 1 1 12 19.3zm4-5.5c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1s-.6.7-.8.9-.3.2-.5.1a6 6 0 0 1-1.8-1.1 6.7 6.7 0 0 1-1.2-1.5c-.1-.2 0-.3.1-.5l.4-.4c.1-.1.1-.3.2-.4s0-.3 0-.5-.5-1.3-.7-1.7-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1.1 2.8.1.2 1.8 2.8 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.3-.5 1.5-1s.2-.9.2-1z" /></svg>
              </a>
            )}
          </div>
        </div>
        <div className="divider" style={{ marginBottom: 24 }} />
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Baila Morena. Todos los derechos reservados.</span>
          <span>Ambiente +21 · Buenos Aires, ARG</span>
        </div>
      </footer>

      {/* LIGHTBOX */}
      <div className={`lightbox ${lightbox ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setLightbox(null); }}>
        <div className="lightbox-close" onClick={() => setLightbox(null)}>&times;</div>
        {lightbox && lightbox.images.length > 1 && (
          <div
            className="lightbox-arrow prev"
            onClick={() => setLightbox((s) => (s ? { ...s, index: (s.index - 1 + s.images.length) % s.images.length } : s))}
          >‹</div>
        )}
        {lightbox && <img src={lightbox.images[lightbox.index]} alt="Vista completa" />}
        {lightbox && lightbox.images.length > 1 && (
          <div
            className="lightbox-arrow next"
            onClick={() => setLightbox((s) => (s ? { ...s, index: (s.index + 1) % s.images.length } : s))}
          >›</div>
        )}
        {lightbox && lightbox.images.length > 1 && (
          <div className="lightbox-counter">{lightbox.index + 1} / {lightbox.images.length}</div>
        )}
      </div>
    </>
  );
}
