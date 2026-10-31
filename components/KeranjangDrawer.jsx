"use client";

import {
  getKeranjang,
  updateJumlahKeranjang,
  hapusDariKeranjang,
  useKatalogSync,
} from "@/lib/klien-state";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

export default function KeranjangDrawer({ onClose }) {
  useKatalogSync();
  const items = getKeranjang();

  const totalHarga = items.reduce(
    (sum, item) => sum + item.harga * item.jumlah,
    0
  );

  const buatPesanWhatsApp = () => {
    let teks = `Halo ${toko.nama}, saya ingin memesan:\n`;
    items.forEach((item, idx) => {
      const subtotal = item.harga * item.jumlah;
      const infoVarian = item.varian && item.varian !== "Reguler" ? ` [${item.varian}]` : "";
      teks += `${idx + 1}. ${item.nama}${infoVarian} x${item.jumlah} = ${formatRupiah(subtotal)}\n`;
    });
    teks += `\nTotal Belanja: ${formatRupiah(totalHarga)}`;
    teks += `\nAlamat pengiriman: `;

    return `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(teks)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity">
      <div className="relative flex h-full w-full max-w-md flex-col bg-latar shadow-2xl">
        {/* Header Drawer */}
        <div className="flex items-center justify-between border-b border-garis px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h2 className="text-lg font-bold">Keranjang Belanja</h2>
            <span className="rounded-full bg-permukaan px-2 py-0.5 text-xs font-semibold text-teks-lembut">
              {items.length} item
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-permukaan text-teks-lembut hover:text-teks"
            aria-label="Tutup keranjang"
          >
            ✕
          </button>
        </div>

        {/* Daftar Item */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-teks-lembut">
              <span className="text-4xl">🧺</span>
              <p className="font-medium">Keranjang belanja masih kosong</p>
              <p className="text-xs">Pilih produk dan tambahkan ke keranjang untuk memesan sekaligus.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-garis">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.varian}`}
                  className="flex items-center gap-3 py-3"
                >
                  <img
                    src={item.foto_url}
                    alt={item.nama}
                    className="h-16 w-16 rounded-lg border border-garis bg-permukaan object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <h3 className="text-sm font-bold leading-tight">{item.nama}</h3>
                    {item.varian && (
                      <span className="text-[11px] text-teks-lembut">
                        Varian: {item.varian}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-harga">
                      {formatRupiah(item.harga)}
                    </span>

                    {/* Stepper Jumlah */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded border border-garis">
                        <button
                          type="button"
                          onClick={() =>
                            updateJumlahKeranjang(
                              item.id,
                              item.varian,
                              item.jumlah - 1
                            )
                          }
                          className="flex h-6 w-6 items-center justify-center text-xs hover:bg-permukaan"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold">{item.jumlah}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateJumlahKeranjang(
                              item.id,
                              item.varian,
                              item.jumlah + 1
                            )
                          }
                          className="flex h-6 w-6 items-center justify-center text-xs hover:bg-permukaan"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => hapusDariKeranjang(item.id, item.varian)}
                        className="text-xs text-bahaya hover:underline"
                      >
                        Hapus
                      </button>

                      <span className="ml-auto text-xs font-bold text-teks">
                        {formatRupiah(item.harga * item.jumlah)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Drawer */}
        {items.length > 0 && (
          <div className="border-t border-garis bg-permukaan/50 p-5">
            <div className="mb-4 flex items-center justify-between text-base">
              <span className="text-teks-lembut">Total Tagihan:</span>
              <span className="text-lg font-extrabold text-harga">
                {formatRupiah(totalHarga)}
              </span>
            </div>

            <a
              href={buatPesanWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-utama py-3 font-semibold text-white shadow transition hover:bg-utama-gelap"
            >
              <span>Pesan Semua via WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

