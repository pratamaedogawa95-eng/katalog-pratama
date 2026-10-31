import KartuProduk from "@/components/KartuProduk";

export default function ProdukTerkait({ produkTerkait = [] }) {
  if (!produkTerkait || produkTerkait.length === 0) return null;

  return (
    <section className="mt-14 border-t border-garis pt-10">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-teks">Produk Terkait Lainnya</h2>
        <p className="mt-1 text-xs text-teks-lembut">
          Pilihan produk sejenis yang mungkin kamu sukai.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {produkTerkait.map((item) => (
          <KartuProduk key={item.id} produk={item} />
        ))}
      </div>
    </section>
  );
}

