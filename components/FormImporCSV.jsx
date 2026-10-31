"use client";

import { useActionState, useRef } from "react";
import Tombol from "@/components/Tombol";
import { imporProdukCSV } from "@/app/admin/actions";

export default function FormImporCSV() {
  const [state, formAction, isPending] = useActionState(imporProdukCSV, null);
  const fileInputRef = useRef(null);

  function unduhContoh() {
    const csvContent =
      "nama,harga,kategori,deskripsi,stok,foto_url\n" +
      '"Keripik Singkong Renyah",15000,"Makanan Ringan","Keripik singkong gurih khas Malang",25,"/produk/keripik.jpg"\n' +
      '"Kopi Robusta Dampit",35000,"Minuman","Kopi bubuk premium aroma kuat",15,"/produk/kopi.jpg"';
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "contoh-format-produk.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Template Download */}
      <div className="rounded-xl border border-garis bg-permukaan p-4 sm:p-5">
        <h2 className="text-sm font-bold text-teks">Format File CSV yang Didukung</h2>
        <p className="mt-1 text-xs text-teks-lembut">
          Header kolom yang wajib ada: <code className="rounded bg-latar px-1.5 py-0.5 text-utama">nama</code> dan{" "}
          <code className="rounded bg-latar px-1.5 py-0.5 text-utama">harga</code>. Kolom opsional:{" "}
          <code className="rounded bg-latar px-1.5 py-0.5">kategori</code>,{" "}
          <code className="rounded bg-latar px-1.5 py-0.5">deskripsi</code>,{" "}
          <code className="rounded bg-latar px-1.5 py-0.5">stok</code>, dan{" "}
          <code className="rounded bg-latar px-1.5 py-0.5">foto_url</code>.
        </p>
        <button
          type="button"
          onClick={unduhContoh}
          className="mt-3 text-xs font-semibold text-utama hover:underline"
        >
          📥 Unduh contoh template CSV
        </button>
      </div>

      {/* Form Upload */}
      <form action={formAction} className="flex max-w-xl flex-col gap-4">
        {state?.error && (
          <p className="rounded-xl bg-harga-latar p-4 text-sm text-bahaya">
            {state.error}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-teks">
            Pilih file CSV
          </label>
          <input
            ref={fileInputRef}
            type="file"
            name="file_csv"
            accept=".csv,text/csv"
            required
            className="w-full text-sm text-teks-lembut file:mr-3 file:rounded-lg file:border-0 file:bg-permukaan file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teks hover:file:bg-garis"
          />
        </div>

        <Tombol type="submit" disabled={isPending} className="self-start">
          {isPending ? "Memproses Impor..." : "Unggah & Impor Produk"}
        </Tombol>
      </form>

      {/* Ringkasan Hasil Impor */}
      {state?.success && (
        <div className="rounded-2xl border border-garis bg-permukaan p-5">
          <h2 className="text-base font-bold text-teks">Ringkasan Hasil Impor</h2>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-garis bg-latar p-3 text-center">
              <p className="text-xs text-teks-lembut">Total Baris</p>
              <p className="text-xl font-extrabold text-teks">{state.total}</p>
            </div>
            <div className="rounded-xl border border-garis bg-latar p-3 text-center">
              <p className="text-xs text-teks-lembut">Berhasil Disimpan</p>
              <p className="text-xl font-extrabold text-utama">{state.berhasil}</p>
            </div>
            <div className="rounded-xl border border-garis bg-latar p-3 text-center">
              <p className="text-xs text-teks-lembut">Gagal / Ditolak</p>
              <p className="text-xl font-extrabold text-bahaya">{state.gagal}</p>
            </div>
          </div>

          {state.barisSalah?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold text-bahaya">
                Daftar Baris yang Ditolak ({state.barisSalah.length} baris):
              </p>
              <ul className="mt-2 flex max-h-48 flex-col gap-1 overflow-y-auto rounded-lg border border-garis bg-latar p-3 text-xs">
                {state.barisSalah.map((err, i) => (
                  <li key={i} className="text-bahaya">
                    <span className="font-semibold">Baris {err.baris}:</span> {err.alasan}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

