import NavAdmin from "@/components/NavAdmin";
import Tombol from "@/components/Tombol";
import TabelProdukAdmin from "@/components/TabelProdukAdmin";
import { createSessionClient } from "@/lib/supabase/session";

const PER_HALAMAN = 20;

// US-07, US-33: Daftar produk admin dengan pencarian dan paginasi
export default async function HalamanProdukAdmin({ searchParams }) {
  const params = await searchParams;
  const cari = params?.q || "";
  const halaman = parseInt(params?.halaman || "1", 10);
  const dari = (halaman - 1) * PER_HALAMAN;

  const supabase = await createSessionClient();

  let query = supabase
    .from("produk")
    .select("*", { count: "exact" })
    .order("urutan", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(dari, dari + PER_HALAMAN - 1);

  if (cari) {
    query = query.ilike("nama", `%${cari}%`);
  }

  const { data: daftarProduk, count, error } = await query;
  const totalHalaman = count ? Math.ceil(count / PER_HALAMAN) : 1;

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        <div className="flex gap-2">
          <Tombol href="/admin/produk/ekspor-csv" varian="garis">
            Ekspor CSV
          </Tombol>
          <Tombol href="/admin/produk/impor" varian="garis">
            Impor CSV
          </Tombol>
          <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
        </div>
      </div>

      {/* Pencarian */}
      <form className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={cari}
          placeholder="Cari nama produk..."
          className="flex-1 rounded-lg border border-garis bg-latar px-4 py-2.5 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
        <Tombol type="submit">Cari</Tombol>
      </form>

      {error && (
        <p className="rounded-lg bg-permukaan p-4 text-sm text-bahaya">
          Gagal memuat produk: {error.message}
        </p>
      )}

      {!daftarProduk || daftarProduk.length === 0 ? (
        <p className="text-teks-lembut">
          {cari ? `Tidak ada produk dengan nama "${cari}".` : "Belum ada produk."}
        </p>
      ) : (
        <>
          <p className="text-sm text-teks-lembut">
            Menampilkan {daftarProduk.length} dari {count} produk
            {cari ? ` untuk "${cari}"` : ""}.
          </p>
          <TabelProdukAdmin daftarProduk={daftarProduk} />
        </>
      )}

      {/* Paginasi */}
      {totalHalaman > 1 && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((h) => {
            const url = `/admin/produk?halaman=${h}${cari ? `&q=${encodeURIComponent(cari)}` : ""}`;
            return (
              <a
                key={h}
                href={url}
                className={`rounded-lg border px-3 py-1 text-sm ${
                  h === halaman
                    ? "border-utama bg-utama text-white"
                    : "border-garis hover:border-utama hover:text-utama"
                }`}
              >
                {h}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

