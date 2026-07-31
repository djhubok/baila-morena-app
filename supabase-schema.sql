-- =========================================================
-- BAILA MORENA — Esquema de base de datos para Supabase
-- Pegar completo en: Supabase → SQL Editor → New query → Run
-- =========================================================

-- Extensión para generar IDs únicos
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- 1) CONFIGURACIÓN GENERAL DEL SITIO (una sola fila)
-- ---------------------------------------------------------
create table if not exists site_config (
  id int primary key default 1,
  hero_intro text default 'La fiesta donde el reggaetón old school vuelve a ser protagonista. Clásicos, nostalgia y una energía única en cada edición.',
  tickets_url text default '',
  calendar_url text default '',
  spotify_url text default '',
  social_instagram text default '',
  social_tiktok text default '',
  social_whatsapp text default '',
  mesa_back_price text default '$400.000',
  mesa_vip_price text default '$400.000',
  mesas_condicion text default '100% en consumo',
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);
insert into site_config (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------
-- 2) PRÓXIMOS EVENTOS
-- ---------------------------------------------------------
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Old School Night',
  venue text not null default '',
  date_text text not null default '',        -- texto visible, ej: "Sábado 15 de agosto, 2026"
  event_datetime timestamptz,                 -- fecha/hora real para el contador
  flyer_url text default '',                  -- link del archivo en Supabase Storage
  is_active boolean default true,             -- solo el evento activo se muestra en el sitio
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- 3) GALERÍA — EDICIONES Y FOTOS (hasta 6 fotos por edición, validado en la app)
-- ---------------------------------------------------------
create table if not exists gallery_editions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  external_link text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid references gallery_editions(id) on delete cascade,
  url text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- 4) VIDEOS
-- ---------------------------------------------------------
create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  thumbnail_url text default '',
  link text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- 5) MAPA DE MESAS (imagen única, similar a site_config)
-- ---------------------------------------------------------
create table if not exists mesas_map (
  id int primary key default 1,
  map_url text default '',
  updated_at timestamptz default now(),
  constraint single_row_map check (id = 1)
);
insert into mesas_map (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------
-- 6) FAQ
-- ---------------------------------------------------------
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- =========================================================
-- SEGURIDAD (RLS) — lectura pública, escritura solo admin logueado
-- =========================================================
alter table site_config enable row level security;
alter table events enable row level security;
alter table gallery_editions enable row level security;
alter table gallery_photos enable row level security;
alter table videos enable row level security;
alter table mesas_map enable row level security;
alter table faqs enable row level security;

-- Lectura: cualquiera puede ver el contenido (así carga el sitio público)
create policy "Lectura pública" on site_config for select using (true);
create policy "Lectura pública" on events for select using (true);
create policy "Lectura pública" on gallery_editions for select using (true);
create policy "Lectura pública" on gallery_photos for select using (true);
create policy "Lectura pública" on videos for select using (true);
create policy "Lectura pública" on mesas_map for select using (true);
create policy "Lectura pública" on faqs for select using (true);

-- Escritura: solo usuarios autenticados (el/los admin que crees en Authentication)
create policy "Escritura solo admin" on site_config for all using (auth.role() = 'authenticated');
create policy "Escritura solo admin" on events for all using (auth.role() = 'authenticated');
create policy "Escritura solo admin" on gallery_editions for all using (auth.role() = 'authenticated');
create policy "Escritura solo admin" on gallery_photos for all using (auth.role() = 'authenticated');
create policy "Escritura solo admin" on videos for all using (auth.role() = 'authenticated');
create policy "Escritura solo admin" on mesas_map for all using (auth.role() = 'authenticated');
create policy "Escritura solo admin" on faqs for all using (auth.role() = 'authenticated');

-- =========================================================
-- DATOS DE EJEMPLO (podés borrarlos después desde el admin)
-- =========================================================
insert into events (name, venue, date_text, event_datetime, is_active)
values ('Old School Night', 'Laundry Soho, Palermo', 'Sábado 15 de agosto, 2026', '2026-08-15T23:30:00-03:00', true);

insert into faqs (question, answer, sort_order) values
('¿Cuál es la edad mínima para ingresar?', 'El evento es exclusivamente para mayores de 21 años. Se solicitará documento de identidad en la entrada.', 1),
('¿Cómo reservo una mesa VIP?', 'Podés reservar desde la sección Mesas VIP o escribiéndonos directamente por WhatsApp.', 2);

insert into gallery_editions (title, sort_order) values
('Baila Morena #01', 1),
('Baila Morena #02', 2);
