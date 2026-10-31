import { createServerClient } from "@/lib/supabase/server";

// US-27: Sitemap otomatis dari database
export default async function sitemap() {
  const baseUrl = process.env.APP_URL || "https://katalog-pratama.vercel.app";

  let produkUrls = [];
  try {
    const supabase = createServerClient();
    const { data: produk } = await supabase
      .from("produk")
      .select("id, created_at, aktif")
      .neq("aktif", false);

    if (produk && produk.length > 0) {
      produkUrls = produk.map((p) => ({
        url: `${baseUrl}/produk/${p.id}`,
        lastModified: p.created_at ? new Date(p.created_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch {}

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...produkUrls,
  ];
}

