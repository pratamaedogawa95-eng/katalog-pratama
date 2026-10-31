import NavAdmin from "@/components/NavAdmin";
import AkunAdminList from "@/components/AkunAdminList";
import { createSessionClient } from "@/lib/supabase/session";
import { createServerClient } from "@/lib/supabase/server";

// US-44: Kelola akun admin
export default async function HalamanAkun() {
  const supabaseSession = await createSessionClient();
  const {
    data: { user: userSaya },
  } = await supabaseSession.auth.getUser();

  const supabaseAdmin = createServerClient();
  let daftarAdmin = [];
  let errorMsg = null;

  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) errorMsg = error.message;
    else daftarAdmin = data?.users || [];
  } catch (e) {
    errorMsg = e.message;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Kelola akun admin</h1>
      {errorMsg ? (
        <p className="rounded-lg bg-permukaan p-4 text-sm text-bahaya">
          Gagal memuat akun: {errorMsg}
        </p>
      ) : (
        <AkunAdminList
          daftarAdmin={daftarAdmin}
          userSayaId={userSaya?.id}
        />
      )}
    </div>
  );
}

