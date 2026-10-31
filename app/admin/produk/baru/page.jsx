import NavAdmin from "@/components/NavAdmin";
import FormProdukAdmin from "@/components/FormProdukAdmin";

// US-08: Tambah produk baru
export default function HalamanTambahProduk() {
  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Tambah produk</h1>
      <FormProdukAdmin mode="tambah" />
    </div>
  );
}
