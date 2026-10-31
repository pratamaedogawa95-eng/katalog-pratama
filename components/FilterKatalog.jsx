"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { getFavorit, useKatalogSync } from "@/lib/klien-state";

export default function FilterKatalog({
  daftarKategori = [],
  kategoriAktif = "",
  pencarianAktif = "",
  urutanAktif = "terbaru",
  hanyaFavorit = false,
  onToggleFavorit,
}) {
  useKatalogSync();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchVal, setSearchVal] = useState(pencarianAktif);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSearchVal(pencarianAktif);
  }, [pencarianAktif]);

  const favorit = mounted ? getFavorit() : [];

  const updateParam = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "" || value === "semua") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    // Reset limit saat filter diubah
    params.delete("limit");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam({ q: searchVal });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Baris Pencarian & Urutan & Favorit */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Form Pencarian (US-11) */}
        <form onSubmit={handleSearchSubmit} className="relative flex flex-1 max-w-md">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Cari nama produk..."
            className="w-full rounded-xl border border-garis bg-latar py-2.5 pl-10 pr-10 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
          <span className="absolute left-3.5 top-3 text-sm text-teks-lembut">🔍</span>
          {searchVal && (
            <button
              type="button"
              onClick={() => {
                setSearchVal("");
                updateParam({ q: "" });
              }}
              className="absolute right-3 top-2.5 text-sm text-teks-lembut hover:text-teks"
            >
              ✕
            </button>
          )}
        </form>

        <div className="flex items-center gap-2">
          {/* Tombol Tab Favorit (US-24) */}
          <button
            type="button"
            onClick={onToggleFavorit}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              hanyaFavorit
                ? "border-bahaya bg-bahaya/10 text-bahaya"
                : "border-garis bg-latar text-teks hover:border-bahaya"
            }`}
          >
            <span>{hanyaFavorit ? "❤️" : "🤍"}</span>
            <span>Favorit</span>
            {mounted && favorit.length > 0 && (
              <span className="rounded-full bg-bahaya/20 px-1.5 py-0.2 text-[10px] font-bold text-bahaya">
                {favorit.length}
              </span>
            )}
          </button>

          {/* Selector Urutan (US-15) */}
          <select
            value={urutanAktif}
            onChange={(e) => updateParam({ urut: e.target.value })}
            className="rounded-xl border border-garis bg-latar px-3 py-2 text-xs font-semibold text-teks focus:border-utama focus:outline-none"
          >
            <option value="terbaru">Terbaru</option>
            <option value="termurah">Harga: Termurah</option>
            <option value="termahal">Harga: Termahal</option>
            <option value="abjad_asc">Nama: A - Z</option>
            <option value="abjad_desc">Nama: Z - A</option>
          </select>
        </div>
      </div>

      {/* Pill Kategori (US-11 & US-49) */}
      {!hanyaFavorit && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            type="button"
            onClick={() => updateParam({ kategori: "" })}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-semibold transition ${
              !kategoriAktif || kategoriAktif === "semua"
                ? "bg-utama text-white"
                : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
            }`}
          >
            Semua
          </button>

          {daftarKategori.map((kat) => (
            <button
              key={kat}
              type="button"
              onClick={() => updateParam({ kategori: kat })}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-semibold transition ${
                kategoriAktif === kat
                  ? "bg-utama text-white"
                  : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
      )}

      {isPending && (
        <div className="text-center text-xs text-teks-lembut animate-pulse">
          Memuat produk...
        </div>
      )}
    </div>
  );
}

