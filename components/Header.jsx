import Link from "next/link";
import { getTokoData } from "@/lib/toko-server";
import NavHeaderKlien from "@/components/NavHeaderKlien";

export default async function Header() {
  const tokoData = await getTokoData();

  return (
    <header className="sticky top-0 z-30 border-b border-garis bg-latar/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-lg font-extrabold tracking-tight text-utama"
          >
            {tokoData.nama}
          </Link>
          <Link
            href="/tentang"
            className="hidden text-xs font-semibold text-teks-lembut hover:text-utama sm:inline"
          >
            Tentang
          </Link>
        </div>
        <NavHeaderKlien />
      </div>
    </header>
  );
}
