import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [authCheckedOnce, setAuthCheckedOnce] = useState(false);
  const [wasLoggedInBefore, setWasLoggedInBefore] = useState(false);
  const location = useLocation();

  // Refresh token if access token expired
  const tryRefreshToken = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/refresh-token`,
        {},
        { withCredentials: true }
      );
      if (res.data.status === "Success") {
        return true;
      }
    } catch (err) {
      if (err.response?.data?.error !== "No refresh token") return;
      console.error("❌ Failed to refresh token", err.response?.data || err.message);
    }
    return false;
  };

  // Check token session
  const checkAuth = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user`, {
        withCredentials: true,
      });
      if (res.status === 200 && res.data?.name) {
        setAuth(true);
        setUser({
          name: res.data.name,
          email: res.data.email,
          id: res.data.id,
        });
        setWasLoggedInBefore(true);
      } else {
        setAuth(false);
        setUser({});
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert("⚠️ You are not authorized. Please refresh the page or login again.");
      } else {
        console.warn("⚠️ Token might be expired, trying refresh...");
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          return await checkAuth();
        } else {
          setAuth(false);
          setUser({});
        }
      }
    } finally {
      setAuthCheckedOnce(true);
      setLoading(false);
    }
  };

  // Check once on load
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      checkAuth();
    } else {
      // If not in /admin, reset auth states to defaults
      setAuth(false);
      setUser({});
      setLoading(false);
      setAuthCheckedOnce(true);
    }
  }, [location.pathname]);

  // Re-check every 5 minutes if user was logged in before
  useEffect(() => {
    if (!location.pathname.startsWith("/admin")) return;
    if (!wasLoggedInBefore) return;

    const interval = setInterval(() => {
      checkAuth();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [wasLoggedInBefore]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        user,
        setUser,
        loading,
        authCheckedOnce,
        wasLoggedInBefore,
        setWasLoggedInBefore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
