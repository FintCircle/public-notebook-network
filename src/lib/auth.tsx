import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { InktellaStoreProvider } from "@/lib/inktella-store";

type AuthContextValue = {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  displayName: string;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: s }) => {
      setUser(s.session?.user ?? null);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const meta = user?.user_metadata as { full_name?: string; name?: string } | undefined;
  const displayName = meta?.full_name ?? meta?.name ?? user?.email?.split("@")[0] ?? "";

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        loading,
        user,
        displayName,
        signOut: async () => {
          await supabase.auth.signOut();
        },
      }}
    >
      <InktellaStoreProvider userId={user?.id ?? null}>{children}</InktellaStoreProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}

export function AuthGate({ children, message = "This corner is for signed-in notebook people." }: { children: ReactNode; message?: string }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;
  if (isAuthenticated) return children;

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <section className="max-w-md text-center">
        <p className="hand text-3xl text-muted-foreground">the bouncer is very polite</p>
        <h1 className="mt-4 font-heading text-3xl tracking-tight">You&apos;ll need an account for this bit.</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">{message}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-4">
          <Link to="/sign-in" className="rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground">Join / Sign in</Link>
          <button type="button" onClick={() => navigate({ to: "/" })} className="px-5 py-3 text-sm underline underline-offset-4">Take me somewhere public</button>
        </div>
      </section>
    </main>
  );
}

export function AuthOnly({ children, message }: { children: ReactNode; message?: string }) {
  return <AuthGate message={message}>{children}</AuthGate>;
}
