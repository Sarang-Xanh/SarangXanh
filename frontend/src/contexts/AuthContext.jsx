import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const fetchRole = useCallback(async (userId) => {
    if (!userId) {
      setRole(null);
      return;
    }

    setRole(undefined);
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Failed to fetch user role:", error);
      setRole(null);
      return;
    }

    setRole(data?.role ?? null);
  }, []);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!active) return;

        if (error) {
          console.error("Failed to get session:", error);
          setSession(null);
          setUser(null);
          setRole(null);
          return;
        }

        const currentSession = data?.session ?? null;
        const currentUser = currentSession?.user ?? null;

        setSession(currentSession);
        setUser(currentUser);

        if (currentUser) {
          await fetchRole(currentUser.id);
        } else {
          setRole(null);
        }
      } catch (err) {
        console.error("Unexpected auth session error:", err);
        if (!active) return;
        setSession(null);
        setUser(null);
        setRole(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        if (!active) return;
        setLoading(true);
        try {
          const nextUser = nextSession?.user ?? null;
          setSession(nextSession ?? null);
          setUser(nextUser);

          if (nextUser) {
            await fetchRole(nextUser.id);
          } else {
            setRole(null);
          }
        } catch (err) {
          console.error("Unexpected auth change error:", err);
          if (!active) return;
          setSession(null);
          setUser(null);
          setRole(null);
        } finally {
          if (active) setLoading(false);
        }
      }
    );

    return () => {
      active = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [fetchRole]);

  const signIn = async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  const value = useMemo(
    () => ({
      user,
      session,
      role,
      isAdmin: role === "admin",
      loading,
      signIn,
      signOut,
    }),
    [user, session, role, loading, signIn, signOut]
  );

  useEffect(() => {
    // TEMP DEBUG: remove after confirmation
    console.log("AUTH STATE", {
      loading,
      session: !!session,
      role,
    });
  }, [loading, session, role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
