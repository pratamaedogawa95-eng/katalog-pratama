import NavAdmin from "@/components/NavAdmin";
import FormProdukAdmin from "@/components/FormProdukAdmin";
import { createSessionClient } from "@/lib/supabase/session";

// US-08: Tambah produk baru
export default async function HalamanTambahProduk() {
  const supabase = await createSessionClient();
  let daftarKategori = [];
  try {
    const { data } = await supabase.from("produk").select("kategori");
    daftarKategori = Array.from(
      new Set((data || []).map((p) => p.kategori).filter(Boolean))
    );
  } catch {}

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Tambah produk</h1>
      <FormProdukAdmin mode="tambah" daftarKategori={daftarKategori} />
    </div>
  );
}
