"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTerakhirDilihat, useKatalogSync } from "@/lib/klien-state";
import { formatRupiah } from "@/lib/format";

export default function TerakhirDilihat() {
  useKatalogSync();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const list = getTerakhirDilihat();

  // US-36: tidak muncul bila masih kosong
  if (list.length === 0) return null;

  return (
    <section className="mt-12 flex flex-col gap-4 border-t border-garis pt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-teks">Terakhir Dilihat</h2>
        <span className="text-xs text-teks-lembut">Tersimpan di browsermu</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {list.map((produk) => (
          <Link
            key={produk.id}
            href={`/produk/${produk.id}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-garis bg-latar p-2 transition hover:border-utama"
          >
            <img
              src={produk.foto_url}
              alt={produk.nama}
              className="aspect-square w-full rounded-lg bg-permukaan object-cover"
            />
            <div className="mt-2 flex flex-1 flex-col">
              <span className="text-[10px] text-teks-lembut">{produk.kategori}</span>
              <h4 className="line-clamp-1 text-xs font-semibold group-hover:text-utama">
                {produk.nama}
              </h4>
              <p className="mt-1 text-xs font-bold text-harga">
                {formatRupiah(produk.harga)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

