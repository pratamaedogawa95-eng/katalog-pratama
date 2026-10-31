import Link from "next/link";
import { toko as tokoFallback } from "@/lib/toko";
import { getTokoData } from "@/lib/toko-server";

export const metadata = {
  title: `Tentang Kami - ${tokoFallback.nama}`,
  description: tokoFallback.deskripsi,
};

export default async function HalamanTentang() {
  const toko = await getTokoData();
  const linkWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(
    "Halo " + toko.nama + ", saya ingin bertanya seputar toko."
  )}`;

  return (
    <div className="mx-auto max-w-3xl py-10 sm:py-14">
      <Link
        href="/"
        className="text-sm font-semibold text-teks-lembut hover:text-utama hover:underline"
      >
        ← Kembali ke katalog
      </Link>

      <div className="mt-6 flex flex-col gap-6">
        <div>
          <span className="rounded-md bg-utama/10 px-2.5 py-1 text-xs font-bold text-utama">
            Profil UMKM
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-teks sm:text-4xl">
            Tentang {toko.nama}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-teks-lembut">
            {toko.tagline}
          </p>
        </div>

        <div className="rounded-2xl border border-garis bg-permukaan/60 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-teks">Cerita & Komitmen Kami</h2>
          <p className="mt-3 text-sm leading-relaxed text-teks-lembut">
            {toko.deskripsi}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-teks-lembut">
            Kami percaya bahwa setiap karya dan camilan rumahan memiliki keunikan
            cita rasa tersendiri. Melalui platform katalog ini, kami ingin
            memudahkan pelanggan setia maupun pengunjung baru untuk menemukan
            produk terbaik kami dan memesan langsung lewat WhatsApp secara cepat
            dan praktis.
          </p>
        </div>

        {/* Informasi Kontak & Lokasi */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-garis bg-latar p-5">
            <span className="text-2xl">📍</span>
            <h3 className="mt-2 font-bold text-teks">Alamat Toko</h3>
            <p className="mt-1 text-sm text-teks-lembut">{toko.alamat}</p>
          </div>

          <div className="rounded-xl border border-garis bg-latar p-5">
            <span className="text-2xl">🕒</span>
            <h3 className="mt-2 font-bold text-teks">Jam Buka</h3>
            <p className="mt-1 text-sm text-teks-lembut">{toko.jamBuka}</p>
          </div>

          <div className="rounded-xl border border-garis bg-latar p-5">
            <span className="text-2xl">💬</span>
            <h3 className="mt-2 font-bold text-teks">WhatsApp Pemesanan</h3>
            <p className="mt-1 text-sm text-teks-lembut">+{toko.nomorWhatsApp}</p>
          </div>

          <div className="rounded-xl border border-garis bg-latar p-5">
            <span className="text-2xl">✉️</span>
            <h3 className="mt-2 font-bold text-teks">Email Kontak</h3>
            <p className="mt-1 text-sm text-teks-lembut">{toko.email}</p>
          </div>
        </div>

        <div className="mt-2 flex flex-col items-center justify-between gap-4 rounded-2xl bg-utama p-6 text-white sm:flex-row">
          <div>
            <h3 className="text-lg font-bold">Siap Menikmati Produk Kami?</h3>
            <p className="text-sm opacity-90">
              Hubungi kami langsung via WhatsApp untuk pertanyaan atau pesanan khusus.
            </p>
          </div>
          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-utama hover:bg-permukaan"
          >
            Chat WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
