"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { formatINR } from "@/lib/money";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { createOrder } from "@/app/actions/orders";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Address } from "@/lib/supabase/types";

type Step = "address" | "payment" | "review";

interface CheckoutAddress {
  full_name: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const EMPTY_ADDRESS: CheckoutAddress = {
  full_name: "",
  phone: "",
  email: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

export function Checkout() {
  const router = useRouter();
  const { lines, subtotal, clear, ready } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<CheckoutAddress>({
    ...EMPTY_ADDRESS,
    email: user?.email ?? "",
  });
  const [saved, setSaved] = useState<Address[]>([]);
  const [savedSelected, setSavedSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  // Load saved addresses for logged-in users.
  useEffect(() => {
    if (!user) return;
    const supabase = createBrowserSupabaseClient();
    supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        setSaved(data);
        const def = data.find((a) => a.is_default) ?? data[0];
        if (def) {
          setSavedSelected(def.id);
          setAddress({
            full_name: def.full_name,
            phone: def.phone,
            email: user.email ?? "",
            line1: def.line1,
            line2: def.line2 ?? "",
            city: def.city,
            state: def.state,
            pincode: def.pincode,
          });
        }
      });
  }, [user]);

  if (!ready) return <Skeleton />;

  if (lines.length === 0 && step !== "review") {
    return (
      <div className="mx-auto max-w-editorial px-5 pt-20 pb-24 text-center md:px-10">
        <h1 className="swr-h1 mb-3"><i>Your bag is empty.</i></h1>
        <p className="swr-lede mb-6">Add a piece before you check out.</p>
        <Button onClick={() => router.push("/shop")} variant="primary">Browse pieces</Button>
      </div>
    );
  }

  const shipping = 0;
  const total = subtotal + shipping;

  function selectSaved(id: string) {
    const a = saved.find((x) => x.id === id);
    if (!a) return;
    setSavedSelected(id);
    setAddress({
      full_name: a.full_name,
      phone: a.phone,
      email: user?.email ?? "",
      line1: a.line1,
      line2: a.line2 ?? "",
      city: a.city,
      state: a.state,
      pincode: a.pincode,
    });
  }

  function submitAddress(e: FormEvent) {
    e.preventDefault();
    setStep("payment");
  }

  async function placeOrder() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await createOrder({
        lines,
        shipping_address: address,
      });
      if (!res.ok) {
        setError(res.message ?? "Could not place order.");
        setSubmitting(false);
        return;
      }
      setConfirmedOrderId(res.orderId ?? null);
      clear();
      setStep("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "review") {
    return (
      <div className="mx-auto max-w-editorial px-5 pt-16 pb-24 text-center md:px-10 flex flex-col items-center gap-4">
        <div className="h-14 w-14 rounded-full border border-gold flex items-center justify-center text-gold">
          <Icon name="check" size={20} />
        </div>
        <Eyebrow withRule>Order placed</Eyebrow>
        <h1 className="swr-h1"><i>Thank you.</i></h1>
        <p className="swr-lede max-w-[440px]">
          We&apos;ll send a quiet email confirming the details. The bench
          starts on your piece this week — we ship in about ten days.
        </p>
        {confirmedOrderId && (
          <p className="swr-meta text-charcoal/60">
            Order ref: <span className="font-sans tracking-wider">#{confirmedOrderId.slice(0, 8)}</span>
          </p>
        )}
        <div className="flex gap-3 mt-4">
          {confirmedOrderId && user && (
            <Link
              href={`/account/orders/${confirmedOrderId}`}
              className="rounded-pill bg-charcoal text-cream px-6 py-3 font-sans text-[13px] font-medium tracking-wide hover:bg-charcoal-800"
            >
              View order
            </Link>
          )}
          <Button variant="secondary" onClick={() => router.push("/")}>
            Back home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-marketing px-5 pt-10 pb-24 md:px-10 md:pt-16">
      <header className="flex items-center justify-between mb-8 md:mb-12">
        <h1 className="swr-h1">Checkout</h1>
        <div className="hidden md:flex items-center gap-3">
          <StepDot active={step === "address"} done={step === "payment"} label="Address" n={1} />
          <span className="h-px w-8 bg-[var(--hairline-strong)]" />
          <StepDot active={step === "payment"} done={false} label="Payment" n={2} />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[7fr_5fr] md:gap-16">
        <div>
          {step === "address" && (
            <form onSubmit={submitAddress} className="flex flex-col gap-5">
              <Eyebrow>Where should we send it?</Eyebrow>

              {!user && (
                <div className="rounded-lg bg-cream-200 px-4 py-3 font-sans text-[13px] text-charcoal/75">
                  Have an account?{" "}
                  <Link href="/auth/login?next=/checkout" className="text-charcoal border-b border-[var(--hairline)] hover:border-charcoal">
                    Sign in
                  </Link>{" "}
                  for one-tap checkout.
                </div>
              )}

              {saved.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="swr-meta text-charcoal">Saved addresses</span>
                  <div className="flex flex-col gap-2">
                    {saved.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => selectSaved(a.id)}
                        className={`text-left rounded-lg border p-4 transition-colors ${
                          savedSelected === a.id
                            ? "border-charcoal bg-cream-50"
                            : "border-[var(--hairline)] hover:border-[var(--hairline-strong)]"
                        }`}
                      >
                        <div className="font-serif font-medium text-[14px] text-charcoal">{a.full_name}</div>
                        <div className="font-sans text-[12px] text-charcoal/65 mt-0.5">
                          {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} {a.pincode}
                        </div>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setSavedSelected(null);
                        setAddress({ ...EMPTY_ADDRESS, email: user?.email ?? "" });
                      }}
                      className={`text-left rounded-lg border border-dashed p-4 transition-colors ${
                        savedSelected === null ? "border-charcoal bg-cream-50" : "border-[var(--hairline-strong)]"
                      }`}
                    >
                      <span className="swr-meta text-charcoal">+ Use a different address</span>
                    </button>
                  </div>
                </div>
              )}

              <Field label="Full name" value={address.full_name} onChange={(v) => setAddress({ ...address, full_name: v })} required />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Email" type="email" value={address.email} onChange={(v) => setAddress({ ...address, email: v })} required />
                <Field label="Phone" type="tel" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} required />
              </div>
              <Field label="Address line 1" value={address.line1} onChange={(v) => setAddress({ ...address, line1: v })} required />
              <Field label="Address line 2" value={address.line2} onChange={(v) => setAddress({ ...address, line2: v })} />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <Field label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} required />
                <Field label="State" value={address.state} onChange={(v) => setAddress({ ...address, state: v })} required />
                <Field label="Pincode" value={address.pincode} onChange={(v) => setAddress({ ...address, pincode: v })} required />
              </div>
              <Button type="submit" variant="primary" size="lg" className="mt-4 self-start">
                Continue to payment
              </Button>
            </form>
          )}

          {step === "payment" && (
            <div className="flex flex-col gap-6">
              <Eyebrow>Payment</Eyebrow>
              <div className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-6">
                <h3 className="swr-h4 mb-3">Razorpay · Cards, UPI, Netbanking</h3>
                <p className="font-sans text-[13px] text-charcoal/65 leading-relaxed">
                  Payments are processed securely via Razorpay. We support all
                  Indian cards, UPI (PhonePe, Google Pay, Paytm), and net banking.
                </p>
                <p className="font-sans text-[12px] text-charcoal/50 mt-4 italic">
                  Razorpay isn&apos;t wired yet — placing this order saves it as{" "}
                  <code>pending</code>. The bench will reach out via WhatsApp to confirm
                  payment.
                </p>
              </div>
              {error && <p className="font-sans text-[13px] text-oxide">{error}</p>}
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep("address")} disabled={submitting}>
                  Back
                </Button>
                <Button variant="primary" size="lg" onClick={placeOrder} disabled={submitting} className="flex-1">
                  {submitting ? "Placing order…" : `Place order — ${formatINR(total)}`}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <aside className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-6 md:p-8 h-fit">
          <Eyebrow>Your order</Eyebrow>
          <ul className="mt-4 m-0 p-0 list-none flex flex-col gap-4">
            {lines.map((line) => (
              <li key={line.key} className="flex gap-3 items-start">
                <div className="w-14 h-16 overflow-hidden bg-cream-200 shrink-0">
                  <Image src={line.image} alt="" width={56} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[14px] text-charcoal">
                    {line.name}{" "}
                    {line.modifier && <i className="font-normal text-charcoal/65">{line.modifier}</i>}
                  </div>
                  <div className="font-sans text-[11px] tracking-wider text-charcoal/50 mt-0.5">× {line.quantity}</div>
                </div>
                <div className="swr-price text-[14px] whitespace-nowrap">{formatINR(line.price * line.quantity)}</div>
              </li>
            ))}
          </ul>
          <div className="h-px bg-[var(--hairline)] my-5" />
          <div className="flex flex-col gap-2">
            <Row label="Subtotal" value={formatINR(subtotal)} />
            <Row label="Shipping" value="Free" />
            <Row label="Total" value={formatINR(total)} large />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="swr-meta text-charcoal">{label}{required && " *"}</span>
      <input
        type={type} required={required} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-b border-[var(--hairline-strong)] px-0 py-3 font-sans text-[15px] text-charcoal outline-none focus:border-gold transition-colors"
      />
    </label>
  );
}

function Row({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className={large ? "swr-eyebrow text-charcoal" : "swr-meta"}>{label}</span>
      <span className={large ? "swr-price-lg" : "swr-price"}>{value}</span>
    </div>
  );
}

function StepDot({ active, done, label, n }: { active: boolean; done: boolean; label: string; n: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-6 w-6 rounded-full flex items-center justify-center font-sans text-[10px] font-semibold ${
        active || done ? "bg-gold text-cream" : "border border-[var(--hairline-strong)] text-charcoal/40"
      }`}>{n}</span>
      <span className={`swr-meta ${active ? "text-charcoal" : "text-charcoal/40"}`}>{label}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-marketing px-5 py-20 md:px-10">
      <p className="swr-meta text-charcoal/50">Loading…</p>
    </div>
  );
}
