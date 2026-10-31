import NavAdmin from "@/components/NavAdmin";
import UlasanAdminList from "@/components/UlasanAdminList";
import { createSessionClient } from "@/lib/supabase/session";

// US-39: Moderasi ulasan
export default async function HalamanUlasan() {
  const supabase = await createSessionClient();

  let daftarUlasan = [];
  let errorMsg = null;
  let tabelBelumAda = false;

  try {
    const { data, error } = await supabase
      .from("ulasan")
      .select("*, produk(nama)")
      .order("created_at", { ascending: false });

    if (error) {
      if (
        error.message.includes("Could not find the table") ||
        error.code === "PGRST205"
      ) {
        tabelBelumAda = true;
      } else {
        errorMsg = error.message;
      }
    } else {
      daftarUlasan = data || [];
    }
  } catch (e) {
    errorMsg = e.message;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Moderasi ulasan</h1>

      {tabelBelumAda ? (
        <div className="rounded-2xl border border-garis bg-permukaan p-6">
          <h2 className="text-base font-bold text-teks">
            Tabel Ulasan Belum Aktif di Supabase
          </h2>
          <p className="mt-1 text-sm text-teks-lembut">
            Fitur ulasan pembeli (US-38 & US-39) membutuhkan tabel{" "}
            <code className="rounded bg-latar px-1.5 py-0.5 text-utama">
              ulasan
            </code>{" "}
            di Supabase. Silakan buka Supabase SQL Editor dan jalankan skrip berikut:
          </p>

          <pre className="mt-3 overflow-x-auto rounded-xl border border-garis bg-latar p-4 text-xs font-mono text-teks">
{`CREATE TABLE IF NOT EXISTS public.ulasan (
  id bigint generated always as identity primary key,
  produk_id bigint references public.produk(id) on delete cascade,
  nama_pengulas text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  komentar text not null,
  disetujui boolean default true,
  created_at timestamptz not null default now()
);

ALTER TABLE public.ulasan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ulasan_baca_semua" ON public.ulasan FOR SELECT USING (true);
CREATE POLICY "ulasan_tambah_publik" ON public.ulasan FOR INSERT WITH CHECK (true);
CREATE POLICY "ulasan_kelola_admin" ON public.ulasan FOR ALL TO authenticated USING (true);`}
          </pre>
          <p className="mt-3 text-xs text-teks-lembut">
            💡 Skrip lengkap untuk semua fitur bonus juga tersedia di file{" "}
            <code className="font-semibold text-utama">docs/schema-bonus.sql</code>.
          </p>
        </div>
      ) : errorMsg ? (
        <p className="rounded-lg bg-permukaan p-4 text-sm text-bahaya">
          Gagal memuat ulasan: {errorMsg}
        </p>
      ) : daftarUlasan.length === 0 ? (
        <p className="text-teks-lembut">Belum ada ulasan pembeli.</p>
      ) : (
        <UlasanAdminList daftarUlasan={daftarUlasan} />
      )}
    </div>
  );
}
