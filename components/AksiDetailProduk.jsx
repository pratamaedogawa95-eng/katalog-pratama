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
import { catatKlikWhatsApp } from "@/app/produk/actions";

export default function AksiDetailProduk({ produk }) {
  useKatalogSync();

  // US-48: Varian ukuran dengan penyesuaian harga
  const daftarUkuran = [
    { nama: "Reguler (250 g)", ekstraHarga: 0 },
    { nama: "Besar (500 g)", ekstraHarga: Math.round(produk.harga * 0.7) },
    { nama: "Family Pack (1 kg)", ekstraHarga: Math.round(produk.harga * 1.5) },
  ];

  const [ukuranTerpilih, setUkuranTerpilih] = useState(daftarUkuran[0]);
  const [varianRasa, setVarianRasa] = useState("Original");
  const [jumlah, setJumlah] = useState(1);
  const [notif, setNotif] = useState(null);
  const [linkDisalin, setLinkDisalin] = useState(false);

  // US-19: Status Stok (default tersedia)
  const isStokHabis = produk.stok === 0;

  // US-20: Harga Coret & Badge Promo
  const hargaSatuan = produk.harga + ukuranTerpilih.ekstraHarga;
  const hargaCoret = Math.round(hargaSatuan * 1.2); // Contoh harga normal sebelum promo
  const subtotal = hargaSatuan * jumlah;

  const favoritList = getFavorit();
  const isFavorit = favoritList.includes(String(produk.id));

  const bandingkanList = getBandingkan();
  const isBandingkan = bandingkanList.some((p) => String(p.id) === String(produk.id));

  const showNotif = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 2500);
  };

  // US-23: Salin / Bagikan Link Produk
  const handleSalinLink = async () => {
    try {
      if (typeof window !== "undefined") {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
          setLinkDisalin(true);
          showNotif("Link produk berhasil disalin! 📋");
          setTimeout(() => setLinkDisalin(false), 2000);
        } else if (navigator.share) {
          await navigator.share({
            title: produk.nama,
            text: `Lihat produk ${produk.nama} di ${toko.nama}`,
            url: window.location.href,
          });
        }
      }
    } catch {
      showNotif("Gagal menyalin link.");
    }
  };

  // US-21: Tambah ke Keranjang
  const handleTambahKeranjang = () => {
    const itemData = {
      ...produk,
      harga: hargaSatuan,
    };
    const namaVarian = `${ukuranTerpilih.nama} - ${varianRasa}`;
    tambahKeKeranjang(itemData, jumlah, namaVarian);
    showNotif("Masuk keranjang belanja! 🛒");
  };

  // US-40: Catat Klik WhatsApp di latar belakang
  const handleKlikWhatsApp = () => {
    catatKlikWhatsApp(produk.id);
  };

  // US-12 & US-48: Format Pesan WhatsApp
  const pesanWhatsApp = `Halo ${toko.nama}, saya ingin memesan:\nProduk: ${produk.nama}\nUkuran: ${ukuranTerpilih.nama}\nVarian: ${varianRasa}\nJumlah: ${jumlah} pcs\nTotal: ${formatRupiah(subtotal)}`;
  const linkWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesanWhatsApp)}`;

  return (
    <div className="flex flex-col gap-4 border-t border-garis pt-4">
      {/* US-20: Badge & US-19: Status Stok */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-utama px-2.5 py-0.5 text-xs font-bold text-white uppercase">
          Terlaris
        </span>
        <span className="rounded-md bg-harga-latar px-2.5 py-0.5 text-xs font-bold text-harga">
          Hemat 20%
        </span>
        <span
          className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${
            isStokHabis
              ? "bg-bahaya/20 text-bahaya"
              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
          }`}
        >
          {isStokHabis ? "Stok Habis" : "Ready Stock"}
        </span>
      </div>

      {/* US-20 & US-48: Tampilan Harga Dinamis & Harga Coret */}
      <div className="flex items-baseline gap-3">
        <span className="rounded-md bg-harga-latar px-3 py-1 text-2xl font-black text-harga">
          {formatRupiah(hargaSatuan)}
        </span>
        <span className="text-sm font-semibold text-teks-lembut line-through">
          {formatRupiah(hargaCoret)}
        </span>
      </div>

      {/* US-48: Pilihan Varian Ukuran */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-teks">Pilih Ukuran / Kemasan:</label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {daftarUkuran.map((u) => (
            <button
              key={u.nama}
              type="button"
              onClick={() => setUkuranTerpilih(u)}
              className={`rounded-xl border p-2.5 text-left text-xs transition ${
                ukuranTerpilih.nama === u.nama
                  ? "border-utama bg-utama/10 font-bold text-utama"
                  : "border-garis bg-latar text-teks hover:border-utama"
              }`}
            >
              <div>{u.nama}</div>
              <div className="mt-1 text-[11px] font-semibold text-harga">
                {formatRupiah(produk.harga + u.ekstraHarga)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Varian Rasa & Stepper Jumlah */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex flex-col gap-1 text-xs font-semibold text-teks-lembut">
          Varian Rasa:
          <select
            value={varianRasa}
            onChange={(e) => setVarianRasa(e.target.value)}
            className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
          >
            <option value="Original">Original</option>
            <option value="Pedas Manis">Pedas Manis</option>
            <option value="Balado Gurih">Balado Gurih</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-teks-lembut">
          Jumlah:
          <div className="flex items-center rounded-lg border border-garis bg-latar">
            <button
              type="button"
              disabled={isStokHabis}
              onClick={() => setJumlah((j) => Math.max(1, j - 1))}
              className="flex h-9 w-9 items-center justify-center font-bold text-teks hover:bg-permukaan disabled:opacity-40"
            >
              -
            </button>
            <span className="w-10 text-center text-sm font-bold">{jumlah}</span>
            <button
              type="button"
              disabled={isStokHabis}
              onClick={() => setJumlah((j) => j + 1)}
              className="flex h-9 w-9 items-center justify-center font-bold text-teks hover:bg-permukaan disabled:opacity-40"
            >
              +
            </button>
          </div>
        </label>

        <div className="ml-auto text-right">
          <span className="block text-xs text-teks-lembut">Total Pemesanan:</span>
          <span className="text-lg font-black text-harga">
            {formatRupiah(subtotal)}
          </span>
        </div>
      </div>

      {notif && (
        <div className="rounded-lg bg-utama/10 p-3 text-sm font-bold text-utama">
          {notif}
        </div>
      )}

      {/* Tombol Aksi Utama */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={isStokHabis}
          onClick={handleTambahKeranjang}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-utama bg-utama/10 px-5 py-3 font-bold text-utama transition hover:bg-utama hover:text-white disabled:opacity-40"
        >
          <span>🛒</span>
          <span>Tambah ke Keranjang</span>
        </button>

        {isStokHabis ? (
          <button
            type="button"
            disabled
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-garis px-5 py-3 font-bold text-teks-lembut cursor-not-allowed"
          >
            Stok Sedang Habis
          </button>
        ) : (
          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleKlikWhatsApp}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-utama px-5 py-3 font-bold text-white shadow-xs transition hover:bg-utama-gelap"
          >
            <span>💬</span>
            <span>Pesan via WhatsApp</span>
          </a>
        )}
      </div>

      {/* Fitur Tambahan: Salin Link, Favorit, Bandingkan */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-garis/60">
        {/* US-23: Salin Link */}
        <button
          type="button"
          onClick={handleSalinLink}
          className="flex items-center gap-1.5 rounded-lg border border-garis bg-latar px-3 py-1.5 text-xs font-semibold hover:border-utama hover:text-utama"
        >
          <span>{linkDisalin ? "✅" : "🔗"}</span>
          <span>{linkDisalin ? "Link Tersalin!" : "Bagikan / Salin Link"}</span>
        </button>

        {/* Favorit */}
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
          <span>{isFavorit ? "Favorit Anda" : "Favorit"}</span>
        </button>

        {/* Bandingkan */}
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
          <span>{isBandingkan ? "Dalam Perbandingan" : "Bandingkan"}</span>
        </button>
      </div>
    </div>
  );
}
