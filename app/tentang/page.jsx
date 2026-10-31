import Link from "next/link";
import { toko } from "@/lib/toko";

export const metadata = {
  title: `Tentang Kami - ${toko.nama}`,
  description: toko.deskripsi,
};

export default function HalamanTentang() {
  const linkWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent("Halo " + toko.nama + ", saya ingin bertanya seputar toko.")}`;

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
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl text-teks">
            Tentang {toko.nama}
          </h1>
          <p className="mt-3 text-base text-teks-lembut leading-relaxed">
            {toko.tagline}
          </p>
        </div>

        <div className="rounded-2xl border border-garis bg-permukaan/60 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-teks">Cerita & Komitmen Kami</h2>
          <p className="mt-3 leading-relaxed text-sm text-teks-lembut">
            {toko.deskripsi}
          </p>
          <p className="mt-3 leading-relaxed text-sm text-teks-lembut">
            Kami percaya bahwa setiap karya dan camilan rumahan memiliki keunikan cita rasa tersendiri. Melalui platform katalog ini, kami ingin memudahkan pelanggan setia maupun pengunjung baru untuk menemukan produk terbaik kami dan memesan langsung lewat WhatsApp secara cepat dan praktis.
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
            <h3 className="mt-2 font-bold text-teks">Jam Operasional</h3>
            <p className="mt-1 text-sm text-teks-lembut">{toko.jamBuka}</p>
          </div>

          <div className="rounded-xl border border-garis bg-latar p-5">
            <span className="text-2xl">💬</span>
            <h3 className="mt-2 font-bold text-teks">WhatsApp Pemesanan</h3>
            <p className="mt-1 text-sm text-teks-lembut">+{toko.nomorWhatsApp}</p>
            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-lg bg-utama px-3.5 py-1.5 text-xs font-bold text-white hover:bg-utama-gelap"
            >
              Hubungi via WhatsApp
            </a>
          </div>

          <div className="rounded-xl border border-garis bg-latar p-5">
            <span className="text-2xl">✉️</span>
            <h3 className="mt-2 font-bold text-teks">Email Kontak</h3>
            <p className="mt-1 text-sm text-teks-lembut">{toko.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

