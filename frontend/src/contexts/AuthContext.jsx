import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);
const isProfileComplete = (profile) =>
  Boolean(profile?.first_name?.trim()) && Boolean(profile?.last_name?.trim());

const getProfileNames = (authUser) => {
  const meta = authUser?.user_metadata || {};
  const fullName = `${meta.full_name || meta.name || ""}`.trim();
  const nameParts = fullName ? fullName.split(/\s+/) : [];
  const fallbackFirst = nameParts[0] || "";
  const fallbackLast = nameParts.slice(1).join(" ");
  const firstName = `${meta.first_name || fallbackFirst || ""}`.trim();
  const lastName = `${meta.last_name || fallbackLast || ""}`.trim();
  const displayName =
    `${firstName} ${lastName}`.trim() || authUser?.email || "User";

  return {
    firstName,
    lastName,
    displayName,
  };
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRole = useCallback(async (authUser) => {
    if (!authUser?.id) {
      setRole(null);
      setProfile(null);
      setProfileComplete(false);
      return;
    }

    setRole(undefined);
    const { data, error } = await supabase
      .from("profiles")
      .select("role, first_name, last_name, name")
      .eq("id", authUser.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        const { firstName, lastName, displayName } = getProfileNames(authUser);
        const { data: insertData, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: authUser.id,
            name: displayName,
            first_name: firstName,
            last_name: lastName,
          })
          .select("role, first_name, last_name, name")
          .single();

        if (insertError) {
          console.error("Failed to create profile:", insertError);
          setRole(null);
          setProfile(null);
          setProfileComplete(false);
          return;
        }

        const nextProfile = insertData || {
          role: null,
          first_name: firstName,
          last_name: lastName,
          name: displayName,
        };
        setRole(nextProfile?.role ?? null);
        setProfile(nextProfile);
        setProfileComplete(isProfileComplete(nextProfile));
        return;
      }

      console.error("Failed to fetch user role:", error);
      setRole(null);
      setProfile(null);
      setProfileComplete(false);
      return;
    }

    setRole(data?.role ?? null);
    setProfile(data || null);
    setProfileComplete(isProfileComplete(data));
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
          setProfile(null);
          setProfileComplete(false);
          return;
        }

        const currentSession = data?.session ?? null;
        const currentUser = currentSession?.user ?? null;

        setSession(currentSession);
        setUser(currentUser);

        if (currentUser) {
          await fetchRole(currentUser);
        } else {
          setRole(null);
          setProfile(null);
          setProfileComplete(false);
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
            await fetchRole(nextUser);
          } else {
            setRole(null);
            setProfile(null);
            setProfileComplete(false);
          }
        } catch (err) {
          console.error("Unexpected auth change error:", err);
          if (!active) return;
          setSession(null);
          setUser(null);
          setRole(null);
          setProfile(null);
          setProfileComplete(false);
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
    const result = await supabase.auth.signOut({ scope: "local" });

    if (typeof window !== "undefined") {
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith("sb-") && key.endsWith("-auth-token"))
        .forEach((key) => window.localStorage.removeItem(key));
    }

    setSession(null);
    setUser(null);
    setRole(null);
    setProfile(null);
    setProfileComplete(false);

    return result;
  };

  const refreshProfile = useCallback(async (authUserOverride) => {
    const targetUser = authUserOverride ?? user;
    if (!targetUser) return;
    await fetchRole(targetUser);
  }, [fetchRole, user]);

  const value = useMemo(
    () => ({
      user,
      session,
      role,
      isAdmin: role === "admin",
      profile,
      profileComplete,
      loading,
      signIn,
      signOut,
      refreshProfile,
    }),
    [user, session, role, profile, profileComplete, loading, signIn, signOut, refreshProfile]
  );

  useEffect(() => {
    // TEMP DEBUG: remove after confirmation
    console.log("AUTH STATE", {
      loading,
      session: !!session,
      role,
      profileComplete,
    });
  }, [loading, session, role, profileComplete]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
