"use client";

import { useState, useTransition, FormEvent } from "react";
import { subscribeNewsletter } from "@/app/actions/newsletter";

/**
 * Full-width newsletter signup block.
 * Cream-50 panel, big italic headline, single-line input + submit.
 */
export function NewsletterBlock() {
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const res = await subscribeNewsletter(email, "home-newsletter");
      if (res.ok) {
        setMessage({ kind: "ok", text: res.message });
        setEmail("");
      } else {
        setMessage({ kind: "error", text: res.message });
      }
    });
  }

  return (
    <section className="bg-gradient-to-b from-charcoal-800 to-charcoal">
      <div className="mx-auto max-w-editorial px-6 py-16 md:py-24 text-center flex flex-col items-center gap-5">
        <span className="swr-eyebrow !text-gold-soft">Join the Maison</span>
        <h2 className="font-serif italic text-[30px] md:text-[40px] leading-[1.2] tracking-[0.03em] text-gold-soft m-0">
          A quiet letter, each month.
        </h2>
        <p className="font-sans text-[15px] leading-relaxed text-cream/70 max-w-[500px] m-0">
          New pieces, behind-the-bench notes, first look at sales. Nothing else.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-4 flex w-full max-w-md flex-col gap-4 sm:flex-row sm:gap-0"
        >
          <input
            type="email"
            required
            value={email}
            disabled={pending}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            aria-label="Email address"
            className="flex-1 border border-cream/30 bg-transparent px-5 py-3.5 font-sans text-[14px] text-cream placeholder:text-cream/40 outline-none focus:border-gold-soft disabled:opacity-50 transition-colors"
          />
          <button
            type="submit"
            disabled={pending}
            className="bg-gold-soft px-8 py-3.5 font-sans text-[11px] font-semibold tracking-widest uppercase text-charcoal hover:bg-[var(--cream)] transition-colors duration-300 disabled:opacity-50"
          >
            {pending ? "Adding…" : "Subscribe"}
          </button>
        </form>

        {message && (
          <p className={`font-sans text-[12px] ${message.kind === "ok" ? "text-gold-soft" : "text-[#FFB4AB]"}`}>
            {message.text}
          </p>
        )}
      </div>
    </section>
  );
}
