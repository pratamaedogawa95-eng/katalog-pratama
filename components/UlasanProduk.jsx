"use client";

import { useState } from "react";
import { kirimUlasanProduk } from "@/app/produk/actions";

const ulasanAwal = [
  {
    id: 1,
    nama: "Budi Santoso",
    rating: 5,
    komentar: "Rasa sangat gurih dan renyah! Pengiriman cepat, dikemas rapi dengan bubble wrap.",
    waktu: "2 hari yang lalu",
  },
  {
    id: 2,
    nama: "Siti Rahma",
    rating: 5,
    komentar: "Kualitas premium, cocok banget buat suguhan tamu dan oleh-oleh keluarga di rumah.",
    waktu: "1 minggu yang lalu",
  },
];

export default function UlasanProduk({ produkId }) {
  const [daftarUlasan, setDaftarUlasan] = useState(ulasanAwal);
  const [nama, setNama] = useState("");
  const [rating, setRating] = useState(5);
  const [komentar, setKentar] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pesan, setPesan] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPesan(null);

    const formData = new FormData(e.target);
    const res = await kirimUlasanProduk(null, formData);

    setIsSubmitting(false);

    if (res.error) {
      setPesan({ tipe: "error", teks: res.error });
    } else {
      setPesan({ tipe: "sukses", teks: res.message });
      if (res.ulasanBaru) {
        setDaftarUlasan([res.ulasanBaru, ...daftarUlasan]);
      }
      setNama("");
      setKentar("");
    }
  };

  const rataRata = (
    daftarUlasan.reduce((sum, u) => sum + u.rating, 0) / daftarUlasan.length
  ).toFixed(1);

  return (
    <section className="mt-12 rounded-2xl border border-garis bg-latar p-6 sm:p-8">
      <div className="flex flex-col gap-4 border-b border-garis pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-teks">Ulasan & Rating Pembeli</h2>
          <p className="mt-1 text-xs text-teks-lembut">
            Penilaian asli dari pelanggan yang telah memesan produk ini.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-permukaan px-4 py-2">
          <span className="text-2xl font-black text-harga">{rataRata}</span>
          <div className="flex flex-col">
            <span className="text-amber-500 text-sm">★★★★★</span>
            <span className="text-[11px] text-teks-lembut">{daftarUlasan.length} ulasan</span>
          </div>
        </div>
      </div>

      {/* Grid: Form Ulasan & Daftar Ulasan */}
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Form Tambah Ulasan */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-garis bg-permukaan/40 p-5">
          <h3 className="text-sm font-bold text-teks">Tulis Ulasan Anda</h3>

          {/* Honeypot anti-spam */}
          <input type="text" name="website" className="hidden" tabIndex="-1" autoComplete="off" />
          <input type="hidden" name="produk_id" value={produkId} />

          {pesan && (
            <div
              className={`rounded-lg p-3 text-xs font-semibold ${
                pesan.tipe === "sukses"
                  ? "bg-utama/10 text-utama"
                  : "bg-bahaya/10 text-bahaya"
              }`}
            >
              {pesan.teks}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-teks-lembut">Nama Anda:</label>
            <input
              type="text"
              name="nama"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Rahadian"
              className="mt-1 w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-teks-lembut">Rating:</label>
            <div className="mt-1 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-xl transition ${
                    star <= rating ? "text-amber-500 scale-110" : "text-garis"
                  }`}
                >
                  ★
                </button>
              ))}
              <input type="hidden" name="rating" value={rating} />
              <span className="ml-2 text-xs font-bold text-teks">{rating} dari 5 bintang</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-teks-lembut">
              Komentar / Pengalaman (Maks. 500 karakter):
            </label>
            <textarea
              name="komentar"
              rows={3}
              required
              maxLength={500}
              value={komentar}
              onChange={(e) => setKentar(e.target.value)}
              placeholder="Ceritakan rasa, kemasan, atau kecepatan pengiriman..."
              className="mt-1 w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-utama py-2 text-xs font-bold text-white transition hover:bg-utama-gelap disabled:opacity-50"
          >
            {isSubmitting ? "Mengirim ulasan..." : "Kirim Ulasan"}
          </button>
        </form>

        {/* Daftar Ulasan */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-teks">Ulasan Terbaru</h3>

          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
            {daftarUlasan.map((u) => (
              <div key={u.id} className="rounded-xl border border-garis bg-latar p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-teks">{u.nama}</span>
                  <span className="text-[11px] text-teks-lembut">{u.waktu}</span>
                </div>
                <div className="mt-1 text-amber-500 text-xs">
                  {"★".repeat(u.rating)}{"☆".repeat(5 - u.rating)}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-teks-lembut">{u.komentar}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

