"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/lib/cart/CartProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { formatINR } from "@/lib/money";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Step = "address" | "payment" | "review";

interface Address {
  full_name: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const EMPTY_ADDRESS: Address = {
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
  const [address, setAddress] = useState<Address>({
    ...EMPTY_ADDRESS,
    email: user?.email ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ready) {
    return <Skeleton />;
  }

  if (lines.length === 0 && step !== "review") {
    return (
      <div className="mx-auto max-w-editorial px-5 pt-20 pb-24 text-center md:px-10">
        <h1 className="swr-h1 mb-3">
          <i>Your bag is empty.</i>
        </h1>
        <p className="swr-lede mb-6">Add a piece before you check out.</p>
        <Button onClick={() => router.push("/shop")} variant="primary">
          Browse pieces
        </Button>
      </div>
    );
  }

  const shipping = 0;
  const total = subtotal + shipping;

  function submitAddress(e: FormEvent) {
    e.preventDefault();
    setStep("payment");
  }

  async function placeOrder() {
    setSubmitting(true);
    setError(null);
    try {
      // TODO: Wire to /api/checkout/create-order once Razorpay is configured.
      // For now we simulate a success and clear the cart.
      await new Promise((r) => setTimeout(r, 800));
      clear();
      setStep("review");
    } catch (err) {
      setError("Something went wrong. Please try again.");
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
        <h1 className="swr-h1">
          <i>Thank you.</i>
        </h1>
        <p className="swr-lede max-w-[440px]">
          We&apos;ll send a quiet email confirming the details. The bench
          starts on your piece this week — we ship in about ten days.
        </p>
        <Button variant="secondary" onClick={() => router.push("/")} className="mt-4">
          Back home
        </Button>
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
                  Razorpay isn&apos;t wired yet — placing this order will simulate
                  a success. Add <code>RAZORPAY_KEY_ID</code> to <code>.env.local</code> to
                  enable real payments.
                </p>
              </div>
              {error && <p className="font-sans text-[13px] text-oxide">{error}</p>}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setStep("address")}
                  disabled={submitting}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={placeOrder}
                  disabled={submitting}
                  className="flex-1"
                >
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
                <div className="w-14 h-16 rounded-md overflow-hidden bg-cream-200 shrink-0">
                  <Image
                    src={line.image}
                    alt=""
                    width={56}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[14px] text-charcoal">
                    {line.name}{" "}
                    {line.modifier && <i className="font-normal text-charcoal/65">{line.modifier}</i>}
                  </div>
                  <div className="font-mono text-[10px] text-charcoal/50 mt-0.5">
                    × {line.quantity}
                  </div>
                </div>
                <div className="swr-price text-[14px] whitespace-nowrap">
                  {formatINR(line.price * line.quantity)}
                </div>
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
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="swr-meta text-charcoal">{label}{required && " *"}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg bg-cream-50 border border-[var(--hairline)] px-4 py-3 font-sans text-[14px] text-charcoal outline-none focus:border-charcoal transition-colors"
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
      <span
        className={`h-6 w-6 rounded-full flex items-center justify-center font-mono text-[10px] ${
          active || done
            ? "bg-charcoal text-cream"
            : "border border-[var(--hairline-strong)] text-charcoal/40"
        }`}
      >
        {n}
      </span>
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
