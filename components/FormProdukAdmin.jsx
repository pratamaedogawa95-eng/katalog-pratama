"use client";

import { useState, useRef } from "react";
import { useFormState } from "react-dom";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { tambahProduk, ubahProduk, generateDeskripsiAI } from "@/app/admin/actions";

const initialState = {};

export default function FormProdukAdmin({ mode = "tambah", produk = {} }) {
  const action = mode === "ubah" ? ubahProduk : tambahProduk;
  const [state, formAction] = useFormState(action, initialState);
  const [preview, setPreview] = useState(null);
  const [genLoading, setGenLoading] = useState(false);
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [nama, setNama] = useState(produk.nama || "");
  const [kategori, setKategori] = useState(produk.kategori || "");
  const fileRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) { setPreview(null); return; }
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diperbolehkan.');
      e.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2 MB.');
      e.target.value = '';
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function handleGenDeskripsi() {
    if (!nama) {
      alert('Isi nama produk terlebih dahulu.');
      return;
    }
    setGenLoading(true);
    const hasil = await generateDeskripsiAI({ nama, kategori });
    if (hasil.success) {
      setDeskripsi(hasil.deskripsi);
    } else {
      alert(hasil.error || 'Gagal membuat deskripsi.');
    }
    setGenLoading(false);
  }

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5" encType="multipart/form-data">
      {mode === "ubah" && <input type="hidden" name="id" value={produk.id} />}

      {state?.error && (
        <p className="rounded-xl bg-harga-latar px-4 py-3 text-sm text-bahaya">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-xl bg-utama/10 px-4 py-3 text-sm text-utama">Produk berhasil disimpan.</p>
      )}

      {/* Nama */}
      <div>
        <Input
          label="Nama produk"
          name="nama"
          defaultValue={produk.nama}
          required
          onChange={(e) => setNama(e.target.value)}
        />
        {state?.errors?.nama && (
          <p className="mt-1 text-xs text-bahaya">{state.errors.nama}</p>
        )}
      </div>

      {/* Harga */}
      <div>
        <Input
          label="Harga (Rp)"
          name="harga"
          type="number"
          min="0"
          defaultValue={produk.harga}
          required
        />
        {state?.errors?.harga && (
          <p className="mt-1 text-xs text-bahaya">{state.errors.harga}</p>
        )}
      </div>

      {/* Stok */}
      <Input
        label="Stok"
        name="stok"
        type="number"
        min="0"
        defaultValue={produk.stok ?? 10}
      />

      {/* Kategori */}
      <Input
        label="Kategori"
        name="kategori"
        defaultValue={produk.kategori}
        onChange={(e) => setKategori(e.target.value)}
      />

      {/* Foto upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-teks">
          Foto produk (unggah file)
        </label>
        <input
          ref={fileRef}
          type="file"
          name="foto_file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm text-teks-lembut file:mr-3 file:rounded-lg file:border-0 file:bg-permukaan file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-teks hover:file:bg-garis"
        />
        {preview && (
          <img src={preview} alt="Preview" className="h-32 w-32 rounded-xl object-cover border border-garis" />
        )}
        {!preview && produk.foto_url && (
          <img src={produk.foto_url} alt="Foto saat ini" className="h-32 w-32 rounded-xl object-cover border border-garis opacity-70" />
        )}
        <p className="text-xs text-teks-lembut">Atau isi URL foto di bawah (jika tidak unggah file)</p>
        <Input
          label="URL foto"
          name="foto_url"
          placeholder="https://... atau /produk/nama-file.jpg"
          defaultValue={produk.foto_url}
        />
      </div>

      {/* Deskripsi */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-teks">Deskripsi</label>
          <button
            type="button"
            onClick={handleGenDeskripsi}
            disabled={genLoading}
            className="rounded-lg border border-garis px-3 py-1 text-xs text-teks-lembut hover:text-utama hover:border-utama disabled:opacity-50"
          >
            {genLoading ? 'Membuat...' : '✦ Buat deskripsi otomatis'}
          </button>
        </div>
        <textarea
          name="deskripsi"
          rows={5}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full rounded-xl border border-garis bg-latar px-4 py-3 text-sm text-teks placeholder:text-teks-lembut focus:outline-none focus:ring-2 focus:ring-utama"
          placeholder="Deskripsi produk..."
        />
      </div>

      <div className="flex gap-3">
        <Tombol type="submit">
          {mode === "ubah" ? "Simpan perubahan" : "Simpan produk"}
        </Tombol>
        <Tombol href="/admin/produk" varian="garis">Batal</Tombol>
      </div>
    </form>
  );
}
