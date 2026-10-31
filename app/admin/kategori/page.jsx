import NavAdmin from "@/components/NavAdmin";
import KelolakategoriAdmin from "@/components/KelolakategoriAdmin";
import { createSessionClient } from "@/lib/supabase/session";

// US-31: Kelola kategori
export default async function HalamanKategori() {
  const supabase = await createSessionClient();

  let daftarKategori = [];
  try {
    const { data, error } = await supabase
      .from("kategori")
      .select("*")
      .order("nama");
    if (!error && data) daftarKategori = data;
  } catch {}

  // Fallback: ambil kategori unik dari produk jika tabel kategori kosong
  if (daftarKategori.length === 0) {
    try {
      const { data: produkData } = await supabase
        .from("produk")
        .select("kategori");
      const unik = [
        ...new Set((produkData || []).map((p) => p.kategori).filter(Boolean)),
      ];
      daftarKategori = unik.map((nama, idx) => ({ id: idx + 1, nama }));
    } catch {}
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Kelola kategori</h1>
      <KelolakategoriAdmin daftarKategori={daftarKategori} />
    </div>
  );
}

