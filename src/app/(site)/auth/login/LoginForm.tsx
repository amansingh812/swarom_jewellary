"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Mode = "password" | "magic" | "phone-otp";

function safeNext(next: string | null): string {
  // Only allow internal next URLs (prevent open redirect).
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/account";
  return next;
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const supabase = createBrowserSupabaseClient();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (mode === "password") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(next);
        router.refresh();
      } else if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (error) throw error;
        setMessage({ kind: "ok", text: "Check your inbox — we sent you a sign-in link." });
      } else if (mode === "phone-otp") {
        if (!otpSent) {
          const { error } = await supabase.auth.signInWithOtp({ phone: phone.startsWith("+") ? phone : `+91${phone}` });
          if (error) throw error;
          setOtpSent(true);
          setMessage({ kind: "ok", text: "We sent a 6-digit code to your phone." });
        } else {
          const { error } = await supabase.auth.verifyOtp({
            phone: phone.startsWith("+") ? phone : `+91${phone}`,
            token: otp,
            type: "sms",
          });
          if (error) throw error;
          router.push("/account");
          router.refresh();
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not sign you in.";
      setMessage({ kind: "error", text: msg });
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed.";
      setMessage({ kind: "error", text: msg });
      setLoading(false);
    }
  }

  return (
    <div className="w-full mt-8 flex flex-col gap-5">
      {/* Mode pills */}
      <div className="flex items-center gap-2 justify-center flex-wrap">
        <ModePill active={mode === "password"} onClick={() => setMode("password")}>Email</ModePill>
        <ModePill active={mode === "magic"} onClick={() => setMode("magic")}>Magic link</ModePill>
        <ModePill active={mode === "phone-otp"} onClick={() => setMode("phone-otp")}>Phone</ModePill>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {mode !== "phone-otp" ? (
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
          />
        ) : (
          <Field
            label="Phone (with country code)"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="+91 99999 99999"
            required
            disabled={otpSent}
          />
        )}

        {mode === "password" && (
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            required
          />
        )}

        {mode === "phone-otp" && otpSent && (
          <Field
            label="6-digit code"
            type="text"
            value={otp}
            onChange={setOtp}
            required
            inputMode="numeric"
          />
        )}

        <Button type="submit" variant="primary" size="lg" disabled={loading}>
          {loading
            ? "Please wait…"
            : mode === "magic"
            ? "Send sign-in link"
            : mode === "phone-otp" && !otpSent
            ? "Send code"
            : "Sign in"}
        </Button>
      </form>

      {message && (
        <p
          className={`font-sans text-[12px] text-center ${
            message.kind === "ok" ? "text-moss" : "text-oxide"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="flex items-center gap-3 my-2">
        <span className="flex-1 h-px bg-[var(--hairline)]" />
        <span className="swr-meta text-charcoal/40">or</span>
        <span className="flex-1 h-px bg-[var(--hairline)]" />
      </div>

      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={signInWithGoogle}
        disabled={loading}
      >
        <GoogleG /> Continue with Google
      </Button>

      <div className="flex justify-between mt-4">
        <Link href="/auth/forgot" className="swr-meta text-charcoal/65 hover:text-charcoal border-b border-[var(--hairline)]">
          Forgot password
        </Link>
        <Link href="/auth/signup" className="swr-meta text-charcoal/65 hover:text-charcoal border-b border-[var(--hairline)] inline-flex items-center gap-1">
          New here? <Icon name="arrow-right" size={10} />
        </Link>
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
  placeholder,
  disabled,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  inputMode?: "numeric" | "text" | "email" | "tel";
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="swr-meta text-charcoal">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={inputMode}
        className="bg-transparent border-b border-[var(--hairline-strong)] px-0 py-3 font-sans text-[15px] text-charcoal outline-none focus:border-gold transition-colors disabled:opacity-50"
      />
    </label>
  );
}

function ModePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-pill px-4 py-2 font-sans text-[11px] tracking-wider uppercase transition-colors ${
        active
          ? "bg-charcoal text-cream"
          : "bg-transparent text-charcoal/65 border border-[var(--hairline)] hover:text-charcoal"
      }`}
    >
      {children}
    </button>
  );
}

function GoogleG() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4 9.6-9.7 0-.7 0-1.2-.2-1.7H12z"
      />
    </svg>
  );
}
