"use client";

import { useEffect } from "react";
import { catatTerakhirDilihat } from "@/lib/klien-state";

export default function CatatDilihatKlien({ produk }) {
  useEffect(() => {
    if (produk) {
      catatTerakhirDilihat(produk);
    }
  }, [produk]);

  return null;
}

