"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

function safeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/account";
  return next;
}

export function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const supabase = createBrowserSupabaseClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (password.length < 8) {
        throw new Error("Password should be at least 8 characters.");
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      if (data.user && !data.session) {
        setMessage({
          kind: "ok",
          text: "Check your inbox to confirm your email — then sign in.",
        });
      } else {
        router.push(next);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not create your account.";
      setMessage({ kind: "error", text: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full mt-6 flex flex-col gap-4">
      <Field label="Your name" value={fullName} onChange={setFullName} required />
      <Field label="Email" type="email" value={email} onChange={setEmail} required />
      <Field label="Password" type="password" value={password} onChange={setPassword} required />
      <Button type="submit" variant="primary" size="lg" disabled={loading}>
        {loading ? "Creating account…" : "Create account"}
      </Button>
      {message && (
        <p className={`font-sans text-[12px] text-center ${message.kind === "ok" ? "text-moss" : "text-oxide"}`}>
          {message.text}
        </p>
      )}
      <p className="swr-meta text-center text-charcoal/55 mt-4">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-charcoal border-b border-[var(--hairline)]">
          Sign in
        </Link>
      </p>
    </form>
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
      <span className="swr-meta text-charcoal">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-b border-[var(--hairline-strong)] px-0 py-3 font-sans text-[15px] text-charcoal outline-none focus:border-gold transition-colors"
      />
    </label>
  );
}
