"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    // POST to the server-side route — it clears SSR cookies and redirects.
    // A hard navigation after ensures no stale RSC payload is served.
    await fetch("/auth/signout", { method: "POST", credentials: "include", redirect: "manual" });
    window.location.href = "/";
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="swr-meta text-charcoal/65 hover:text-oxide flex items-center gap-2 transition-colors disabled:opacity-50"
    >
      <Icon name="arrow-right" size={12} />
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
