import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase/server";

// US-43: Ambil data toko dinamis dari tabel pengaturan_toko, cadangan lib/toko.js
export async function getTokoData() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("pengaturan_toko")
      .select("kunci, nilai");

    if (error || !data || data.length === 0) {
      return toko;
    }

    const res = { ...toko };
    data.forEach(({ kunci, nilai }) => {
      if (kunci && nilai) {
        if (kunci === "nama_toko") res.nama = nilai;
        else if (kunci === "nomor_whatsapp") res.nomorWhatsApp = nilai;
        else if (kunci === "jam_buka") res.jamBuka = nilai;
        else res[kunci] = nilai;
      }
    });
    return res;
  } catch {
    return toko;
  }
}

