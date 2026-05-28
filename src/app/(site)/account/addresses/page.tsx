import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Addresses" };

export default function AddressesPage() {
  // TODO: wire to Supabase `addresses` table with full CRUD.
  return (
    <div className="flex flex-col gap-4">
      <Eyebrow>Addresses</Eyebrow>
      <p className="swr-lede max-w-[420px]">
        Save a default shipping address so checkout is one tap.
      </p>
      <div className="rounded-xl border border-dashed border-[var(--hairline-strong)] bg-cream-50 p-8 text-center">
        <p className="font-serif italic text-[18px] text-charcoal/70 mb-3">
          No addresses yet.
        </p>
        <Button variant="secondary">Add an address</Button>
      </div>
    </div>
  );
}
