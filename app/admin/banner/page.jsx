import NavAdmin from "@/components/NavAdmin";
import BannerAdminList from "@/components/BannerAdminList";
import { createSessionClient } from "@/lib/supabase/session";

// US-42: Kelola banner promo
export default async function HalamanBanner() {
  const supabase = await createSessionClient();

  let daftarBanner = [];
  let errorMsg = null;
  let tabelBelumAda = false;

  try {
    const { data, error } = await supabase
      .from("banner")
      .select("*")
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
      daftarBanner = data || [];
    }
  } catch (e) {
    errorMsg = e.message;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Kelola banner</h1>

      {tabelBelumAda ? (
        <div className="rounded-2xl border border-garis bg-permukaan p-6">
          <h2 className="text-base font-bold text-teks">
            Tabel Banner Belum Aktif di Supabase
          </h2>
          <p className="mt-1 text-sm text-teks-lembut">
            Fitur banner promo (US-42) membutuhkan tabel{" "}
            <code className="rounded bg-latar px-1.5 py-0.5 text-utama">
              banner
            </code>{" "}
            di Supabase. Silakan buka Supabase SQL Editor dan jalankan skrip berikut:
          </p>

          <pre className="mt-3 overflow-x-auto rounded-xl border border-garis bg-latar p-4 text-xs font-mono text-teks">
{`CREATE TABLE IF NOT EXISTS public.banner (
  id bigint generated always as identity primary key,
  judul text not null,
  teks text,
  foto_url text,
  tautan text,
  aktif boolean default true,
  created_at timestamptz not null default now()
);

ALTER TABLE public.banner ENABLE ROW LEVEL SECURITY;
CREATE POLICY "banner_baca_semua" ON public.banner FOR SELECT USING (true);
CREATE POLICY "banner_kelola_admin" ON public.banner FOR ALL TO authenticated USING (true);`}
          </pre>
          <p className="mt-3 text-xs text-teks-lembut">
            💡 Skrip lengkap untuk semua fitur bonus juga tersedia di file{" "}
            <code className="font-semibold text-utama">docs/schema-bonus.sql</code>.
          </p>
        </div>
      ) : errorMsg ? (
        <p className="rounded-lg bg-permukaan p-4 text-sm text-bahaya">
          Gagal memuat banner: {errorMsg}
        </p>
      ) : (
        <BannerAdminList daftarBanner={daftarBanner} />
      )}
    </div>
  );
}
