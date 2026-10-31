"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";

export default function BannerPromo() {
  const [tampil, setTampil] = useState(true);

  if (!tampil) return null;

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-utama/20 bg-linear-to-r from-utama/10 via-permukaan to-utama/5 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl sm:text-3xl">🎉</span>
          <div>
            <div className="inline-block rounded-md bg-utama px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase text-white">
              Promo Spesial Hari Ini
            </div>
            <h3 className="mt-1 text-base font-bold text-teks sm:text-lg">
              Pesan Lebih Mudah & Hemat Langsung via WhatsApp!
            </h3>
            <p className="text-xs text-teks-lembut sm:text-sm">
              Gunakan fitur Keranjang Belanja untuk memesan beberapa varian sekaligus tanpa perlu chat berulang-ulang.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <a
            href={`https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent("Halo " + toko.nama + ", saya ingin tanya promo produk hari ini.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-utama px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-utama-gelap"
          >
            Tanya Promo
          </a>
          <button
            type="button"
            onClick={() => setTampil(false)}
            className="rounded-lg p-1 text-teks-lembut hover:bg-permukaan hover:text-teks"
            aria-label="Tutup banner promo"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

