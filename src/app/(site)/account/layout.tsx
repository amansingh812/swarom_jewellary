import { AccountNav } from "./AccountNav";
import { SignOutButton } from "./SignOutButton";
import { getServerUser, getProfile } from "@/lib/auth/server";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Account pages read user session cookies — never prerender.
export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | null = null;
  let fullName: string | null = null;

  if (isSupabaseConfigured()) {
    const user = await getServerUser();
    if (!user) redirect("/auth/login?next=/account");
    const profile = await getProfile();
    userEmail = user.email ?? null;
    fullName =
      profile?.full_name ??
      (user.user_metadata?.full_name as string | undefined) ??
      null;
  } else {
    userEmail = "you@swarom.in";
    fullName = "Friend";
  }

  return (
    <div className="mx-auto max-w-marketing px-5 pt-10 pb-24 md:px-10 md:pt-14">
      <header className="flex flex-col gap-2 mb-10 md:mb-14">
        <span className="swr-eyebrow text-charcoal/55">Your account</span>
        <h1 className="swr-h1">
          <i>Hello, {fullName?.split(" ")[0] || "friend"}.</i>
        </h1>
        <p className="swr-meta text-charcoal/45">{userEmail}</p>
      </header>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[200px_1fr] md:gap-16">
        <aside className="flex flex-col gap-1">
          <AccountNav />
          <div className="mt-6 pt-6 border-t border-[var(--hairline)]">
            <SignOutButton />
          </div>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
