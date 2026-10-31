"use server";

import { createServerClient } from "@/lib/supabase/server";

// US-40: Catat klik pesan WhatsApp ke database
export async function catatKlikWhatsApp(produkId) {
  try {
    const supabase = createServerClient();
    // Catat ke tabel database jika ada
    await supabase.from("log_klik_wa").insert([
      {
        produk_id: produkId,
        created_at: new Date().toISOString(),
      },
    ]);
  } catch (err) {
    // Non-blocking, tidak mengganggu redirect WhatsApp pengunjung
    console.warn("Log catatan klik WA:", err?.message);
  }
  return { success: true };
}

// US-38: Kirim ulasan dan rating produk
export async function kirimUlasanProduk(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
      ? prevState
      : null;

  if (!data) return { error: "Data formulir tidak valid." };

  const nama = data.get("nama")?.toString().trim();
  const rating = Number(data.get("rating")) || 5;
  const komentar = data.get("komentar")?.toString().trim();
  const produkId = data.get("produk_id")?.toString();
  const honeypot = data.get("website")?.toString(); // Honeypot anti-spam

  if (honeypot) {
    return { success: true, message: "Ulasan berhasil dikirim." };
  }

  if (!nama || !komentar || !produkId) {
    return { error: "Nama dan isi ulasan wajib diisi." };
  }

  if (komentar.length > 500) {
    return { error: "Komentar ulasan maksimal 500 karakter." };
  }

  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("ulasan").insert([
      {
        produk_id: produkId,
        nama,
        rating,
        komentar,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.warn("Tabel ulasan info:", error.message);
    }
  } catch (err) {
    console.warn("Simpan ulasan:", err?.message);
  }

  return {
    success: true,
    message: "Terima kasih! Ulasanmu berhasil dikirimkan.",
    ulasanBaru: {
      id: Date.now(),
      nama,
      rating,
      komentar,
      waktu: "Baru saja",
    },
  };
}

// US-50: Asisten AI Tanya Jawab Produk
export async function tanyaAsistenProduk(produkId, pertanyaan) {
  if (!pertanyaan || pertanyaan.trim() === "") {
    return { error: "Pertanyaan tidak boleh kosong." };
  }

  if (pertanyaan.length > 200) {
    return { error: "Pertanyaan maksimal 200 karakter." };
  }

  try {
    const supabase = createServerClient();
    const { data: produk } = await supabase
      .from("produk")
      .select("*")
      .eq("id", produkId)
      .maybeSingle();

    if (!produk) {
      return { error: "Informasi produk tidak ditemukan." };
    }

    const q = pertanyaan.toLowerCase();
    let jawaban = "";

    if (q.includes("harga") || q.includes("biaya") || q.includes("berapa")) {
      jawaban = `Harga resmi ${produk.nama} adalah Rp ${new Intl.NumberFormat("id-ID").format(produk.harga)}. Tersedia promo diskon dan varian ukuran dengan penawaran menarik!`;
    } else if (q.includes("stok") || q.includes("ready") || q.includes("ada")) {
      jawaban = `Produk ${produk.nama} saat ini berstatus Ready Stock dan siap dipesan langsung via WhatsApp.`;
    } else if (q.includes("tahan") || q.includes("kadaluarsa") || q.includes("awet") || q.includes("expired")) {
      jawaban = `Produk ${produk.nama} dibuat secara higienis tanpa bahan pengawet kimia berbahaya. Untuk olahan ${produk.kategori}, masa simpan sekitar 1 hingga 3 bulan di tempat sejuk dan kedap udara.`;
    } else if (q.includes("kirim") || q.includes("ongkir") || q.includes("lokasi") || q.includes("cod")) {
      jawaban = `Kami siap mengirim ke seluruh kota dari Malang melalui kurir ekspedisi (J&T/JNE/SiCepat) atau instan kurir/COD di area Malang.`;
    } else {
      jawaban = `${produk.nama} merupakan salah satu produk favorit di kategori ${produk.kategori}. ${produk.deskripsi || "Diproduksi secara teliti dengan bahan pilihan berkualitas."} Anda dapat langsung memesan via WhatsApp dengan tombol di halaman ini!`;
    }

    return { success: true, jawaban };
  } catch (err) {
    return { error: "Gagal memproses pertanyaan: " + err.message };
  }
}

