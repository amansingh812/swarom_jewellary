import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Eyebrow>Settings</Eyebrow>

      <section className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-6 md:p-8 flex flex-col gap-3">
        <h2 className="swr-h4">Profile</h2>
        <p className="font-sans text-[13px] text-charcoal/65">
          Your name and contact details, shown only to you and to the bench.
        </p>
        <Button variant="secondary">Edit profile</Button>
      </section>

      <section className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-6 md:p-8 flex flex-col gap-3">
        <h2 className="swr-h4">Email preferences</h2>
        <p className="font-sans text-[13px] text-charcoal/65">
          One quiet letter each month. Behind-the-bench notes, new pieces.
        </p>
        <Button variant="secondary">Manage preferences</Button>
      </section>

      <section className="rounded-xl border border-oxide/30 bg-cream-50 p-6 md:p-8 flex flex-col gap-3">
        <h2 className="swr-h4 text-oxide">Danger</h2>
        <p className="font-sans text-[13px] text-charcoal/65">
          Delete your account and all stored data. We keep order records for
          tax compliance only.
        </p>
        <Button variant="secondary" className="text-oxide hover:border-oxide">
          Delete account
        </Button>
      </section>
    </div>
  );
}
