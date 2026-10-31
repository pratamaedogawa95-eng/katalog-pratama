"use client";

import { useState, useEffect } from "react";

const EVENT_NAME = "katalog-state-change";

function safeLocalStorageGet(key, defaultValue) {
  if (typeof window === "undefined") return defaultValue;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function safeLocalStorageSet(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key, value } }));
  } catch {}
}

// 1. Keranjang Belanja (US-21 & US-12)
export function getKeranjang() {
  return safeLocalStorageGet("katalog_keranjang", []);
}

export function tambahKeKeranjang(produk, jumlah = 1, varian = "Reguler") {
  const items = getKeranjang();
  const existingIndex = items.findIndex(
    (item) => String(item.id) === String(produk.id) && item.varian === varian
  );

  let newItems;
  if (existingIndex > -1) {
    newItems = [...items];
    newItems[existingIndex].jumlah += jumlah;
  } else {
    newItems = [
      ...items,
      {
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga,
        foto_url: produk.foto_url,
        kategori: produk.kategori,
        varian,
        jumlah,
      },
    ];
  }
  safeLocalStorageSet("katalog_keranjang", newItems);
  return newItems;
}

export function updateJumlahKeranjang(id, varian, jumlah) {
  const items = getKeranjang();
  let newItems;
  if (jumlah <= 0) {
    newItems = items.filter(
      (item) => !(String(item.id) === String(id) && item.varian === varian)
    );
  } else {
    newItems = items.map((item) => {
      if (String(item.id) === String(id) && item.varian === varian) {
        return { ...item, jumlah };
      }
      return item;
    });
  }
  safeLocalStorageSet("katalog_keranjang", newItems);
  return newItems;
}

export function hapusDariKeranjang(id, varian) {
  return updateJumlahKeranjang(id, varian, 0);
}

// 2. Favorit (US-24)
export function getFavorit() {
  return safeLocalStorageGet("katalog_favorit", []);
}

export function toggleFavorit(id) {
  const favorit = getFavorit();
  const idStr = String(id);
  let newFavorit;
  if (favorit.includes(idStr)) {
    newFavorit = favorit.filter((f) => f !== idStr);
  } else {
    newFavorit = [...favorit, idStr];
  }
  safeLocalStorageSet("katalog_favorit", newFavorit);
  return newFavorit;
}

// 3. Terakhir Dilihat (US-36)
export function getTerakhirDilihat() {
  return safeLocalStorageGet("katalog_terakhir_dilihat", []);
}

export function catatTerakhirDilihat(produk) {
  if (!produk || !produk.id) return;
  const list = getTerakhirDilihat();
  const filtered = list.filter((p) => String(p.id) !== String(produk.id));
  const updated = [
    {
      id: produk.id,
      nama: produk.nama,
      harga: produk.harga,
      foto_url: produk.foto_url,
      kategori: produk.kategori,
    },
    ...filtered,
  ].slice(0, 6); // Maksimal 6 produk terakhir dilihat
  safeLocalStorageSet("katalog_terakhir_dilihat", updated);
}

// 4. Bandingkan 2 Produk (US-37)
export function getBandingkan() {
  return safeLocalStorageGet("katalog_bandingkan", []);
}

export function toggleBandingkan(produk) {
  const list = getBandingkan();
  const existingIndex = list.findIndex((p) => String(p.id) === String(produk.id));

  let newList;
  let statusMessage = null;

  if (existingIndex > -1) {
    newList = list.filter((p) => String(p.id) !== String(produk.id));
  } else {
    if (list.length >= 2) {
      // US-37: menggantikan pilihan lama (pilihan tertua)
      newList = [
        list[1],
        {
          id: produk.id,
          nama: produk.nama,
          harga: produk.harga,
          deskripsi: produk.deskripsi,
          foto_url: produk.foto_url,
          kategori: produk.kategori,
        },
      ];
      statusMessage = "Maksimal 2 produk. Produk pertama diganti.";
    } else {
      newList = [
        ...list,
        {
          id: produk.id,
          nama: produk.nama,
          harga: produk.harga,
          deskripsi: produk.deskripsi,
          foto_url: produk.foto_url,
          kategori: produk.kategori,
        },
      ];
    }
  }

  safeLocalStorageSet("katalog_bandingkan", newList);
  return { newList, statusMessage };
}

// 5. Dark Mode (US-25)
export function getTema() {
  if (typeof window === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function toggleTema() {
  if (typeof window === "undefined") return "light";
  const isDark = document.documentElement.classList.contains("dark");
  const newTema = isDark ? "light" : "dark";
  if (newTema === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  try {
    localStorage.setItem("katalog_tema", newTema);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key: "katalog_tema", value: newTema } }));
  } catch {}
  return newTema;
}

// Hook untuk subscribe perubahan localStorage
export function useKatalogSync() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
}

