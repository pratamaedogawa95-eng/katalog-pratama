import Link from "next/link";
import Tombol from "@/components/Tombol";

export default function TidakDitemukan() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-permukaan text-4xl shadow-xs">
        🔍
      </div>
      <h1 className="text-3xl font-extrabold text-teks">Halaman Tidak Ditemukan</h1>
      <p className="max-w-md text-sm text-teks-lembut leading-relaxed">
        Maaf, produk atau halaman yang kamu cari tidak tersedia, sudah dipindahkan, atau telah dihapus.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Tombol href="/">Kembali ke Katalog</Tombol>
        <Link
          href="/tentang"
          className="rounded-lg border border-garis bg-latar px-4 py-2.5 text-sm font-semibold text-teks hover:border-utama hover:text-utama"
        >
          Hubungi Kami
        </Link>
      </div>
    </div>
  );
}
