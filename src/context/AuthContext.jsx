import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase.js";

/**
 * Authentication.
 *
 * When Supabase credentials are present this is real auth: real password
 * hashing, real sessions, real email confirmation. When they are absent the
 * provider runs in demo mode, which accepts a signup or login and holds the
 * session in memory for the tab. Demo mode exists so the account flow can be
 * shown to a client before a database is wired up, and every screen that uses
 * it says so on the page rather than pretending to be real.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialising, setInitialising] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setUser(data.session?.user ?? null);
      setInitialising(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      initialising,
      isDemoMode: !isSupabaseConfigured,

      async signUp({ email, password, fullName }) {
        if (!isSupabaseConfigured) {
          setUser({ email, user_metadata: { full_name: fullName }, id: "demo" });
          return { needsConfirmation: false };
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw new Error(error.message);

        // Supabase returns a user with no session when email confirmation is on.
        return { needsConfirmation: Boolean(data.user) && !data.session };
      },

      async signIn({ email, password }) {
        if (!isSupabaseConfigured) {
          setUser({ email, user_metadata: { full_name: "" }, id: "demo" });
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
      },

      async signOut() {
        if (!isSupabaseConfigured) {
          setUser(null);
          return;
        }
        await supabase.auth.signOut();
      },

      async accessToken() {
        if (!isSupabaseConfigured) return null;
        const { data } = await supabase.auth.getSession();
        return data.session?.access_token ?? null;
      },
    }),
    [user, initialising]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}
