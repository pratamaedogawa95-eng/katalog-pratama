"use client";

import { useFormState } from "react-dom";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { simpanPengaturanToko } from "@/app/admin/actions";

const initialState = {};

export default function FormPengaturanToko({ pengaturan }) {
  const [state, formAction] = useFormState(simpanPengaturanToko, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      {state?.error && (
        <p className="rounded-xl bg-harga-latar px-4 py-3 text-sm text-bahaya">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-xl bg-utama/10 px-4 py-3 text-sm text-utama">{state.message}</p>
      )}

      <Input label="Nama toko" name="nama_toko" defaultValue={pengaturan.nama || pengaturan.nama_toko} required />
      <Input label="Tagline" name="tagline" defaultValue={pengaturan.tagline} placeholder="Slogan singkat toko..." />
      <Input
        label="Nomor WhatsApp (contoh: 6281234567890)"
        name="nomor_whatsapp"
        defaultValue={pengaturan.nomorWhatsApp || pengaturan.nomor_whatsapp}
        required
      />
      <Input label="Alamat" name="alamat" defaultValue={pengaturan.alamat} textarea />
      <Input label="Jam buka" name="jam_buka" defaultValue={pengaturan.jamBuka || pengaturan.jam_buka} placeholder="Senin–Sabtu, 08.00–17.00" />
      <Input label="Email toko" name="email" type="email" defaultValue={pengaturan.email} />

      <Tombol type="submit">Simpan pengaturan</Tombol>
    </form>
  );
}
