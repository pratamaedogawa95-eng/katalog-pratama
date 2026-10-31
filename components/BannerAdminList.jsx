"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { simpanBanner, hapusBanner, toggleAktifBanner } from "@/app/admin/actions";

const initialState = {};

export default function BannerAdminList({ daftarBanner: awal }) {
  const [state, formAction] = useFormState(simpanBanner, initialState);
  const [pesan, setPesan] = useState('');

  async function handleHapus(id) {
    if (!confirm('Hapus banner ini?')) return;
    const hasil = await hapusBanner(id);
    if (hasil?.error) setPesan(`Gagal: ${hasil.error}`);
    else setPesan('Banner dihapus.');
  }

  async function handleToggle(id, aktif) {
    const hasil = await toggleAktifBanner(id, aktif);
    if (hasil?.error) setPesan(`Gagal: ${hasil.error}`);
  }

  return (
    <div className="flex flex-col gap-8">
      {pesan && <p className="rounded-xl bg-utama/10 px-4 py-3 text-sm text-utama">{pesan}</p>}
      {state?.error && <p className="rounded-xl bg-harga-latar px-4 py-3 text-sm text-bahaya">{state.error}</p>}
      {state?.success && <p className="rounded-xl bg-utama/10 px-4 py-3 text-sm text-utama">Banner berhasil disimpan.</p>}

      {/* Daftar banner */}
      <div>
        <h2 className="mb-3 text-lg font-bold">Daftar banner</h2>
        {awal.length === 0 ? (
          <p className="text-teks-lembut">Belum ada banner.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {awal.map((b) => (
              <div key={b.id} className="flex items-center gap-4 rounded-2xl border border-garis p-4">
                {b.foto_url && (
                  <img src={b.foto_url} alt="" className="h-16 w-24 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{b.judul}</p>
                  <p className="text-sm text-teks-lembut truncate">{b.teks}</p>
                  {b.tautan && <p className="text-xs text-utama truncate">{b.tautan}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggle(b.id, b.aktif)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      b.aktif ? 'bg-utama/10 text-utama' : 'bg-permukaan text-teks-lembut'
                    }`}
                  >
                    {b.aktif ? 'Aktif' : 'Nonaktif'}
                  </button>
                  <button
                    onClick={() => handleHapus(b.id)}
                    className="text-xs text-bahaya hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form tambah banner */}
      <div className="max-w-xl">
        <h2 className="mb-3 text-lg font-bold">Tambah banner baru</h2>
        <form action={formAction} className="flex flex-col gap-4" encType="multipart/form-data">
          <Input label="Judul banner" name="judul" required />
          <Input label="Teks" name="teks" textarea />
          <Input label="Tautan (URL tujuan klik)" name="tautan" placeholder="https://..." />
          <div>
            <label className="text-sm font-semibold text-teks">Foto banner</label>
            <input
              type="file"
              name="foto_file"
              accept="image/*"
              className="mt-1 w-full text-sm text-teks-lembut file:mr-3 file:rounded-lg file:border-0 file:bg-permukaan file:px-3 file:py-1.5 file:text-sm file:font-semibold"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="aktif" id="aktif-banner" defaultChecked className="rounded" />
            <label htmlFor="aktif-banner" className="text-sm text-teks">Aktifkan langsung</label>
          </div>
          <Tombol type="submit">Tambah banner</Tombol>
        </form>
      </div>
    </div>
  );
}
