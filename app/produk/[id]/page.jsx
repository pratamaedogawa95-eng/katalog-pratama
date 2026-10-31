import Link from "next/link";
import { notFound } from "next/navigation";
import { formatRupiah } from "@/lib/format";
import { createServerClient } from "@/lib/supabase/server";
import AksiDetailProduk from "@/components/AksiDetailProduk";
import CatatDilihatKlien from "@/components/CatatDilihatKlien";

export const dynamic = "force-dynamic";

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !produk) {
    notFound();
  }

  return (
    <>
      <CatatDilihatKlien produk={produk} />

      <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
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

          <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>

          <p className="max-w-prose leading-relaxed text-teks-lembut">
            {produk.deskripsi}
          </p>

          {/* US-12 & US-21 & US-24 & US-37: Aksi Interaktif */}
          <AksiDetailProduk produk={produk} />
        </div>
      </article>
    </>
  );
}
