import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import GaleriFotoProduk from "@/components/GaleriFotoProduk";
import AksiDetailProduk from "@/components/AksiDetailProduk";
import AsistenAIProduk from "@/components/AsistenAIProduk";
import UlasanProduk from "@/components/UlasanProduk";
import ProdukTerkait from "@/components/ProdukTerkait";
import CatatDilihatKlien from "@/components/CatatDilihatKlien";

export const dynamic = "force-dynamic";

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  const supabase = createServerClient();

  // Ambil detail produk
  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // US-32: Jika produk tidak ditemukan atau nonaktif, tampilkan not-found
  if (error || !produk || produk.aktif === false) {
    notFound();
  }

  // US-17: Ambil produk terkait dari kategori yang sama
  const { data: produkTerkait } = await supabase
    .from("produk")
    .select("*")
    .eq("kategori", produk.kategori)
    .neq("id", id)
    .limit(3);

  // US-18: Galeri foto (foto utama + variasi sudut jika ada)
  const galeriTambahan = produk.galeri || [];

  return (
    <div className="py-8 md:py-12">
      <CatatDilihatKlien produk={produk} />

      {/* Bagian Atas: Galeri & Detail Info */}
      <article className="grid gap-8 md:grid-cols-2">
        {/* US-18: Galeri Foto Interaktif */}
        <GaleriFotoProduk
          fotoUtama={produk.foto_url}
          alt={produk.nama}
          galeriTambahan={galeriTambahan}
        />

        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
          >
            ← Kembali ke katalog
          </Link>

          {/* US-49: Kategori Tertaut */}
          <Link
            href={`/kategori/${encodeURIComponent(produk.kategori)}`}
            className="self-start text-sm font-semibold text-teks-lembut hover:text-utama hover:underline"
          >
            {produk.kategori}
          </Link>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-teks">
            {produk.nama}
          </h1>

          <p className="max-w-prose leading-relaxed text-teks-lembut">
            {produk.deskripsi || "Produk pilihan terbaik diproduksi dengan bahan baku bermutu tinggi."}
          </p>

          {/* US-12 & 19 & 20 & 21 & 23 & 40 & 48: Interaksi Harga, Varian, Keranjang, Salin Link */}
          <AksiDetailProduk produk={produk} />
        </div>
      </article>

      {/* US-50: Asisten AI Tanya Jawab Produk */}
      <AsistenAIProduk produk={produk} />

      {/* US-38: Ulasan & Rating Bintang */}
      <UlasanProduk produkId={produk.id} />

      {/* US-17: Produk Terkait di Bawah */}
      <ProdukTerkait produkTerkait={produkTerkait || []} />
    </div>
  );
}
