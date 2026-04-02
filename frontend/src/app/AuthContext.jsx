import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  authService,
  getStoredSession,
  setAuthToken,
  storeSession,
} from "@/services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());
  const [bootstrapping, setBootstrapping] = useState(true);
  const [theme, setTheme] = useState(() => window.localStorage.getItem("zorvyn-theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    window.localStorage.setItem("zorvyn-theme", theme);
  }, [theme]);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const stored = getStoredSession();
      if (!stored?.token) {
        setBootstrapping(false);
        return;
      }

      setAuthToken(stored.token);

      try {
        const response = await authService.me();
        if (!active) return;
        const nextSession = { token: stored.token, user: response.user };
        setSession(nextSession);
        storeSession(nextSession);
      } catch {
        if (!active) return;
        setSession(null);
        storeSession(null);
        setAuthToken(null);
      } finally {
        if (active) setBootstrapping(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  async function login(values) {
    const response = await authService.login(values);
    const nextSession = { token: response.token, user: response.user };
    setAuthToken(response.token);
    setSession(nextSession);
    storeSession(nextSession);
    toast.success(`Welcome back, ${response.user.name.split(" ")[0]}`);
    return response.user;
  }

  async function register(values) {
    const response = await authService.register(values);
    toast.success("Account created. Sign in to open your dashboard.");
    return response.user;
  }

  function logout(message = "Signed out successfully") {
    setAuthToken(null);
    setSession(null);
    storeSession(null);
    toast.success(message);
  }

  const value = useMemo(
    () => ({
      user: session?.user || null,
      token: session?.token || null,
      authenticated: Boolean(session?.token),
      bootstrapping,
      login,
      register,
      logout,
      theme,
      setTheme,
    }),
    [bootstrapping, session, theme]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
