import { createClient } from '@/lib/supabase/server';
import type {
  SiteConfig,
  EventRow,
  GalleryEdition,
  VideoRow,
  MesasMap,
  FaqRow,
} from '@/lib/types';

export async function getSiteData() {
  const supabase = await createClient();

  const [
    { data: siteConfig },
    { data: activeEvent },
    { data: gallery },
    { data: videos },
    { data: mesasMap },
    { data: faqs },
  ] = await Promise.all([
    supabase.from('site_config').select('*').eq('id', 1).single(),
    supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('gallery_editions')
      .select('*, gallery_photos(*)')
      .order('sort_order', { ascending: true }),
    supabase.from('videos').select('*').order('sort_order', { ascending: true }),
    supabase.from('mesas_map').select('*').eq('id', 1).single(),
    supabase.from('faqs').select('*').order('sort_order', { ascending: true }),
  ]);

  return {
    siteConfig: siteConfig as SiteConfig | null,
    activeEvent: activeEvent as EventRow | null,
    gallery: (gallery ?? []) as GalleryEdition[],
    videos: (videos ?? []) as VideoRow[],
    mesasMap: mesasMap as MesasMap | null,
    faqs: (faqs ?? []) as FaqRow[],
  };
}
