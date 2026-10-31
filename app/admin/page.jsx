import NavAdmin from "@/components/NavAdmin";
import { createSessionClient } from "@/lib/supabase/session";

// US-30, US-41, US-45: Dashboard admin
export default async function HalamanDashboard() {
  const supabase = await createSessionClient();

  // Total produk
  const { count: totalProduk } = await supabase
    .from("produk")
    .select("*", { count: "exact", head: true });

  // Produk aktif
  let produkAktif = totalProduk;
  try {
    const { count } = await supabase
      .from("produk")
      .select("*", { count: "exact", head: true })
      .eq("aktif", true);
    produkAktif = count;
  } catch {}

  // Produk per kategori
  const { data: semuaProduk } = await supabase
    .from("produk")
    .select("kategori");

  const perKategori = {};
  (semuaProduk || []).forEach((p) => {
    const k = p.kategori || "Tanpa kategori";
    perKategori[k] = (perKategori[k] || 0) + 1;
  });
  const daftarKategori = Object.entries(perKategori).sort((a, b) => b[1] - a[1]);

  // Produk terlaris (US-41 dari log_klik_wa)
  let produkTerlaris = [];
  try {
    const { data: logKlik } = await supabase
      .from("log_klik_wa")
      .select("produk_id");

    if (logKlik && logKlik.length > 0) {
      const hitungKlik = {};
      logKlik.forEach((l) => {
        hitungKlik[l.produk_id] = (hitungKlik[l.produk_id] || 0) + 1;
      });
      const top5 = Object.entries(hitungKlik)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const ids = top5.map(([id]) => id);
      const { data: produkData } = await supabase
        .from("produk")
        .select("id, nama")
        .in("id", ids);

      produkTerlaris = top5.map(([id, jumlah]) => ({
        id,
        jumlah,
        nama:
          produkData?.find((p) => String(p.id) === String(id))?.nama ||
          "Produk dihapus",
      }));
    }
  } catch {}

  // Log aktivitas (US-45)
  let logAktivitas = [];
  try {
    const { data } = await supabase
      .from("log_aktivitas_admin")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    logAktivitas = data || [];
  } catch {}

  return (
    <div className="flex flex-col gap-8 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Dashboard</h1>

      {/* Statistik ringkasan */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-garis bg-permukaan p-5">
          <p className="text-sm text-teks-lembut">Total produk</p>
          <p className="text-3xl font-extrabold text-utama">{totalProduk ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-garis bg-permukaan p-5">
          <p className="text-sm text-teks-lembut">Produk aktif</p>
          <p className="text-3xl font-extrabold text-utama">{produkAktif ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-garis bg-permukaan p-5">
          <p className="text-sm text-teks-lembut">Total klik WA</p>
          <p className="text-3xl font-extrabold text-utama">
            {produkTerlaris.reduce((s, p) => s + p.jumlah, 0)}
          </p>
        </div>
      </div>

      {/* Produk per kategori */}
      <section>
        <h2 className="mb-3 text-lg font-bold">Produk per kategori</h2>
        {daftarKategori.length === 0 ? (
          <p className="text-teks-lembut">Belum ada data.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-garis">
            <table className="w-full text-left text-sm">
              <thead className="bg-permukaan text-teks-lembut">
                <tr>
                  <th className="px-4 py-3 font-semibold">Kategori</th>
                  <th className="px-4 py-3 font-semibold">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {daftarKategori.map(([k, n]) => (
                  <tr key={k} className="border-t border-garis">
                    <td className="px-4 py-3">{k}</td>
                    <td className="px-4 py-3 font-semibold">{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 5 produk terlaris */}
      <section>
        <h2 className="mb-3 text-lg font-bold">5 produk terlaris (klik WhatsApp)</h2>
        {produkTerlaris.length === 0 ? (
          <p className="text-teks-lembut">Belum ada data klik WhatsApp.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-garis">
            <table className="w-full text-left text-sm">
              <thead className="bg-permukaan text-teks-lembut">
                <tr>
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Nama produk</th>
                  <th className="px-4 py-3 font-semibold">Jumlah klik</th>
                </tr>
              </thead>
              <tbody>
                {produkTerlaris.map((p, i) => (
                  <tr key={p.id} className="border-t border-garis">
                    <td className="px-4 py-3 text-teks-lembut">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold">{p.nama}</td>
                    <td className="px-4 py-3">{p.jumlah}×</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Log aktivitas */}
      <section>
        <h2 className="mb-3 text-lg font-bold">Log aktivitas (50 terakhir)</h2>
        {logAktivitas.length === 0 ? (
          <p className="text-teks-lembut">Belum ada aktivitas tercatat.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-garis">
            <table className="w-full text-left text-sm">
              <thead className="bg-permukaan text-teks-lembut">
                <tr>
                  <th className="px-4 py-3 font-semibold">Waktu</th>
                  <th className="px-4 py-3 font-semibold">Admin</th>
                  <th className="px-4 py-3 font-semibold">Aksi</th>
                  <th className="px-4 py-3 font-semibold">Detail</th>
                </tr>
              </thead>
              <tbody>
                {logAktivitas.map((log) => (
                  <tr key={log.id} className="border-t border-garis">
                    <td className="whitespace-nowrap px-4 py-3 text-teks-lembut">
                      {new Date(log.created_at).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3">{log.admin_email}</td>
                    <td className="px-4 py-3">{log.aksi}</td>
                    <td className="px-4 py-3 text-teks-lembut">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
