"use client";

import { useState } from "react";

export default function GaleriFotoProduk({ fotoUtama, alt, galeriTambahan = [] }) {
  // Susun daftar foto (foto utama + galeri tambahan jika ada)
  const daftarFoto = [
    fotoUtama,
    ...(Array.isArray(galeriTambahan) ? galeriTambahan : []),
  ].filter(Boolean);

  const [fotoAktif, setFotoAktif] = useState(daftarFoto[0] || fotoUtama);

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-garis bg-permukaan">
        <img
          src={fotoAktif}
          alt={alt}
          className="aspect-square w-full object-cover transition duration-300"
        />
      </div>

      {/* US-18: Thumbnail galeri jika foto lebih dari satu */}
      {daftarFoto.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {daftarFoto.map((foto, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setFotoAktif(foto)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-permukaan transition ${
                fotoAktif === foto
                  ? "border-utama ring-2 ring-utama/30"
                  : "border-garis opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={foto}
                alt={`${alt} tampilan ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

