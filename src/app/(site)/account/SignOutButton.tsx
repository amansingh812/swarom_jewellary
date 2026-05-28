"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Icon } from "@/components/ui/Icon";

export function SignOutButton() {
  const router = useRouter();
  const { signOut } = useAuth();

  async function onClick() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={onClick}
      className="swr-meta text-charcoal/65 hover:text-oxide flex items-center gap-2 transition-colors"
    >
      <Icon name="arrow-right" size={12} /> Sign out
    </button>
  );
}
