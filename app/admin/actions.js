"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/session";
import { createServerClient } from "@/lib/supabase/server";

// ─── Helper: cek login ────────────────────────────────────────────
async function cekLogin() {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return { supabase, user: null };
  return { supabase, user };
}

// ─── Helper: catat log aktivitas (internal, tidak diekspor) ───────
async function catatLog(supabase, email, aksi, detail) {
  try {
    await supabase.from("log_aktivitas_admin").insert({
      admin_email: email,
      aksi,
      detail: String(detail || "").slice(0, 500),
    });
  } catch (e) {
    console.error("Log aktivitas gagal:", e.message);
  }
}

// ─── Helper: upload file ke Storage ──────────────────────────────
async function uploadFoto(file, bucket = "produk-foto") {
  if (!file || file.size === 0) return null;
  if (!file.type.startsWith("image/"))
    throw new Error("Foto hanya boleh berupa file gambar.");
  if (file.size > 2 * 1024 * 1024)
    throw new Error("Ukuran foto maksimal 2 MB.");

  const supabaseAdmin = createServerClient();
  const ext = file.name.split(".").pop();
  const namaFile = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(namaFile, file, { contentType: file.type, upsert: false });

  if (error) throw new Error("Gagal mengunggah foto: " + error.message);

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(bucket).getPublicUrl(namaFile);

  return publicUrl;
}

// ═══════════════════════════════════════════════════════════════════
// US-04: Login admin
// ═══════════════════════════════════════════════════════════════════
export async function loginAdmin(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
      ? prevState
      : null;

  if (!data) return { error: "Data formulir tidak valid." };

  const email = data.get("email")?.toString().trim();
  const password = data.get("password")?.toString();

  if (!email || !password) return { error: "Email dan password wajib diisi." };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes("Invalid login credentials"))
      return { error: "Email atau password salah." };
    return { error: error.message || "Gagal masuk. Silakan coba lagi." };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

// ═══════════════════════════════════════════════════════════════════
// US-04: Logout admin
// ═══════════════════════════════════════════════════════════════════
export async function logoutAdmin() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}

// ═══════════════════════════════════════════════════════════════════
// US-05: Ganti password
// ═══════════════════════════════════════════════════════════════════
export async function gantiPassword(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
      ? prevState
      : null;

  if (!data) return { error: "Data formulir tidak valid." };

  const passwordBaru = data.get("password_baru")?.toString() || "";
  const konfirmasi = data.get("konfirmasi_password")?.toString() || "";

  if (!passwordBaru || !konfirmasi)
    return { error: "Password baru dan konfirmasi wajib diisi." };
  if (passwordBaru.length < 8)
    return { error: "Password baru minimal 8 karakter." };
  if (passwordBaru !== konfirmasi)
    return { error: "Konfirmasi password tidak sama dengan password baru." };

  const { supabase, user } = await cekLogin();
  if (!user)
    return { error: "Sesi tidak valid. Silakan masuk kembali." };

  const { error } = await supabase.auth.updateUser({ password: passwordBaru });
  if (error) return { error: error.message || "Gagal mengganti password." };

  return { success: true, message: "Password berhasil diganti." };
}

// ═══════════════════════════════════════════════════════════════════
// US-14: Generator deskripsi AI (mock)
// ═══════════════════════════════════════════════════════════════════
export async function generateDeskripsiAI({ nama, kategori }) {
  if (!nama) return { error: "Nama produk wajib diisi sebelum membuat deskripsi." };

  const { user } = await cekLogin();
  if (!user) return { error: "Akses ditolak. Silakan login terlebih dahulu." };

  const tpl = [
    `Rasakan kelezatan otentik dari ${nama}, persembahan terbaik dari kategori ${kategori || "UMKM kami"}. Dibuat dari bahan-bahan segar berkualitas tinggi dengan teknik pengolahan tradisional untuk menjaga kemurnian rasa dan teksturnya. Sangat cocok dijadikan camilan sehari-hari maupun hantaran berkesan untuk kerabat terdekat.`,
    `${nama} hadir untuk memberikan kenikmatan di setiap gigitan! Dihasilkan oleh perajin dan dapur lokal berpengalaman, terjamin higienis, renyah, dan lezat tanpa tambahan pengawet berbahaya. Pilihan cerdas untuk menemani waktu santai Anda di rumah maupun kantor.`,
    `Koleksi spesial ${nama} dari kategori ${kategori || "produk unggulan"}. Dibuat dengan penuh ketelitian dan perhatian pada kualitas. Dikemas dalam wadah kedap udara yang menjaga kesegaran dan kerenyahannya lebih lama. Pesan sekarang juga sebelum kehabisan!`,
  ];

  return { success: true, deskripsi: tpl[Math.floor(Math.random() * tpl.length)] };
}

// ═══════════════════════════════════════════════════════════════════
// US-08: Tambah produk  (US-29 upload, US-34 validasi)
// ═══════════════════════════════════════════════════════════════════
export async function tambahProduk(prevState, formData) {
  const fd =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
      ? prevState
      : null;
  if (!fd) return { error: "Data formulir tidak valid." };

  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak. Silakan login terlebih dahulu." };

  const nama = fd.get("nama")?.toString().trim();
  const harga = Number(fd.get("harga"));
  const kategori = fd.get("kategori")?.toString().trim() || null;
  const deskripsi = fd.get("deskripsi")?.toString().trim() || null;
  const stok = parseInt(fd.get("stok") || "10", 10);
  const fotoFile = fd.get("foto_file");
  const fotoUrlInput = fd.get("foto_url")?.toString().trim() || null;

  // Validasi per field
  const errors = {};
  if (!nama) errors.nama = "Nama produk wajib diisi.";
  if (!harga || harga <= 0) errors.harga = "Harga harus angka positif.";
  if (Object.keys(errors).length > 0) return { errors };

  // Upload foto jika ada file
  let foto_url = fotoUrlInput;
  try {
    if (fotoFile && fotoFile.size > 0) {
      foto_url = await uploadFoto(fotoFile);
    }
  } catch (e) {
    return { error: e.message };
  }

  const { error } = await supabase.from("produk").insert({
    nama,
    harga,
    kategori,
    deskripsi,
    foto_url,
    aktif: true,
    urutan: 0,
    stok,
  });

  if (error) return { error: "Gagal menyimpan produk: " + error.message };

  await catatLog(supabase, user.email, "tambah_produk", nama);
  revalidatePath("/admin/produk");
  revalidatePath("/");
  redirect("/admin/produk");
}

// ═══════════════════════════════════════════════════════════════════
// US-09: Ubah produk
// ═══════════════════════════════════════════════════════════════════
export async function ubahProduk(prevState, formData) {
  const fd =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
      ? prevState
      : null;
  if (!fd) return { error: "Data formulir tidak valid." };

  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak. Silakan login terlebih dahulu." };

  const id = fd.get("id")?.toString();
  const nama = fd.get("nama")?.toString().trim();
  const harga = Number(fd.get("harga"));
  const kategori = fd.get("kategori")?.toString().trim() || null;
  const deskripsi = fd.get("deskripsi")?.toString().trim() || null;
  const stok = parseInt(fd.get("stok") || "10", 10);
  const fotoFile = fd.get("foto_file");
  const fotoUrlInput = fd.get("foto_url")?.toString().trim() || null;

  if (!id) return { error: "ID produk tidak ditemukan." };

  const errors = {};
  if (!nama) errors.nama = "Nama produk wajib diisi.";
  if (!harga || harga <= 0) errors.harga = "Harga harus angka positif.";
  if (Object.keys(errors).length > 0) return { errors };

  const updateData = { nama, harga, kategori, deskripsi, stok };

  try {
    if (fotoFile && fotoFile.size > 0) {
      updateData.foto_url = await uploadFoto(fotoFile);
    } else if (fotoUrlInput) {
      updateData.foto_url = fotoUrlInput;
    }
  } catch (e) {
    return { error: e.message };
  }

  const { error } = await supabase
    .from("produk")
    .update(updateData)
    .eq("id", id);

  if (error) return { error: "Gagal menyimpan perubahan: " + error.message };

  await catatLog(supabase, user.email, "ubah_produk", `${id} - ${nama}`);
  revalidatePath("/admin/produk");
  revalidatePath("/");
  revalidatePath(`/produk/${id}`);
  redirect("/admin/produk");
}

// ═══════════════════════════════════════════════════════════════════
// US-10: Hapus produk
// ═══════════════════════════════════════════════════════════════════
export async function hapusProduk(id) {
  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak." };

  const { error } = await supabase.from("produk").delete().eq("id", id);
  if (error) return { error: "Gagal menghapus produk: " + error.message };

  await catatLog(supabase, user.email, "hapus_produk", id);
  revalidatePath("/admin/produk");
  revalidatePath("/");
  return { success: true };
}

// ═══════════════════════════════════════════════════════════════════
// US-32: Toggle aktif / nonaktif produk
// ═══════════════════════════════════════════════════════════════════
export async function toggleAktifProduk(id, aktifSekarang) {
  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak." };

  const { error } = await supabase
    .from("produk")
    .update({ aktif: !aktifSekarang })
    .eq("id", id);

  if (error) return { error: error.message };

  await catatLog(supabase, user.email, "toggle_aktif", `${id} → ${!aktifSekarang ? "aktif" : "nonaktif"}`);
  revalidatePath("/admin/produk");
  revalidatePath("/");
  return { success: true };
}

// ═══════════════════════════════════════════════════════════════════
// US-47: Naik / turun urutan produk
// ═══════════════════════════════════════════════════════════════════
export async function ubahUrutanProduk(id, urutanBaru) {
  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak." };

  const urutan = parseInt(urutanBaru, 10);
  if (isNaN(urutan)) return { error: "Urutan harus berupa angka." };

  const { error } = await supabase
    .from("produk")
    .update({ urutan })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/produk");
  revalidatePath("/");
  return { success: true };
}

export async function naikUrutanProduk(id, urutanSekarang = 0) {
  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak." };

  const urutanBaru = Math.max(0, (parseInt(urutanSekarang, 10) || 0) - 1);
  const { error } = await supabase
    .from("produk")
    .update({ urutan: urutanBaru })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/produk");
  revalidatePath("/");
  return { success: true };
}

export async function turunUrutanProduk(id, urutanSekarang = 0) {
  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak." };

  const urutanBaru = (parseInt(urutanSekarang, 10) || 0) + 1;
  const { error } = await supabase
    .from("produk")
    .update({ urutan: urutanBaru })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/produk");
  revalidatePath("/");
  return { success: true };
}

// ═══════════════════════════════════════════════════════════════════
// US-31: Kelola kategori
// ═══════════════════════════════════════════════════════════════════
export async function tambahKategori(nama) {
  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak." };
  if (!nama || !nama.trim()) return { error: "Nama kategori wajib diisi." };

  const { error } = await supabase
    .from("kategori")
    .insert({ nama: nama.trim() });

  if (error) return { error: "Gagal menambah kategori: " + error.message };

  await catatLog(supabase, user.email, "tambah_kategori", nama);
  revalidatePath("/admin/kategori");
  return { success: true };
}

export async function ubahKategori(id, namaBaru, namaLama) {
  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak." };
  if (!namaBaru || !namaBaru.trim()) return { error: "Nama kategori wajib diisi." };

  const { error } = await supabase
    .from("kategori")
    .update({ nama: namaBaru.trim() })
    .eq("id", id);

  if (error) return { error: "Gagal mengubah kategori: " + error.message };

  // Update semua produk yang memakai kategori lama
  if (namaLama && namaLama !== namaBaru.trim()) {
    await supabase
      .from("produk")
      .update({ kategori: namaBaru.trim() })
      .eq("kategori", namaLama);
  }

  await catatLog(supabase, user.email, "ubah_kategori", `${namaLama} → ${namaBaru}`);
  revalidatePath("/admin/kategori");
  revalidatePath("/");
  return { success: true };
}

export async function hapusKategori(id, nama) {
  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak." };

  // Cek apakah masih digunakan produk
  const { count } = await supabase
    .from("produk")
    .select("*", { count: "exact", head: true })
    .eq("kategori", nama);

  if (count > 0)
    return { error: `Kategori masih digunakan oleh ${count} produk. Pindahkan produk terlebih dahulu.` };

  const { error } = await supabase.from("kategori").delete().eq("id", id);
  if (error) return { error: "Gagal menghapus kategori: " + error.message };

  await catatLog(supabase, user.email, "hapus_kategori", nama);
  revalidatePath("/admin/kategori");
  return { success: true };
}

// ═══════════════════════════════════════════════════════════════════
// US-39: Moderasi ulasan
// ═══════════════════════════════════════════════════════════════════
export async function moderasiUlasan(id, aksi) {
  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak." };

  let error;
  if (aksi === "hapus") {
    ({ error } = await supabase.from("ulasan").delete().eq("id", id));
  } else if (aksi === "sembunyikan") {
    ({ error } = await supabase.from("ulasan").update({ disetujui: false }).eq("id", id));
  } else if (aksi === "tampilkan") {
    ({ error } = await supabase.from("ulasan").update({ disetujui: true }).eq("id", id));
  } else {
    return { error: "Aksi tidak valid." };
  }

  if (error) return { error: error.message };

  await catatLog(supabase, user.email, "moderasi_ulasan", `${aksi} id:${id}`);
  revalidatePath("/admin/ulasan");
  revalidatePath("/");
  return { success: true };
}

// ═══════════════════════════════════════════════════════════════════
// US-44: Kelola akun admin (memakai SECRET_KEY untuk admin API)
// ═══════════════════════════════════════════════════════════════════
export async function tambahAdmin(prevState, formData) {
  const fd =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
      ? prevState
      : null;
  if (!fd) return { error: "Data formulir tidak valid." };

  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak." };

  const email = fd.get("email")?.toString().trim();
  const password = fd.get("password")?.toString();

  if (!email) return { error: "Email wajib diisi." };
  if (!password || password.length < 8)
    return { error: "Password minimal 8 karakter." };

  const supabaseAdmin = createServerClient();
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) return { error: "Gagal menambah admin: " + error.message };

  await catatLog(supabase, user.email, "tambah_admin", email);
  revalidatePath("/admin/akun");
  return { success: true, message: "Admin baru berhasil ditambahkan." };
}

export async function hapusAdmin(userId) {
  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak." };
  if (userId === user.id)
    return { error: "Tidak bisa menghapus akun Anda sendiri." };

  const supabaseAdmin = createServerClient();
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) return { error: "Gagal menghapus admin: " + error.message };

  await catatLog(supabase, user.email, "hapus_admin", userId);
  revalidatePath("/admin/akun");
  return { success: true };
}

// ═══════════════════════════════════════════════════════════════════
// US-43: Pengaturan toko (simpan ke database)
// ═══════════════════════════════════════════════════════════════════
export async function simpanPengaturanToko(prevState, formData) {
  const fd =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
      ? prevState
      : null;
  if (!fd) return { error: "Data formulir tidak valid." };

  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak." };

  const kunci = ["nama_toko", "tagline", "nomor_whatsapp", "alamat", "jam_buka", "email"];
  const nilai = {};
  kunci.forEach((k) => {
    nilai[k] = fd.get(k)?.toString().trim() || "";
  });

  // Validasi nomor WhatsApp
  const nomorBersih = nilai.nomor_whatsapp.replace(/\D/g, "");
  if (nomorBersih.length < 10)
    return { error: "Nomor WhatsApp minimal 10 digit angka." };
  nilai.nomor_whatsapp = nomorBersih;

  // Upsert per kunci
  for (const k of kunci) {
    const { error } = await supabase.from("pengaturan_toko").upsert(
      { kunci: k, nilai: nilai[k], updated_at: new Date().toISOString() },
      { onConflict: "kunci" }
    );
    if (error) return { error: `Gagal menyimpan ${k}: ${error.message}` };
  }

  await catatLog(supabase, user.email, "ubah_pengaturan_toko", "");
  revalidatePath("/");
  revalidatePath("/tentang");
  revalidatePath("/admin/pengaturan");
  return { success: true, message: "Pengaturan toko berhasil disimpan." };
}

// ═══════════════════════════════════════════════════════════════════
// US-42: Kelola banner promo
// ═══════════════════════════════════════════════════════════════════
export async function simpanBanner(prevState, formData) {
  const fd =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
      ? prevState
      : null;
  if (!fd) return { error: "Data formulir tidak valid." };

  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak." };

  const id = fd.get("id")?.toString() || null;
  const judul = fd.get("judul")?.toString().trim();
  const teks = fd.get("teks")?.toString().trim() || null;
  const tautan = fd.get("tautan")?.toString().trim() || null;
  const aktif = fd.get("aktif") === "on" || fd.get("aktif") === "true";
  const fotoFile = fd.get("foto_file");

  if (!judul) return { error: "Judul banner wajib diisi." };

  let foto_url = null;
  try {
    if (fotoFile && fotoFile.size > 0) {
      foto_url = await uploadFoto(fotoFile, "banner-foto");
    }
  } catch (e) {
    return { error: e.message };
  }

  const bannerData = { judul, teks, tautan, aktif };
  if (foto_url) bannerData.foto_url = foto_url;

  let error;
  if (id) {
    ({ error } = await supabase.from("banner").update(bannerData).eq("id", id));
  } else {
    ({ error } = await supabase.from("banner").insert(bannerData));
  }

  if (error) return { error: "Gagal menyimpan banner: " + error.message };

  await catatLog(supabase, user.email, id ? "ubah_banner" : "tambah_banner", judul);
  revalidatePath("/");
  revalidatePath("/admin/banner");
  return { success: true };
}

export async function hapusBanner(id) {
  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak." };

  const { error } = await supabase.from("banner").delete().eq("id", id);
  if (error) return { error: error.message };

  await catatLog(supabase, user.email, "hapus_banner", id);
  revalidatePath("/");
  revalidatePath("/admin/banner");
  return { success: true };
}

export async function toggleAktifBanner(id, aktifSekarang) {
  const { supabase, user } = await cekLogin();
  if (!user) return { error: "Akses ditolak." };

  const { error } = await supabase
    .from("banner")
    .update({ aktif: !aktifSekarang })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/banner");
  return { success: true };
}
