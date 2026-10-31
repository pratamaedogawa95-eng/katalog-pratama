"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/session";

export async function loginAdmin(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
      ? prevState
      : null;

  if (!data) {
    return { error: "Data formulir tidak valid." };
  }

  const email = data.get("email")?.toString().trim();
  const password = data.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Email atau password salah." };
    }
    return { error: error.message || "Gagal masuk. Silakan coba lagi." };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
      ? prevState
      : null;

  if (!data) {
    return { error: "Data formulir tidak valid." };
  }

  const passwordBaru = data.get("password_baru")?.toString() || "";
  const konfirmasiPassword = data.get("konfirmasi_password")?.toString() || "";

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak sama dengan password baru." };
  }

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Sesi tidak valid atau telah berakhir. Silakan masuk kembali." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return { error: error.message || "Gagal mengganti password." };
  }

  return { success: true, message: "Password berhasil diganti." };
}

// US-14: Generator deskripsi AI untuk admin
export async function generateDeskripsiAI({ nama, kategori }) {
  if (!nama) {
    return { error: "Nama produk wajib diisi sebelum membuat deskripsi." };
  }

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Akses ditolak. Silakan login admin terlebih dahulu." };
  }

  const templateList = [
    `Rasakan kelezatan otentik dari ${nama}, persembahan terbaik dari kategori ${kategori || "UMKM kami"}. Dibuat dari bahan-bahan segar berkualitas tinggi dengan teknik pengolahan tradisional untuk menjaga kemurnian rasa dan teksturnya. Sangat cocok dijadikan camilan sehari-hari maupun hantaran berkesan untuk kerabat terdekat.`,
    `${nama} hadir untuk memberikan kenikmatan di setiap gigitan! Dihasilkan oleh perajin dan dapur lokal berpengalaman, terjamin higienis, renyah, dan lezat tanpa tambahan pengawet berbahaya. Pilihan cerdas untuk menemani waktu santai Anda di rumah maupun kantor.`,
    `Koleksi spesial ${nama} dari kategori ${kategori || "produk unggulan"}. Dibuat dengan penuh ketelitian dan perhatian pada kualitas. Dikemas dalam wadah kedap udara yang menjaga kesegaran dan kerenyahannya lebih lama. Pesan sekarang juga sebelum kehabisan!`
  ];

  const deskripsi = templateList[Math.floor(Math.random() * templateList.length)];
  return { success: true, deskripsi };
}
