export interface SiteConfig {
  id: number;
  hero_intro: string;
  tickets_url: string;
  calendar_url: string;
  spotify_url: string;
  social_instagram: string;
  social_tiktok: string;
  social_whatsapp: string;
  mesa_back_price: string;
  mesa_vip_price: string;
  mesas_condicion: string;
  mesa_back_desc: string;
  mesa_vip_desc: string;
}

export interface EventRow {
  id: string;
  name: string;
  venue: string;
  date_text: string;
  event_datetime: string | null;
  flyer_url: string;
  is_active: boolean;
}

export interface GalleryEdition {
  id: string;
  title: string;
  external_link: string;
  sort_order: number;
  gallery_photos: GalleryPhoto[];
}

export interface GalleryPhoto {
  id: string;
  edition_id: string;
  url: string;
  sort_order: number;
}

export interface VideoRow {
  id: string;
  label: string;
  thumbnail_url: string;
  link: string;
  sort_order: number;
}

export interface MesasMap {
  id: number;
  map_url: string;
}

export interface FaqRow {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}
