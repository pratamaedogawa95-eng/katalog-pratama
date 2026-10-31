import NavAdmin from "@/components/NavAdmin";
import UlasanAdminList from "@/components/UlasanAdminList";
import { createSessionClient } from "@/lib/supabase/session";

// US-39: Moderasi ulasan
export default async function HalamanUlasan() {
  const supabase = await createSessionClient();

  let daftarUlasan = [];
  let errorMsg = null;

  try {
    const { data, error } = await supabase
      .from("ulasan")
      .select("*, produk(nama)")
      .order("created_at", { ascending: false });

    if (error) errorMsg = error.message;
    else daftarUlasan = data || [];
  } catch (e) {
    errorMsg = e.message;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Moderasi ulasan</h1>
      {errorMsg ? (
        <p className="rounded-lg bg-permukaan p-4 text-sm text-bahaya">
          Gagal memuat ulasan: {errorMsg}
        </p>
      ) : daftarUlasan.length === 0 ? (
        <p className="text-teks-lembut">Belum ada ulasan.</p>
      ) : (
        <UlasanAdminList daftarUlasan={daftarUlasan} />
      )}
    </div>
  );
}

