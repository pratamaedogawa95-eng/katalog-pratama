"use client";

import { useState } from "react";
import { moderasiUlasan } from "@/app/admin/actions";

export default function UlasanAdminList({ daftarUlasan: awal }) {
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(null);

  async function handle(id, aksi) {
    setLoading(`${aksi}-${id}`);
    const hasil = await moderasiUlasan(id, aksi);
    if (hasil?.error) {
      setPesan(`Gagal: ${hasil.error}`);
    } else {
      setPesan('Aksi berhasil. Muat ulang untuk melihat perubahan.');
    }
    setLoading(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {pesan && <p className="rounded-xl bg-utama/10 px-4 py-3 text-sm text-utama">{pesan}</p>}
      <div className="overflow-x-auto rounded-2xl border border-garis">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-permukaan text-teks-lembut">
            <tr>
              <th className="px-4 py-3 font-semibold">Produk</th>
              <th className="px-4 py-3 font-semibold">Nama</th>
              <th className="px-4 py-3 font-semibold">Rating</th>
              <th className="px-4 py-3 font-semibold">Komentar</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold"><span className="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody>
            {awal.map((u) => (
              <tr key={u.id} className="border-t border-garis">
                <td className="px-4 py-3 text-teks-lembut">{u.produk?.nama || u.produk_id}</td>
                <td className="px-4 py-3 font-medium">{u.nama_pengulas}</td>
                <td className="px-4 py-3">{'★'.repeat(u.rating)}{'☆'.repeat(5 - u.rating)}</td>
                <td className="px-4 py-3 max-w-xs truncate">{u.komentar}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    u.disetujui ? 'bg-utama/10 text-utama' : 'bg-permukaan text-teks-lembut'
                  }`}>
                    {u.disetujui ? 'Tampil' : 'Tersembunyi'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    {u.disetujui ? (
                      <button
                        onClick={() => handle(u.id, 'sembunyikan')}
                        disabled={loading === `sembunyikan-${u.id}`}
                        className="text-xs text-teks-lembut hover:text-utama disabled:opacity-30"
                      >
                        Sembunyikan
                      </button>
                    ) : (
                      <button
                        onClick={() => handle(u.id, 'tampilkan')}
                        disabled={loading === `tampilkan-${u.id}`}
                        className="text-xs text-teks-lembut hover:text-utama disabled:opacity-30"
                      >
                        Tampilkan
                      </button>
                    )}
                    <button
                      onClick={() => { if(confirm('Hapus ulasan ini?')) handle(u.id, 'hapus'); }}
                      disabled={loading === `hapus-${u.id}`}
                      className="text-xs text-bahaya hover:underline disabled:opacity-30"
                    >
                      Hapus
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
