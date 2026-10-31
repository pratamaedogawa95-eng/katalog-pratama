import Link from "next/link";
import { getTokoData } from "@/lib/toko-server";

export default async function Footer() {
  const tokoData = await getTokoData();

  return (
    <footer className="mt-16 border-t border-garis bg-permukaan">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-teks-lembut sm:flex-row sm:justify-between">
        <div>
          <p className="font-bold text-teks">{tokoData.nama}</p>
          <p>{tokoData.alamat}</p>
          <p>{tokoData.jamBuka}</p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Link
            href="/tentang"
            className="underline underline-offset-4 hover:text-utama"
          >
            Tentang Toko & Kontak
          </Link>
          <Link
            href="/admin"
            className="text-xs text-teks-lembut underline underline-offset-4 hover:text-utama"
          >
            Masuk sebagai admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
