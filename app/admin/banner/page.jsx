import NavAdmin from "@/components/NavAdmin";
import BannerAdminList from "@/components/BannerAdminList";
import { createSessionClient } from "@/lib/supabase/session";

// US-42: Kelola banner promo
export default async function HalamanBanner() {
  const supabase = await createSessionClient();

  let daftarBanner = [];
  let errorMsg = null;

  try {
    const { data, error } = await supabase
      .from("banner")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) errorMsg = error.message;
    else daftarBanner = data || [];
  } catch (e) {
    errorMsg = e.message;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Kelola banner</h1>
      {errorMsg ? (
        <p className="rounded-lg bg-permukaan p-4 text-sm text-bahaya">
          Gagal memuat banner: {errorMsg}
        </p>
      ) : (
        <BannerAdminList daftarBanner={daftarBanner} />
      )}
    </div>
  );
}

