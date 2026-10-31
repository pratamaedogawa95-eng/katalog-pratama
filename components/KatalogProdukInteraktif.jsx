"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import FilterKatalog from "@/components/FilterKatalog";
import BannerPromo from "@/components/BannerPromo";
import TerakhirDilihat from "@/components/TerakhirDilihat";
import { getFavorit, useKatalogSync } from "@/lib/klien-state";

export default function KatalogProdukInteraktif({
  daftarProduk = [],
  daftarKategori = [],
  totalCount = 0,
  currentLimit = 12,
  kategoriAktif = "",
  pencarianAktif = "",
  urutanAktif = "terbaru",
  errorMessage = null,
}) {
  useKatalogSync();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [hanyaFavorit, setHanyaFavorit] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const favoritIds = getFavorit();

  // Filter lokal jika mode hanyaFavorit aktif
  const displayedProduk = hanyaFavorit
    ? daftarProduk.filter((p) => favoritIds.includes(String(p.id)))
    : daftarProduk;

  const handleLoadMore = () => {
    setLoadingMore(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(currentLimit + 12));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setTimeout(() => setLoadingMore(false), 800);
  };

  const adaProdukLagi = !hanyaFavorit && daftarProduk.length < totalCount;

  return (
    <div className="flex flex-col gap-6">
      {/* US-42: Banner Promo Dinamis */}
      <BannerPromo />

      {/* US-11 & 15 & 24: Filter Kategori, Pencarian, Urutkan, Favorit */}
      <FilterKatalog
        daftarKategori={daftarKategori}
        kategoriAktif={kategoriAktif}
        pencarianAktif={pencarianAktif}
        urutanAktif={urutanAktif}
        hanyaFavorit={hanyaFavorit}
        onToggleFavorit={() => setHanyaFavorit(!hanyaFavorit)}
      />

      {/* Status Error atau Daftar Produk */}
      {errorMessage ? (
        <div className="rounded-xl border border-garis bg-permukaan p-6 text-center">
          <p className="text-sm font-medium text-bahaya">{errorMessage}</p>
        </div>
      ) : displayedProduk.length === 0 ? (
        <div className="rounded-xl border border-garis bg-permukaan p-10 text-center text-teks-lembut">
          <span className="text-3xl">🔍</span>
          <p className="mt-2 text-base font-medium">
            {hanyaFavorit ? "Belum ada produk favorit" : "Belum ada produk"}
          </p>
          <p className="mt-1 text-xs">
            {hanyaFavorit
              ? "Klik ikon hati pada kartu produk untuk menandai produk favorit."
              : "Coba ubah kata kunci pencarian atau pilih kategori lain."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {displayedProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>

          {/* US-16: Tombol Muat Lebih Banyak */}
          {adaProdukLagi && (
            <div className="mt-4 flex flex-col items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-xl border border-garis bg-latar px-6 py-2.5 text-sm font-bold text-teks transition hover:border-utama hover:text-utama disabled:opacity-50"
              >
                {loadingMore ? "Memuat..." : "Muat lebih banyak"}
                <span className="text-xs text-teks-lembut font-normal">
                  ({daftarProduk.length} dari {totalCount})
                </span>
              </button>
            </div>
          )}
        </>
      )}

      {/* US-36: Terakhir Dilihat */}
      <TerakhirDilihat />
    </div>
  );
}

