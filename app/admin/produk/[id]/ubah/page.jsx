import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProdukAdmin from "@/components/FormProdukAdmin";
import { createSessionClient } from "@/lib/supabase/session";

// US-09: Ubah produk
export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;
  const supabase = await createSessionClient();

  const { data: produk } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .single();

  if (!produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProdukAdmin mode="ubah" produk={produk} />
    </div>
  );
}
