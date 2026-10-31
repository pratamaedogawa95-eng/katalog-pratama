"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  getKeranjang,
  getBandingkan,
  toggleTema,
  useKatalogSync,
} from "@/lib/klien-state";
import KeranjangDrawer from "@/components/KeranjangDrawer";
import ModalBandingkan from "@/components/ModalBandingkan";

export default function NavHeaderKlien() {
  useKatalogSync();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [bukaKeranjang, setBukaKeranjang] = useState(false);
  const [bukaBandingkan, setBukaBandingkan] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const keranjang = mounted ? getKeranjang() : [];
  const bandingkan = mounted ? getBandingkan() : [];
  const totalItemKeranjang = keranjang.reduce((sum, item) => sum + item.jumlah, 0);

  const handleToggleTema = () => {
    const nextTema = toggleTema();
    setIsDark(nextTema === "dark");
  };

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle Mode Gelap (US-25) */}
        <button
          type="button"
          onClick={handleToggleTema}
          title={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-permukaan text-base transition-colors hover:border-utama hover:text-utama"
          aria-label="Toggle tema gelap atau terang"
        >
          {mounted ? (isDark ? "☀️" : "🌙") : "🌙"}
        </button>

        {/* Keranjang & Bandingkan hanya muncul di halaman publik / belanja, bukan di admin */}
        {!isAdmin && (
          <>
            {/* Tombol Bandingkan (US-37) */}
            {mounted && bandingkan.length > 0 && (
              <button
                type="button"
                onClick={() => setBukaBandingkan(true)}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-garis bg-permukaan px-2.5 text-xs font-semibold hover:border-utama hover:text-utama"
              >
                <span>⚖️ Bandingkan</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-utama text-[11px] font-bold text-white">
                  {bandingkan.length}
                </span>
              </button>
            )}

            {/* Tombol Keranjang (US-21) */}
            <button
              type="button"
              onClick={() => setBukaKeranjang(true)}
              className="flex h-9 items-center gap-2 rounded-lg bg-utama px-3 text-xs font-semibold text-white transition-colors hover:bg-utama-gelap sm:text-sm"
            >
              <span>🛒</span>
              <span className="hidden sm:inline">Keranjang</span>
              {mounted && totalItemKeranjang > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-extrabold text-utama">
                  {totalItemKeranjang}
                </span>
              )}
            </button>
          </>
        )}
      </div>

      {/* Drawer / Modal Keranjang */}
      {!isAdmin && bukaKeranjang && (
        <KeranjangDrawer onClose={() => setBukaKeranjang(false)} />
      )}

      {/* Modal Bandingkan */}
      {!isAdmin && bukaBandingkan && (
        <ModalBandingkan onClose={() => setBukaBandingkan(false)} />
      )}
    </>
  );
}

