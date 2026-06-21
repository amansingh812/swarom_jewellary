"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Stable client instance — must not be recreated on every render or the
  // useEffect dependency changes every cycle, causing infinite re-subscription.
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  async function signOut() {
    // Delegate to the server-side route which clears the SSR cookies properly.
    await fetch("/auth/signout", { method: "POST", credentials: "include" });
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{ user: session?.user ?? null, session, loading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
