import NavAdmin from "@/components/NavAdmin";
import FormPengaturanToko from "@/components/FormPengaturanToko";
import { createSessionClient } from "@/lib/supabase/session";
import { toko } from "@/lib/toko";

// US-43: Pengaturan toko dari admin
export default async function HalamanPengaturan() {
  const supabase = await createSessionClient();

  // Default dari lib/toko.js
  const pengaturan = {
    nama_toko: toko.nama,
    tagline: toko.tagline,
    nomor_whatsapp: toko.nomorWhatsApp,
    alamat: toko.alamat,
    jam_buka: toko.jamBuka,
    email: toko.email,
  };

  // Override dari database jika ada
  try {
    const { data } = await supabase
      .from("pengaturan_toko")
      .select("kunci, nilai");

    if (data && data.length > 0) {
      data.forEach(({ kunci, nilai }) => {
        if (kunci && nilai) pengaturan[kunci] = nilai;
      });
    }
  } catch {}

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Pengaturan toko</h1>
      <p className="text-sm text-teks-lembut">
        Data di sini menggantikan konfigurasi bawaan di lib/toko.js.
      </p>
      <FormPengaturanToko pengaturan={pengaturan} />
    </div>
  );
}

