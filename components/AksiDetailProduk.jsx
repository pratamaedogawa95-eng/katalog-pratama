"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";
import {
  tambahKeKeranjang,
  toggleFavorit,
  getFavorit,
  toggleBandingkan,
  getBandingkan,
  useKatalogSync,
} from "@/lib/klien-state";

export default function AksiDetailProduk({ produk }) {
  useKatalogSync();
  const [jumlah, setJumlah] = useState(1);
  const [varian, setVarian] = useState("Reguler");
  const [notif, setNotif] = useState(null);

  const favoritList = getFavorit();
  const isFavorit = favoritList.includes(String(produk.id));

  const bandingkanList = getBandingkan();
  const isBandingkan = bandingkanList.some((p) => String(p.id) === String(produk.id));

  const showNotif = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 2500);
  };

  const handleTambahKeranjang = () => {
    tambahKeKeranjang(produk, jumlah, varian);
    showNotif("Produk berhasil ditambahkan ke keranjang! 🛒");
  };

  // Link WhatsApp lengkap dengan jumlah & varian (US-12)
  const pesanWhatsApp = `Halo ${toko.nama}, saya ingin memesan ${produk.nama} [Varian: ${varian}] sejumlah ${jumlah} pcs seharga total ${formatRupiah(produk.harga * jumlah)}.`;
  const linkWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesanWhatsApp)}`;

  return (
    <div className="flex flex-col gap-4 border-t border-garis pt-4">
      {/* Varian & Kuantitas */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex flex-col gap-1 text-xs font-semibold text-teks-lembut">
          Pilih Varian:
          <select
            value={varian}
            onChange={(e) => setVarian(e.target.value)}
            className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
          >
            <option value="Reguler">Reguler</option>
            <option value="Pedas/Spesial">Pedas/Spesial</option>
            <option value="Ekstra">Ekstra</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-teks-lembut">
          Jumlah:
          <div className="flex items-center rounded-lg border border-garis bg-latar">
            <button
              type="button"
              onClick={() => setJumlah((j) => Math.max(1, j - 1))}
              className="flex h-9 w-9 items-center justify-center font-bold text-teks hover:bg-permukaan"
            >
              -
            </button>
            <span className="w-10 text-center text-sm font-bold">{jumlah}</span>
            <button
              type="button"
              onClick={() => setJumlah((j) => j + 1)}
              className="flex h-9 w-9 items-center justify-center font-bold text-teks hover:bg-permukaan"
            >
              +
            </button>
          </div>
        </label>
      </div>

      {/* Subtotal */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-teks-lembut">Subtotal ({jumlah} item):</span>
        <span className="text-base font-extrabold text-harga">
          {formatRupiah(produk.harga * jumlah)}
        </span>
      </div>

      {notif && (
        <div className="rounded-lg bg-utama/10 p-3 text-sm font-semibold text-utama">
          {notif}
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleTambahKeranjang}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-utama bg-utama/10 px-5 py-3 font-semibold text-utama transition hover:bg-utama hover:text-white"
        >
          <span>🛒</span>
          <span>Tambah ke Keranjang</span>
        </button>

        <a
          href={linkWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white shadow-xs transition hover:bg-utama-gelap"
        >
          Pesan via WhatsApp
        </a>
      </div>

      {/* Favorit & Bandingkan */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => toggleFavorit(produk.id)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
            isFavorit
              ? "border-bahaya bg-bahaya/10 text-bahaya"
              : "border-garis bg-latar text-teks hover:border-bahaya"
          }`}
        >
          <span>{isFavorit ? "❤️" : "🤍"}</span>
          <span>{isFavorit ? "Favorit Anda" : "Tambah ke Favorit"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const { statusMessage } = toggleBandingkan(produk);
            if (statusMessage) showNotif(statusMessage);
          }}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
            isBandingkan
              ? "border-utama bg-utama/10 text-utama"
              : "border-garis bg-latar text-teks hover:border-utama"
          }`}
        >
          <span>⚖️</span>
          <span>{isBandingkan ? "Dalam Perbandingan" : "Bandingkan Produk"}</span>
        </button>
      </div>
    </div>
  );
}

