import { Eyebrow } from "@/components/ui/Eyebrow";
import { getProfile, getServerUser } from "@/lib/auth/server";
import { ProfileForm } from "./ProfileForm";
import { SignOutButton } from "../SignOutButton";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const [user, profile] = await Promise.all([getServerUser(), getProfile()]);

  return (
    <div className="flex flex-col gap-8">
      <Eyebrow>Settings</Eyebrow>

      <section className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-6 md:p-8 flex flex-col gap-4">
        <h2 className="swr-h4">Profile</h2>
        <p className="font-sans text-[13px] text-charcoal/65">
          Your name and contact details, shown only to you and to the bench.
        </p>
        <ProfileForm
          email={user?.email ?? ""}
          initial={{
            full_name: profile?.full_name ?? "",
            phone: profile?.phone ?? "",
          }}
        />
      </section>

      <section className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-6 md:p-8 flex flex-col gap-3">
        <h2 className="swr-h4">Email preferences</h2>
        <p className="font-sans text-[13px] text-charcoal/65">
          One quiet letter each month. Behind-the-bench notes, new pieces.
          Manage from any email we send you.
        </p>
      </section>

      <section className="rounded-xl border border-oxide/30 bg-cream-50 p-6 md:p-8 flex flex-col gap-3">
        <h2 className="swr-h4 text-oxide">Sign out</h2>
        <p className="font-sans text-[13px] text-charcoal/65">
          Ends this session on this device. You can sign back in any time.
        </p>
        <div className="mt-2">
          <SignOutButton />
        </div>
      </section>
    </div>
  );
}
