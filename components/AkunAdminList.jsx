"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { tambahAdmin, hapusAdmin } from "@/app/admin/actions";

const initialState = {};

export default function AkunAdminList({ daftarAdmin, userSayaId }) {
  const [state, formAction] = useFormState(tambahAdmin, initialState);
  const [pesan, setPesan] = useState('');

  async function handleHapus(userId, email) {
    if (!confirm(`Hapus admin "${email}"?`)) return;
    const hasil = await hapusAdmin(userId);
    if (hasil?.error) {
      setPesan(`Gagal: ${hasil.error}`);
    } else {
      setPesan('Admin berhasil dihapus. Muat ulang halaman untuk melihat perubahan.');
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {pesan && <p className="rounded-xl bg-utama/10 px-4 py-3 text-sm text-utama">{pesan}</p>}

      {/* Daftar admin */}
      <div>
        <h2 className="mb-3 text-lg font-bold">Daftar admin</h2>
        <div className="overflow-x-auto rounded-2xl border border-garis">
          <table className="w-full text-left text-sm">
            <thead className="bg-permukaan text-teks-lembut">
              <tr>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Dibuat</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold"><span className="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody>
              {daftarAdmin.map((admin) => (
                <tr key={admin.id} className="border-t border-garis">
                  <td className="px-4 py-3 font-medium">
                    {admin.email}
                    {admin.id === userSayaId && (
                      <span className="ml-2 rounded-full bg-utama/10 px-2 py-0.5 text-xs text-utama">Anda</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-teks-lembut">
                    {new Date(admin.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      admin.banned_until ? 'bg-permukaan text-teks-lembut' : 'bg-utama/10 text-utama'
                    }`}>
                      {admin.banned_until ? 'Dinonaktifkan' : 'Aktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {admin.id !== userSayaId && (
                      <button
                        onClick={() => handleHapus(admin.id, admin.email)}
                        className="text-xs text-bahaya hover:underline"
                      >
                        Hapus
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form tambah admin */}
      <div className="max-w-md">
        <h2 className="mb-3 text-lg font-bold">Tambah admin baru</h2>
        {state?.error && (
          <p className="mb-3 rounded-xl bg-harga-latar px-4 py-3 text-sm text-bahaya">{state.error}</p>
        )}
        {state?.success && (
          <p className="mb-3 rounded-xl bg-utama/10 px-4 py-3 text-sm text-utama">Admin baru berhasil ditambahkan.</p>
        )}
        <form action={formAction} className="flex flex-col gap-4">
          <Input label="Email" name="email" type="email" required />
          <Input label="Password sementara (min. 8 karakter)" name="password" type="password" required />
          <Tombol type="submit">Tambah admin</Tombol>
        </form>
      </div>
    </div>
  );
}
