import { createContext, useContext, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";

type AuthContextValue = {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      signIn: () => setIsAuthenticated(true),
      signOut: () => setIsAuthenticated(false),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}

export function AuthGate({ children, message = "This corner is for signed-in notebook people." }: { children: ReactNode; message?: string }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
