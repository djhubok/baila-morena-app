import type { ReactNode } from 'react';

// Set de íconos disponibles para elegir en el admin. La key se guarda en la
// base de datos (icon_key) y acá se resuelve al SVG correspondiente.
export const EXPERIENCE_ICONS: Record<string, ReactNode> = {
  music: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 8l2-3h12l2 3" />
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <circle cx="12" cy="14" r="3.5" />
    </svg>
  ),
  candy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  ),
  flag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 18V6l8 3-8 3" />
      <path d="M4 21h16" />
    </svg>
  ),
  vip: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 10l1.5-5h11L19 10" />
      <path d="M4 10h16v3a8 8 0 0 1-16 0v-3z" />
      <path d="M12 17v4M8 21h8" />
    </svg>
  ),
  age: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="3" width="16" height="10" rx="1" />
      <path d="M8 21l2-5h4l2 5M9 13v3M15 13v3" />
    </svg>
  ),
  tv: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 8h.01" />
    </svg>
  ),
  headphones: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="2" y="14" width="5" height="7" rx="2" />
      <rect x="17" y="14" width="5" height="7" rx="2" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L12 16.9 6.4 20l1.4-6.2L3 9.5l6.4-.6z" />
    </svg>
  ),
  fire: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 22c4 0 6.5-2.5 6.5-6 0-3-2-4.5-3-6.5-.5 1.5-1.5 2.5-2.5 2.5C13.5 8 13 4 10 2c0 3-3 5-4.5 8-1 2-1 3.5-1 4.5C4.5 19.5 8 22 12 22z" />
    </svg>
  ),
  cocktail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 4h16l-8 9v7M8 20h8" />
    </svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 17v5M9 22h6" />
    </svg>
  ),
  disco: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3v18M6 6l12 12M18 6L6 18" />
    </svg>
  ),
};

export const ICON_OPTIONS = Object.keys(EXPERIENCE_ICONS) as (keyof typeof EXPERIENCE_ICONS)[];

export const ICON_LABELS: Record<string, string> = {
  music: 'Nota musical',
  camera: 'Cámara',
  candy: 'Dulce',
  flag: 'Bandera / Show',
  vip: 'Botella VIP',
  age: 'Identificación',
  tv: 'Pantalla / TV',
  headphones: 'Auriculares',
  star: 'Estrella',
  fire: 'Fuego',
  cocktail: 'Trago',
  mic: 'Micrófono',
  disco: 'Disco',
};
