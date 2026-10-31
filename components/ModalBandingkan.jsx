"use client";

import { getBandingkan, toggleBandingkan, useKatalogSync } from "@/lib/klien-state";
import { formatRupiah } from "@/lib/format";
import Link from "next/link";

export default function ModalBandingkan({ onClose }) {
  useKatalogSync();
  const list = getBandingkan();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-garis bg-latar shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-garis px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <h2 className="text-lg font-bold">Bandingkan Produk ({list.length}/2)</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-permukaan text-teks-lembut hover:text-teks"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {list.length === 0 ? (
            <div className="py-12 text-center text-teks-lembut">
              <p>Belum ada produk yang dipilih untuk dibandingkan.</p>
              <p className="mt-1 text-xs">Pilih tombol "Bandingkan" pada kartu produk.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {list.map((produk) => (
                <div
                  key={produk.id}
                  className="relative flex flex-col rounded-xl border border-garis bg-permukaan/40 p-4"
                >
                  <button
                    type="button"
                    onClick={() => toggleBandingkan(produk)}
                    className="absolute right-3 top-3 rounded-full bg-latar p-1 text-xs text-bahaya shadow-xs hover:bg-permukaan"
                    title="Hapus dari perbandingan"
                  >
                    ✕ Hapus
                  </button>

                  <img
                    src={produk.foto_url}
                    alt={produk.nama}
                    className="aspect-square w-full rounded-lg border border-garis bg-permukaan object-cover"
                  />

                  <div className="mt-4 flex flex-1 flex-col gap-2">
                    <span className="text-xs font-semibold text-teks-lembut">
                      {produk.kategori}
                    </span>
                    <h3 className="text-lg font-bold leading-tight">{produk.nama}</h3>
                    <div className="self-start rounded-md bg-harga-latar px-2.5 py-1 text-base font-bold text-harga">
                      {formatRupiah(produk.harga)}
                    </div>

                    <div className="mt-3 border-t border-garis pt-3">
                      <p className="text-xs font-bold text-teks-lembut">Deskripsi:</p>
                      <p className="mt-1 text-xs leading-relaxed text-teks">
                        {produk.deskripsi || "Tidak ada deskripsi detail."}
                      </p>
                    </div>

                    <Link
                      href={`/produk/${produk.id}`}
                      onClick={onClose}
                      className="mt-auto block rounded-lg border border-garis bg-latar py-2 text-center text-xs font-semibold hover:border-utama hover:text-utama"
                    >
                      Buka Detail Produk
                    </Link>
                  </div>
                </div>
              ))}

              {list.length === 1 && (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-garis p-8 text-center text-teks-lembut">
                  <span className="text-3xl">➕</span>
                  <p className="mt-2 text-sm font-semibold">Pilih 1 produk lagi</p>
                  <p className="text-xs">Klik tombol "Bandingkan" pada kartu produk lain untuk melihat perbandingan berdampingan.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

