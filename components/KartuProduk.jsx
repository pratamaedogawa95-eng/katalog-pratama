"use client";

import { useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";
import {
  tambahKeKeranjang,
  toggleFavorit,
  getFavorit,
  toggleBandingkan,
  getBandingkan,
  catatTerakhirDilihat,
  useKatalogSync,
} from "@/lib/klien-state";

export default function KartuProduk({ produk }) {
  useKatalogSync();
  const [jumlah, setJumlah] = useState(1);
  const [varian, setVarian] = useState("Reguler");
  const [notif, setNotif] = useState(null);

  const favoritList = getFavorit();
  const isFavorit = favoritList.includes(String(produk.id));

  const bandingkanList = getBandingkan();
  const isBandingkan = bandingkanList.some((p) => String(p.id) === String(produk.id));

  // Tampilkan notifikasi singkat
  const showNotif = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 2000);
  };

  const handleTambahKeranjang = (e) => {
    e.preventDefault();
    e.stopPropagation();
    tambahKeKeranjang(produk, jumlah, varian);
    showNotif("Masuk keranjang! 🛒");
  };

  const handleToggleFavorit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorit(produk.id);
  };

  const handleToggleBandingkan = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { statusMessage } = toggleBandingkan(produk);
    if (statusMessage) {
      showNotif(statusMessage);
    }
  };

  // Link WhatsApp langsung dengan jumlah dan varian (US-12)
  const pesanWhatsApp = `Halo ${toko.nama}, saya ingin memesan ${produk.nama} [Varian: ${varian}] sejumlah ${jumlah} pcs seharga total ${formatRupiah(produk.harga * jumlah)}.`;
  const urlWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesanWhatsApp)}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar transition hover:shadow-md">
      {/* Gambar & Tombol Aksi Cepat */}
      <div className="relative aspect-square w-full overflow-hidden bg-permukaan">
        <Link
          href={`/produk/${produk.id}`}
          onClick={() => catatTerakhirDilihat(produk)}
          className="flex h-full w-full items-center justify-center"
        >
          {produk.foto_url ? (
            <img
              src={produk.foto_url}
              alt={produk.nama}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/produk/kopi.svg";
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center text-teks-lembut">
              <span className="text-4xl">🍲</span>
              <span className="text-xs font-semibold">Foto belum ada</span>
            </div>
          )}
        </Link>

        {/* Tombol Favorit (US-24) */}
        <button
          type="button"
          onClick={handleToggleFavorit}
          title={isFavorit ? "Hapus dari favorit" : "Tambah ke favorit"}
          className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-latar/90 shadow-sm backdrop-blur-xs transition hover:scale-110 ${
            isFavorit ? "text-bahaya font-bold" : "text-teks-lembut hover:text-bahaya"
          }`}
        >
          {isFavorit ? "❤️" : "🤍"}
        </button>

        {/* Tombol Bandingkan (US-37) */}
        <button
          type="button"
          onClick={handleToggleBandingkan}
          title="Bandingkan produk"
          className={`absolute left-2 top-2 flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold shadow-xs backdrop-blur-xs transition ${
            isBandingkan
              ? "bg-utama text-white"
              : "bg-latar/90 text-teks-lembut hover:bg-permukaan hover:text-utama"
          }`}
        >
          <span>⚖️</span>
          <span className="hidden sm:inline">{isBandingkan ? "Terpilih" : "Bandingkan"}</span>
        </button>

        {/* Notifikasi Singkat */}
        {notif && (
          <div className="absolute inset-x-2 bottom-2 rounded-lg bg-utama/95 py-1 text-center text-xs font-bold text-white shadow-md animate-fade-in">
            {notif}
          </div>
        )}
      </div>

      {/* Konten Kartu */}
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        {/* US-49: Kategori Tertaut */}
        <Link
          href={`/kategori/${encodeURIComponent(produk.kategori)}`}
          className="self-start text-xs font-medium text-teks-lembut hover:text-utama hover:underline"
        >
          {produk.kategori}
        </Link>

        <Link
          href={`/produk/${produk.id}`}
          onClick={() => catatTerakhirDilihat(produk)}
          className="font-semibold leading-snug text-teks group-hover:text-utama"
        >
          {produk.nama}
        </Link>

        {/* Harga */}
        <p className="mt-auto self-start rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
          {formatRupiah(produk.harga)}
        </p>

        {/* US-12: Pilihan Varian & Kuantitas */}
        <div className="mt-2 flex flex-col gap-2 border-t border-garis/60 pt-2.5">
          <div className="flex items-center justify-between gap-1 text-xs">
            <select
              value={varian}
              onChange={(e) => setVarian(e.target.value)}
              className="rounded border border-garis bg-permukaan px-1.5 py-1 text-[11px] text-teks focus:border-utama focus:outline-none"
            >
              <option value="Reguler">Reguler</option>
              <option value="Pedas/Spesial">Pedas/Spesial</option>
              <option value="Ekstra">Ekstra</option>
            </select>

            {/* Stepper Jumlah */}
            <div className="flex items-center rounded border border-garis bg-permukaan">
              <button
                type="button"
                onClick={() => setJumlah((j) => Math.max(1, j - 1))}
                className="flex h-6 w-6 items-center justify-center font-bold text-teks-lembut hover:text-teks"
              >
                -
              </button>
              <span className="px-1.5 text-xs font-bold">{jumlah}</span>
              <button
                type="button"
                onClick={() => setJumlah((j) => j + 1)}
                className="flex h-6 w-6 items-center justify-center font-bold text-teks-lembut hover:text-teks"
              >
                +
              </button>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={handleTambahKeranjang}
              className="flex-1 rounded-lg border border-utama bg-utama/10 py-1.5 text-center text-xs font-bold text-utama transition hover:bg-utama hover:text-white"
            >
              + Keranjang
            </button>
            <a
              href={urlWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              title="Pesan via WhatsApp dengan varian ini"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-utama text-sm font-bold text-white transition hover:bg-utama-gelap"
            >
              💬
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
