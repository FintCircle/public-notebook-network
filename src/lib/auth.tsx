import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ClerkProvider, useClerk, useUser } from "@clerk/clerk-react";
import { getClerkPublishableKey } from "@/lib/inktella.functions";
import { InktellaStoreProvider } from "@/lib/inktella-store";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    getClerkPublishableKey().then(setKey).catch(() => setKey(""));
  }, []);

  if (key === null) {
    return <div className="flex min-h-screen items-center justify-center"><p className="hand text-2xl opacity-50">opening the notebooks…</p></div>;
  }
  if (!key) {
    return <div className="flex min-h-screen items-center justify-center px-5 text-center"><p>Sign-in isn&apos;t set up yet.</p></div>;
  }
  return (
    <ClerkProvider publishableKey={key} signInUrl="/sign-in" signUpUrl="/sign-in" afterSignOutUrl="/">
      <StoreWithUser>{children}</StoreWithUser>
    </ClerkProvider>
  );
}

function StoreWithUser({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return <div className="flex min-h-screen items-center justify-center"><p className="hand text-2xl opacity-50">opening the notebooks…</p></div>;
  }
  return <InktellaStoreProvider userKey={user?.id ?? null}>{children}</InktellaStoreProvider>;
}

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();
  return {
    isAuthenticated: !!isSignedIn,
    loading: !isLoaded,
    user,
    displayName: user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress.split("@")[0] || "",
    signOut: () => clerk.signOut(),
  };
}

export function AuthGate({ children, message = "This corner is for signed-in notebook people." }: { children: ReactNode; message?: string | undefined }) {
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

export function AuthOnly({ children, message }: { children: ReactNode; message?: string | undefined }) {
  return <AuthGate message={message}>{children}</AuthGate>;
}
