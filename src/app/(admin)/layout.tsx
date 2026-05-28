import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Providers } from "@/components/site/Providers";
import { AdminSidebar } from "./AdminSidebar";

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
  const configured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR-PROJECT");

  if (configured) {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login?next=/admin");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single<{ role: "customer" | "admin" }>();
    if (profile?.role !== "admin") redirect("/");
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
