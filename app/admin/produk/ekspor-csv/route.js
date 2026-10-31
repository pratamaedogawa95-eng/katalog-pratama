import { createSessionClient } from "@/lib/supabase/session";
import { NextResponse } from "next/server";

// US-35: Ekspor produk ke CSV
export async function GET() {
  const supabase = await createSessionClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 401 });
  }

  const { data: produk, error } = await supabase
    .from("produk")
    .select("id, nama, harga, kategori, deskripsi, foto_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = [
    "id",
    "nama",
    "harga",
    "kategori",
    "deskripsi",
    "foto_url",
    "created_at",
  ];

  const escape = (val) => {
    const str = val == null ? "" : String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const baris = (produk || []).map((p) =>
    header.map((k) => escape(p[k])).join(",")
  );
  const csv = [header.join(","), ...baris].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="produk-${Date.now()}.csv"`,
    },
  });
}

