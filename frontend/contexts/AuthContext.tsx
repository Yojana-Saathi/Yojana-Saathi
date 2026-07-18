"use client";

import { createContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const CONFIG_ERR = "Supabase not configured. Contact the administrator.";

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string, redirectPath?: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  demoSignIn: () => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  demoSignIn: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) {
        // Check localStorage demo session
        try {
          const stored = localStorage.getItem("yojanasaathi_demo_session");
          if (stored) {
            const parsed = JSON.parse(stored) as Session;
            setSession(parsed);
            setUser(parsed.user ?? null);
          }
        } catch {}
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user ?? null);
        } else {
          // Check localStorage for demo session
          const stored = localStorage.getItem("yojanasaathi_demo_session");
          if (stored) {
            const parsed = JSON.parse(stored) as Session;
            setSession(parsed);
            setUser(parsed.user ?? null);
          }
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    if (!supabase) return;
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setUser(session.user ?? null);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const demoSignIn = useCallback(async () => {
    const mockUser = {
      id: "demo-citizen-2026",
      app_metadata: { provider: "email" },
      user_metadata: { full_name: "Aarav Sharma" },
      aud: "authenticated",
      created_at: new Date().toISOString(),
      email: "citizen@yojanasaathi.org",
      role: "authenticated",
    } as unknown as User;

    const mockSession = {
      access_token: "demo-token-12345",
      token_type: "bearer",
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: "demo-refresh-12345",
      user: mockUser,
    } as unknown as Session;

    setUser(mockUser);
    setSession(mockSession);
    try {
      localStorage.setItem("yojanasaathi_demo_session", JSON.stringify(mockSession));
    } catch {}
    router.push("/dashboard");
  }, [router]);

  const signIn = useCallback(async (email: string, password: string, redirectPath?: string) => {
    if (!supabase) return { error: CONFIG_ERR };
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      const target = redirectPath || "/dashboard";
      router.refresh();
      if (typeof window !== "undefined") {
        window.location.href = target;
      } else {
        router.push(target);
      }
      return {};
    } catch (e) {
      return { error: e instanceof Error ? e.message : CONFIG_ERR };
    }
  }, [router]);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    if (!supabase) return { error: CONFIG_ERR };
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) return { error: error.message };
      return {};
    } catch (e) {
      return { error: e instanceof Error ? e.message : CONFIG_ERR };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      localStorage.removeItem("yojanasaathi_demo_session");
    } catch {}
    setUser(null);
    setSession(null);
    if (!supabase) {
      router.push("/");
      return;
    }
    try {
      await supabase.auth.signOut();
    } catch { /* ignore */ }
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, demoSignIn }}>
      {children}
    </AuthContext.Provider>
  );
}
