import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const AUTH_STORAGE_KEY = "readify-auth";

type AuthResponse = {
  token: string;
  user: AuthUser;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storedAuth) {
      setIsLoading(false);
      return;
    }

    const parsed = JSON.parse(storedAuth) as { token: string; user: AuthUser };
    setToken(parsed.token);
    setUser(parsed.user);

    apiRequest<{ user: AuthUser }>("/api/auth/me", { token: parsed.token })
      .then((data) => {
        setUser(data.user);
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ token: parsed.token, user: data.user }),
        );
      })
      .catch(() => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persistAuth = (data: AuthResponse) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  };

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    persistAuth(data);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const data = await apiRequest<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    persistAuth(data);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) {
      return;
    }

    const data = await apiRequest<{ user: AuthUser }>("/api/auth/me", { token });
    setUser(data.user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user: data.user }));
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      signup,
      logout,
      refreshUser,
    }),
    [user, token, isLoading, login, signup, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
