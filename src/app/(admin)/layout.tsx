import { Providers } from "@/components/site/Providers";
import { AdminSidebar } from "./AdminSidebar";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/server";

export const metadata = {
  title: "Admin · Swarom",
  robots: { index: false, follow: false },
};

// Admin pages depend on session + role — never prerender.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isSupabaseConfigured()) {
    await requireAdmin();
  }

  return (
    <Providers>
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr] bg-cream">
        <AdminSidebar />
        <main className="px-5 py-8 md:px-10 md:py-12">{children}</main>
      </div>
    </Providers>
  );
}
