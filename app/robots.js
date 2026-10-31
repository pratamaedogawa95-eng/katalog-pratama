// US-27 & K-8: robots.txt valid yang memblokir akses crawler ke /admin
export default function robots() {
  const baseUrl = process.env.APP_URL || "https://katalog-pratama.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/admin"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

