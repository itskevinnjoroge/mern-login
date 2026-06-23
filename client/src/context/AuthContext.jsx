// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check session on load

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.status === 401) {
        setUser(null); // no session — expected on cold load
        return;
      }
      if (!res.ok) {
        console.error("Unexpected /api/auth/me response:", res.status);
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("Failed to reach /api/auth/me:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
