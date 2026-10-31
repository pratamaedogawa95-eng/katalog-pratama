"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import { hapusProduk, toggleAktifProduk, naikUrutanProduk, turunUrutanProduk } from "@/app/admin/actions";

export default function TabelProdukAdmin({ daftarProduk }) {
  const [loading, setLoading] = useState(null);
  const [pesan, setPesan] = useState('');

  async function handleHapus(id, nama) {
    if (!confirm(`Hapus produk "${nama}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setLoading(`hapus-${id}`);
    const hasil = await hapusProduk(id);
    if (hasil?.error) {
      setPesan(`Gagal: ${hasil.error}`);
    }
    setLoading(null);
  }

  async function handleToggleAktif(id, aktif) {
    setLoading(`toggle-${id}`);
    const hasil = await toggleAktifProduk(id, aktif);
    if (hasil?.error) {
      setPesan(`Gagal: ${hasil.error}`);
    }
    setLoading(null);
  }

  async function handleNaik(id, urutan) {
    setLoading(`naik-${id}`);
    await naikUrutanProduk(id, urutan);
    setLoading(null);
  }

  async function handleTurun(id, urutan) {
    setLoading(`turun-${id}`);
    await turunUrutanProduk(id, urutan);
    setLoading(null);
  }

  if (!daftarProduk || daftarProduk.length === 0) {
    return <p className="text-teks-lembut">Belum ada produk.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {pesan && (
        <p className="rounded-xl bg-harga-latar px-4 py-3 text-sm text-bahaya">{pesan}</p>
      )}
      <div className="overflow-x-auto rounded-2xl border border-garis">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-permukaan text-teks-lembut">
            <tr>
              <th className="px-4 py-3 font-semibold">Urut</th>
              <th className="px-4 py-3 font-semibold">Produk</th>
              <th className="px-4 py-3 font-semibold">Kategori</th>
              <th className="px-4 py-3 font-semibold">Harga</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold"><span className="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody>
            {daftarProduk.map((produk) => (
              <tr key={produk.id} className={`border-t border-garis ${produk.aktif === false ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleNaik(produk.id, produk.urutan)}
                      disabled={loading === `naik-${produk.id}`}
                      className="text-teks-lembut hover:text-utama disabled:opacity-30 text-xs leading-none"
                      title="Naikkan urutan"
                    >
                      ▲
                    </button>
                    <span className="text-center text-xs">{produk.urutan ?? 0}</span>
                    <button
                      onClick={() => handleTurun(produk.id, produk.urutan)}
                      disabled={loading === `turun-${produk.id}`}
                      className="text-teks-lembut hover:text-utama disabled:opacity-30 text-xs leading-none"
                      title="Turunkan urutan"
                    >
                      ▼
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {produk.foto_url && (
                      <img
                        src={produk.foto_url}
                        alt=""
                        className="h-10 w-10 rounded-md object-cover flex-shrink-0"
                      />
                    )}
                    <span className="font-semibold">{produk.nama}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-teks-lembut">{produk.kategori || '-'}</td>
                <td className="px-4 py-3">{formatRupiah(produk.harga)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleAktif(produk.id, produk.aktif !== false)}
                    disabled={loading === `toggle-${produk.id}`}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      produk.aktif === false
                        ? 'bg-permukaan text-teks-lembut hover:bg-harga-latar'
                        : 'bg-utama/10 text-utama hover:bg-utama/20'
                    }`}
                  >
                    {produk.aktif === false ? 'Nonaktif' : 'Aktif'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                      Ubah
                    </Tombol>
                    <button
                      onClick={() => handleHapus(produk.id, produk.nama)}
                      disabled={loading === `hapus-${produk.id}`}
                      className="rounded-xl border border-bahaya/30 px-3 py-1 text-sm font-semibold text-bahaya hover:bg-bahaya hover:text-white disabled:opacity-30 transition-colors"
                    >
                      {loading === `hapus-${produk.id}` ? 'Menghapus...' : 'Hapus'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
