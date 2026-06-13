"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ShimmerLine } from "@/components/ui/ShimmerLine";
import { Button } from "@/components/ui/Button";

export default function ForgotPage() {
  const supabase = createBrowserSupabaseClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/auth/reset`,
      });
      if (error) throw error;
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not send reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <Eyebrow withRule>Reset</Eyebrow>
      <h1 className="swr-h1 text-center">
        <i>Forgotten?</i>
      </h1>
      <ShimmerLine />
      <p className="swr-lede text-center max-w-[360px]">
        Tell us your email and we&apos;ll send you a link to set a new password.
      </p>

      {done ? (
        <p className="swr-body text-center text-moss mt-6">
          Check your inbox. The link is good for one hour.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="w-full mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="swr-meta text-charcoal">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-b border-[var(--hairline-strong)] px-0 py-3 font-sans text-[15px] text-charcoal outline-none focus:border-gold transition-colors"
            />
          </label>
          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
          {error && <p className="font-sans text-[12px] text-center text-oxide">{error}</p>}
        </form>
      )}

      <Link href="/auth/login" className="swr-meta text-charcoal/65 border-b border-[var(--hairline)] mt-4">
        Back to sign in
      </Link>
    </div>
  );
}
