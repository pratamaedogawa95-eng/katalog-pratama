import { getTokoData } from "@/lib/toko-server";
import { createServerClient } from "@/lib/supabase/server";
import KatalogProdukInteraktif from "@/components/KatalogProdukInteraktif";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const search = await searchParams;
  const kategoriAktif = search?.kategori || "";
  const pencarianAktif = search?.q || "";
  const urutanAktif = search?.urut || "terbaru";
  const currentLimit = Number(search?.limit) || 12;

  const toko = await getTokoData();

  let daftarProduk = [];
  let daftarKategori = [];
  let totalCount = 0;
  let errorMessage = null;

  try {
    const supabase = createServerClient();

    // Ambil daftar kategori unik untuk filter
    const { data: katData } = await supabase.from("produk").select("kategori");
    if (katData) {
      daftarKategori = Array.from(
        new Set(katData.map((k) => k.kategori).filter(Boolean))
      );
    }

    // Bangun query produk di server (US-11, US-15, US-16, US-32, US-47)
    let query = supabase.from("produk").select("*", { count: "exact" });

    // US-32: Sembunyikan produk nonaktif
    query = query.neq("aktif", false);

    // Filter Kategori (US-11)
    if (kategoriAktif && kategoriAktif !== "semua") {
      query = query.eq("kategori", kategoriAktif);
    }

    // Pencarian nama produk (US-11)
    if (pencarianAktif && pencarianAktif.trim() !== "") {
      query = query.ilike("nama", `%${pencarianAktif.trim()}%`);
    }

    // Urutan produk (US-15, US-47, US-49)
    if (urutanAktif === "termurah") {
      query = query.order("harga", { ascending: true });
    } else if (urutanAktif === "termahal") {
      query = query.order("harga", { ascending: false });
    } else if (urutanAktif === "abjad_asc") {
      query = query.order("nama", { ascending: true });
    } else if (urutanAktif === "abjad_desc") {
      query = query.order("nama", { ascending: false });
    } else {
      // Bawaan: urutan prioritas admin (US-47), lalu terbaru
      query = query
        .order("urutan", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });
    }

    // Paginasi / pembatasan jumlah di database (US-16)
    query = query.limit(currentLimit);

    const { data, count, error } = await query;

    if (error) {
      errorMessage = `Gagal memuat produk: ${error.message}`;
    } else {
      daftarProduk = data || [];
      totalCount = count || 0;
    }
  } catch (err) {
    errorMessage = `Gagal menghubungkan ke database: ${err.message}`;
  }

  return (
    <>
      <section className="py-8 sm:py-12">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-teks sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-3 text-sm text-teks-lembut">🕒 {toko.jamBuka}</p>
      </section>

      <section
        aria-labelledby="judul-produk"
        className="flex flex-col gap-5 pb-12"
      >
        <h2 id="judul-produk" className="text-xl font-bold text-teks">
          Produk kami
        </h2>

        <KatalogProdukInteraktif
          daftarProduk={daftarProduk}
          daftarKategori={daftarKategori}
          totalCount={totalCount}
          currentLimit={currentLimit}
          kategoriAktif={kategoriAktif}
          pencarianAktif={pencarianAktif}
          urutanAktif={urutanAktif}
          errorMessage={errorMessage}
        />
      </section>
    </>
  );
}
