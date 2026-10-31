"use client";

import { useState } from "react";
import { tanyaAsistenProduk } from "@/app/produk/actions";

export default function AsistenAIProduk({ produk }) {
  const [pertanyaan, setPertanyaan] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      pengirim: "ai",
      teks: `Halo! Saya Asisten Pintar ${produk.nama}. Mau tanya soal ketahanan produk, cara pemesanan, atau rekomendasi varian? Silakan tanyakan di bawah!`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saranTanya = [
    "Berapa lama masa simpannya?",
    "Bagaimana opsi pengirimannya?",
    "Apakah produk ini ready stock?",
  ];

  const handleKirim = async (teksKirim) => {
    const q = teksKirim || pertanyaan;
    if (!q.trim() || loading) return;

    setError(null);
    setChatLog((prev) => [...prev, { pengirim: "user", teks: q }]);
    setPertanyaan("");
    setLoading(true);

    const res = await tanyaAsistenProduk(produk.id, q);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setChatLog((prev) => [...prev, { pengirim: "ai", teks: res.jawaban }]);
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-utama/30 bg-linear-to-b from-utama/5 to-permukaan/40 p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-utama text-base text-white">
          🤖
        </span>
        <div>
          <h2 className="text-lg font-bold text-teks">Tanya Asisten AI seputar {produk.nama}</h2>
          <p className="text-xs text-teks-lembut">Jawaban instan otomatis berdasarkan data produk & panduan toko.</p>
        </div>
      </div>

      {/* Bubble Chat Log */}
      <div className="mt-4 flex max-h-72 flex-col gap-3 overflow-y-auto rounded-xl border border-garis bg-latar p-4">
        {chatLog.map((chat, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              chat.pengirim === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                chat.pengirim === "user"
                  ? "bg-utama text-white rounded-br-xs"
                  : "bg-permukaan text-teks rounded-bl-xs border border-garis/80"
              }`}
            >
              {chat.teks}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-teks-lembut animate-pulse">
            <span>🤖 Asisten sedang mengetik jawaban...</span>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs font-semibold text-bahaya">{error}</p>
      )}

      {/* Saran Pertanyaan Cepat */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {saranTanya.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleKirim(s)}
            className="rounded-full border border-garis bg-latar px-2.5 py-1 text-[11px] font-medium text-teks-lembut hover:border-utama hover:text-utama"
          >
            💬 {s}
          </button>
        ))}
      </div>

      {/* Form Input Chat */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleKirim();
        }}
        className="mt-3 flex gap-2"
      >
        <input
          type="text"
          maxLength={200}
          value={pertanyaan}
          onChange={(e) => setPertanyaan(e.target.value)}
          placeholder="Ketik pertanyaanmu seputar produk ini..."
          className="flex-1 rounded-xl border border-garis bg-latar px-4 py-2.5 text-xs text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !pertanyaan.trim()}
          className="rounded-xl bg-utama px-4 py-2 text-xs font-bold text-white transition hover:bg-utama-gelap disabled:opacity-50"
        >
          Kirim
        </button>
      </form>
    </section>
  );
}

