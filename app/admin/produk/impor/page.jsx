import NavAdmin from "@/components/NavAdmin";
import FormImporCSV from "@/components/FormImporCSV";
import Tombol from "@/components/Tombol";

// US-46: Halaman Impor Produk dari CSV
export default function HalamanImporProduk() {
  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-teks">Impor Produk CSV</h1>
          <p className="mt-1 text-sm text-teks-lembut">
            Unggah file CSV untuk menambahkan banyak produk sekaligus ke katalog.
          </p>
        </div>
        <Tombol href="/admin/produk" varian="garis">
          Kembali ke produk
        </Tombol>
      </div>

      <FormImporCSV />
    </div>
  );
}

