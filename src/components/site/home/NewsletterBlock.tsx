"use client";

import { useState, useTransition, FormEvent } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ShimmerLine } from "@/components/ui/ShimmerLine";
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
    <section className="bg-cream-50 border-y border-[var(--hairline)]">
      <div className="mx-auto max-w-editorial px-5 py-14 md:py-20 text-center flex flex-col items-center gap-4">
        <Eyebrow withRule>Newsletter sign-up</Eyebrow>
        <h2 className="swr-h1 italic">A quiet letter, each month.</h2>
        <ShimmerLine />
        <p className="swr-lede max-w-[500px]">
          New pieces, behind-the-bench notes, first look at sales. Nothing else.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-3 flex w-full max-w-md flex-col gap-2 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            disabled={pending}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            aria-label="Email address"
            className="flex-1 rounded-pill border border-[var(--hairline)] bg-cream px-5 py-3 font-sans text-[14px] text-charcoal placeholder:text-charcoal/40 outline-none focus:border-charcoal disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-pill bg-charcoal px-6 py-3 font-sans text-[12px] font-medium tracking-wider uppercase text-cream hover:bg-charcoal-800 disabled:opacity-50"
          >
            {pending ? "Adding…" : "Submit"}
          </button>
        </form>

        {message && (
          <p className={`font-sans text-[12px] ${message.kind === "ok" ? "text-moss" : "text-oxide"}`}>
            {message.text}
          </p>
        )}
      </div>
    </section>
  );
}
