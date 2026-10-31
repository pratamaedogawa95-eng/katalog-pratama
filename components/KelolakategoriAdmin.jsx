"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import Tombol from "@/components/Tombol";
import Input from "@/components/Input";
import { tambahKategori, ubahKategori, hapusKategori } from "@/app/admin/actions";

const initialState = {};

export default function KelolakategoriAdmin({ daftarKategori: awalKategori }) {
  const [editId, setEditId] = useState(null);
  const [editNama, setEditNama] = useState('');
  const [pesan, setPesan] = useState('');
  const [pesanError, setPesanError] = useState('');
  const [namaBaru, setNamaBaru] = useState('');

  async function handleTambah(e) {
    e.preventDefault();
    if (!namaBaru.trim()) return;
    const hasil = await tambahKategori(namaBaru.trim());
    if (hasil?.error) {
      setPesanError(hasil.error);
    } else {
      setPesan('Kategori berhasil ditambahkan. Muat ulang halaman untuk melihat perubahan.');
      setNamaBaru('');
    }
  }

  async function handleUbah(id, namaLama) {
    if (!editNama.trim()) return;
    const hasil = await ubahKategori(id, editNama.trim(), namaLama);
    if (hasil?.error) {
      setPesanError(hasil.error);
    } else {
      setPesan('Kategori berhasil diubah.');
      setEditId(null);
    }
  }

  async function handleHapus(id, nama) {
    if (!confirm(`Hapus kategori "${nama}"?`)) return;
    const hasil = await hapusKategori(id, nama);
    if (hasil?.error) {
      setPesanError(hasil.error);
    } else {
      setPesan('Kategori berhasil dihapus.');
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {pesan && <p className="rounded-xl bg-utama/10 px-4 py-3 text-sm text-utama">{pesan}</p>}
      {pesanError && <p className="rounded-xl bg-harga-latar px-4 py-3 text-sm text-bahaya">{pesanError}</p>}

      {/* Form tambah */}
      <form onSubmit={handleTambah} className="flex gap-2 max-w-md">
        <input
          type="text"
          value={namaBaru}
          onChange={(e) => setNamaBaru(e.target.value)}
          placeholder="Nama kategori baru..."
          className="flex-1 rounded-xl border border-garis bg-latar px-4 py-2 text-sm text-teks placeholder:text-teks-lembut focus:outline-none focus:ring-2 focus:ring-utama"
        />
        <Tombol type="submit">Tambah</Tombol>
      </form>

      {/* Daftar kategori */}
      {awalKategori.length === 0 ? (
        <p className="text-teks-lembut">Belum ada kategori.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-garis">
          <table className="w-full text-left text-sm">
            <thead className="bg-permukaan text-teks-lembut">
              <tr>
                <th className="px-4 py-3 font-semibold">Nama kategori</th>
                <th className="px-4 py-3 font-semibold"><span className="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody>
              {awalKategori.map((kat) => (
                <tr key={kat.id} className="border-t border-garis">
                  <td className="px-4 py-3">
                    {editId === kat.id ? (
                      <input
                        type="text"
                        value={editNama}
                        onChange={(e) => setEditNama(e.target.value)}
                        className="rounded-lg border border-garis bg-latar px-3 py-1 text-sm text-teks focus:outline-none focus:ring-2 focus:ring-utama"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium">{kat.nama}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {editId === kat.id ? (
                        <>
                          <Tombol type="button" onClick={() => handleUbah(kat.id, kat.nama)}>Simpan</Tombol>
                          <Tombol type="button" varian="garis" onClick={() => setEditId(null)}>Batal</Tombol>
                        </>
                      ) : (
                        <>
                          <Tombol
                            type="button"
                            varian="garis"
                            onClick={() => { setEditId(kat.id); setEditNama(kat.nama); }}
                          >
                            Ubah
                          </Tombol>
                          <button
                            onClick={() => handleHapus(kat.id, kat.nama)}
                            className="rounded-xl border border-bahaya/30 px-3 py-1 text-sm font-semibold text-bahaya hover:bg-bahaya hover:text-white transition-colors"
                          >
                            Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
