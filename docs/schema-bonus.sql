-- Skema Tambahan untuk Fitur Bonus Katalog UMKM
-- Cara pakai:
-- 1. Buka dashboard Supabase (https://supabase.com/dashboard)
-- 2. Pilih project usahamu > Buka menu "SQL Editor" di bilah kiri
-- 3. Klik "New query", tempel seluruh isi file ini, lalu klik "Run".
-- Script ini aman dijalankan berulang kali (idempotent).

-- 1. Kolom tambahan pada tabel produk (US-19, US-32, US-47)
alter table public.produk add column if not exists aktif boolean default true;
alter table public.produk add column if not exists urutan integer default 0;
alter table public.produk add column if not exists stok integer default 10;

-- 2. Tabel ulasan & rating pembeli (US-38 & US-39)
create table if not exists public.ulasan (
  id bigint generated always as identity primary key,
  produk_id bigint references public.produk(id) on delete cascade,
  nama_pengulas text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  komentar text not null,
  disetujui boolean default true,
  created_at timestamptz not null default now()
);

-- RLS untuk ulasan
alter table public.ulasan enable row level security;
drop policy if exists "ulasan_baca_semua" on public.ulasan;
create policy "ulasan_baca_semua" on public.ulasan for select using (true);
drop policy if exists "ulasan_tambah_publik" on public.ulasan;
create policy "ulasan_tambah_publik" on public.ulasan for insert with check (true);
drop policy if exists "ulasan_kelola_admin" on public.ulasan;
create policy "ulasan_kelola_admin" on public.ulasan for all to authenticated using (true);

-- 3. Tabel banner promosi beranda (US-42)
create table if not exists public.banner (
  id bigint generated always as identity primary key,
  judul text not null,
  teks text,
  foto_url text,
  tautan text,
  aktif boolean default true,
  created_at timestamptz not null default now()
);

-- RLS untuk banner
alter table public.banner enable row level security;
drop policy if exists "banner_baca_semua" on public.banner;
create policy "banner_baca_semua" on public.banner for select using (true);
drop policy if exists "banner_kelola_admin" on public.banner;
create policy "banner_kelola_admin" on public.banner for all to authenticated using (true);

-- 4. Tabel pengaturan identitas toko (US-43)
create table if not exists public.pengaturan_toko (
  id bigint generated always as identity primary key,
  kunci text not null unique,
  nilai text not null,
  updated_at timestamptz not null default now()
);

-- RLS untuk pengaturan toko
alter table public.pengaturan_toko enable row level security;
drop policy if exists "pengaturan_baca_semua" on public.pengaturan_toko;
create policy "pengaturan_baca_semua" on public.pengaturan_toko for select using (true);
drop policy if exists "pengaturan_kelola_admin" on public.pengaturan_toko;
create policy "pengaturan_kelola_admin" on public.pengaturan_toko for all to authenticated using (true);

-- 5. Tabel log aktivitas admin (US-45)
create table if not exists public.log_aktivitas_admin (
  id bigint generated always as identity primary key,
  admin_email text not null,
  aksi text not null,
  detail text,
  created_at timestamptz not null default now()
);

alter table public.log_aktivitas_admin enable row level security;
drop policy if exists "log_kelola_admin" on public.log_aktivitas_admin;
create policy "log_kelola_admin" on public.log_aktivitas_admin for all to authenticated using (true);

-- 6. Tabel kategori terpisah (US-31)
create table if not exists public.kategori (
  id bigint generated always as identity primary key,
  nama text not null unique,
  created_at timestamptz not null default now()
);

alter table public.kategori enable row level security;
drop policy if exists "kategori_baca_semua" on public.kategori;
create policy "kategori_baca_semua" on public.kategori for select using (true);
drop policy if exists "kategori_kelola_admin" on public.kategori;
create policy "kategori_kelola_admin" on public.kategori for all to authenticated using (true);

-- 7. Tabel pencatatan klik tombol pesan WhatsApp (US-40 & US-41)
create table if not exists public.log_klik_wa (
  id bigint generated always as identity primary key,
  produk_id bigint references public.produk(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.log_klik_wa enable row level security;
drop policy if exists "log_wa_tambah_semua" on public.log_klik_wa;
create policy "log_wa_tambah_semua" on public.log_klik_wa for insert with check (true);
drop policy if exists "log_wa_baca_admin" on public.log_klik_wa;
create policy "log_wa_baca_admin" on public.log_klik_wa for select using (true);

