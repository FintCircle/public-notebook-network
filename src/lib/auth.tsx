import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ClerkProvider, useClerk, useUser } from "@clerk/clerk-react";
import { getClerkPublishableKey } from "@/lib/inktella.functions";
import { portalUrl } from "@/lib/account-portal";
import { CLERK_PUBLISHABLE_KEY_FALLBACK } from "@/lib/clerk-config";
import { InktellaStoreProvider } from "@/lib/inktella-store";

export type AuthContextValue = {
  isAuthenticated: boolean;
  loading: boolean;
  user: ReturnType<typeof useUser>["user"];
  displayName: string;
  signOut: () => Promise<void>;
};

const visitor: AuthContextValue = {
  isAuthenticated: false,
  loading: false,
  user: null,
  displayName: "",
  signOut: async () => {},
};

const AuthContext = createContext<AuthContextValue>(visitor);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    getClerkPublishableKey()
      .then((k) => setKey(k || CLERK_PUBLISHABLE_KEY_FALLBACK))
      .catch(() => setKey(CLERK_PUBLISHABLE_KEY_FALLBACK));
  }, []);

  if (key === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="hand text-2xl opacity-50">opening the notebooks…</p>
      </div>
    );
  }
  if (!key) {
    // No sign-in available: keep the public site readable as a visitor.
    return (
      <AuthContext.Provider value={visitor}>
        <InktellaStoreProvider userKey={null}>{children}</InktellaStoreProvider>
      </AuthContext.Provider>
    );
  }
  return (
    <ClerkProvider
      publishableKey={key}
      signInUrl="https://accounts.inktella.com/sign-in"
      signUpUrl="https://accounts.inktella.com/sign-up"
      afterSignOutUrl="/"
    >
      <StoreWithUser>{children}</StoreWithUser>
    </ClerkProvider>
  );
}

function StoreWithUser({ children }: { children: ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();
  const [gaveUp, setGaveUp] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGaveUp(true), 6000);
    return () => clearTimeout(t);
  }, []);

  if (!isLoaded && !gaveUp) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="hand text-2xl opacity-50">opening the notebooks…</p>
      </div>
    );
  }

  const authValue: AuthContextValue = {
    isAuthenticated: !!isSignedIn,
    loading: !isLoaded,
    user: user ?? null,
    displayName:
      user?.fullName ||
      user?.username ||
      user?.primaryEmailAddress?.emailAddress.split("@")[0] ||
      "",
    signOut: () => clerk.signOut(),
  };

  return (
    <AuthContext.Provider value={authValue}>
      <InktellaStoreProvider userKey={user?.id ?? null}>{children}</InktellaStoreProvider>
    </AuthContext.Provider>
  );
}

const ClerkReady = createContext(false);

const visitor = {
  isAuthenticated: false,
  loading: false,
  user: null,
  displayName: "",
  signOut: async () => {},
};

export function useAuth() {
  return useContext(ClerkReady) ? useClerkAuth() : visitor; // context is fixed for the tree's lifetime
}

function useClerkAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();
  return {
    isAuthenticated: !!isSignedIn,
    loading: !isLoaded,
    user,
    displayName:
      user?.fullName ||
      user?.username ||
      user?.primaryEmailAddress?.emailAddress.split("@")[0] ||
      "",
    signOut: () => clerk.signOut(),
  };
}

export function AuthGate({
  children,
  message = "This corner is for signed-in notebook people.",
}: {
  children: ReactNode;
  message?: string | undefined;
}) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;
  if (isAuthenticated) return children;

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <section className="max-w-md text-center">
        <p className="hand text-3xl text-muted-foreground">the bouncer is very polite</p>
        <h1 className="mt-4 font-heading text-3xl tracking-tight">
          You&apos;ll need an account for this bit.
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">{message}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-4">
          <a
            href={portalUrl("sign-in")}
            className="rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground"
          >
            Join / Sign in
          </a>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="px-5 py-3 text-sm underline underline-offset-4"
          >
            Take me somewhere public
          </button>
        </div>
      </section>
    </main>
  );
}

export function AuthOnly({
  children,
  message,
}: {
  children: ReactNode;
  message?: string | undefined;
}) {
  return <AuthGate message={message}>{children}</AuthGate>;
}
