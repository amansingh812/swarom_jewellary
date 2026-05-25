"use client";

import { useState, FormEvent } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    // No backend yet — we store locally so users get a friendly response.
    // We'll wire this to a real list (Klaviyo / Sheets / Resend) at launch.
    try {
      const existing = JSON.parse(
        localStorage.getItem("swarom_waitlist") || "[]"
      );
      if (!existing.includes(email)) existing.push(email);
      localStorage.setItem("swarom_waitlist", JSON.stringify(existing));
      setStatus("ok");
      setMessage("You're on the list. We'll be in touch when we open doors.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Background gradient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-silver-light to-cream opacity-60 blur-3xl float"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-gold/20 to-cream opacity-50 blur-3xl float"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10 sm:px-8 sm:py-14">
        {/* Top: tiny wordmark + city */}
        <header className="flex items-center justify-between text-[11px] uppercase tracking-widest text-charcoal/60">
          <span>Swarom</span>
          <span>Bengaluru · Est. 2026</span>
        </header>

        {/* Center hero */}
        <section className="flex flex-1 flex-col items-center justify-center text-center">
          {/* Hairline divider */}
          <div className="mb-10 flex items-center gap-3 text-[10px] uppercase tracking-widest text-charcoal/50">
            <span className="h-px w-8 bg-charcoal/30" />
            <span>Coming Soon</span>
            <span className="h-px w-8 bg-charcoal/30" />
          </div>

          {/* Wordmark */}
          <h1 className="font-serif text-6xl font-medium leading-none tracking-tight text-charcoal sm:text-7xl md:text-8xl">
            Swarom
          </h1>

          {/* Animated underline */}
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent shimmer" />

          {/* Tagline */}
          <p className="mt-8 max-w-md font-serif text-xl italic text-charcoal/80 sm:text-2xl">
            Your story, told in silver.
          </p>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-charcoal/65 sm:text-base">
            Personalized 925 sterling silver jewellery, handcrafted in
            Bengaluru. Made to order. Made to last.
          </p>

          {/* Email capture */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex w-full max-w-md flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="flex-1 rounded-full border border-charcoal/15 bg-cream-50 px-5 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-charcoal/40 focus:outline-none focus:ring-0 disabled:opacity-50"
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-full bg-charcoal px-6 py-3 text-sm font-medium tracking-wide text-cream transition hover:bg-charcoal-800 active:scale-[0.98] disabled:opacity-50"
            >
              {status === "loading" ? "Adding…" : "Notify me"}
            </button>
          </form>

          {/* Inline status message */}
          {message && (
            <p
              className={`mt-3 text-xs ${
                status === "ok" ? "text-charcoal/70" : "text-red-700/70"
              }`}
              role="status"
            >
              {message}
            </p>
          )}

          {/* What's coming */}
          <div className="mt-12 grid w-full max-w-md grid-cols-3 gap-4 text-[11px] uppercase tracking-widest text-charcoal/55">
            <div className="flex flex-col items-center gap-1.5">
              <Sparkle />
              <span>925 Silver</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Heart />
              <span>Personalized</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Leaf />
              <span>Made to Order</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-3 text-[11px] uppercase tracking-widest text-charcoal/50 sm:flex-row sm:justify-between">
          <span>© 2026 Swarom</span>
          <div className="flex items-center gap-5">
            <a
              href="https://wa.me/919999999999?text=Hi%20Swarom%2C%20I%27d%20love%20to%20know%20when%20you%20launch."
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-charcoal"
            >
              WhatsApp
            </a>
            <a
              href="https://instagram.com/swarom.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-charcoal"
            >
              Instagram
            </a>
            <a
              href="mailto:hello@swarom.in"
              className="hover:text-charcoal"
            >
              Email
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}

/* ---------- tiny inline icons (no extra package) ---------- */

function Sparkle() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
      <path d="M19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16z" />
    </svg>
  );
}

function Heart() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function Leaf() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 20A7 7 0 0 1 4 13c0-6 5-10 16-10 0 11-4 16-9 17z" />
      <path d="M2 22c4-4 8-6 14-8" />
    </svg>
  );
}
