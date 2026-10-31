import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import KartuProduk from "@/components/KartuProduk";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

export default async function HalamanKategori({ params }) {
  const { slug } = await params;
  const namaKategori = decodeURIComponent(slug);

  const supabase = createServerClient();
  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("kategori", namaKategori)
    .order("id", { ascending: true });

  if (error || !daftarProduk || daftarProduk.length === 0) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <div>
        <Link
          href="/"
          className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
        >
          ← Kembali ke semua produk
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold text-teks">
          Kategori: {namaKategori}
        </h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Menampilkan {daftarProduk.length} produk dari {toko.nama}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {daftarProduk.map((produk) => (
          <KartuProduk key={produk.id} produk={produk} />
        ))}
      </div>
    </div>
  );
}

